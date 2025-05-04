import axios from 'axios';
import Order, { IOrder } from '../models/Order';
import mongoose from 'mongoose';
import { ClientSession } from 'mongoose';
import { notificationServiceApi, restaurantServiceApi, userServiceApi } from '../utils/serviceApi';

interface CreateOrderDTO {
  customerId: string;
  restaurantId: string;
  items: { menuItemId: string; name?: string; imageUrl?: string; quantity: number; unitPrice?: number }[];
  deliveryOption?: 'Standard' | 'PickUp';
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  promotionCode?: string;
  paymentMethod?: 'Card' | 'Cash on Delivery';
  location: {
    lat: number;
    lng: number;
  };
}

interface MenuItem { menuItemId: string; name: string; imageUrl: string; quantity: number; unitPrice: number }

interface ModifyOrderDTO {
  items?: { menuItemId: string; name: string; imageUrl: string; quantity: number; unitPrice: number }[];
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  location?: {
    lat: number;
    lng: number;
  };
  promotionCode?: string;
}

export async function createOrder(dto: CreateOrderDTO): Promise<IOrder> {

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch all menu items for this restaurant via our GET endpoint
    const { data: menuData } = await restaurantServiceApi.get<
      { _id: string; name: string; imageUrl: string; price: number }[]
    >(
      `/${dto.restaurantId}/menu-items`,
      { timeout: 2000 }
    );

    const enrichedItems = dto.items.map(i => {
      const menu = menuData.find(m => m._id === i.menuItemId);
      if (!menu) {
        throw new Error(`Menu item ${i.menuItemId} not found`);
      }
      return {
        menuItemId: i.menuItemId,
        name: menu.name,
        imageUrl: menu.imageUrl,
        quantity: i.quantity,
        unitPrice: menu.price,
      };
    });

    const itemsTotal = enrichedItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const deliveryFee = 50;
    const serviceFee = 30;
    const tax = Math.round(itemsTotal * 0.05);
    const totalPrice = itemsTotal + deliveryFee + serviceFee + tax;

    const [order] = await Order.create(
      [
        {
          customerId: dto.customerId,
          restaurantId: dto.restaurantId,
          items: dto.items,
          fees: { deliveryFee, serviceFee, tax },
          totalPrice,
          status: 'PendingPayment',
          deliveryOption: dto.deliveryOption || 'Standard',
          deliveryAddress: dto.deliveryAddress,
          notes: dto.notes,
          promotionCode: dto.promotionCode,
          paymentMethod: dto.paymentMethod || 'Card',
          location: dto.location,
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

export async function getAllOrders(
  restaurantId?: string,
  userId?: string,
  statuses?: string[]
): Promise<IOrder[]> {
  const filter: any = {};
  if (restaurantId) filter.restaurantId = restaurantId;
  if (userId) filter.customerId = userId;
  if (statuses && statuses.length) filter.status = { $in: statuses };
  return await Order.find(filter).lean().exec() as IOrder[];
}

//Get an order by ID
export async function getOrderById(orderId: string): Promise<IOrder> {
  const order = await Order.findById(orderId).lean().exec();
  if (!order) throw { status: 404, message: 'Order not found' };
  return order as IOrder;
}

//Modify an existing order (only if still PendingPayment)
export async function modifySelectOrder(
  orderId: string,
  dto: ModifyOrderDTO
): Promise<IOrder> {
  const order = await Order.findById(orderId);
  if (!order) throw { status: 404, message: 'Order not found' };

  if (order.status !== 'PendingPayment' && order.status !== 'Confirmed') {
    throw { status: 400, message: 'Order cannot be modified at this stage' };
  }
  
  console.log('dto', dto)

  if (dto.items) {
    const enriched = dto.items.map(i => ({
      menuItemId: i.menuItemId,
      name:       i.name,
      imageUrl: i.imageUrl,
      quantity:   i.quantity,
      unitPrice:  i.unitPrice
    }));
  
    order.items = enriched as any;   
    order.items.splice(0, order.items.length, ...enriched as any);
  }

  if (dto.notes !== undefined)       order.notes = dto.notes;
  if (dto.promotionCode !== undefined) order.promotionCode = dto.promotionCode;
  if (dto.deliveryAddress !== undefined) order.deliveryAddress = dto.deliveryAddress;
  if (dto.location !== undefined) order.location = dto.location;

  const itemsTotal = order.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const deliveryFee = order.fees.deliveryFee;  // or recalc if dynamic
  const serviceFee  = order.fees.serviceFee;
  const tax         = Math.round(itemsTotal * 0.05);
  order.fees.tax    = tax;
  order.totalPrice  = itemsTotal + deliveryFee + serviceFee + tax;

  await order.save();

  return order;
}

// Cancel an order 
export async function cancelSelectOrder(orderId: string): Promise<void> {
  const order = await Order.findById(orderId);
  if (!order) throw { status: 404, message: 'Order not found' };

  const cancellableStatuses = ['PendingPayment','Confirmed','Preparing'];
  if (!cancellableStatuses.includes(order.status)) {
    throw { status: 400, message: 'Order cannot be cancelled at this stage' };
  }

  order.status = 'Cancelled';
  await order.save();
}

// Get only status & last update 
export async function getOrderStatus(orderId: string) {
  const order = await Order.findById(orderId).lean().exec();
  if (!order) throw { status: 404, message: 'Order not found' };
  return {
    status: order.status,
    updatedAt: order.updatedAt,
    totalPrice: order.totalPrice
  };
}

// Restaurant accepts an order
export async function acceptOrder(orderId: string, restaurantId: string): Promise<IOrder> {
  const order = await Order.findById(orderId);
  if (!order) throw { status: 404, message: 'Order not found' };
  // if (order.restaurantId !== restaurantId) throw { status: 403, message: 'Unauthorized' };
  if (order.status !== 'Confirmed') {
    throw { status: 400, message: 'Only confirmed orders can be accepted' };
  }
  order.status = 'Preparing';
  await order.save();

  let userContact: { email?: string; phoneNumber?: string } = {};
  try {
    const { data: user } = await userServiceApi.get<{ email: string; phoneNumber: string }>(
      `/${order.customerId}`
    );
    userContact = {
      email: user.email,
      phoneNumber: user.phoneNumber
    };
  } catch (err: any) {
    console.error('Failed to fetch user contact:', err.message);
  }
  console.log('userContact', userContact)

  // Fire-and-forget notification request
  notificationServiceApi
    .post('/', {
        userId: order.customerId,
        email: userContact.email,
        phoneNumber: '+94769835804',
        channels: ['EMAIL', 'SMS'],
        eventType: 'OrderPreparing',
        payload: { orderId: order.id }
      })
    .catch((err) => console.error('Notification failed:', err.message));
  return order;
}

// Restaurant rejects an order
export async function rejectOrder(orderId: string, restaurantId: string): Promise<IOrder> {
  const order = await Order.findById(orderId);
  if (!order) throw { status: 404, message: 'Order not found' };
  if (order.restaurantId !== restaurantId) throw { status: 403, message: 'Unauthorized' };
  if (order.status !== 'Confirmed') {
    throw { status: 400, message: 'Only confirmed orders can be rejected' };
  }
  order.status = 'Cancelled';
  await order.save();

  let userContact: { email?: string; phoneNumber?: string } = {};
  try {
    const { data: user } = await userServiceApi.get<{ email: string; phoneNumber: string }>(
      `/${order.customerId}`
    );
    userContact = {
      email: user.email,
      phoneNumber: user.phoneNumber
    };
  } catch (err: any) {
    console.error('Failed to fetch user contact:', err.message);
  }
  console.log('userContact', userContact)

  // Fire-and-forget notification request
  notificationServiceApi
    .post('/', {
        userId: order.customerId,
        email: userContact.email,
        phoneNumber: '+94769835804',
        channels: ['EMAIL', 'SMS'],
        eventType: 'OrderCancelled',
        payload: { orderId: order.id, reason: 'Restaurant cancelled the order' }
      })
    .catch((err) => console.error('Notification failed:', err.message));
  return order;
}


// Update order status
export async function updateOrderStatus(
  orderId: string,
  newStatus: 'Preparing' | 'OutForDelivery' | 'Delivered' | 'Confirmed' | 'PaymentFail'
): Promise<IOrder> {
  const order = await Order.findById(orderId);
  if (!order) throw { status: 404, message: 'Order not found' };

  const allowed: Record<string, string[]> = {
    PendingPayment: ['Confirmed', 'PaymentFail'],
    PaymentFail: ['Confirmed'],
    Confirmed:       ['Preparing'],
    Preparing:       ['OutForDelivery'],
    OutForDelivery:  ['Delivered'],
  };

  const current = order.status;
  const nextAllowed = allowed[current] || [];
  if (!nextAllowed.includes(newStatus)) {
    throw {
      status: 400,
      message: `Cannot change status from ${current} to ${newStatus}`
    };
  }

  order.status = newStatus;
  await order.save();

  // Determine which notification to send
  let eventType: string;
  const payload: any = { orderId: order.id };

  switch (newStatus) {
    case 'Confirmed':
      eventType = 'OrderConfirmed';
      break;

    case 'OutForDelivery':
      eventType = 'OutForDelivery';
      payload.eta = new Date(Date.now() + 30 * 60000).toISOString();
      break;

    case 'Delivered':
      eventType = 'Delivered';
      payload.deliveredAt = new Date().toISOString();
      break;

    case 'PaymentFail':
      eventType = 'OrderCancelled';
      payload.reason = 'Payment failed';
      break;

    default:
      return order;
  }

  let userContact: { email?: string; phoneNumber?: string } = {};
  try {
    const { data: user } = await userServiceApi.get<{ email: string; phoneNumber: string }>(
      `/${order.customerId}`
    );
    userContact = {
      email: user.email,
      phoneNumber: user.phoneNumber
    };
  } catch (err: any) {
    console.error('Failed to fetch user contact:', err.message);
  }
  console.log('userContact', userContact)

  // Fire-and-forget notification request
  notificationServiceApi
    .post('/', {
        userId: order.customerId,
        email: userContact.email,
        phoneNumber: '+94769835804',
        channels: ['EMAIL', 'SMS'],
        eventType,
        payload
      })
    .catch((err) => console.error('Notification failed:', err.message));

  return order;
}

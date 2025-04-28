import axios from 'axios';
import Order, { IOrder } from '../models/Order';
// import { publish }    from '../config/broker';

interface CreateOrderDTO {
  customerId: string;
  restaurantId: string;
  items: { menuItemId: string; name: string; imageUrl: string; quantity: number; unitPrice: number }[];
  deliveryAddress: {
    street: string; city: string; postalCode: string; country: string;
  };
  notes?: string;
  promotionCode?: string;
}

interface MenuItem { menuItemId: string; name: string; imageUrl: string; quantity: number; unitPrice: number }

interface ModifyOrderDTO {
  items?: { menuItemId: string; name: string; imageUrl: string; quantity: number; unitPrice: number }[];
  notes?: string;
  promotionCode?: string;
}

export async function createOrder(dto: CreateOrderDTO): Promise<IOrder> {
  // 1) Validate & reserve items with Restaurant Service
  // await axios.post(
  //   `${process.env.RESTAURANT_URL}/validate-order`,
  //   { restaurantId: dto.restaurantId, items: dto.items },
  //   { timeout: 2000 }
  // );


  //fetch unit price from Restaurant service
  // const { data: menuData } = await axios.post<MenuItem[]>(
  //   `${process.env.RESTAURANT_URL}/get-menu-items`,
  //   { restaurantId: dto.restaurantId, menuItemIds: dto.items.map(i => i.menuItemId) }
  // );

  // const enrichedItems = dto.items.map(i => {
  //   const menu = menuData.find(m => m.menuItemId === i.menuItemId);
  //   if (!menu) throw new Error(`Menu item ${i.menuItemId} not found`);
  //   return {
  //     menuItemId: i.menuItemId,
  //     quantity:   i.quantity,
  //     unitPrice:  menu.price,
  //     name:       menu.name
  //   };
  // });

  // 2) Calculate pricing
  // const itemsTotal = enrichedItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const itemsTotal = dto.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const deliveryFee = 50;
  const serviceFee  = 30;
  const tax         = Math.round(itemsTotal * 0.05);
  const totalPrice  = itemsTotal + deliveryFee + serviceFee + tax;

  // 3) Save to MongoDB
  const order = await Order.create({
    // customerId:      dto.customerId,
    // restaurantId:    dto.restaurantId,
    // items:           enrichedItems,
    // fees:            { deliveryFee, serviceFee, tax },
    // totalPrice,
    // deliveryAddress: dto.deliveryAddress,
    // notes:           dto.notes,
    // promotionCode:   dto.promotionCode,

    ...dto,
    fees: { deliveryFee, serviceFee, tax },
    totalPrice,
  });

  // 4) Publish payment_requested event
  // await publish('order.payment_requested', {
  //   orderId:       order.id,
  //   customerId:    order.customerId,
  //   amount:        totalPrice,
  //   currency:      'LKR',
  //   paymentMethod: 'CARD'
  // });

  return order;
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

/**
 * 2) Get an order by ID
 */
export async function getOrderById(orderId: string): Promise<IOrder> {
  const order = await Order.findById(orderId).lean().exec();
  if (!order) throw { status: 404, message: 'Order not found' };
  return order as IOrder;
}

/**
 * 3) Modify an existing order (only if still PendingPayment)
 */
export async function modifySelectOrder(
  orderId: string,
  dto: ModifyOrderDTO
): Promise<IOrder> {
  const order = await Order.findById(orderId);
  if (!order) throw { status: 404, message: 'Order not found' };

  if (order.status !== 'PendingPayment') {
    throw { status: 400, message: 'Order cannot be modified at this stage' };
  }

  // Update items if provided
  if (dto.items) {
    // Optionally re-validate with Restaurant Service:
    //##########################################################################################
    // await axios.post(
    //   `${process.env.RESTAURANT_URL}/validate-order`,
    //   { restaurantId: order.restaurantId, items: dto.items },
    //   { timeout: 2000 }
    // );

    // Recalculate item totals
    const enriched = dto.items.map(i => ({
      menuItemId: i.menuItemId,
      name:       i.name,
      imageUrl: i.imageUrl,
      quantity:   i.quantity,
      unitPrice:  i.unitPrice
    }));
  
    // either overwrite the array...
    order.items = enriched as any;   
    // …or clear & push
    order.items.splice(0, order.items.length, ...enriched as any);
  }

  // Update notes/promotion if provided
  if (dto.notes !== undefined)       order.notes = dto.notes;
  if (dto.promotionCode !== undefined) order.promotionCode = dto.promotionCode;

  // Recompute totalPrice & fees
  const itemsTotal = order.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const deliveryFee = order.fees.deliveryFee;  // or recalc if dynamic
  const serviceFee  = order.fees.serviceFee;
  const tax         = Math.round(itemsTotal * 0.05);
  order.fees.tax    = tax;
  order.totalPrice  = itemsTotal + deliveryFee + serviceFee + tax;

  await order.save();

  // If you’ve already requested payment before, you might republish:
  // await publish('order.payment_requested', { orderId, amount: order.totalPrice, ... });

  return order;
}

/**
 * 4) Cancel an order (if not already too far)
 */
export async function cancelSelectOrder(orderId: string): Promise<void> {
  const order = await Order.findById(orderId);
  if (!order) throw { status: 404, message: 'Order not found' };

  // Allow cancellation only up to 'Preparing'
  const cancellableStatuses = ['PendingPayment','Confirmed','Preparing'];
  if (!cancellableStatuses.includes(order.status)) {
    throw { status: 400, message: 'Order cannot be cancelled at this stage' };
  }

  order.status = 'Cancelled';
  await order.save();

  // Notify other systems
  // await publish('order.cancelled', { orderId });
}

/**
 * 5) Get only status & last update (lightweight)
 */
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
  if (order.restaurantId !== restaurantId) throw { status: 403, message: 'Unauthorized' };
  if (order.status !== 'Confirmed') {
    throw { status: 400, message: 'Only confirmed orders can be accepted' };
  }
  order.status = 'Preparing';
  await order.save();
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
  // Optionally trigger refund here
  return order;
}


/**
 * Update order status (e.g., Preparing -> OutForDelivery -> Delivered)
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: 'Preparing' | 'OutForDelivery' | 'Delivered' | 'Confirmed' | 'PaymentFail'
): Promise<IOrder> {
  const order = await Order.findById(orderId);
  if (!order) throw { status: 404, message: 'Order not found' };

  // Validate allowed transitions
  const allowed: Record<string, string[]> = {
    PendingPayment: ['Confirmed', 'PaymentFail'],
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
  return order;
}

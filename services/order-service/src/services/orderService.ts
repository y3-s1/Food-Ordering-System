import axios from 'axios';
import Order, { IOrder } from '../models/Order';
// import { publish }    from '../config/broker';

interface CreateOrderDTO {
  customerId: string;
  restaurantId: string;
  items: { menuItemId: string; quantity: number; unitPrice: number }[];
  deliveryAddress: {
    street: string; city: string; postalCode: string; country: string;
  };
  notes?: string;
  promotionCode?: string;
}

interface MenuItem { menuItemId: string; name: string; price: number }

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

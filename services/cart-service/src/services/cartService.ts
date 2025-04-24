/* services/cart-service/src/services/cartService.ts */
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Cart, { ICart } from '../models/Cart';
import { MAX_QTY_PER_ITEM } from '../config';
import { ICartItem } from '../models/CartItem';
// import { publish } from '../config/broker';

// Utility: recalculate subtotal, fees, total
function recalcCart(cart: ICart) {
  const itemsTotal = cart.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const deliveryFee = 50;
  const serviceFee = 30;
  const tax = Math.round(itemsTotal * 0.05);
  cart.subtotal = itemsTotal;
  cart.fees = { deliveryFee, serviceFee, tax };
  cart.total = itemsTotal + deliveryFee + serviceFee + tax - (cart.discountAmount || 0);
}

// 1) Initialize or fetch existing cart
export async function findOrCreateCart(
  userId?: string,
  cartIdHeader?: string
): Promise<ICart> {
  let cart: ICart | null = null;
  if (userId) {
    cart = await Cart.findOne({ userId }).exec();
  }
  if (!cart && cartIdHeader) {
    cart = await Cart.findOne({ cartId: cartIdHeader }).exec();
  }
  if (!cart) {
    cart = new Cart({
      cartId: uuidv4(),
      userId: userId,
      items: [],
      promotionCode: undefined,
      discountAmount: 0,
      subtotal: 0,
      fees: { deliveryFee: 0, serviceFee: 0, tax: 0 },
      total: 0
    });
  } else if (userId && !cart.userId) {
    // associate guest cart to user
    cart.userId = userId;
  }
  recalcCart(cart);
  await cart.save();
  return cart;
}

// 2) Get Cart
export async function getCart(
  userId?: string,
  cartIdHeader?: string
): Promise<ICart> {
  const cart = await findOrCreateCart(userId, cartIdHeader);
  return cart;
}

// 3) Add or increment item
export async function addItem(
  userId: string | undefined,
  cartIdHeader: string | undefined,
  item: { restaurantId: string; menuItemId: string; name: string; quantity: number; unitPrice: number; notes?: string }
): Promise<ICart> {
  const cart = await findOrCreateCart(userId, cartIdHeader);

  // Single-restaurant constraint
  if (cart.items.length && cart.items[0].menuItemId && item.restaurantId) {
    // Could store restaurantId in Cart schema for clarity
    const existingRestaurant = cart.items[0].restaurantId;
    if (existingRestaurant && existingRestaurant !== item.restaurantId) {
      throw { status: 409, message: 'Cart contains items from another restaurant' };
    }
  }

  // Validate item availability via Restaurant Service
  //########################################################################################################################################
//   await axios.post(
//     `${process.env.RESTAURANT_URL}/validate-item`,
//     { restaurantId: item.restaurantId, menuItemId: item.menuItemId, quantity: item.quantity },
//     { timeout: 2000 }
//   );

  // Find existing item
  const existing = cart.items.find(i => i.menuItemId === item.menuItemId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + item.quantity, MAX_QTY_PER_ITEM);
    if (item.notes !== undefined) existing.notes = item.notes;
  } else {
    if (item.quantity < 1 || item.quantity > MAX_QTY_PER_ITEM) {
      throw { status: 400, message: `Quantity must be between 1 and ${MAX_QTY_PER_ITEM}` };
    }
    cart.items.push(item as ICartItem);
  }

  recalcCart(cart);
  await cart.save();
  return cart;
}



import { v4 as uuidv4 } from 'uuid';
import Cart, { ICart } from '../models/Cart';
import { MAX_QTY_PER_ITEM } from '../config';
import { ICartItem } from '../models/CartItem';

//  recalculate subtotal, fees, total
function recalcCart(cart: ICart) {
  const itemsTotal = cart.items.reduce((sum, i) => {
    const qty = Number(i.quantity) || 0;
    const price = Number(i.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  console.log('itemsTotal', itemsTotal)

  const deliveryFee = 50;
  const serviceFee = 30;
  const tax = Math.round(itemsTotal * 0.05);

  cart.subtotal = itemsTotal;
  cart.fees = { deliveryFee, serviceFee, tax };
  cart.total = itemsTotal + deliveryFee + serviceFee + tax - (cart.discountAmount || 0);
}


// Initialize or fetch existing cart
export async function findOrCreateCart(
  userId?: string,
  cartId?: string
): Promise<ICart> {
  let cart: ICart | null = null;
  if (userId) {
    cart = await Cart.findOne({ userId }).exec();
  }
  if (!cart && cartId) {
    cart = await Cart.findOne({ cartId }).exec();
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
    cart.userId = userId;
  }
  recalcCart(cart);
  await cart.save();
  return cart;
}

// Get Cart
export async function getCart(
  userId?: string,
  cartId?: string
): Promise<ICart> {
  console.log('userId-get', userId)
  const cart = await findOrCreateCart(userId, cartId);
  return cart;
}

// Add or increment item
export async function addItem(
  userId: string | undefined,
  cartId: string | undefined,
  item: { restaurantId: string; menuItemId: string; name: string; imageUrl: string, quantity: number; unitPrice: number; notes?: string }
): Promise<ICart> {
  const cart = await findOrCreateCart(userId, cartId);

  if (!cart.items.length) {
    cart.userId = userId;
  }
  if (cart.items.length && cart.items[0].menuItemId && item.restaurantId) {
    const existingRestaurant = cart.items[0].restaurantId;
    if (existingRestaurant && existingRestaurant !== item.restaurantId) {
      throw { status: 409, message: 'Cart contains items from another restaurant' };
    }
  }

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

// Update item
export async function updateItem(
  userId: string | undefined,
  cartIdHeader: string | undefined,
  itemId: string,
  data: { quantity?: number; notes?: string }
): Promise<ICart> {
  const cart = await findOrCreateCart(userId, cartIdHeader);
  const item = cart.items.id(itemId);
  if (!item) throw { status: 404, message: 'Item not found in cart' };

  if (data.quantity !== undefined) {
    if (data.quantity < 1) {
      cart.items = cart.items.filter(i => i._id?.toString() !== itemId);
    } else if (data.quantity > MAX_QTY_PER_ITEM) {
      throw { status: 400, message: `Max quantity per item is ${MAX_QTY_PER_ITEM}` };
    } else {
      item.quantity = data.quantity;
    }
  }
  if (data.notes !== undefined) item.notes = data.notes;

  recalcCart(cart);
  await cart.save();
  return cart;
}

// Remove item
export async function removeItem(
  userId: string | undefined,
  cartIdHeader: string | undefined,
  itemId: string
): Promise<ICart> {
  const cart = await findOrCreateCart(userId, cartIdHeader);
  const item = cart.items.id(itemId);
  if (!item) throw { status: 404, message: 'Item not found in cart' };
  cart.items = cart.items.filter(i => i._id?.toString() !== itemId);
  recalcCart(cart);
  await cart.save();
  return cart;
}

// Clear cart
export async function clearCart(
  userId: string | undefined,
  cartIdHeader: string | undefined
): Promise<ICart> {
  const cart = await findOrCreateCart(userId, cartIdHeader);
  cart.items = [];
  cart.promotionCode = undefined;
  cart.discountAmount = 0;
  recalcCart(cart);
  await cart.save();
  return cart;
}

// Generate Order Draft and publish
export async function generateDraft(
  userId: string | undefined,
  cartId: string | undefined
): Promise<any> {
  const cart = await findOrCreateCart(userId, cartId);
  if (!cart.items.length) throw { status: 400, message: 'Cart is empty' };

  const draft = {
    customerId: userId,
    restaurantId: cart.items[0]._doc.restaurantId,
    items: cart.items.map(i => ({
      menuItemId: i.menuItemId,
      name: i.name,
      imageUrl: i.imageUrl,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      notes: i.notes
    })),
    promotionCode: cart.promotionCode,
    fees: cart.fees,
    totalPrice: cart.total
  };

  return draft;
}

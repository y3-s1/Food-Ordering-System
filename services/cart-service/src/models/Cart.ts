import { Schema, model, Document } from 'mongoose';
import { CartItemSchema, ICartItem } from './CartItem';
import { CART_TTL_HOURS } from '../config';

export interface ICart extends Document {
  cartId: string;
  userId?: string;
  items: ICartItem[];
  promotionCode?: string;
  discountAmount?: number;
  subtotal: number;
  fees: { deliveryFee: number; serviceFee: number; tax: number };
  total: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const CartSchema = new Schema<ICart>({
  cartId:         { type: String, required: true, unique: true },
  userId:         { type: String, index: true },
  items:          { type: [CartItemSchema], default: [] },
  promotionCode:  String,
  discountAmount: { type: Number, default: 0 },
  subtotal:       { type: Number, default: 0 },
  fees: {
    deliveryFee: { type: Number, default: 0 },
    serviceFee:  { type: Number, default: 0 },
    tax:         { type: Number, default: 0 }
  },
  total:          { type: Number, default: 0 },
  expiresAt:      { type: Date, default: () => new Date(Date.now() + CART_TTL_HOURS*3600*1000), index: { expireAfterSeconds: 0 } }
}, { timestamps: true });

export default model<ICart>('Cart', CartSchema);

import { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export const CartItemSchema = new Schema<ICartItem>({
  menuItemId: { type: String, required: true },
  name:       { type: String, required: true },
  quantity:   { type: Number, required: true, min: 1 },
  unitPrice:  { type: Number, required: true, min: 0 },
  notes:      { type: String }
});

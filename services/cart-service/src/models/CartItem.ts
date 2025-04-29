import { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
  restaurantId: string;
  menuItemId: string;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export const CartItemSchema = new Schema<ICartItem>({
  restaurantId: { type: String, required: true },
  menuItemId: { type: String, required: true },
  name:       { type: String, required: true },
  imageUrl:       { type: String },
  quantity:   { type: Number, required: true, min: 1 },
  unitPrice:  { type: Number, required: true, min: 0 },
  notes:      { type: String }
});

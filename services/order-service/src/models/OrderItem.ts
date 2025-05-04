import { Schema, Document } from 'mongoose';

export interface IOrderItem extends Document {
  menuItemId: string;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}

export const OrderItemSchema = new Schema({
  menuItemId: { type: String, required: true },
  name:       { type: String, required: true },
  imageUrl:       { type: String },
  quantity:   { type: Number, required: true, min: 1 },
  unitPrice:  { type: Number, required: true, min: 0 },
});

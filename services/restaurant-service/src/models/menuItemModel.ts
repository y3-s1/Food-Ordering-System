import { Schema, model, Document, Types } from 'mongoose';

interface IMenuItem extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

const menuItemSchema = new Schema<IMenuItem>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  available: { type: Boolean, default: true }
});

export default model<IMenuItem>('MenuItem', menuItemSchema);

import { Schema, model, Document } from 'mongoose';

interface IRestaurant extends Document {
  name: string;
  email: string;
  isAvailable: boolean;
  address: string;
}

const restaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  address: { type: String, required: true }
});

export default model<IRestaurant>('Restaurant', restaurantSchema);

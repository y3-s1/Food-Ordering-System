// models/MenuItem.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  restaurantId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  imageUrl: string;
  preparationTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema: Schema = new Schema(
  {
    restaurantId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Restaurant', 
      required: true,
      index: true // Adding an index for better query performance
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    imageUrl: { type: String, default: '' },
    preparationTime: { type: Number, default: 30 },
  },
  { timestamps: true }
);

// Ensure this model doesn't already exist before creating it
const MenuItem = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;
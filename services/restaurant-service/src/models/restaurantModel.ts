// models/Restaurant.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string; // Keep for backwards compatibility or additional info
  contactNumber: string;
  email: string;
  cuisineType: string[];
  openingHours: string;
  isAvailable: boolean;
  imageUrl: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    address: { type: String, required: true }, // Keep for backwards compatibility
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    cuisineType: [{ type: String }],
    openingHours: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    imageUrl: { type: String, default: '' },
    approvalStatus: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
  },
  { timestamps: true }
);

// Add index for geospatial queries if needed in the future
RestaurantSchema.index({ location: '2dsphere' });

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
// models/Restaurant.ts (updated)
import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  contactNumber: string;
  email: string;
  cuisineType: string[];
  openingHours: string;
  isAvailable: boolean;
  imageUrl: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  ownerId: mongoose.Types.ObjectId; // Add owner ID to track ownership
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
    address: { type: String, required: true },
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
    ownerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      index: true // Add index for better query performance
    }
  },
  { timestamps: true }
);

// Add index for geospatial queries
RestaurantSchema.index({ location: '2dsphere' });

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
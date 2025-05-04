import mongoose, { Schema, Document } from 'mongoose';

export interface IDelivery extends Document {
  orderId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId | null;
  deliveryAddress: string;
  status: 'PENDING' | 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED_TO_ASSIGN';
  location: {
    lat: number;
    lng: number;
  };
  resLocation: {
    lat: number;
    lng: number;
  };
  estimatedTime?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  retryCount: number;
}

const DeliverySchema: Schema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_TO_ASSIGN'],
      default: 'PENDING',
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    resLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    estimatedTime: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDelivery>('Delivery', DeliverySchema);

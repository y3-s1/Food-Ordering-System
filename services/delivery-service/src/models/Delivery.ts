import mongoose, { Schema, Document } from 'mongoose';

export interface IDelivery extends Document {
  orderId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId | null;
  deliveryAddress: string;
  status: 'PENDING' | 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
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
      enum: ['PENDING', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED'],
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
  },
  { timestamps: true }
);

export default mongoose.model<IDelivery>('Delivery', DeliverySchema);

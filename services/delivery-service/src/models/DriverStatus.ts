import mongoose, { Schema, Document } from 'mongoose';

export interface IDriverStatus extends Document {
  userId: mongoose.Types.ObjectId;  // reference to user-service
  isAvailable: boolean;
  currentLocation: {
    lat: number;
    lng: number;
  };
  currentLoad: number;
}

const DriverStatusSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  currentLoad: {
    type: Number,
    default: 0,
  }
});

export default mongoose.model<IDriverStatus>('DriverStatus', DriverStatusSchema);

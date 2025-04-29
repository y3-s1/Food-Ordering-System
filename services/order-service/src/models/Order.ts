import { Schema, model, Document } from 'mongoose';
import { OrderItemSchema, IOrderItem } from './OrderItem';

export interface IOrder extends Document {
  customerId: string;
  restaurantId: string;
  items: IOrderItem[];
  fees: {
    deliveryFee: number;
    serviceFee: number;
    tax: number;
  };
  totalPrice: number;
  status: string;
  deliveryOption: 'Standard' | 'PickUp';
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  promotionCode?: string;
  paymentMethod: 'Card' | 'Cash on Delivery';
  location: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  customerId:   { type: String, required: true },
  restaurantId: { type: String, required: true },
  items:        { type: [OrderItemSchema], required: true },
  fees: {
    deliveryFee: { type: Number, default: 0 },
    serviceFee:  { type: Number, default: 0 },
    tax:         { type: Number, default: 0 }
  },
  totalPrice:   { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: [
      'PendingPayment',
      'PaymentFail',
      'Confirmed',
      'Preparing',
      'OutForDelivery',
      'Delivered',
      'Cancelled'
    ],
    default: 'PendingPayment'
  },
  deliveryOption: {
    type: String,
    enum: ['Standard', 'PickUp'],
    default: 'Standard',
    required: true
  },
  deliveryAddress: {
    street:     { type: String },
    city:       { type: String },
    postalCode: { type: String },
    country:    { type: String }
  },
  notes:         { type: String },
  promotionCode: { type: String },
  paymentMethod: {
    type: String,
    enum: ['Card', 'Cash on Delivery'],
    default: 'Card',
    required: true
  },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

export default model<IOrder>('Order', OrderSchema);

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
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  promotionCode?: string;
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
      'Confirmed',
      'Preparing',
      'OutForDelivery',
      'Delivered',
      'Cancelled'
    ],
    default: 'PendingPayment'
  },
  deliveryAddress: {
    street:     String,
    city:       String,
    postalCode: String,
    country:    String
  },
  notes:         String,
  promotionCode: String
}, { timestamps: true });

export default model<IOrder>('Order', OrderSchema);

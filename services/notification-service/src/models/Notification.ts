import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  notificationId: string;
  userId?: string;
  email?: string;
  phoneNumber?: string;
  channels: ('EMAIL' | 'SMS')[];
  eventType: string;
  payload: Record<string, any>;
  status: 'Pending' | 'Sent' | 'Failed';
  attempts: number;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  notificationId: { type: String, required: true, unique: true },
  userId:         String,
  email:          String,
  phoneNumber:    String,
  channels:       [{ type: String, enum: ['EMAIL','SMS'], required: true }],
  eventType:      { type: String, required: true },
  payload:        { type: Schema.Types.Mixed, required: true },
  status:         { type: String, enum: ['Pending','Sent','Failed'], default: 'Pending' },
  attempts:       { type: Number, default: 0 },
  lastError:      String
}, { timestamps: true });

export default model<INotification>('Notification', NotificationSchema);

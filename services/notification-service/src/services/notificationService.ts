import { v4 as uuidv4 } from 'uuid';
import Notification, { INotification } from '../models/Notification';
import nodemailer from 'nodemailer';
import Twilio from 'twilio';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, SMS_ACCOUNT_SID, SMS_AUTH_TOKEN, SMS_FROM_NUMBER } from '../config';

// Configure providers
export const mailer = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
});
export const twilio = Twilio(SMS_ACCOUNT_SID, SMS_AUTH_TOKEN);

// Helper: render template (simplest form)
function renderTemplate(eventType: string, payload: any): { subject: string, text: string } {
  switch (eventType) {
    case 'OrderConfirmed':
      return {
        subject: `Your order ${payload.orderId} is confirmed!`,
        text: `Hi! Your order ${payload.orderId} has been confirmed and is now being prepared.`
      };
    case 'OutForDelivery':
      return {
        subject: `Your order ${payload.orderId} is out for delivery!`,
        text: `Good news! Your order ${payload.orderId} is on the way. ETA: ${payload.eta}`
      };
    case 'Delivered':
      return {
        subject: `Your order ${payload.orderId} has been delivered!`,
        text: `Enjoy your meal! Order ${payload.orderId} was delivered at ${payload.deliveredAt}.`
      };
    case 'OrderCancelled':
      return {
        subject: `Your order ${payload.orderId} was cancelled`,
        text: `We're sorry: your order ${payload.orderId} has been cancelled. Reason: ${payload.reason || 'N/A'}.`
      };
    default:
      return {
        subject: `Notification for ${eventType}`,
        text: JSON.stringify(payload)
      };
  }
}

// Create and persist a notification record
export async function createNotification(data: {
  notificationId?: string;
  userId?: string;
  email?: string;
  phoneNumber?: string;
  channels: ('EMAIL'|'SMS')[];
  eventType: string;
  payload: any;
}): Promise<INotification> {
  const notificationId = data.notificationId || uuidv4();
  const doc = new Notification({
    notificationId,
    ...data,
    status: 'Pending',
    attempts: 0
  });
  await doc.save();
  return doc;
}

// Send a notification (with retries)
export async function sendNotification(notif: INotification): Promise<void> {
  const maxAttempts = 3;
  const { subject, text } = renderTemplate(notif.eventType, notif.payload);

  for (; notif.attempts < maxAttempts; notif.attempts++) {
    try {
      if (notif.channels.includes('EMAIL') && notif.email) {
        console.log('send', notif)
        await mailer.sendMail({
          from: EMAIL_USER,
          to: notif.email,
          subject,
          text
        });
      }
      if (notif.channels.includes('SMS') && notif.phoneNumber) {
        await twilio.messages.create({
          from: SMS_FROM_NUMBER,
          to: notif.phoneNumber,
          body: text
        });
      }
      notif.status = 'Sent';
      notif.lastError = undefined;
      break;
    } catch (err: any) {
      notif.lastError = err.message;
      // exponential backoff
      await new Promise(r => setTimeout(r, 500 * Math.pow(2, notif.attempts)));
    }
  }

  if (notif.attempts >= maxAttempts && notif.status !== 'Sent') {
    notif.status = 'Failed';
    // TODO: alert admin or log
  }

  await notif.save();
}

// Background worker to process pending notifications
export async function processPending(): Promise<void> {
  const pendingList = await Notification.find({ status: 'Pending' }).limit(10).exec();
  console.log('process');
  console.log('pendingList', pendingList)
  for (const notif of pendingList) {
    console.log('notif', notif)
    await sendNotification(notif);
  }
}

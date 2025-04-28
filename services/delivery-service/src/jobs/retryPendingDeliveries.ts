import cron from 'node-cron';
import DeliveryModel, { IDelivery } from '../models/Delivery';
import { assignDriverToDelivery } from '../utils/assignDriver';

export function startRetryPendingDeliveries() {
  cron.schedule('*/1 * * * *', async () => {  // every 1 minute
    console.log('Checking for pending deliveries...');

    try {
      const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);

      const pendingDeliveries = await DeliveryModel.find({
        status: 'PENDING',
        createdAt: { $lt: thirtySecondsAgo },
      });

      if (pendingDeliveries.length === 0) {
        console.log('No eligible pending deliveries found.');
        return;
      }

      console.log(`Found ${pendingDeliveries.length} pending deliveries. Retrying assignments...`);

      for (const delivery of pendingDeliveries) {
        try {
          await assignDriverToDelivery(delivery as IDelivery);
        } catch (error) {
          console.error(`Failed to assign delivery ${delivery._id}. Retrying later...`);

          // Increment retry count
          delivery.retryCount += 1;

          // If retried more than 5 times, optionally mark it
          if (delivery.retryCount >= 5) {
            console.warn(`Delivery ${delivery._id} exceeded retry limit. Marking as FAILED_TO_ASSIGN.`);
            delivery.status = 'FAILED_TO_ASSIGN';
          }

          await delivery.save();
        }
      }
    } catch (error) {
      console.error('Error retrying pending deliveries:', error);
    }
  });



  // Clean up old pending deliveries every 5 minute
  cron.schedule('* * * * *', async () => {
    console.log('Running cleanup job for old pending deliveries...');
  
    const THIRTY_MINUTES = 30 * 60 * 5000; // 5 minutes 
    const cutoffTime = new Date(Date.now() - THIRTY_MINUTES);
  
    try {
      const result = await DeliveryModel.deleteMany({
        status: 'PENDING',
        createdAt: { $lt: cutoffTime },
      });
  
      if (result.deletedCount && result.deletedCount > 0) {
        console.log(`Cleaned up ${result.deletedCount} old pending deliveries.`);
      } else {
        console.log('No old pending deliveries found.');
      }
    } catch (error) {
      console.error('Error during pending deliveries cleanup:', error);
    }
  });
}

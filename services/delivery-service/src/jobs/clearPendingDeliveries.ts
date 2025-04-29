import cron from 'node-cron';
import Delivery from '../models/Delivery';
import mongoose from 'mongoose';

// Clean up old pending deliveries every 5 minute
cron.schedule('* * * * *', async () => {
  console.log('Running cleanup job for old pending deliveries...');

  const THIRTY_MINUTES = 30 * 60 * 5000; // 5 minutes 
  const cutoffTime = new Date(Date.now() - THIRTY_MINUTES);

  try {
    const result = await Delivery.deleteMany({
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

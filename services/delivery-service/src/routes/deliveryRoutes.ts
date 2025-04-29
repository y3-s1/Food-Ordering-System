import express from 'express';
import {
  createDelivery,
  updateStatus,
  getDeliveryById,
  getAvailableDrivers,
  updateDriverLocation,
  registerDriverStatus,
  getDeliveriesByDriver,
  updateDriverAvailability
} from '../controllers/deliveryController';

const router = express.Router();

// Delivery endpoints
router.post('/', createDelivery);
router.put('/:id/status', updateStatus);
router.get('/:id', getDeliveryById);
router.get('/', getDeliveriesByDriver);

// Driver status endpoints
router.get('/drivers/available', getAvailableDrivers);
router.post('/drivers/register', registerDriverStatus);
router.put('/drivers/:userId/location', updateDriverLocation);
router.put('/drivers/:userId/availability', updateDriverAvailability);

export default router;

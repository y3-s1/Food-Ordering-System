import { Router } from 'express';
import {
  placeOrder,
  getOrder,
  modifyOrder,
  cancelOrder,
  getStatus,
  getOrders,
  acceptOrderController,
  rejectOrderController,
  updateStatusController,
  getUserOrders,
  getRestaurantOrders
} from '../controllers/orderController';

const router = Router();

//Admin endpoint

// Customer and admin endpoints
router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/user/:userId', getUserOrders);
router.get('/:orderId', getOrder);
router.put('/:orderId', modifyOrder);
router.delete('/:orderId', cancelOrder);
router.get('/:orderId/status', getStatus);

// Restaurant endpoints
router.get('/restaurant/:restaurantId', getRestaurantOrders);
router.put('/:orderId/accept', acceptOrderController);
router.put('/:orderId/reject', rejectOrderController);

// Delivery
router.put('/:orderId/status', updateStatusController);

export default router;

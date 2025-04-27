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
  updateStatusController
} from '../controllers/orderController';

const router = Router();

// Customer endpoints
router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrder);
router.put('/:orderId', modifyOrder);
router.delete('/:orderId', cancelOrder);
router.get('/:orderId/status', getStatus);

// Restaurant endpoints
router.put('/:orderId/accept', acceptOrderController);
router.put('/:orderId/reject', rejectOrderController);

// Delivery
router.put('/:orderId/status', updateStatusController);

export default router;

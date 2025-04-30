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
import { authMiddleware } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';

const router = Router();

//Admin endpoint
router.get('/', authMiddleware, roleGuard(['admin']), getOrders);

// Customer and admin endpoints
router.post('/', authMiddleware, roleGuard(['customer', 'admin']), placeOrder);
router.get('/user/:userId', authMiddleware, roleGuard(['customer', 'admin']), getUserOrders);
router.get('/:orderId', authMiddleware, roleGuard(['customer', 'admin', 'deliveryAgent']), getOrder);
router.put('/:orderId', authMiddleware, roleGuard(['customer', 'admin']), modifyOrder);
router.delete('/:orderId', authMiddleware, roleGuard(['customer', 'admin']), cancelOrder);
router.get('/:orderId/status', authMiddleware, roleGuard(['customer', 'admin']), getStatus);

// Restaurant endpoints
router.get('/restaurant/:restaurantId', authMiddleware, roleGuard(['restaurant']), getRestaurantOrders);
router.put('/:orderId/accept', authMiddleware, roleGuard(['restaurant']), acceptOrderController);
router.put('/:orderId/reject', authMiddleware, roleGuard(['restaurant']), rejectOrderController);

// Delivery and restaurant
router.put('/:orderId/status', authMiddleware, roleGuard(['restaurant', 'deliveryAgent', 'customer']), updateStatusController);

export default router;

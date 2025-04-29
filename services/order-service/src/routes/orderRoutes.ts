import { Router } from 'express';
import {
  placeOrder,
  getOrder,
  modifyOrder,
  cancelOrder,
  getStatus,
  getOrders
} from '../controllers/orderController';

const router = Router();

router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrder);
router.put('/:orderId', modifyOrder);
router.delete('/:orderId', cancelOrder);
router.get('/:orderId/status', getStatus);

export default router;

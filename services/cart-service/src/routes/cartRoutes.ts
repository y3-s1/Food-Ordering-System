import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getCart, addItem /*, updateItem, removeItem, clearCart, applyPromo, removePromo, mergeCarts, getDraft */
} from '../controllers/cartController';

const router = Router();
// router.use(authMiddleware);

router.get('/', getCart);
router.post('/items', addItem);
// ... other routes

export default router;

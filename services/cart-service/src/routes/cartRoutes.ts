/* services/cart-service/src/routes/cartRoutes.ts */
import { Router } from 'express';
import {
  getCart,
  addItem,
} from '../controllers/cartController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// Cart operations
router.get('/', getCart);
router.post('/items', addItem);

export default router;

/* services/cart-service/src/routes/cartRoutes.ts */
import { Router } from 'express';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  generateDraft
} from '../controllers/cartController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

// Cart operations
router.get('/', getCart);
router.post('/items', addItem);
router.put('/items/:itemId', updateItem);
router.delete('/items/:itemId', removeItem);
router.delete('/', clearCart);

// Checkout draft
router.get('/draft', generateDraft);

export default router;

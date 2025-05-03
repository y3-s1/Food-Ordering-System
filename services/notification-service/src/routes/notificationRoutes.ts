import { Router } from 'express';
import {
  postNotification,
  getNotification,
  queryNotifications,
  runProcessor
} from '../controllers/notificationController';
import { authMiddleware } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';

const router = Router();

// Public: services call this (no auth) or you can protect with a service token
router.post('/', postNotification);

// Admin: view & manage
router.get('/', authMiddleware, roleGuard(['admin']), queryNotifications);
router.get('/:notificationId', authMiddleware, roleGuard(['admin']), getNotification);

// Debug: manually trigger (admin)
router.post('/process',  runProcessor);

export default router;

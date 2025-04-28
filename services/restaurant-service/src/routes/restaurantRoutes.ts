// routes/restaurantRoutes.ts (updated)
import express from 'express';
import * as restaurantController from '../controllers/restaurantController';
import * as menuItemController from '../controllers/menuItemController';
import { protect, authorize, isAdmin, isRestaurantOwner } from '../middleware/authMiddleware';

const router = express.Router();

// Public restaurant routes - no authentication needed
router.get('/', restaurantController.getAllRestaurants);
router.get('/approved', restaurantController.getApprovedRestaurants);
router.get('/nearby', restaurantController.findRestaurantsByLocation);
router.get('/:id', restaurantController.getRestaurantById);
router.get('/:restaurantId/menu-items', menuItemController.getMenuItems);
router.get('/:restaurantId/menu-items/:itemId', menuItemController.getMenuItemById);

// Protected restaurant owner routes - login required with restaurantOwner role
router.get('/owner/my-restaurants', protect, authorize(['restaurantOwner']), restaurantController.getMyRestaurants);
router.post('/', protect, authorize(['restaurantOwner']), restaurantController.createRestaurant);
router.put('/:id', protect, isRestaurantOwner, restaurantController.updateRestaurant);
router.delete('/:id', protect, isRestaurantOwner, restaurantController.deleteRestaurant);
router.patch('/:id/toggle-availability', protect, isRestaurantOwner, restaurantController.toggleAvailability);

// Menu item routes - require restaurant owner access
router.post('/:restaurantId/menu-items', protect, isRestaurantOwner, menuItemController.createMenuItem);
router.put('/:restaurantId/menu-items/:itemId', protect, isRestaurantOwner, menuItemController.updateMenuItem);
router.delete('/:restaurantId/menu-items/:itemId', protect, isRestaurantOwner, menuItemController.deleteMenuItem);
router.patch('/:restaurantId/menu-items/:itemId/toggle-availability', protect, isRestaurantOwner, menuItemController.toggleItemAvailability);

// Admin-only routes
router.get('/admin/pending', protect, isAdmin, restaurantController.getPendingRestaurants);
router.patch('/:id/approve', protect, isAdmin, restaurantController.approveRestaurant);
router.patch('/:id/reject', protect, isAdmin, restaurantController.rejectRestaurant);

export default router;
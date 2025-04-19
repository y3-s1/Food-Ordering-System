// routes/restaurantRoutes.ts
import express from 'express';
import * as restaurantController from '../controllers/restaurantController';
import * as menuItemController from '../controllers/menuItemController';

const router = express.Router();

// Restaurant routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/', restaurantController.createRestaurant);
router.put('/:id', restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);
router.patch('/:id/toggle-availability', restaurantController.toggleAvailability);

// Menu items routes (nested under restaurants)
router.get('/:restaurantId/menu-items', menuItemController.getMenuItems);
router.post('/:restaurantId/menu-items', menuItemController.createMenuItem);
router.get('/:restaurantId/menu-items/:itemId', menuItemController.getMenuItemById);
router.put('/:restaurantId/menu-items/:itemId', menuItemController.updateMenuItem);
router.delete('/:restaurantId/menu-items/:itemId', menuItemController.deleteMenuItem);
router.patch('/:restaurantId/menu-items/:itemId/toggle-availability', menuItemController.toggleItemAvailability);

export default router;
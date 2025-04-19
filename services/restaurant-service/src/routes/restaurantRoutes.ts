import express from 'express';
import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setRestaurantAvailability,
  getRestaurantMenu
} from '../controllers/restaurantController';

const router = express.Router();

router.post('/menu', addMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);
router.put('/availability/:restaurantId', setRestaurantAvailability);
router.get('/menu/:restaurantId', getRestaurantMenu);

export default router;

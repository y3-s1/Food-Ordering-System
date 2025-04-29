// controllers/menuItemController.ts (updated)
import { Request, Response } from 'express';
import MenuItem, { IMenuItem } from '../models/menuItemModel';
import Restaurant from '../models/restaurantModel';
import mongoose from 'mongoose';

// Custom Request interface with user info
interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: string;
    isAdmin: boolean;
  };
}

// Get all menu items for a restaurant
export const getMenuItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      res.status(400).json({ message: 'Invalid restaurant ID format' });
      return;
    }

    const menuItems = await MenuItem.find({ restaurantId });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching menu items', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// Get menu item by ID
export const getMenuItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, itemId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }

    const menuItem = await MenuItem.findOne({ 
      _id: itemId,
      restaurantId: restaurantId 
    });
    
    if (!menuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching menu item', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// Create new menu item - check restaurant ownership
export const createMenuItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    
    // Validate restaurant ID format
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      res.status(400).json({ message: 'Invalid restaurant ID format' });
      return;
    }

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }

    // Verify ownership or admin status
    if (!req.user?.isAdmin && restaurant.ownerId.toString() !== req.user?._id) {
      res.status(403).json({ message: 'Not authorized to manage menu items for this restaurant' });
      return;
    }

    // Validate required fields
    const { name, description, price, category } = req.body;
    if (!name || !description || price === undefined || !category) {
      res.status(400).json({ 
        message: 'Missing required fields', 
        required: ['name', 'description', 'price', 'category'],
        received: req.body 
      });
      return;
    }

    // Create menu item
    const newMenuItem = new MenuItem({
      ...req.body,
      restaurantId
    });
    
    const savedMenuItem = await newMenuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating menu item', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Update menu item - check restaurant ownership
export const updateMenuItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { restaurantId, itemId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    
    // Check restaurant ownership
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }

    // Verify ownership or admin status
    if (!req.user?.isAdmin && restaurant.ownerId.toString() !== req.user?._id) {
      res.status(403).json({ message: 'Not authorized to manage menu items for this restaurant' });
      return;
    }
    
    // Update the menu item
    const updatedMenuItem = await MenuItem.findOneAndUpdate(
      { _id: itemId, restaurantId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedMenuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating menu item', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Delete menu item - check restaurant ownership
export const deleteMenuItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { restaurantId, itemId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    
    // Check restaurant ownership
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }

    // Verify ownership or admin status
    if (!req.user?.isAdmin && restaurant.ownerId.toString() !== req.user?._id) {
      res.status(403).json({ message: 'Not authorized to manage menu items for this restaurant' });
      return;
    }
    
    // Delete the menu item
    const deletedMenuItem = await MenuItem.findOneAndDelete({ 
      _id: itemId,
      restaurantId
    });
    
    if (!deletedMenuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting menu item', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Toggle menu item availability - check restaurant ownership
export const toggleItemAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { restaurantId, itemId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    
    // Check restaurant ownership
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }

    // Verify ownership or admin status
    if (!req.user?.isAdmin && restaurant.ownerId.toString() !== req.user?._id) {
      res.status(403).json({ message: 'Not authorized to manage menu items for this restaurant' });
      return;
    }
    
    // Toggle menu item availability
    const menuItem = await MenuItem.findOne({ 
      _id: itemId,
      restaurantId
    });
    
    if (!menuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    
    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();
    
    res.status(200).json({ 
      message: `Menu item is now ${menuItem.isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: menuItem.isAvailable
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error toggling menu item availability', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
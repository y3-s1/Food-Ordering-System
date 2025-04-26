// controllers/menuItemController.ts
import { Request, Response } from 'express';
import MenuItem, { IMenuItem } from '../models/menuItemModel';
import Restaurant from '../models/restaurantModel'; // Make sure to import your Restaurant model
import mongoose from 'mongoose';

// Get all menu items for a restaurant
export const getMenuItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      res.status(400).json({ message: 'Invalid restaurant ID format' });
      return;
    }

    const menuItems = await MenuItem.find({ restaurantId });
    console.log(`Found ${menuItems.length} menu items for restaurant ${restaurantId}`);
    res.status(200).json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ 
      message: 'Error fetching menu items', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// Get menu item by ID for a specific restaurant
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
    console.error('Error fetching menu item:', error);
    res.status(500).json({ 
      message: 'Error fetching menu item', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// Create new menu item for a restaurant
export const createMenuItem = async (req: Request, res: Response): Promise<void> => {
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

    console.log('Restaurant found:', restaurant._id);
    console.log('Request body:', req.body);

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

    // Create and save menu item
    const newMenuItem = new MenuItem({
      ...req.body,
      restaurantId: restaurantId // Ensure we're using the parameter from URL
    });
    
    console.log('About to save menu item:', newMenuItem);
    const savedMenuItem = await newMenuItem.save();
    console.log('Menu item saved successfully:', savedMenuItem._id);
    
    res.status(201).json(savedMenuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(400).json({ 
      message: 'Error creating menu item', 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
};

// Update menu item for a restaurant
export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, itemId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    
    const updatedMenuItem = await MenuItem.findOneAndUpdate(
      { _id: itemId, restaurantId: restaurantId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedMenuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    console.log('Menu item updated successfully:', updatedMenuItem._id);
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(400).json({ 
      message: 'Error updating menu item', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Delete menu item from a restaurant
export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, itemId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    
    const deletedMenuItem = await MenuItem.findOneAndDelete({ 
      _id: itemId,
      restaurantId: restaurantId 
    });
    
    if (!deletedMenuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    console.log('Menu item deleted successfully:', itemId);
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ 
      message: 'Error deleting menu item', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Toggle menu item availability for a restaurant
export const toggleItemAvailability = async (req: Request, res: Response): Promise<void> => {
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
    
    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();
    
    console.log(`Menu item ${itemId} availability toggled to ${menuItem.isAvailable}`);
    res.status(200).json({ 
      message: `Menu item is now ${menuItem.isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: menuItem.isAvailable
    });
  } catch (error) {
    console.error('Error toggling menu item availability:', error);
    res.status(500).json({ 
      message: 'Error toggling menu item availability', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
// controllers/restaurantController.ts
import { Request, Response } from 'express';
import Restaurant, { IRestaurant } from '../models/restaurantModel';

// Get all restaurants
export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error });
  }
};

// Get restaurant by ID
export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', error });
  }
};

// Get approved restaurants only (for customer view)
export const getApprovedRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurants = await Restaurant.find({ approvalStatus: 'approved' });
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching approved restaurants', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// Create restaurant with location
export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate location data
    const { location } = req.body;
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      res.status(400).json({ 
        message: 'Invalid location data. Both lat and lng must be numbers.',
        received: location 
      });
      return;
    }

    const newRestaurant = new Restaurant({
      ...req.body,
      approvalStatus: 'pending' // Ensure all new registrations are pending
    });
    
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating restaurant', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// Update restaurant
export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate location data if it's being updated
    if (req.body.location) {
      const { location } = req.body;
      if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        res.status(400).json({ 
          message: 'Invalid location data. Both lat and lng must be numbers.',
          received: location 
        });
        return;
      }
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedRestaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(400).json({ message: 'Error updating restaurant', error });
  }
};

// Delete restaurant
export const deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restaurant', error });
  }
};

// Toggle restaurant availability
export const toggleAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }
    
    restaurant.isAvailable = !restaurant.isAvailable;
    await restaurant.save();
    
    res.status(200).json({ 
      message: `Restaurant is now ${restaurant.isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: restaurant.isAvailable
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling restaurant availability', error });
  }
};

// Get all pending restaurant registrations (for admin)
export const getPendingRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingRestaurants = await Restaurant.find({ approvalStatus: 'pending' });
    res.status(200).json(pendingRestaurants);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching pending restaurants', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// Approve restaurant registration
export const approveRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }
    
    if (restaurant.approvalStatus !== 'pending') {
      res.status(400).json({ 
        message: 'Restaurant is not in pending status', 
        currentStatus: restaurant.approvalStatus 
      });
      return;
    }
    
    restaurant.approvalStatus = 'approved';
    await restaurant.save();
    
    res.status(200).json({ 
      message: 'Restaurant registration approved successfully',
      restaurant 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error approving restaurant', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// Reject restaurant registration
export const rejectRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }
    
    if (restaurant.approvalStatus !== 'pending') {
      res.status(400).json({ 
        message: 'Restaurant is not in pending status', 
        currentStatus: restaurant.approvalStatus 
      });
      return;
    }
    
    restaurant.approvalStatus = 'rejected';
    await restaurant.save();
    
    res.status(200).json({ 
      message: 'Restaurant registration rejected',
      restaurant 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error rejecting restaurant', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// New endpoint to find restaurants by proximity
export const findRestaurantsByLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius in meters, default 5km
    
    if (!lat || !lng) {
      res.status(400).json({ message: 'Latitude and longitude are required' });
      return;
    }
    
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ message: 'Invalid latitude or longitude values' });
      return;
    }
    
    // Find restaurants within the given radius
    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude] // GeoJSON format
          },
          $maxDistance: parseInt(radius as string)
        }
      },
      approvalStatus: 'approved' // Only return approved restaurants
    });
    
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error finding restaurants by location', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};
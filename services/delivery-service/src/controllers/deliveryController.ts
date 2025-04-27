import { Request, Response, RequestHandler } from 'express';
import Delivery from '../models/Delivery';
import DriverStatus from '../models/DriverStatus';
import mongoose from 'mongoose';
import { orderServiceApi, restaurantServiceApi } from '../utils/serviceApi';


// Typing for Order object
interface IOrder {
  restaurantId: string;
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  location: {
    lat: number;
    lng: number;
  };
}

// Typing for Restaurant object
interface IRestaurant {
  location: {
    lat: number;
    lng: number;
  };
}




async function retryRequest<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    console.warn(`Retrying... (${3 - retries} attempt(s))`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay);
  }
}




// 1. Create a delivery
export const createDelivery: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(400).json({ message: 'orderId is required' });
      return;
    }

    // Fetch Order details with Retry
    const orderResponse = await retryRequest(() => orderServiceApi.get<IOrder>(`/${orderId}`));
    const order = orderResponse.data;

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const restaurantId = order.restaurantId;
    const deliveryAddress = `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.postalCode}, ${order.deliveryAddress.country}`;
    const deliveryLocation = order.location;

    // Fetch Restaurant details with Retry
    const restaurantResponse = await retryRequest(() => restaurantServiceApi.get<IRestaurant>(`/${restaurantId}`));
    const restaurant = restaurantResponse.data;

    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }

    const restaurantLocation = restaurant.location;

    // Create Delivery
    const delivery = await Delivery.create({
      orderId: new mongoose.Types.ObjectId(orderId),
      driverId: null,
      deliveryAddress,
      status: 'PENDING',
      location: {
        lat: deliveryLocation.lat,
        lng: deliveryLocation.lng,
      },
      resLocation: {
        lat: restaurantLocation.lat,
        lng: restaurantLocation.lng,
      },
    });

    res.status(201).json(delivery);
  } catch (err) {
    console.error('Error creating delivery:', err);
    res.status(500).json({ message: 'Failed to create delivery', error: err });
  }
};



// 2. Assign driver (auto from available drivers)
export const assignDriver: RequestHandler = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      res.status(404).json({ message: 'Delivery not found' });
      return;
    }

    const availableDriver = await DriverStatus.findOne({ isAvailable: true });
    if (!availableDriver) {
      res.status(400).json({ message: 'No drivers available' });
      return;
    }

    delivery.driverId = availableDriver.userId;
    delivery.status = 'ASSIGNED';
    await delivery.save();

    availableDriver.isAvailable = false;
    await availableDriver.save();

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign driver', error: err });
  }
};

// 3. Update delivery status
export const updateStatus: RequestHandler = async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (status === 'DELIVERED' && delivery?.driverId) {
      await DriverStatus.findOneAndUpdate(
        { userId: delivery.driverId },
        { isAvailable: true }
      );
    }

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err });
  }
};

// 4. Get delivery by ID
export const getDeliveryById: RequestHandler = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving delivery', error: err });
  }
};

// 5. Get available drivers
export const getAvailableDrivers: RequestHandler = async (_req, res) => {
  try {
    const drivers = await DriverStatus.find({ isAvailable: true });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching drivers', error: err });
  }
};

// 6. Register driver status
export const registerDriverStatus: RequestHandler = async (req, res) => {
  try {
    const { userId, lat, lng } = req.body;

    const existing = await DriverStatus.findOne({ userId });
    if (existing) {
      res.status(409).json({ message: 'Driver already registered.' });
      return;
    }

    const status = await DriverStatus.create({
      userId: new mongoose.Types.ObjectId(userId),
      isAvailable: true,
      currentLocation: { lat, lng },
    });

    res.status(201).json(status);
  } catch (err) {
    res.status(500).json({ message: 'Failed to register driver status', error: err });
  }
};

// 7. Update real-time location
export const updateDriverLocation: RequestHandler = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const { userId } = req.params;

    const updated = await DriverStatus.findOneAndUpdate(
      { userId },
      { currentLocation: { lat, lng } },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: 'Driver not found' });
      return;
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update driver location', error: err });
  }
};

// 8. Get all deliveries assigned to a specific driver
export const getDeliveriesByDriver: RequestHandler = async (req, res) => {
  try {
    const { driverId } = req.query;

    if (!driverId) {
      res.status(400).json({ message: 'Missing driverId parameter' });
      return;
    }

    const deliveries = await Delivery.find({ driverId });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch deliveries by driver', error: err });
  }
};
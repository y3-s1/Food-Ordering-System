import { Request, Response, RequestHandler } from 'express';
import Delivery from '../models/Delivery';
import DriverStatus from '../models/DriverStatus';
import mongoose from 'mongoose';
import { orderServiceApi, restaurantServiceApi } from '../utils/serviceApi';
import { assignDriverToDelivery } from '../utils/assignDriver';


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

    console.log(`Delivery ${delivery._id} created successfully.`);

    // Auto-assign driver using helper
    try {
      await assignDriverToDelivery(delivery);
    } catch (assignError) {
      console.error('Error auto-assigning driver:', assignError);
    }

    res.status(201).json(delivery);

  } catch (err) {
    console.error('Error creating delivery:', err);
    res.status(500).json({ message: 'Failed to create delivery', error: err });
  }
};



// 2. Update delivery status
export const updateStatus: RequestHandler = async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      res.status(404).json({ message: 'Delivery not found' });
      return;
    }

    const oldStatus = delivery.status;
    delivery.status = status;
    await delivery.save();

    // If status becomes "DELIVERED", decrease driver's load
    if (status === 'DELIVERED' && delivery.driverId) {
      const driver = await DriverStatus.findOne({ userId: delivery.driverId });
      if (driver) {
        driver.currentLoad = Math.max(0, driver.currentLoad - 1); // prevent negative load
        await driver.save();
      }
    }

    res.json(delivery);
  } catch (err) {
    console.error('Error updating delivery status:', err);
    res.status(500).json({ message: 'Failed to update status', error: err });
  }
};


// 3. Get delivery by ID
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

// 4. Get available drivers
export const getAvailableDrivers: RequestHandler = async (_req, res) => {
  try {
    const drivers = await DriverStatus.find({ isAvailable: true });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching drivers', error: err });
  }
};

// 5. Register driver status
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

// 6. Update real-time location
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

// 7. Get all deliveries assigned to a specific driver
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


// 8. Toggle driver's online/offline status
export const updateDriverAvailability: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      res.status(400).json({ message: 'isAvailable must be a boolean' });
      return;
    }

    const driver = await DriverStatus.findOne({ userId });

    if (!driver) {
      res.status(404).json({ message: 'Driver not found' });
      return;
    }

    // Prevent going offline if there are active deliveries
    if (
      !isAvailable &&
      (await Delivery.findOne({
        driverId: userId,
        status: { $in: ['ASSIGNED', 'OUT_FOR_DELIVERY'] }
      }))
    ) {
      res.status(400).json({
        message: 'Cannot go offline with active deliveries',
      });
      return;
    }

    driver.isAvailable = isAvailable;
    await driver.save();

    res.json({ message: `Driver is now ${isAvailable ? 'online' : 'offline'}` });
  } catch (err) {
    console.error('Failed to update driver availability:', err);
    res.status(500).json({ message: 'Failed to update driver status', error: err });
  }
};



// 9. Live tracking info by orderId
export const getLiveTrackingInfo: RequestHandler = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({ error: 'Invalid orderId' });
      return;
    }

    const delivery = await Delivery.findOne({ orderId: new mongoose.Types.ObjectId(orderId) });

    if (!delivery) {
      res.status(404).json({ error: 'Delivery not found for this order' });
      return;
    }

    if (!delivery.driverId) {
      res.status(400).json({ error: 'No driver assigned yet' });
      return;
    }

    const driverStatus = await DriverStatus.findOne({ userId: delivery.driverId });

    if (!driverStatus) {
      res.status(404).json({ error: 'Driver location not available' });
      return;
    }

    res.json({
      status: delivery.status,
      driverLocation: driverStatus.currentLocation,
      deliveryAddress: delivery.deliveryAddress,
      deliveryLocation: delivery.location,
      restaurantLocation: delivery.resLocation,
      estimatedTime: delivery.estimatedTime,
    });
    return;
  } catch (err) {
    console.error('Live tracking error:', err);
    res.status(500).json({ error: 'Failed to fetch tracking info' });
  }
};

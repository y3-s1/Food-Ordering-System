import { Request, Response, NextFunction } from 'express';
import { acceptOrder, cancelSelectOrder, createOrder, getAllOrders, getOrderById, getOrderStatus, modifySelectOrder, rejectOrder, updateOrderStatus } from '../services/orderService';

export const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const order = await getAllOrders();
      res.json(order);
    } catch (err) {
      next(err);
    }
  };

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await getOrderById(req.params.orderId);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const modifyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await modifySelectOrder(req.params.orderId, req.body);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await cancelSelectOrder(req.params.orderId);
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    next(err);
  }
};

export const getStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = await getOrderStatus(req.params.orderId);
    res.json(status);
  } catch (err) {
    next(err);
  }
};

export const acceptOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const restaurantId = (req as any).userId; // Assume userId from JWT is restaurantId
    const order = await acceptOrder(orderId, restaurantId);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const rejectOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const restaurantId = (req as any).userId;
    const order = await rejectOrder(orderId, restaurantId);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const updateStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) throw { status: 400, message: 'Missing status in body' };
    const validStatuses = ['Preparing', 'OutForDelivery', 'Delivered'];
    if (!validStatuses.includes(status)) {
      throw { status: 400, message: 'Invalid status value' };
    }
    const order = await updateOrderStatus(orderId, status as any);
    res.json(order);
  } catch (err) {
    next(err);
  }
};
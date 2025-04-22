import { Request, Response, NextFunction } from 'express';
import { cancelSelectOrder, createOrder, getAllOrders, getOrderById, getOrderStatus, modifySelectOrder } from '../services/orderService';

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

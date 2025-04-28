import { Request, Response, NextFunction } from 'express';
import type { Server as SocketIOServer } from 'socket.io';
import { acceptOrder, cancelSelectOrder, createOrder, getAllOrders, getOrderById, getOrderStatus, modifySelectOrder, rejectOrder, updateOrderStatus } from '../services/orderService';
import axios from 'axios';

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

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { restaurantId, userId, status } = req.query;
    const statuses = typeof status === 'string' ? status.split(',') : undefined;
    const orders = await getAllOrders(
      typeof restaurantId === 'string' ? restaurantId : undefined,
      typeof userId === 'string' ? userId : undefined,
      statuses
    );
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const statusQuery = req.query.status;
    const statuses = typeof statusQuery === 'string' ? statusQuery.split(',') : undefined;
    const orders = await getAllOrders(undefined, userId, statuses);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getRestaurantOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurantId = req.params.restaurantId;
    const statusQuery = req.query.status;
    const statuses = typeof statusQuery === 'string' ? statusQuery.split(',') : undefined;
    const orders = await getAllOrders(restaurantId, undefined, statuses);
    res.json(orders);
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
  const io = req.app.locals.io as SocketIOServer;
  try {
    const { orderId } = req.params;
    // const restaurantId = (req as any).userId; 
    const restaurantId = '680b4f35b02ac7fdd10ed49d'; 
    const order = await acceptOrder(orderId, restaurantId);
    io.emit('orderUpdated', order);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const rejectOrderController = async (req: Request, res: Response, next: NextFunction) => {
  const io = req.app.locals.io as SocketIOServer;
  try {
    const { orderId } = req.params;
    const restaurantId = (req as any).userId;
    const order = await rejectOrder(orderId, restaurantId);
    io.emit('orderUpdated', order);
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
  const io = req.app.locals.io as SocketIOServer;
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) throw { status: 400, message: 'Missing status in body' };
    const validStatuses = ['Preparing', 'OutForDelivery', 'Delivered', 'Confirmed', 'PaymentFail'];
    if (!validStatuses.includes(status)) {
      throw { status: 400, message: 'Invalid status value' };
    }
    const order = await updateOrderStatus(orderId, status as any);
    io.emit('orderUpdated', order);
    res.json(order);
  } catch (err) {
    next(err);
  }
};
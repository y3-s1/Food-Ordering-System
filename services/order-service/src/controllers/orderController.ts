import { Request, Response, NextFunction } from 'express';

export const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(201).json({ message: 'placeOrder stub' });
};

export const getOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.json({ message: 'getOrders stub' });
  };

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: 'getOrder stub' });
};

export const modifyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: 'modifyOrder stub' });
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: 'cancelOrder stub' });
};

export const getStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: 'getStatus stub' });
};

/* services/cart-service/src/controllers/cartController.ts */
import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cartService';

// Helper to extract auth context
function getContext(req: Request) {
  const userId = (req as any).userId as string | undefined;
  const cartId = (req as any).cartId as string | undefined;
  return { userId, cartId };
}

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, cartId } = getContext(req);
    const cart = await cartService.getCart(userId, cartId);
    // Return cart and possibly set header for guest
    if (!userId && cart.cartId !== cartId) {
      res.setHeader('X-Cart-Id', cart.cartId);
    }
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, cartId } = getContext(req);
    const item = req.body;
    const cart = await cartService.addItem(userId, cartId, item);
    if (!userId && cart.cartId !== cartId) {
      res.setHeader('X-Cart-Id', cart.cartId);
    }
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
};


/* services/cart-service/src/controllers/cartController.ts */
import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cartService';

// Helper to extract auth context
function getContext(req: Request) {
  const userId = (req as any).userId as string | undefined;
  const cartId = (req as any).cartId as string | undefined;
  const userRole = (req as any).userRole as string | undefined;
  
  return { userId, cartId, userRole };
}

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // console.log('req', req)
    const { userId, cartId } = getContext(req);
    console.log('userId-c', userId)
    const cart = await cartService.getCart(userId, cartId);
    // Return cart and possibly set header for guest
    if (!userId) {
      res.cookie('cartId', cart.cartId, {
        httpOnly: true,        // Can't be accessed by JavaScript
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiry
        sameSite: 'lax'        // Protection against CSRF
      });
    }
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, cartId } = getContext(req);
    const item = req.body.item;
    console.log('req.body', req.body)
    const cart = await cartService.addItem(userId, cartId, item);
    if (!userId) {
      res.cookie('cartId', cart.cartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'lax'
      });
    }
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, cartId } = getContext(req);
    const itemId = req.params.itemId;
    const data = req.body;
    const cart = await cartService.updateItem(userId, cartId, itemId, data);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, cartId } = getContext(req);
    const itemId = req.params.itemId;
    const cart = await cartService.removeItem(userId, cartId, itemId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, cartId } = getContext(req);
    const cart = await cartService.clearCart(userId, cartId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const generateDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, cartId } = getContext(req);
    // if (!userId) throw { status: 401, message: 'User must be authenticated to checkout' };
    const draft = await cartService.generateDraft( userId, cartId);
    res.json(draft);
  } catch (err) {
    next(err);
  }
};
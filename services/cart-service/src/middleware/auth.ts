import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export interface AuthRequest extends Request {
  userId?: string;
  cartId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const guest = req.headers['x-cart-id'] as string;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET) as any;
      req.userId = payload.userId;
      return next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } else if (guest) {
    req.cartId = guest;
    return next();
  } else {
    return res.status(401).json({ error: 'No credentials provided' });
  }
}

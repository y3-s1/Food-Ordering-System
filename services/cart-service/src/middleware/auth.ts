import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export interface AuthRequest extends Request {
  userId?: string;
  cartId?: string;
  userRole?: string;
}

// authenticate request token and role
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  const guestCartId = req.cookies.cartId;

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      req.userId = payload._id;
      req.userRole = payload.role;
      if (payload.cartId) {
        req.cartId = payload.cartId;
      }
      
      return next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return
    }
  } else if (guestCartId) {
    req.cartId = guestCartId;
    return next();
  } else {
    res.status(401).json({ error: 'No credentials provided' });
    return
  }
}
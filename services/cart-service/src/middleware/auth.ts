import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export interface AuthRequest extends Request {
  userId?: string;
  cartId?: string;
  userRole?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // Try to get authentication token from cookies
  const token = req.cookies.token;
  const guestCartId = req.cookies.cartId;

  if (token) {
    try {
      // Verify and decode the JWT token
      console.log('token', token)
      const payload = jwt.verify(token, JWT_SECRET) as any;
      console.log('payload ', payload )
      // Extract user information from payload
      req.userId = payload._id;
      req.userRole = payload.role; // Extract the role
      
      // If the payload contains cartId, use it
      if (payload.cartId) {
        req.cartId = payload.cartId;
      }
      
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } else if (guestCartId) {
    // Handle guest users with only a cart ID
    req.cartId = guestCartId;
    return next();
  } else {
    return res.status(401).json({ error: 'No credentials provided' });
  }
}
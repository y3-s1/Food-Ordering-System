import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // Try to get authentication token from cookies
  const token = req.cookies.token;

  if (token) {
    try {
      // Verify and decode the JWT token
      const payload = jwt.verify(token, JWT_SECRET) as any;
      // Extract user information from payload
      req.userId = payload._id;
      req.userRole = payload.role; 
      
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ error: 'No credentials provided' });
  }
}

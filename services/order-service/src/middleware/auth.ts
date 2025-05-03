import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

// verify the request token
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // Bypass auth if internal request
  const internalService = req.headers['x-internal-service'];
  if (internalService === 'delivery-service') {
    req.userRole = 'deliveryAgent';
    return next();
  }

  const token = req.cookies.token;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      req.userId = payload._id;
      req.userRole = payload.role; 
      
      return next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return
    }
  } else {
    res.status(401).json({ error: 'No credentials provided' });
    return
  }
}

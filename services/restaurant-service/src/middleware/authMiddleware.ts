// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: string;
    isAdmin: boolean;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:5004';

// Protect routes - verify token and add user to request
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header or cookie
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ error: 'Not authorized, no token' });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authorized' });
      return;
    }

    if (roles.includes(req.user.role) || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ 
        error: 'Forbidden - Not authorized to access this resource',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }
  };
};

// Check if user is admin
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

// Restaurant owner verification middleware
export const isRestaurantOwner = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const restaurantId = req.params.id || req.params.restaurantId;
    
    if (!restaurantId) {
      res.status(400).json({ error: 'Restaurant ID is required' });
      return;
    }
    
    // Here you would typically check if the restaurant belongs to the user
    // This is a simplified example - you should implement proper ownership verification
    
    // For now, we'll just check if the user has the restaurantOwner role
    if (req.user?.role === 'restaurantOwner' || req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: 'Not authorized to manage this restaurant' });
    }
  } catch (error) {
    console.error('Restaurant owner verification error:', error);
    res.status(500).json({ error: 'Authorization error' });
  }
};
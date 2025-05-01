import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

// Only allows requests allowedRoles array.
export function roleGuard(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Allow internal services even without token
    if (req.headers['x-internal-service'] === 'delivery-service') {
      return next();
    }

    const { userRole } = req;
    if (!userRole) {
      res.status(401).json({ error: 'No credentials provided' });
      return
    }
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ error: 'Forbidden: insufficient permissions' });
      return
    }
    next();
  };
}

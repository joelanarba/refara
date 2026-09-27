import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { AuthUser } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: { message: 'Authentication token missing or malformed', status: 401 } });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (_error) {
    return res
      .status(403)
      .json({ error: { message: 'Invalid or expired authentication token', status: 403 } });
  }
};

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: { message: 'Unauthenticated', status: 401 } });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: { message: 'Forbidden: Insufficient privileges for this action', status: 403 },
      });
    }

    next();
  };
};

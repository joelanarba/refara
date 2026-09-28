import { Role } from '@prisma/client';

export interface AuthUser {
  userId: string;
  role: Role;
  facilityId: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
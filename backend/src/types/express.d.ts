import { UserRole } from '@prisma/client';

export interface AuthUser {
  userId: string;
  role: UserRole;
  facilityId?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

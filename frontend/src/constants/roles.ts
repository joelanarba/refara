import { UserRole } from '../types';

export const ROLES: Record<UserRole, UserRole> = {
  WORKER: 'WORKER',
  ADMIN: 'ADMIN',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  WORKER: 'Healthcare Worker',
  ADMIN: 'Administrator',
};

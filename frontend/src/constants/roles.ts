import { UserRole } from '../types';

export const ROLES: Record<UserRole, UserRole> = {
  REFERRING_WORKER: 'REFERRING_WORKER',
  RECEIVING_WORKER: 'RECEIVING_WORKER',
  ADMIN: 'ADMIN',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  REFERRING_WORKER: 'Referring Worker',
  RECEIVING_WORKER: 'Receiving Worker',
  ADMIN: 'Administrator',
};

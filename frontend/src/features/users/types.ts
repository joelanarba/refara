import { UserRole } from '../../types';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  facilityName: string;
  isActive: boolean;
  isPending?: boolean;
}

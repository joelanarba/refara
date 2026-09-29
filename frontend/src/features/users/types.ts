import { UserRole } from '../../types';

export interface UserSummary {
  id: string;
  name: string;
  role: UserRole;
  facilityName: string;
  isActive: boolean;
}

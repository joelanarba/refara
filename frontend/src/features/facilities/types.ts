import { FacilityType } from '../../types';

export interface FacilitySummary {
  id: string;
  name: string;
  type: FacilityType;
  location: string;
  isOnline: boolean;
  activeReferrals: number;
}

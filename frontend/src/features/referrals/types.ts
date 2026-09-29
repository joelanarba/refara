import { ReferralStatus, ReferralUrgency } from '../../types';

/** Flattened shape for list/table views - facility names included directly. */
export interface ReferralListItem {
  id: string;
  code: string;
  patientInitials: string;
  patientName: string;
  patientAge: number;
  reason: string;
  referringFacilityName: string;
  receivingFacilityName: string;
  urgency: ReferralUrgency;
  status: ReferralStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReferralScope = 'network' | 'facility';
export type ReferralDirection = 'all' | 'sent' | 'received';

export interface CreateReferralPayload {
  patientName: string;
  patientAge: number;
  gestationalWeeks?: number;
  urgency: ReferralUrgency;
  reason: string;
  receivingFacilityId: string;
}
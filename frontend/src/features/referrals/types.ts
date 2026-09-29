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

export interface ReferralStatusHistory {
  id: string;
  referralId: string;
  previousStatus: ReferralStatus | null;
  newStatus: ReferralStatus;
  reasonText: string | null;
  timestamp: string;
  changedByUser: {
    id: string;
    name: string;
    role: string;
  };
}

export interface ReferralDetail {
  id: string;
  code: string;
  patientName: string;
  patientAge: number;
  gestationalWeeks: number | null;
  reason: string;
  urgency: ReferralUrgency;
  status: ReferralStatus;
  referringFacilityId: string;
  receivingFacilityId: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  referringFacility: { id: string; name: string; type: string };
  receivingFacility: { id: string; name: string; type: string };
  createdByUser: { id: string; name: string; email: string };
  statusHistory: ReferralStatusHistory[];
}

export interface UpdateReferralStatusPayload {
  newStatus: ReferralStatus;
  reasonText?: string;
}

// Shared TypeScript types and interfaces
// These should mirror the backend types for API contracts

export type UserRole = 'WORKER' | 'ADMIN';

export type FacilityType =
  | 'CHPS_COMPOUND'
  | 'HEALTH_CENTER'
  | 'DISTRICT_HOSPITAL'
  | 'REGIONAL_HOSPITAL'
  | 'TEACHING_HOSPITAL'
  | 'PRIVATE_CLINIC';

export type ReferralUrgency = 'ROUTINE' | 'URGENT' | 'EMERGENCY';

export type ReferralStatus =
  'SUBMITTED' | 'ACKNOWLEDGED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'ARRIVED' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  facilityId: string | null;
  createdAt: string;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  location: string;
  createdAt: string;
}

export interface Referral {
  id: string;
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
}

export interface ReferralStatusHistory {
  id: string;
  referralId: string;
  previousStatus: ReferralStatus | null;
  newStatus: ReferralStatus;
  changedByUserId: string;
  reasonText: string | null;
  timestamp: string;
}

import { ReferralStatus, ReferralUrgency } from '../../types';

export interface DashboardStats {
  totalReferrals: number;
  totalReferralsChangePct: number | null;
  pendingAction: number;
  completed: number;
  completedChangePct: number | null;
  urgentCases: number;
}

/**
 * Flattened referral shape for the "Recent network referrals" table —
 * includes facility names directly so the UI doesn't need a second lookup.
 * Backend endpoint: GET /dashboard/recent-referrals
 */
export interface DashboardReferral {
  id: string;
  code: string; // e.g. "MR-1048"
  patientInitials: string;
  patientName: string;
  patientAge: number;
  reason: string;
  referringFacilityName: string;
  receivingFacilityName: string;
  urgency: ReferralUrgency;
  status: ReferralStatus;
  createdAt: string;
}

export interface ActivityPoint {
  date: string; // ISO date
  count: number;
}

export interface ReferralActivity {
  points: ActivityPoint[];
  changePct: number | null;
}

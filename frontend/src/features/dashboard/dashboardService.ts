import { apiClient } from '../../services/api';
import { DashboardStats, DashboardReferral, ReferralActivity } from './types';

export type DashboardScope = 'network' | 'facility';

const USE_MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';
const ago = (mins: number) => new Date(Date.now() - mins * 60 * 1000).toISOString();

const MOCK_STATS: Record<DashboardScope, DashboardStats> = {
  network: {
    totalReferrals: 5,
    totalReferralsChangePct: 12.5,
    pendingAction: 4,
    completed: 1,
    completedChangePct: 8.2,
    urgentCases: 3,
  },
  facility: {
    totalReferrals: 3,
    totalReferralsChangePct: 12.5,
    pendingAction: 3,
    completed: 0,
    completedChangePct: 8.2,
    urgentCases: 2,
  },
};

const ALL_REFERRALS: DashboardReferral[] = [
  {
    id: '1',
    code: 'MR-1048',
    patientInitials: 'MO',
    patientName: 'M. Owusu',
    patientAge: 26,
    reason: 'Severe pre-eclampsia',
    referringFacilityName: 'Adabraka Community Clinic',
    receivingFacilityName: 'Korle Bu Teaching Hospital',
    urgency: 'EMERGENCY',
    status: 'SUBMITTED',
    createdAt: ago(12),
  },
  {
    id: '2',
    code: 'MR-1047',
    patientInitials: 'AB',
    patientName: 'A. Boateng',
    patientAge: 34,
    reason: 'Obstructed labour',
    referringFacilityName: 'La General Hospital',
    receivingFacilityName: '37 Military Hospital',
    urgency: 'URGENT',
    status: 'ACKNOWLEDGED',
    createdAt: ago(46),
  },
  {
    id: '3',
    code: 'MR-1046',
    patientInitials: 'EA',
    patientName: 'E. Addo',
    patientAge: 23,
    reason: 'Previous C-section',
    referringFacilityName: 'Osu Maternity Centre',
    receivingFacilityName: 'Adabraka Community Clinic',
    urgency: 'ROUTINE',
    status: 'ACCEPTED',
    createdAt: ago(60),
  },
  {
    id: '4',
    code: 'MR-1045',
    patientInitials: 'JQ',
    patientName: 'J. Quaye',
    patientAge: 31,
    reason: 'Antepartum haemorrhage',
    referringFacilityName: 'Adabraka Community Clinic',
    receivingFacilityName: 'Ridge Regional Hospital',
    urgency: 'URGENT',
    status: 'ARRIVED',
    createdAt: ago(120),
  },
];

const MOCK_REFERRALS: Record<DashboardScope, DashboardReferral[]> = {
  network: ALL_REFERRALS,
  facility: ALL_REFERRALS.filter((r) => r.id !== '2'),
};

const MOCK_ACTIVITY: ReferralActivity = {
  changePct: 18.4,
  points: [3, 5, 4, 7, 6, 8, 6, 9, 8, 11, 9, 12, 10, 13].map((count, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
    count,
  })),
};

// Backend endpoints: /dashboard/{network|facility}/{stats|recent-referrals|referral-activity}
export async function getDashboardStats(scope: DashboardScope): Promise<DashboardStats> {
  if (USE_MOCK) return MOCK_STATS[scope];
  return apiClient.get<DashboardStats>(`/dashboard/${scope}/stats`);
}

export async function getRecentReferrals(scope: DashboardScope): Promise<DashboardReferral[]> {
  if (USE_MOCK) return MOCK_REFERRALS[scope];
  return apiClient.get<DashboardReferral[]>(`/dashboard/${scope}/recent-referrals`);
}

export async function getReferralActivity(scope: DashboardScope): Promise<ReferralActivity> {
  if (USE_MOCK) return MOCK_ACTIVITY;
  return apiClient.get<ReferralActivity>(`/dashboard/${scope}/referral-activity`);
}

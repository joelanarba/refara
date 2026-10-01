import { apiClient } from '../../services/api';
import {
  ReferralListItem,
  ReferralScope,
  ReferralDirection,
  CreateReferralPayload,
  ReferralDetail,
  UpdateReferralStatusPayload,
} from './types';

const USE_MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';
const ago = (mins: number) => new Date(Date.now() - mins * 60 * 1000).toISOString();

const ALL_REFERRALS: ReferralListItem[] = [
  {
    id: '1',
    code: 'MR-1048',
    patientInitials: 'MO',
    patientName: 'M. Owusu',
    patientAge: 28,
    reason: 'Severe pre-eclampsia',
    referringFacilityName: 'Adabraka Community Clinic',
    receivingFacilityName: 'Korle Bu Teaching Hospital',
    urgency: 'EMERGENCY',
    status: 'SUBMITTED',
    createdAt: ago(12),
    updatedAt: ago(12),
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
    updatedAt: ago(46),
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
    updatedAt: ago(60),
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
    updatedAt: ago(120),
  },
  {
    id: '5',
    code: 'MR-1044',
    patientInitials: 'SA',
    patientName: 'S. Arthur',
    patientAge: 26,
    reason: 'Gestational diabetes',
    referringFacilityName: 'Ridge Regional Hospital',
    receivingFacilityName: '37 Military Hospital',
    urgency: 'ROUTINE',
    status: 'COMPLETED',
    createdAt: ago(1500),
    updatedAt: ago(1500),
  },
];

const MOCK_MY_FACILITY = 'Adabraka Community Clinic';

function filterByDirection(items: ReferralListItem[], direction: ReferralDirection) {
  if (direction === 'sent')
    return items.filter((r) => r.referringFacilityName === MOCK_MY_FACILITY);
  if (direction === 'received')
    return items.filter((r) => r.receivingFacilityName === MOCK_MY_FACILITY);
  return items.filter(
    (r) =>
      r.referringFacilityName === MOCK_MY_FACILITY || r.receivingFacilityName === MOCK_MY_FACILITY,
  );
}

function toDetail(record: ReferralListItem): ReferralDetail {
  return {
    ...record,
    gestationalWeeks: 38,
    referringFacilityId: 'mock-1',
    receivingFacilityId: 'mock-2',
    createdByUserId: 'mock-u1',
    referringFacility: { id: 'mock-1', name: record.referringFacilityName, type: 'CHPS_COMPOUND' },
    receivingFacility: { id: 'mock-2', name: record.receivingFacilityName, type: 'DISTRICT_HOSPITAL' },
    createdByUser: { id: 'mock-u1', name: 'Mock User', email: 'mock@example.com' },
    statusHistory: [],
  };
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export async function getReferrals(
  scope: ReferralScope,
  direction: ReferralDirection = 'all',
): Promise<ReferralListItem[]> {
  if (USE_MOCK) {
    return scope === 'network' ? ALL_REFERRALS : filterByDirection(ALL_REFERRALS, direction);
  }
  
  let raw: any[] = [];
  if (scope === 'network') {
    // Admin seeing all
    raw = await apiClient.get<any[]>('/referrals/outgoing'); // Assuming outgoing for admins returns all
  } else {
    if (direction === 'sent') {
      raw = await apiClient.get<any[]>('/referrals/outgoing');
    } else if (direction === 'received') {
      raw = await apiClient.get<any[]>('/referrals/incoming');
    } else {
      const [out, inc] = await Promise.all([
        apiClient.get<any[]>('/referrals/outgoing'),
        apiClient.get<any[]>('/referrals/incoming')
      ]);
      raw = [...out, ...inc];
    }
  }

  // Deduplicate if we merged both (since backend returns identical IDs if somehow both)
  const unique = Array.from(new Map(raw.map((r) => [r.id, r])).values());

  return unique.map((r: any) => ({
    id: r.id,
    code: r.referralCode || r.code || 'N/A',
    patientInitials: initials(r.patientName || 'Unknown'),
    patientName: r.patientName,
    patientAge: r.patientAge,
    reason: r.reason,
    referringFacilityName: r.referringFacility?.name || 'Unknown',
    receivingFacilityName: r.receivingFacility?.name || 'Unknown',
    urgency: r.urgency,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function createReferral(payload: CreateReferralPayload): Promise<ReferralListItem> {
  const r: any = await apiClient.post('/referrals', payload);
  return {
    id: r.id,
    code: r.referralCode || 'N/A',
    patientInitials: initials(r.patientName),
    patientName: r.patientName,
    patientAge: r.patientAge,
    reason: r.reason,
    referringFacilityName: 'Your Facility', // Mocked on create
    receivingFacilityName: 'Destination', // Mocked on create
    urgency: r.urgency,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function getReferralById(id: string): Promise<ReferralDetail | null> {
  if (USE_MOCK) {
    const record = ALL_REFERRALS.find((r) => r.id === id);
    return record ? toDetail(record) : null;
  }
  const r: any = await apiClient.get(`/referrals/${id}`);
  return {
    ...r,
    code: r.referralCode,
  };
}

export async function updateReferralStatus(
  id: string,
  payload: UpdateReferralStatusPayload,
): Promise<ReferralDetail> {
  return apiClient.patch<ReferralDetail>(`/referrals/${id}/status`, payload);
}

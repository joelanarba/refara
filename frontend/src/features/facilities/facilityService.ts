import { apiClient } from '../../services/api';
import { FacilitySummary } from './types';

const USE_MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

const MOCK_FACILITIES: FacilitySummary[] = [
  {
    id: 'fac-1',
    name: 'Korle Bu Teaching Hospital',
    type: 'TEACHING_HOSPITAL',
    location: 'Accra Central',
    isOnline: true,
    activeReferrals: 24,
  },
  {
    id: 'fac-2',
    name: '37 Military Hospital',
    type: 'REGIONAL_HOSPITAL',
    location: 'Accra North',
    isOnline: true,
    activeReferrals: 12,
  },
  {
    id: 'fac-3',
    name: 'Ridge Regional Hospital',
    type: 'REGIONAL_HOSPITAL',
    location: 'Ridge',
    isOnline: true,
    activeReferrals: 9,
  },
  {
    id: 'fac-4',
    name: 'Adabraka Community Clinic',
    type: 'CHPS_COMPOUND',
    location: 'Adabraka',
    isOnline: true,
    activeReferrals: 7,
  },
];

const TYPE_LABELS: Record<FacilitySummary['type'], string> = {
  CHPS_COMPOUND: 'Community clinic',
  HEALTH_CENTER: 'Health center',
  DISTRICT_HOSPITAL: 'District hospital',
  REGIONAL_HOSPITAL: 'Regional hospital',
  TEACHING_HOSPITAL: 'Teaching hospital',
  PRIVATE_CLINIC: 'Private clinic',
};

export function facilityTypeLabel(type: FacilitySummary['type']) {
  return TYPE_LABELS[type];
}

// Dropdown options for the Add Facility form — derived from TYPE_LABELS so
// there's one source of truth for the label wording.
export const FACILITY_TYPE_OPTIONS: { value: FacilitySummary['type']; label: string }[] =
  Object.entries(TYPE_LABELS).map(([value, label]) => ({
    value: value as FacilitySummary['type'],
    label,
  }));

export async function getFacilities(): Promise<FacilitySummary[]> {
  if (USE_MOCK) return MOCK_FACILITIES;
  return apiClient.get<FacilitySummary[]>('/facilities');
}

export interface CreateFacilityPayload {
  name: string;
  type: FacilitySummary['type'];
  location: string;
}

export async function createFacility(data: CreateFacilityPayload): Promise<FacilitySummary> {
  if (USE_MOCK) {
    const facility: FacilitySummary = {
      id: `fac-${MOCK_FACILITIES.length + 1}`,
      name: data.name,
      type: data.type,
      location: data.location,
      isOnline: true,
      activeReferrals: 0,
    };
    MOCK_FACILITIES.push(facility);
    return facility;
  }
  return apiClient.post<FacilitySummary>('/facilities', data);
}

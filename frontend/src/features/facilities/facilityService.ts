import { apiClient } from '../../services/api';
import { FacilitySummary, CreateFacilityPayload } from './types';

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

export const FACILITY_TYPE_OPTIONS: { value: FacilitySummary['type']; label: string }[] = [
  { value: 'CHPS_COMPOUND', label: 'CHPS Compound' },
  { value: 'HEALTH_CENTER', label: 'Health Center' },
  { value: 'DISTRICT_HOSPITAL', label: 'District Hospital' },
  { value: 'REGIONAL_HOSPITAL', label: 'Regional Hospital' },
  { value: 'TEACHING_HOSPITAL', label: 'Teaching Hospital' },
  { value: 'PRIVATE_CLINIC', label: 'Private Clinic' },
];

export function facilityTypeLabel(type: FacilitySummary['type']) {
  return FACILITY_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

export async function getFacilities(): Promise<FacilitySummary[]> {
  if (USE_MOCK) return MOCK_FACILITIES;
  return apiClient.get<FacilitySummary[]>('/facilities');
}

export async function createFacility(input: CreateFacilityPayload): Promise<FacilitySummary> {
  if (USE_MOCK) {
    const facility: FacilitySummary = {
      id: `fac-${MOCK_FACILITIES.length + 1}`,
      name: input.name,
      type: input.type,
      location: input.location,
      isOnline: true,
      activeReferrals: 0,
    };
    MOCK_FACILITIES.push(facility);
    return facility;
  }
  return apiClient.post<FacilitySummary>('/facilities', input);
}

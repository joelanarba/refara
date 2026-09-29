import { getFacilities } from '@/features/facilities/facilityService';
import { useFetch } from './useFetch';

export function useFacilities() {
  return useFetch(getFacilities, []);
}

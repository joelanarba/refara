import { useFetch } from '../../../hooks/useFetch';
import { getDashboardStats, getRecentReferrals, getReferralActivity } from '../dashboardService';

export function useDashboardStats() {
  return useFetch(getDashboardStats, []);
}

export function useRecentReferrals() {
  return useFetch(getRecentReferrals, []);
}

export function useReferralActivity() {
  return useFetch(getReferralActivity, []);
}

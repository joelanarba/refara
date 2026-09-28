import {
  DashboardScope,
  getDashboardStats,
  getRecentReferrals,
  getReferralActivity,
} from '@/features/dashboard/dashboardService';
import { useFetch } from './useFetch';

export function useDashboardData(scope: DashboardScope) {
  const stats = useFetch(() => getDashboardStats(scope), [scope]);
  const referrals = useFetch(() => getRecentReferrals(scope), [scope]);
  const activity = useFetch(() => getReferralActivity(scope), [scope]);
  return { stats, referrals, activity };
}

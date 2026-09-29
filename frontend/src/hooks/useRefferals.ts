import { getReferrals } from '@/features/referrals/referralSrvice';
import { ReferralDirection, ReferralScope } from '@/features/referrals/types';
import { useFetch } from './useFetch';

export function useReferrals(scope: ReferralScope, direction: ReferralDirection = 'all') {
  return useFetch(() => getReferrals(scope, direction), [scope, direction]);
}

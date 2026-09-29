import { useState, useEffect } from 'react';
import { getReferralById, updateReferralStatus } from '../features/referrals/referralService';
import { ReferralDetail, UpdateReferralStatusPayload } from '../features/referrals/types';

export function useReferralDetail(id: string | undefined) {
  const [data, setData] = useState<ReferralDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReferral = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await getReferralById(id);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch referral details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferral();
  }, [id]);

  const updateStatus = async (payload: UpdateReferralStatusPayload) => {
    if (!id) return;
    try {
      await updateReferralStatus(id, payload);
      await fetchReferral(); // Refresh after update
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update status.');
    }
  };

  return { data, loading, error, updateStatus, refetch: fetchReferral };
}

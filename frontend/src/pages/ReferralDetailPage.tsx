import { useParams, useNavigate } from 'react-router-dom';
import { useReferralDetail } from '@/hooks/useReferralDetail';
import ReferralDetailView from '@/features/referrals/ReferralDetailView';
import { ROUTES } from '@/constants/routes';

export default function ReferralDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error, updateStatus } = useReferralDetail(id);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1100px] p-6 sm:p-8">
        <p className="text-sm text-[#8c9d9f]">Loading referral details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-[1100px] p-6 sm:p-8">
        <div
          role="alert"
          className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
        >
          {error || 'Referral not found.'}
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.REFERRALS)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#e0e9e9] bg-white px-4 py-2.5 text-sm font-semibold text-[#718285] transition hover:border-[#a7ccce] hover:text-[#3e8995] focus:outline-none focus:ring-2 focus:ring-[#86b3b5]/30"
        >
          ← Back to Referrals
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] p-6 sm:p-8">
      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(ROUTES.REFERRALS)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#e0e9e9] bg-white px-4 py-2.5 text-sm font-semibold text-[#718285] transition hover:border-[#a7ccce] hover:text-[#3e8995] focus:outline-none focus:ring-2 focus:ring-[#86b3b5]/30"
        >
          ← Back
        </button>

        <h1 className="font-display text-[26px] font-bold tracking-tight text-[#253b42]">
          Referral {data.code}
        </h1>
      </div>

      <ReferralDetailView referral={data} onUpdateStatus={updateStatus} />
    </div>
  );
}

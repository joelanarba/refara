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
      <div className="page-container">
        <p>Loading referral details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-container">
        <div className="form-error">
          <p>{error || 'Referral not found.'}</p>
        </div>
        <button className="secondary-button mt-4" onClick={() => navigate(ROUTES.REFERRALS)}>
          &larr; Back to Referrals
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button className="secondary-button" onClick={() => navigate(ROUTES.REFERRALS)}>
          &larr; Back
        </button>
        <h1 className="page-title">Referral {data.code}</h1>
      </div>
      
      <ReferralDetailView referral={data} onUpdateStatus={updateStatus} />
    </div>
  );
}

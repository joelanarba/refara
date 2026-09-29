import ReferralCreateForm from '@/features/referrals/ReferralCreateForm';

export default function ReferralCreatePage() {
  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">New Referral</h1>
      </div>
      
      <ReferralCreateForm />
    </div>
  );
}

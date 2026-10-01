import ReferralCreateForm from '@/features/referrals/ReferralCreateForm';

export default function ReferralCreatePage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="font-display text-[26px] font-bold tracking-tight text-[#253b42]">
          New Referral
        </h1>
      </div>

      <ReferralCreateForm />
    </div>
  );
}

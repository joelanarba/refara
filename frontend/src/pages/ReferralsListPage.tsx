import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../features/dashboard/components/DashboardHeader';
import { ROUTES } from '../constants/routes';
import { useAuth } from '@/features/auth/useAuth';
import { useReferrals } from '@/hooks/useReferrals';
import { ReferralDirection } from '@/features/referrals/types';
import ReferralTabs from '@/features/referrals/ReferralTabs';
import ReferralsTable from '@/features/referrals/ReferralsTable';

export default function ReferralsListPage() {
  const { user } = useAuth();
  const [direction, setDirection] = useState<ReferralDirection>('all');
  const [search, setSearch] = useState('');

  const isAdmin = user?.role === 'ADMIN';
  const scope = isAdmin ? 'network' : 'facility';
  const canCreate = user?.role === 'REFERRING_WORKER';

  const { data, loading } = useReferrals(scope, direction);

  return (
    <>
      <DashboardHeader
        eyebrow="REFERRAL MANAGEMENT"
        title={isAdmin ? 'All referrals' : 'My referrals'}
        subtitle="Track, review, and coordinate every maternal referral."
        action={
          canCreate ? (
            <Link to={ROUTES.REFERRAL_CREATE} className="primary-button">
              <PlusIcon />
              New referral
            </Link>
          ) : undefined
        }
      />

      {!isAdmin && <ReferralTabs active={direction} onChange={setDirection} />}

      <ReferralsTable
        referrals={data ?? []}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
      />
    </>
  );
}

function PlusIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

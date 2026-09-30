import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import DashboardHeader from '../components/DashboardHeader';
import WelcomeBanner from '../components/WelcomeBanner';
import StatsRow from '../components/StatsRow';
import RecentReferralsPanel from '../components/RecentReferralsPanel';
import ReferralActivityChart from '../components/ReferralActivityChart';
import { useAuth } from '@/features/auth/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function FacilityDashboard() {
  const { user } = useAuth();
  const { stats, referrals, activity } = useDashboardData('facility');

  const firstName = user?.name.split(' ')[0] ?? '';
  const canCreate = user?.role === 'WORKER';

  return (
    <>
      <DashboardHeader
        eyebrow={greeting().toUpperCase()}
        title={
          <>
            {greeting()}, <span>{firstName}</span>
          </>
        }
        subtitle="Here's what's happening with your maternal referrals today."
        action={
          canCreate ? (
            <Link to={ROUTES.REFERRAL_CREATE} className="primary-button">
              <PlusIcon />
              New referral
            </Link>
          ) : undefined
        }
      />
      <WelcomeBanner
        title="Together, we keep mothers moving safely."
        text="You have a clear view of every referral, from submission to completion."
      />
      <StatsRow stats={stats.data} loading={stats.loading} totalLabel="My referrals" />
      <div className="content-grid">
        <RecentReferralsPanel
          title="Recent referrals"
          referrals={referrals.data ?? []}
          loading={referrals.loading}
        />
        <ReferralActivityChart
          points={activity.data?.points ?? []}
          changePct={activity.data?.changePct ?? null}
          loading={activity.loading}
        />
      </div>
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

import DashboardHeader from '../components/DashboardHeader';
import WelcomeBanner from '../components/WelcomeBanner';
import StatsRow from '../components/StatsRow';
import RecentReferralsPanel from '../components/RecentReferralsPanel';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function AdminDashboard() {
  const { stats, referrals } = useDashboardData('network');

  return (
    <>
      <DashboardHeader
        eyebrow="NETWORK OVERVIEW"
        title="Network overview"
        subtitle="A live view of referral activity across your care network."
      />
      <WelcomeBanner
        title="Care network health is steady"
        text="All facilities are online and referrals are being acknowledged within target."
      />
      <StatsRow stats={stats.data} loading={stats.loading} totalLabel="Total referrals" />
      <div className="content-grid">
        <RecentReferralsPanel
          title="Recent network referrals"
          referrals={referrals.data ?? []}
          loading={referrals.loading}
        />
        {/* <ReferralActivityChart
          points={activity.data?.points ?? []}
          changePct={activity.data?.changePct ?? null}
          loading={activity.loading}
        /> */}
      </div>
    </>
  );
}

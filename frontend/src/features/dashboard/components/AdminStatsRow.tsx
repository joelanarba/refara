import StatsCard from './StatsCard';
import { DashboardStats } from '../types';

interface StatsRowProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export default function AdminStatsRow({ stats, loading }: StatsRowProps) {
  const v = (n?: number) => (loading ? '…' : (n ?? 0));

  return (
    <div className="mb-6 grid grid-cols-2 gap-2.5 min-[431px]:gap-4 md:grid-cols-4">
      <StatsCard
        icon={<ClipboardIcon />}
        iconVariant="blue"
        label="Total requests"
        value={v(stats?.totalReferrals)}
        trend={{ text: 'System wide', direction: 'muted' }}
      />
      <StatsCard
        icon={<BuildingIcon />}
        iconVariant="amber"
        label="Facilities"
        value={v(stats?.totalFacilities)}
        trend={{ text: 'Connected', direction: 'muted' }}
      />
      <StatsCard
        icon={<UsersIcon />}
        iconVariant="green"
        label="Active Users"
        value={v(stats?.totalUsers)}
        trend={{ text: 'System wide', direction: 'muted' }}
      />
      <StatsCard
        icon={<PulseIcon />}
        iconVariant="coral"
        label="Urgent cases"
        value={v(stats?.urgentCases)}
        trend={{ text: 'Active priority', direction: 'muted' }}
      />
    </div>
  );
}

const svgProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
};
function ClipboardIcon() {
  return (
    <svg {...svgProps}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 11h6M9 15h6" />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg {...svgProps}>
      <path d="M3 21h18M6 21V7l6-4 6 4v14M9 9h1M9 13h1M14 9h1M14 13h1M10 21v-4h4v4" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg {...svgProps}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function PulseIcon() {
  return (
    <svg {...svgProps}>
      <path d="M3 12h4l2 8 4-16 2 8h6" />
    </svg>
  );
}

import StatsCard from './StatsCard';
import { DashboardStats } from '../types';

interface StatsRowProps {
  stats: DashboardStats | null;
  loading: boolean;
  totalLabel: string; // "Total referrals" (admin) | "My referrals" (facility)
}

export default function StatsRow({ stats, loading, totalLabel }: StatsRowProps) {
  const v = (n?: number) => (loading ? '–' : (n ?? 0));

  return (
    <div className="metric-grid">
      <StatsCard
        icon={<ClipboardIcon />}
        iconVariant="blue"
        label={totalLabel}
        value={v(stats?.totalReferrals)}
        trend={
          stats?.totalReferralsChangePct != null
            ? { text: `↗ ${stats.totalReferralsChangePct}%`, direction: 'up' }
            : undefined
        }
      />
      <StatsCard
        icon={<ClockIcon />}
        iconVariant="amber"
        label="Pending action"
        value={v(stats?.pendingAction)}
        trend={{ text: 'Needs attention', direction: 'warn' }}
      />
      <StatsCard
        icon={<CheckIcon />}
        iconVariant="green"
        label="Completed"
        value={v(stats?.completed)}
        trend={
          stats?.completedChangePct != null
            ? { text: `↗ ${stats.completedChangePct}%`, direction: 'up' }
            : undefined
        }
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
function ClockIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg {...svgProps}>
      <path d="M5 13l4 4L19 7" />
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

import { useAuth } from '@/features/auth/useAuth';
import { useLocation } from 'react-router-dom';

const CRUMB_LABELS: Record<string, string> = {
  dashboard: 'Overview',
  referrals: 'Referrals',
  new: 'New Referral',
  facilities: 'Facilities',
  users: 'Users & access',
};

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean);
  const pageCrumbs = segments.map((seg) => CRUMB_LABELS[seg] ?? seg);
  const crumbs = pageCrumbs.length ? pageCrumbs : ['Overview'];

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button type="button" className="mobile-menu" onClick={onMenuClick} aria-label="Open menu">
          <MenuIcon />
        </button>

        <div className="breadcrumb">
          <span>Refera</span>
          {crumbs.map((c, i) => (
            <span key={i}>/{i === crumbs.length - 1 ? <strong> {c}</strong> : ` ${c}`}</span>
          ))}
        </div>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="icon-button notification-button"
          aria-label="Notifications"
        >
          <BellIcon />
          <i />
        </button>

        {user && <span className="avatar avatar-coral topbar-avatar">{initials(user.name)}</span>}
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

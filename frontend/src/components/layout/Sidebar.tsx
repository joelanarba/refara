import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ROLE_LABELS } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '@/features/auth/useAuth';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  roles?: Array<'WORKER' | 'WORKER' | 'ADMIN'>;
  badge?: number;
}

interface SidebarProps {
  open?: boolean;
  pendingReferralsCount?: number;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Sidebar({ open, pendingReferralsCount }: SidebarProps) {
  const { user, logout } = useAuth();

  const NAV_ITEMS: NavItem[] = [
    { to: ROUTES.DASHBOARD, label: 'Overview', icon: <GridIcon /> },
    { to: ROUTES.REFERRALS, label: 'Referrals', icon: <ListIcon />, badge: pendingReferralsCount },
    {
      to: ROUTES.REFERRAL_CREATE,
      label: 'New referral',
      icon: <PlusIcon />,
      roles: ['WORKER'],
    },
    { to: ROUTES.FACILITIES, label: 'Facilities', icon: <BuildingIcon />, roles: ['ADMIN'] },
    { to: ROUTES.USERS, label: 'Users & access', icon: <UsersIcon />, roles: ['ADMIN'] },
  ];

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
      <div className="brand-mark">
        <span className="brand-icon">
          <HeartIcon />
        </span>
        <span>Refera</span>
      </div>

      <p className="workspace-label">WORKSPACE</p>

      {user && (
        <button type="button" className="profile-mini" style={{ width: '100%', cursor: 'pointer' }}>
          <span className="avatar avatar-sage">{initials(user.name)}</span>
          <div>
            <strong>{user.name}</strong>
            <span>{ROLE_LABELS[user.role]}</span>
          </div>
          <ChevronDownIcon />
        </button>
      )}

      <nav className="nav-list">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            {item.icon}
            {item.label}
            {item.badge ? <b>{item.badge}</b> : null}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="help-card">
          <span className="help-icon">
            <HelpIcon />
          </span>
          <strong>Need help?</strong>
          <p>Contact your network coordinator.</p>
          <button type="button">View support</button>
        </div>

        <button type="button" className="signout-button" onClick={logout}>
          <LogoutIcon />
          Sign out
        </button>
      </div>
    </aside>
  );
}

/* --- inline icons --- */
function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21s-6.7-4.35-9.3-8.28C.86 9.94 1.6 6.4 4.6 5.1c2.1-.9 4.3-.1 5.6 1.6.4.5.7 1 .8 1.3.1-.3.4-.8.8-1.3 1.3-1.7 3.5-2.5 5.6-1.6 3 1.3 3.74 4.84 1.9 7.62C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 21h18M6 21V7l6-4 6 4v14M9 9h1M9 13h1M14 9h1M14 13h1M10 21v-4h4v4" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4M12 17h.01" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

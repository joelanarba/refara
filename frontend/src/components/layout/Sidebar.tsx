import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROLE_LABELS } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '@/features/auth/useAuth';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  roles?: Array<'WORKER' | 'ADMIN'>;
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
  const navigate = useNavigate();

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
    <aside
      className={`fixed inset-y-0 left-0 z-[12] flex w-[215px] shrink-0 flex-col border-r border-[#e8eeee] bg-white px-4 pt-7 pb-5 shadow-[8px_0_25px_rgba(28,57,60,0.12)] transition-transform duration-200 ease-out md:static md:translate-x-0 md:shadow-none min-[1100px]:w-[248px] ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center gap-2.5 px-3 font-display text-[22px] font-extrabold tracking-[-0.8px] text-[#1d3d44]">
        <span className="grid size-[34px] place-items-center rounded-[11px] bg-[#3f8995] text-white shadow-[0_5px_14px_rgba(63,137,149,0.24)]">
          <HeartIcon />
        </span>
        <span>Refara</span>
      </div>

      <p className="mx-3 mt-12 mb-3 text-sm leading-tight font-bold tracking-[1.5px] text-[#91a3a6]">
        WORKSPACE
      </p>

      {user && (
        <button
          type="button"
          onClick={() => navigate(ROUTES.PROFILE)}
          className="mb-[30px] flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-[#edf1f1] px-2.5 py-[11px] text-left transition hover:bg-[#f3f8f8]"
        >
          <span className="grid size-[31px] shrink-0 place-items-center rounded-full bg-[#e3f0e8] text-sm font-bold text-[#547d69]">
            {initials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block truncate text-base text-[#294047]">{user.name}</strong>
            <span className="mt-[3px] block truncate text-sm text-[#8a9a9e]">
              {ROLE_LABELS[user.role]}
            </span>
          </div>
          <span className="text-[#9baeb0]">
            <ChevronDownIcon />
          </span>
        </button>
      )}

      <nav className="grid gap-[5px]">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-[10px] p-3 text-left text-lg font-semibold transition ${
                isActive
                  ? 'bg-[#eaf5f5] text-[#317c89]'
                  : 'text-[#839396] hover:bg-[#f3f8f8] hover:text-[#3f8995]'
              }`
            }
          >
            {item.icon}
            {item.label}
            {item.badge ? (
              <b className="ml-auto grid size-[19px] place-items-center rounded-md bg-[#df8d6d] text-sm text-white">
                {item.badge}
              </b>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="mt-[25px] mb-[17px] rounded-[13px] bg-[#f3f8f7] p-[17px]">
          <strong className="block text-base">Need help?</strong>
          <p className="mt-[5px] text-sm leading-normal text-[#829396]">
            Contact{' '}
            <a
              href="mailto:admin@refara.com"
              className="font-semibold text-[#3e8791] hover:underline"
            >
              admin@refara.com
            </a>
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-[11px] px-3 py-2.5 text-left text-base text-[#859497]"
        >
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

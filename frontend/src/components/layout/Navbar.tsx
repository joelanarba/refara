import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useLocation } from 'react-router-dom';
import { userRoleDisplay } from '@/features/users/userService';

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
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const segments = location.pathname.split('/').filter(Boolean);
  const pageCrumbs = segments.map((seg) => CRUMB_LABELS[seg] ?? seg);
  const crumbs = pageCrumbs.length ? pageCrumbs : ['Overview'];

  // Close on outside click + Escape
  useEffect(() => {
    if (!isUserMenuOpen) return;

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsUserMenuOpen(false);
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="flex h-[62px] items-center justify-between border-b border-[#e8eeee] bg-white/70 px-5 md:h-[75px] md:px-[30px] min-[1100px]:px-12">
      {/* Left: menu + breadcrumbs */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="p-0 text-[#668084] md:hidden"
        >
          <MenuIcon />
        </button>

        <div className="flex gap-[11px] text-[15px] text-[#9aa8aa] md:text-base">
          <span>Refera</span>
          {crumbs.map((c, i) => (
            <span key={i}>
              /
              {i === crumbs.length - 1 ? <strong className="text-[#354f55]"> {c}</strong> : ` ${c}`}
            </span>
          ))}
        </div>
      </div>

      {/* Right: profile */}
      <div className="flex items-center gap-[19px]">
        {user && (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((v) => !v)}
              aria-label="Open user menu"
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fce7e1] text-sm font-bold text-[#b65c4d] transition hover:ring-4 hover:ring-[#fce7e1]/60 focus:outline-none focus:ring-4 focus:ring-[#fce7e1]/60"
            >
              {initials(user.name)}
            </button>

            {isUserMenuOpen && (
              <div
                role="menu"
                className="absolute top-[calc(100%+10px)] right-0 z-50 w-[280px] overflow-hidden rounded-[14px] border border-[#e8eeee] bg-white shadow-[0_20px_50px_rgba(20,40,44,0.14)]"
              >
                {/* User header */}
                <div className="flex items-center gap-3 px-[18px] pt-[18px] pb-[14px]">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#fce7e1] text-sm font-bold text-[#b65c4d]">
                    {initials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold text-[#253b42]">{user.name}</p>
                    <p className="truncate text-[12.5px] text-[#87979a]">
                      {userRoleDisplay(user.role)}
                    </p>
                  </div>
                </div>

                {/* Facility chip */}
                {user.facilityName && (
                  <div className="px-[18px] pb-3.5">
                    <div className="flex items-center gap-2 rounded-lg bg-[#eff7f7] px-3 py-2.5 text-[13px] font-medium text-[#3f7f8a]">
                      <PinIcon />
                      <span className="truncate">{user.facilityName}</span>
                    </div>
                  </div>
                )}

                {/* Sign out */}
                <div className="border-t border-[#edf2f2]">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout?.();
                    }}
                    className="flex w-full items-center justify-end gap-2 px-[18px] py-3.5 text-right text-[14px] font-semibold text-[#c96a5a] transition hover:bg-[#fdf4f2]"
                  >
                    <SignOutIcon />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

/* ---------- Icons ---------- */

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

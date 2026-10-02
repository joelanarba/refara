import { UserSummary } from './types';
import { userRoleDisplay } from './userService';

function initials(name: string) {
  const words = name.split(' ').filter((w) => !w.endsWith('.'));
  return words
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_VARIANTS = {
  coral: 'bg-[#fdeeea] text-[#bd6255]',
  blue: 'bg-[#e8f1f5] text-[#568a9a]',
  sage: 'bg-[#e9f4eb] text-[#5c8b76]',
} as const;

const VARIANT_KEYS = Object.keys(AVATAR_VARIANTS) as (keyof typeof AVATAR_VARIANTS)[];

export default function UserRow({ user, index }: { user: UserSummary; index: number }) {
  const variant = AVATAR_VARIANTS[VARIANT_KEYS[index % VARIANT_KEYS.length]];

  return (
    <div className="grid grid-cols-[36px_1fr_1fr_auto_28px] items-center gap-3 border-b border-[#edf2f2] px-4 py-3.5 last:border-b-0">
      <span className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold ${variant}`}>
        {initials(user.name)}
      </span>

      <div className="flex min-w-0 flex-col">
        <strong className="truncate text-sm font-semibold text-[#2d444a]">{user.name}</strong>
        <span className="truncate text-xs text-[#8c9d9f]">{userRoleDisplay(user.role)}</span>
      </div>

      <span className="truncate text-sm text-[#60797d]">{user.facilityName}</span>

      <span
        className={`inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold ${
          user.isPending
            ? 'bg-[#fff5e4] text-[#ba8c4e]'
            : user.isActive
              ? 'bg-[#eaf5eb] text-[#598a6f]'
              : 'bg-[#fde7e2] text-[#bd6255]'
        }`}
      >
        <CheckIcon />
            {user.isActive ? 'Active access' : 'Revoked'}
      </span>

      <button
        type="button"
        className="grid h-7 w-7 place-items-center rounded-md text-[#9aabad] transition hover:bg-[#f3f8f8] hover:text-[#3f8995] focus:outline-none focus:ring-2 focus:ring-[#86b3b5]/30"
        aria-label="More options"
      >
        <MoreIcon />
      </button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}


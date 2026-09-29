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

const AVATAR_VARIANTS = ['avatar-coral', 'avatar-blue', 'avatar-sage'];

export default function UserRow({ user, index }: { user: UserSummary; index: number }) {
  const variant = AVATAR_VARIANTS[index % AVATAR_VARIANTS.length];

  return (
    <div className="user-row">
      <span className={`avatar ${variant}`}>{initials(user.name)}</span>

      <div>
        <strong>{user.name}</strong>
        <span>{userRoleDisplay(user.role)}</span>
      </div>

      <span className="user-facility">{user.facilityName}</span>

      <span className="access-pill">
        <CheckIcon />
        {user.isActive ? 'Active access' : 'Revoked'}
      </span>

      <button type="button" className="row-more" aria-label="More options">
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
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
function MoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

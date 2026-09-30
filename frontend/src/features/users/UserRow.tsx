import { UserSummary } from './types';
import { userRoleDisplay } from './userService';
import { copyToClipboard } from '@/utils';

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
        {user.isPending ? (
          <>
            <ClockIcon />
            Pending Invite
          </>
        ) : (
          <>
            <CheckIcon />
            {user.isActive ? 'Active access' : 'Revoked'}
          </>
        )}
      </span>

      {user.isPending ? (
        <button 
          type="button"
          onClick={() => copyToClipboard(`Email: ${user.email}\nPassword: Refara2026!`)}
          className="row-more"
          title="Copy temporary credentials"
          aria-label="Copy temporary credentials"
        >
          <CopyIcon />
        </button>
      ) : (
        <button type="button" className="row-more" aria-label="More options">
          <MoreIcon />
        </button>
      )}
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

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

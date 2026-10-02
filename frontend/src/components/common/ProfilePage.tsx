import { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { userRoleDisplay } from '@/features/users/userService';

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordError('');
    setIsSavingPassword(true);
    setPasswordSaved(false);

    try {
            await new Promise((r) => setTimeout(r, 600));
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    try {
            await new Promise((r) => setTimeout(r, 600));
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[720px] p-6 sm:p-8">
      {/* Header card */}
      <div className="mb-6 rounded-[14px] border border-[#e8eeee] bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#fce7e1] text-lg font-bold text-[#b65c4d]">
            {initials(user.name)}
          </span>

          <div className="min-w-0">
            <h1 className="truncate font-display text-[22px] font-bold text-[#253b42]">
              {user.name}
            </h1>
            <p className="mt-0.5 truncate text-sm text-[#87979a]">{userRoleDisplay(user.role)}</p>
          </div>
        </div>

        {user.facility?.name && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#eff7f7] px-3 py-2 text-[13px] font-medium text-[#3f7f8a]">
            <PinIcon />
            {user.facility?.name}
          </div>
        )}
      </div>

      {/* Editable form */}
      <form onSubmit={handleSave} className="rounded-[14px] border border-[#e8eeee] bg-white p-6">
        <h2 className="mb-5 font-display text-[17px] font-bold text-[#2d444a]">
          Profile information
        </h2>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="profile-name"
              className="mb-1.5 block text-[13px] font-semibold text-[#334752]"
            >
              Full name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
            />
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="mb-1.5 block text-[13px] font-semibold text-[#334752]"
            >
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#334752]">Role</label>
            <div className="rounded-xl border border-slate-100 bg-[#f9fbfb] px-3.5 py-2.5 text-sm text-[#60797d]">
              {userRoleDisplay(user.role)}
            </div>
          </div>
        </div>

                {saved && <p className="mt-5 text-sm font-medium text-[#5c8b76]">Profile updated.</p>}

        <div className="mt-6 flex justify-end border-t border-[#edf2f2] pt-5">
          <button
            type="submit"
            disabled={isSaving || !name.trim() || !email.trim()}
            className={`inline-flex min-w-[130px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition focus:outline-none disabled:cursor-not-allowed ${
              name.trim() && email.trim()
                ? 'bg-[#3e8995] hover:bg-[#327581] active:bg-[#2d6d78] opacity-100'
                : 'bg-[#9aa8aa] opacity-70'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>

      {/* Password reset form */}
      <form onSubmit={handlePasswordSave} className="mt-6 rounded-[14px] border border-[#e8eeee] bg-white p-6">
        <h2 className="mb-5 font-display text-[17px] font-bold text-[#2d444a]">
          Change password
        </h2>

        {passwordError && (
          <div className="mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {passwordError}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label
              htmlFor="current-password"
              className="mb-1.5 block text-[13px] font-semibold text-[#334752]"
            >
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block text-[13px] font-semibold text-[#334752]"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-[13px] font-semibold text-[#334752]"
              >
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
              />
            </div>
          </div>
        </div>

        {passwordSaved && <p className="mt-5 text-sm font-medium text-[#5c8b76]">Password successfully changed.</p>}

        <div className="mt-6 flex justify-end border-t border-[#edf2f2] pt-5">
          <button
            type="submit"
            disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}
            className={`inline-flex min-w-[130px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition focus:outline-none disabled:cursor-not-allowed ${
              currentPassword && newPassword && confirmPassword
                ? 'bg-[#3e8995] hover:bg-[#327581] active:bg-[#2d6d78] opacity-100'
                : 'bg-[#9aa8aa] opacity-70'
            }`}
          >
            {isSavingPassword ? 'Updating...' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
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





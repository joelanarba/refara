import { FormEvent, useState, useEffect } from 'react';
import { Mail, UserPlus, X, ChevronDown } from 'lucide-react';
import { ROLE_LABELS, ROLES } from '../../constants/roles';
import type { UserRole } from '../../types';

import { createUser } from '../../features/users/userService';
import { getFacilities } from '../../features/facilities/facilityService';
import type { FacilitySummary } from '../../features/facilities/types';
import { copyToClipboard } from '@/utils';

interface InviteUserFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function InviteUserForm({ onCancel, onSuccess }: InviteUserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [facilityId, setFacilityId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [facilities, setFacilities] = useState<FacilitySummary[]>([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(true);

  const handleCopy = () => {
    copyToClipboard(`Email: ${email}\nPassword: Refara2026!`);
  };

  useEffect(() => {
    getFacilities()
      .then((data) => {
        setFacilities(data);
      })
      .catch(() => {
        setError('Failed to load facilities.');
      })
      .finally(() => {
        setIsLoadingFacilities(false);
      });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!role) {
      setError('Please select a role.');
      return;
    }

    if (!facilityId) {
      setError('Please select a facility.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser({ name, email, role, facilityId });
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="w-full max-w-[450px] rounded-2xl border border-slate-100 bg-white p-6 shadow-xl sm:p-7 text-slate-800 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <UserPlus className="h-7 w-7" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-slate-900">User created successfully!</h2>
        <p className="mb-6 text-sm text-slate-500">
          Since this is an MVP without an email service, please share these credentials directly with {name}.
        </p>
        <div className="mb-6 rounded-xl bg-slate-50 p-4 text-left border border-slate-100 relative">
          <div className="mb-2">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</span>
            <span className="text-sm font-medium text-slate-800">{email}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Temporary Password</span>
            <span className="text-sm font-mono text-slate-800 font-medium bg-white px-2 py-0.5 rounded border border-slate-200">Refara2026!</span>
          </div>
          <button 
            type="button"
            onClick={handleCopy}
            className="absolute top-4 right-4 text-slate-400 hover:text-[#86b3b5] transition flex items-center gap-1 text-xs font-medium bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm"
          >
            Copy
          </button>
        </div>
        <button
          onClick={onSuccess}
          className="w-full rounded-xl bg-[#86b3b5] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#729fa1] active:bg-[#638e90]"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[450px] rounded-2xl border border-slate-100 bg-white p-6 shadow-xl sm:p-7 text-slate-800"
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e6f2f2] text-[#4c7c7f]">
            <UserPlus className="h-6 w-6 stroke-[1.8]" />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#1b2a32]">Invite user</h2>
            <p className="mt-0.5 text-[13px] text-[#6b7d87]">
              Send a workspace invitation to a new team member.
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-slate-400 transition hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-2 text-xs font-medium text-rose-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#334752]">Full name</label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Abena Sarkodie"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] placeholder-[#8fa0aa] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#334752]">
            Email address
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8fa0aa]">
              <Mail className="h-4 w-4 stroke-[1.8]" />
            </div>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@healthnetwork.org"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#1b2a32] placeholder-[#8fa0aa] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#334752]">Role</label>

          <div className="relative">
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className={`w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15 ${
                !role ? 'text-[#8fa0aa]' : 'text-[#1b2a32]'
              }`}
            >
              <option value="" disabled>
                Select a role
              </option>

              {Object.values(ROLES).map((value) => (
                <option key={value} value={value} className="text-[#1b2a32]">
                  {ROLE_LABELS[value]}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#334752]">
              <ChevronDown className="h-4 w-4 stroke-[2]" />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#334752]">Facility</label>

          <div className="relative">
            <select
              value={facilityId}
              onChange={(event) => setFacilityId(event.target.value)}
              disabled={isLoadingFacilities}
              className={`w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15 ${
                !facilityId ? 'text-[#8fa0aa]' : 'text-[#1b2a32]'
              } ${isLoadingFacilities ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="" disabled>
                {isLoadingFacilities ? 'Loading facilities...' : 'Select a facility'}
              </option>
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id} className="text-[#1b2a32]">
                  {fac.name}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#334752]">
              <ChevronDown className="h-4 w-4 stroke-[2]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-[#334752] transition hover:bg-slate-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#86b3b5] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-[#729fa1] active:bg-[#638e90] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Mail className="h-4 w-4 stroke-[2]" />
          <span>{isSubmitting ? 'Sending...' : 'Send invitation'}</span>
        </button>
      </div>
    </form>
  );
}

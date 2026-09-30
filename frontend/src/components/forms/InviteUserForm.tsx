import { FormEvent, useState, useEffect } from 'react';
import { Mail, UserPlus, X, ChevronDown } from 'lucide-react';
import { ROLE_LABELS, ROLES } from '../../constants/roles';
import type { UserRole } from '../../types';

import { createUser } from '../../features/users/userService';
import { getFacilities } from '../../features/facilities/facilityService';
import type { FacilitySummary } from '../../features/facilities/types';

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
  
  const [facilities, setFacilities] = useState<FacilitySummary[]>([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(true);

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
      onSuccess?.();
    } catch (err: unknown) {
      setError(
        (err instanceof Error && err.message) || 'Failed to create user. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    'h-[41px] w-full rounded-xl border border-[#e2e4e3] bg-[#fbfdfc] px-[13px] text-[12px] leading-4 font-[600] tracking-[-0.2px] text-[#1b2a32] outline-none transition placeholder:text-[#939aa0] focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15';
  const selectClass =
    'h-[41px] w-full cursor-pointer appearance-none rounded-xl border border-[#e2e4e3] bg-[#fbfdfc] pl-4 pr-9 text-[11.5px] font-[700] tracking-[-0.1px] text-[#37403f] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15';
  const labelClass = 'mb-2 block text-[11.5px] font-[600] leading-4 tracking-[-0.1px] text-[#5a6667]';

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[450px] overflow-hidden rounded-2xl border border-slate-100 bg-white text-[#1b2a32] shadow-xl"
    >
      <div className="px-6 pt-4">
        <div className="mb-[26px] flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7f3f3] text-[#577c7c]">
              <UserPlus className="h-5 w-5 stroke-[1.8]" />
            </div>

            <div>
              <h2 className="m-0 text-lg font-[600] leading-6 tracking-[-0.3px] text-[#1b2a32]">
                Invite user
              </h2>
              <p className="mb-0 mt-[5px] text-[12px] leading-4 font-[400] tracking-[-0.3px] text-[#8a9294]">
                Send a workspace invitation to a new team member.
              </p>
            </div>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="-mr-[2px] -mt-1 cursor-pointer border-0 bg-transparent p-2 text-[#8a8f8f] transition hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-5 w-5 stroke-[1.5]" />
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-2 text-[12px] leading-4 font-[500] text-rose-600">
            {error}
          </div>
        )}

        <div className="space-y-[17px]">
          <div>
            <label className={labelClass}>Full name</label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Abena Sarkodie"
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email address</label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#939aa0]">
                <Mail className="h-4 w-4 stroke-[1.8]" />
              </div>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@healthnetwork.org"
                className={`${fieldClass} pl-[35px]`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Role</label>

            <div className="relative">
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className={selectClass}
              >
                <option value="" disabled>
                  Select a role
                </option>

                {Object.values(ROLES).map((value) => (
                  <option key={value} value={value}>
                    {ROLE_LABELS[value]}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-px text-[#37403f]">
                <ChevronDown className="h-4 w-4 stroke-[2.5]" />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Facility</label>

            <div className="relative">
              <select
                value={facilityId}
                onChange={(event) => setFacilityId(event.target.value)}
                disabled={isLoadingFacilities}
                className={`${selectClass} ${isLoadingFacilities ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <option value="" disabled>
                  {isLoadingFacilities ? 'Loading facilities...' : 'Select a facility'}
                </option>
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-px text-[#37403f]">
                <ChevronDown className="h-4 w-4 stroke-[2.5]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#f1f1f1] px-6 py-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-10 cursor-pointer rounded-xl border border-[#e6e6e6] bg-white px-[15px] text-[11px] font-[700] tracking-[-0.3px] text-[#667070] transition hover:bg-slate-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border-0 bg-[#9ec3c9] px-[17px] text-[11px] font-[700] tracking-[-0.3px] text-white shadow-xs transition hover:bg-[#8ab6bd] active:bg-[#7aa9b0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Mail className="h-4 w-4 stroke-[2]" />
          <span>{isSubmitting ? 'Sending...' : 'Send invitation'}</span>
        </button>
      </div>
    </form>
  );
}

import { FormEvent, useState } from 'react';
import { UserPlus, Mail, X, ChevronDown } from 'lucide-react';
import { ROLE_LABELS, ROLES } from '../../constants/roles';
import type { UserRole } from '../../types';

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
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

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
              className={`w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15 ${
                !facilityId ? 'text-[#8fa0aa]' : 'text-[#1b2a32]'
              }`}
            >
              <option value="" disabled>
                Select a facility
              </option>
              <option value="kbth" className="text-[#1b2a32]">
                Korle Bu Teaching Hospital
              </option>
              <option value="acc" className="text-[#1b2a32]">
                Adabraka Community Clinic
              </option>
              <option value="lgh" className="text-[#1b2a32]">
                La General Hospital
              </option>
              <option value="37mh" className="text-[#1b2a32]">
                37 Military Hospital
              </option>
              <option value="rrh" className="text-[#1b2a32]">
                Ridge Regional Hospital
              </option>
              <option value="omh" className="text-[#1b2a32]">
                Osu Maternity Home
              </option>
              <option value="tgh" className="text-[#1b2a32]">
                Tema General Hospital
              </option>
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

import { FormEvent, useState } from 'react';
import { FacilityType } from '@/types';
import { createFacility, FACILITY_TYPE_OPTIONS } from './facilityService';

interface AddFacilityFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function AddFacilityForm({ onCancel, onSuccess }: AddFacilityFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<FacilityType | ''>('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!name.trim()) return setError('Facility name is required.');
    if (!type) return setError('Select a facility type.');
    if (!location.trim()) return setError('Location is required.');

    setIsSubmitting(true);
    try {
      await createFacility({ name, type, location });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to add facility.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[420px] rounded-2xl border border-slate-100 bg-white p-6 shadow-xl sm:p-7 text-slate-800"
    >
      <div className="mb-6 flex items-start gap-4 border-b border-slate-100 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#498d96]">
          <BuildingIcon />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold tracking-tight text-[#253b42]">Add facility</h2>
          <p className="mt-1 text-sm text-[#87979a] leading-relaxed">
            Connect a new care facility to the network.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="-mr-1 -mt-1 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="facilityName" className="mb-1.5 block text-[13px] font-semibold text-[#334752]">
            Facility name
          </label>
          <input
            id="facilityName"
            type="text"
            placeholder="e.g. Tema General Hospital"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] placeholder-[#8fa0aa] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
          />
        </div>

        <div>
          <label htmlFor="facilityType" className="mb-1.5 block text-[13px] font-semibold text-[#334752]">
            Facility type
          </label>
          <div className="relative">
            <select
              id="facilityType"
              value={type}
              onChange={(e) => setType(e.target.value as FacilityType)}
              className={`w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15 ${!type ? 'text-[#8fa0aa]' : 'text-[#1b2a32]'}`}
            >
              <option value="" disabled>Select a type</option>
              {FACILITY_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-[#1b2a32]">
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#334752]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="facilityLocation" className="mb-1.5 block text-[13px] font-semibold text-[#334752]">
            Location
          </label>
          <input
            id="facilityLocation"
            type="text"
            placeholder="e.g. Tema"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] placeholder-[#8fa0aa] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
          />
        </div>
      </div>

      <div className="mt-7 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-[#334752] transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#86b3b5] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-[#729fa1] active:bg-[#638e90] disabled:cursor-not-allowed disabled:opacity-50 gap-2 min-w-[130px]"
        >
          <CheckIcon />
          {isSubmitting ? 'Adding...' : 'Add facility'}
        </button>
      </div>
    </form>
  );
}

function BuildingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M6 21V7l6-4 6 4v14M9 9h1M9 13h1M14 9h1M14 13h1M10 21v-4h4v4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

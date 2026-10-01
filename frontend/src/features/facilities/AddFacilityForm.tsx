import { FormEvent, useState } from 'react';
import { FacilityType } from '@/types';
import { createFacility } from './facilityService';
import { FACILITY_TYPE_OPTIONS } from './facilityService';

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
      className="w-full max-w-[420px] rounded-2xl bg-white p-7 shadow-[0_24px_60px_rgba(20,40,44,.22)]"
    >
      {/* Header */}
      <div className="mb-6 flex items-start gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e7f3f3] text-[#498d96]">
          <BuildingIcon />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="m-0 font-display text-[17px] font-bold text-[#253b42]">Add facility</h2>
          <p className="mt-1 text-[12.5px] leading-snug text-[#87979a]">
            Connect a new care facility to the network.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="-mt-1 -mr-1 grid h-8 w-8 place-items-center rounded-lg text-[#9aabad] transition hover:bg-[#f3f8f8] hover:text-[#3f8995] focus:outline-none focus:ring-2 focus:ring-[#86b3b5]/30"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="mb-4 text-[13px] font-medium text-[#bd6255]">
          {error}
        </p>
      )}

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="facilityName"
            className="mb-1.5 block text-[12px] font-semibold text-[#4d6469]"
          >
            Facility name
          </label>
          <input
            id="facilityName"
            type="text"
            placeholder="e.g. Tema General Hospital"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[#e0e9e9] bg-white px-3 py-2.5 text-sm text-[#2a4148] outline-none transition placeholder:text-[#a6b2b3] focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
          />
        </div>

        <div>
          <label
            htmlFor="facilityType"
            className="mb-1.5 block text-[12px] font-semibold text-[#4d6469]"
          >
            Facility type
          </label>
          <select
            id="facilityType"
            value={type}
            onChange={(e) => setType(e.target.value as FacilityType)}
            className={`w-full cursor-pointer rounded-lg border border-[#e0e9e9] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15 ${
              type ? 'text-[#2a4148]' : 'text-[#a6b2b3]'
            }`}
          >
            <option value="" disabled>
              Select a type
            </option>
            {FACILITY_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="!mb-2">
          <label
            htmlFor="facilityLocation"
            className="mb-1.5 block text-[12px] font-semibold text-[#4d6469]"
          >
            Location
          </label>
          <input
            id="facilityLocation"
            type="text"
            placeholder="e.g. Tema"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-[#e0e9e9] bg-white px-3 py-2.5 text-sm text-[#2a4148] outline-none transition placeholder:text-[#a6b2b3] focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex justify-end gap-2.5 border-t border-[#edf2f2] pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-[#e0e9e9] bg-white px-[18px] py-[11px] text-[13px] font-semibold text-[#718285] transition hover:border-[#a7ccce] hover:text-[#3e8995] focus:outline-none focus:ring-2 focus:ring-[#86b3b5]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3e8995] px-[18px] py-[11px] text-[13px] font-bold text-white shadow-sm transition hover:bg-[#327581] active:bg-[#2d6d78] focus:outline-none focus:ring-4 focus:ring-[#3e8995]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckIcon />
          {isSubmitting ? 'Adding…' : 'Add facility'}
        </button>
      </div>
    </form>
  );
}

function BuildingIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M3 21h18M6 21V7l6-4 6 4v14M9 9h1M9 13h1M14 9h1M14 13h1M10 21v-4h4v4" />
    </svg>
  );
}

function CloseIcon() {
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
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
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

import { facilityTypeLabel } from './facilityService';
import { FacilitySummary } from './types';

export default function FacilityCard({ facility }: { facility: FacilitySummary }) {
  return (
    <div className="rounded-[13px] border border-[#e8eeee] bg-white p-[21px]">
      <div className="flex justify-between">
        <span className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[#e7f3f3] text-[#498d96]">
          <PinIcon />
        </span>

        <button
          type="button"
          aria-label="More options"
          className="rounded-md p-1 text-[#9aabad] transition hover:bg-[#f3f8f8] hover:text-[#3f8995] focus:outline-none focus:ring-2 focus:ring-[#86b3b5]/30"
        >
          <MoreIcon />
        </button>
      </div>

      <h2 className="mt-5 mb-1.5 font-display text-sm font-bold text-[#30494f]">{facility.name}</h2>

      <p className="mb-[23px] text-[15px] text-[#94a2a4]">
        {facilityTypeLabel(facility.type)} · {facility.location}
      </p>

      <div className="flex items-center justify-between border-t border-[#edf2f2] pt-3.5 text-sm">
        <span className="flex items-center gap-1.5 text-[#5c9674]">
          <i
            className={`block h-1.5 w-1.5 rounded-full ${
              facility.isOnline ? 'bg-[#6aab82]' : 'bg-[#bd6255]'
            }`}
          />
          {facility.isOnline ? 'Online' : 'Offline'}
        </span>

        <strong className="font-medium text-[#7e9194]">
          {facility.activeReferrals} active referrals
        </strong>
      </div>
    </div>
  );
}

function PinIcon() {
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
      <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
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

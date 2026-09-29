import { facilityTypeLabel } from './facilityService';
import { FacilitySummary } from './types';

export default function FacilityCard({ facility }: { facility: FacilitySummary }) {
  return (
    <div className="panel facility-card">
      <div className="facility-top">
        <span className="facility-icon">
          <PinIcon />
        </span>
        <button type="button" className="row-more" aria-label="More options">
          <MoreIcon />
        </button>
      </div>

      <h2>{facility.name}</h2>
      <p>
        {facilityTypeLabel(facility.type)} · {facility.location}
      </p>

      <div className="facility-footer">
        <span>
          <i />
          {facility.isOnline ? 'Online' : 'Offline'}
        </span>
        <strong>{facility.activeReferrals} active referrals</strong>
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
    >
      <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
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

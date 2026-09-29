import { timeAgo } from '@/utils';
import { ReferralListItem } from './types';


interface ReferralsTableProps {
  referrals: ReferralListItem[];
  loading?: boolean;
  search: string;
  onSearchChange: (value: string) => void;
}

function titleCase(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

export default function ReferralsTable({
  
  
  referrals,
  loading,
  search,
  onSearchChange,
}: ReferralsTableProps) {
  const filtered = referrals.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.code.toLowerCase().includes(q) ||
      r.patientName.toLowerCase().includes(q) ||
      r.referringFacilityName.toLowerCase().includes(q) ||
      r.receivingFacilityName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="panel table-panel">
      <div className="table-toolbar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search referrals..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button type="button" className="filter-button">
          <FilterIcon />
          Filters
          <ChevronDownIcon />
        </button>
        <span className="result-count">
          {loading ? '…' : `${filtered.length} referral${filtered.length === 1 ? '' : 's'}`}
        </span>
      </div>

      <div className="table-head">
        <span>REFERENCE</span>
        <span>PATIENT</span>
        <span>FACILITIES</span>
        <span>URGENCY</span>
        <span>STATUS</span>
        <span>UPDATED</span>
        <span />
      </div>

      {loading && (
        <div style={{ padding: '20px 24px', color: '#9aa8aa', fontSize: 11 }}>Loading…</div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ padding: '20px 24px', color: '#9aa8aa', fontSize: 11 }}>
          No referrals found.
        </div>
      )}

      {!loading &&
        filtered.map((r) => (
          <button key={r.id} type="button" className="referral-row" style={{ cursor: 'pointer' }} onClick={() => { window.location.href = `/referrals/${r.id}` }}>
            <span className="referral-id">{r.code}</span>

            <div className="patient-cell">
              <span className="patient-avatar">{r.patientInitials}</span>
              <div>
                <strong>{r.patientName}</strong>
                <span>
                  {r.patientAge} years · {r.reason}
                </span>
              </div>
            </div>

            <div className="facility-cell">
              <div>
                <strong>{r.referringFacilityName}</strong>
                <span>→ {r.receivingFacilityName}</span>
              </div>
            </div>

            <span className={`urgency ${r.urgency.toLowerCase()}`}>{titleCase(r.urgency)}</span>

            <span className={`status-pill status-${r.status.toLowerCase()}`}>
              <i />
              {titleCase(r.status)}
            </span>

            <span className="row-time">{timeAgo(r.updatedAt)}</span>

            <span className="row-more">
              <MoreIcon />
            </span>
          </button>
        ))}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
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

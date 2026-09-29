import { CSSProperties } from 'react';
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

// The base .table-head / .referral-row rules in index.css run 9-11px —
// fine for a dense admin table, hard to scan otherwise. Sizes are set
// explicitly here instead of inheriting them.
const headStyle: CSSProperties = { fontSize: 11, letterSpacing: 0.4 };
const idStyle: CSSProperties = { fontSize: 12 };
const nameStyle: CSSProperties = { fontSize: 13 };
const subTextStyle: CSSProperties = { fontSize: 11.5, marginTop: 3 };
const badgeStyle: CSSProperties = { fontSize: 11, padding: '6px 9px' };
const timeStyle: CSSProperties = { fontSize: 11 };

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
            style={{ fontSize: 13 }}
          />
        </div>
        <button type="button" className="filter-button" style={{ fontSize: 12 }}>
          <FilterIcon />
          Filters
          <ChevronDownIcon />
        </button>
        <span className="result-count" style={{ fontSize: 12 }}>
          {loading ? '…' : `${filtered.length} referral${filtered.length === 1 ? '' : 's'}`}
        </span>
      </div>

      <div className="table-head" style={headStyle}>
        <span>REFERENCE</span>
        <span>PATIENT</span>
        <span>FACILITIES</span>
        <span>URGENCY</span>
        <span>STATUS</span>
        <span>UPDATED</span>
        <span />
      </div>

      {loading && (
        <div style={{ padding: '20px 24px', color: '#9aa8aa', fontSize: 13 }}>Loading…</div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ padding: '20px 24px', color: '#9aa8aa', fontSize: 13 }}>
          No referrals found.
        </div>
      )}

      {!loading &&
        filtered.map((r) => (
          <button
            key={r.id}
            type="button"
            className="referral-row"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              window.location.href = `/referrals/${r.id}`;
            }}
          >
            <span className="referral-id" style={idStyle}>
              {r.code}
            </span>

            <div className="patient-cell">
              <span className="patient-avatar" style={{ fontSize: 11 }}>
                {r.patientInitials}
              </span>
              <div>
                <strong style={nameStyle}>{r.patientName}</strong>
                <span style={subTextStyle}>
                  {r.patientAge} years · {r.reason}
                </span>
              </div>
            </div>

            <div className="facility-cell">
              <div>
                <strong style={nameStyle}>{r.referringFacilityName}</strong>
                <span style={subTextStyle}>→ {r.receivingFacilityName}</span>
              </div>
            </div>

            <span className={`urgency ${r.urgency.toLowerCase()}`} style={badgeStyle}>
              {titleCase(r.urgency)}
            </span>

            <span className={`status-pill status-${r.status.toLowerCase()}`} style={badgeStyle}>
              <i />
              {titleCase(r.status)}
            </span>

            <span className="row-time" style={timeStyle}>
              {timeAgo(r.updatedAt)}
            </span>

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

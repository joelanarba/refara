import { useNavigate } from 'react-router-dom';
import { timeAgo } from '@/utils';
import { StatusPill, UrgencyBadge } from '@/components/ui/ReferralBadges';
import { ReferralListItem } from './types';

interface ReferralsTableProps {
  referrals: ReferralListItem[];
  loading?: boolean;
  search: string;
  onSearchChange: (value: string) => void;
}

/* Shared by the header and every row so columns line up at each breakpoint */
const GRID =
  'grid items-center gap-x-3 gap-y-1 px-3 min-[431px]:gap-x-4 min-[431px]:px-6 ' +
  'md:px-[18px] min-[1100px]:px-6 ' +
  'grid-cols-[57px_minmax(130px,1fr)_80px_96px_17px] ' +
  'md:grid-cols-[57px_minmax(120px,1.1fr)_minmax(130px,1.2fr)_80px_110px_70px_18px] md:gap-x-5 ' +
  'min-[1100px]:grid-cols-[62px_minmax(130px,1.2fr)_minmax(170px,1.4fr)_86px_120px_78px_18px] min-[1100px]:gap-x-6';

export default function ReferralsTable({
  referrals,
  loading,
  search,
  onSearchChange,
}: ReferralsTableProps) {
  const navigate = useNavigate();

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
    <div className="overflow-hidden rounded-[13px] border border-[#e8eeee] bg-white">
      <div className="flex flex-wrap items-center gap-[11px] border-b border-[#edf2f2] px-[22px] py-[18px]">
        <div className="flex h-[35px] flex-1 basis-full items-center gap-2 rounded-[7px] border border-[#e2eaea] px-[11px] text-[#99a9aa] md:max-w-[290px] md:basis-auto">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search referrals..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border-0 text-[15px] text-[#3a5056] outline-none placeholder:text-[#a6b2b3]"
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[#e0e9e9] bg-white px-3 py-[9px] text-[15px] font-semibold text-[#718285] hover:border-[#a7ccce] hover:text-brand"
        >
          <FilterIcon />
          Filters
          <ChevronDownIcon />
        </button>
        <span className="ml-auto text-sm text-[#a1adae]">
          {loading ? '…' : `${filtered.length} referral${filtered.length === 1 ? '' : 's'}`}
        </span>
      </div>

      <div className={`${GRID} py-[13px] text-xs font-bold tracking-[0.6px] text-[#a3b0b1]`}>
        <span>REFERENCE</span>
        <span>PATIENT</span>
        <span className="hidden md:block">FACILITIES</span>
        <span>URGENCY</span>
        <span>STATUS</span>
        <span className="hidden md:block">UPDATED</span>
        <span />
      </div>

      {loading && <div className="px-6 py-5 text-sm text-[#9aa8aa]">Loading…</div>}

      {!loading && filtered.length === 0 && (
        <div className="px-6 py-5 text-sm text-[#9aa8aa]">No referrals found.</div>
      )}

      {!loading &&
        filtered.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => navigate(`/referrals/${r.id}`)}
            className={`${GRID} w-full border-t border-[#eff3f3] bg-transparent py-[15px] text-left text-[#294148] hover:bg-[#f9fbfb]`}
          >
            <span className="text-sm font-bold text-[#789296]">{r.code}</span>

            <div className="flex min-w-0 items-center gap-[9px]">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#f0e8e1] text-sm font-bold text-[#aa7762]">
                {r.patientInitials}
              </span>
              <div className="min-w-0">
                <strong className="block truncate text-[15px] font-bold">{r.patientName}</strong>
                <span className="mt-1 block truncate text-xs text-[#9aa8aa]">
                  {r.patientAge} years · {r.reason}
                </span>
              </div>
            </div>

            <div className="hidden min-w-0 md:block">
              <strong className="block truncate text-[15px] font-bold">
                {r.referringFacilityName}
              </strong>
              <span className="mt-1 block truncate text-xs text-[#9aa8aa]">
                → {r.receivingFacilityName}
              </span>
            </div>

            <UrgencyBadge urgency={r.urgency} />
            <StatusPill status={r.status} />

            <span className="hidden text-xs whitespace-nowrap text-[#9aa8aa] md:block">
              {timeAgo(r.updatedAt)}
            </span>

            <span className="text-[#9aabad]">
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

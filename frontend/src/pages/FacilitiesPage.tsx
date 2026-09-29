import { useFacilities } from '@/hooks/useFacilities';
import DashboardHeader from '../features/dashboard/components/DashboardHeader';
import FacilityCard from '@/features/facilities/FacilityCard';

export default function FacilitiesPage() {
  const { data: facilities, loading } = useFacilities();

  return (
    <>
      <DashboardHeader
        eyebrow="NETWORK ADMINISTRATION"
        title="Facilities"
        subtitle="Manage connected care facilities across the network."
        action={
          <button type="button" className="primary-button">
            <PlusIcon />
            Add facility
          </button>
        }
      />

      {loading && <p style={{ color: '#9aa8aa', fontSize: 12 }}>Loading…</p>}

      {!loading && (
        <div className="facility-grid">
          {facilities?.map((f) => (
            <FacilityCard key={f.id} facility={f} />
          ))}
        </div>
      )}
    </>
  );
}

function PlusIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

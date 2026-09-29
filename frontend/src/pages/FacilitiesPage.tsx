import { useFacilities } from '@/hooks/useFacilities';
import DashboardHeader from '../features/dashboard/components/DashboardHeader';
import FacilityCard from '@/features/facilities/FacilityCard';
import { useState } from 'react';
import AddFacilityForm from '../features/facilities/AddFacilityForm';
import Modal from '../components/ui/Modal';

export default function FacilitiesPage() {
  const { data: facilities, loading, refetch } = useFacilities();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <DashboardHeader
        eyebrow="NETWORK ADMINISTRATION"
        title="Facilities"
        subtitle="Manage connected care facilities across the network."
        action={
          <button type="button" className="primary-button" onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon />
            Add facility
          </button>
        }
      />

      {loading && <p style={{ color: '#9aa8aa', fontSize: 13 }}>Loading…</p>}

      {!loading && (
        <div className="facility-grid">
          {facilities?.map((f) => (
            <FacilityCard key={f.id} facility={f} />
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <AddFacilityForm
            onCancel={() => setIsAddModalOpen(false)}
            onSuccess={() => {
              setIsAddModalOpen(false);
              if (refetch) refetch();
            }}
          />
        </Modal>
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

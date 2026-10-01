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
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-[#3e8995] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#327581] active:bg-[#2d6d78] focus:outline-none focus:ring-4 focus:ring-[#3e8995]/20"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusIcon />
            Add facility
          </button>
        }
      />

      {loading && <p style={{ color: '#9aa8aa', fontSize: 12 }}>Loading...</p>}

      {!loading && (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

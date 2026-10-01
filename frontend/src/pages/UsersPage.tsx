import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import DashboardHeader from '../features/dashboard/components/DashboardHeader';
import UserRow from '@/features/users/UserRow';
import InviteUserForm from '@/components/forms/InviteUserForm';

export default function UsersPage() {
  const { data: users, loading, refetch } = useUsers();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <>
      <DashboardHeader
        eyebrow="NETWORK ADMINISTRATION"
        title="Users & access"
        subtitle="Authorized people and their workspace permissions."
        action={
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3e8995] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#327581] active:bg-[#2d6d78] focus:outline-none focus:ring-4 focus:ring-[#3e8995]/20"
          >
            <UserPlusIcon />
            Invite user
          </button>
        }
      />

      <div className="rounded-[13px] border border-[#e8eeee] bg-white p-4">
        {loading && <p className="px-1 py-4 text-xs text-[#9aa8aa]">Loading...</p>}

        {!loading && users?.map((u, i) => <UserRow key={u.id} user={u} index={i} />)}
      </div>

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <InviteUserForm
            onCancel={() => setIsInviteModalOpen(false)}
            onSuccess={() => {
              setIsInviteModalOpen(false);
              if (refetch) refetch();
            }}
          />
        </div>
      )}
    </>
  );
}

function UserPlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" />
    </svg>
  );
}

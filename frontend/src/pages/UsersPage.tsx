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
          <button type="button" className="primary-button" onClick={() => setIsInviteModalOpen(true)}>
            <UserPlusIcon />
            Invite user
          </button>
        }
      />

      <div className="panel users-panel">
        {loading && <p style={{ color: '#9aa8aa', fontSize: 12, padding: '17px 0' }}>Loading...</p>}
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
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" />
    </svg>
  );
}

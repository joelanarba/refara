import { useAuth } from '@/features/auth/Useauth';
import AdminDashboard from '@/features/dashboard/views/AdminDashboard';
import FacilityDashboard from '@/features/dashboard/views/FacilityDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  return user?.role === 'ADMIN' ? <AdminDashboard /> : <FacilityDashboard />;
}

import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ReferralsListPage from '../pages/ReferralsListPage';
import FacilitiesPage from '../pages/FacilitiesPage';
import UsersPage from '../pages/UsersPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '@/components/common/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';

// Not built yet — uncomment each as the page is created
import ReferralDetailPage from '../pages/ReferralDetailPage';
import ReferralCreatePage from '../pages/ReferralCreatePage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Protected — any authenticated role */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.REFERRALS} element={<ReferralsListPage />} />
          <Route path={ROUTES.REFERRAL_DETAIL} element={<ReferralDetailPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />

          {/* Protected — referring workers only */}
          <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
            <Route path={ROUTES.REFERRAL_CREATE} element={<ReferralCreatePage />} />
          </Route>

          {/* Protected — admin only */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path={ROUTES.FACILITIES} element={<FacilitiesPage />} />
            <Route path={ROUTES.USERS} element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      {/* Default + fallback */}
      <Route path={ROUTES.HOME} element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

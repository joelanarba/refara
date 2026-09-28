// Route configuration
// Define application routes here as features are implemented

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  REFERRALS: '/referrals',
  REFERRAL_CREATE: '/referrals/new',
  REFERRAL_DETAIL: '/referrals/:id',
  FACILITIES: '/facilities',
  USERS: '/users',
} as const;

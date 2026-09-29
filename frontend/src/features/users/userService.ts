import { UserRole } from '@/types';
import { apiClient } from '../../services/api';
import { UserSummary } from './types';

const USE_MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

const MOCK_USERS: UserSummary[] = [
  {
    id: 'u-1',
    name: 'Ama Mensah',
    role: 'REFERRING_WORKER',
    facilityName: 'Adabraka Community Clinic',
    isActive: true,
  },
  {
    id: 'u-2',
    name: 'Dr. Kojo Asare',
    role: 'RECEIVING_WORKER',
    facilityName: 'Korle Bu Teaching Hospital',
    isActive: true,
  },
  {
    id: 'u-3',
    name: 'Nana Owusu',
    role: 'ADMIN',
    facilityName: 'Central Health Network',
    isActive: true,
  },
];

const ROLE_DISPLAY: Record<UserRole, string> = {
  REFERRING_WORKER: 'Healthcare Worker',
  RECEIVING_WORKER: 'Healthcare Worker',
  ADMIN: 'System Administrator',
};

export function userRoleDisplay(role: UserRole) {
  return ROLE_DISPLAY[role];
}

export async function getUsers(): Promise<UserSummary[]> {
  if (USE_MOCK) return MOCK_USERS;
  return apiClient.get<UserSummary[]>('/users');
}

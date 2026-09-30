import { UserRole } from '@/types';
import { apiClient } from '../../services/api';
import { UserSummary } from './types';

const USE_MOCK = import.meta.env.VITE_MOCK_AUTH === 'true';

const MOCK_USERS: UserSummary[] = [
  {
    id: 'u-1',
    name: 'Ama Mensah',
    email: 'ama@example.com',
    role: 'WORKER',
    facilityName: 'Adabraka Community Clinic',
    isActive: true,
    isPending: false,
  },
  {
    id: 'u-2',
    name: 'Dr. Kojo Asare',
    email: 'kojo@example.com',
    role: 'WORKER',
    facilityName: 'Korle Bu Teaching Hospital',
    isActive: true,
    isPending: false,
  },
  {
    id: 'u-3',
    name: 'Nana Owusu',
    email: 'nana@example.com',
    role: 'ADMIN',
    facilityName: 'Central Health Network',
    isActive: true,
    isPending: true,
  },
];

const ROLE_DISPLAY: Record<UserRole, string> = {
  WORKER: 'Healthcare Worker',
  ADMIN: 'System Administrator',
};

export function userRoleDisplay(role: UserRole) {
  return ROLE_DISPLAY[role];
}

export async function getUsers(): Promise<UserSummary[]> {
  if (USE_MOCK) return MOCK_USERS;
  return apiClient.get<UserSummary[]>('/users');
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: UserRole;
  facilityId: string;
}

export async function createUser(data: CreateUserPayload): Promise<{ data: any }> {
  if (USE_MOCK) {
    return { data: { id: Math.random().toString(), ...data } };
  }
  return apiClient.post<{ data: any }>('/users', data);
}

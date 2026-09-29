import { UserRole } from '@/types';
import { apiClient } from '../../services/api';
import { UserSummary } from './types';
import { getFacilities } from '../facilities/facilityService';

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

export interface CreateUserPayload {
  name: string;
  email: string;
  role: UserRole;
  facilityId: string;
}

export async function createUser(data: CreateUserPayload): Promise<UserSummary> {
  if (USE_MOCK) {
    // Mock store only keys facilities by id — resolve the name for display.
    const facilities = await getFacilities();
    const facility = facilities.find((f) => f.id === data.facilityId);

    const user: UserSummary = {
      id: `u-${MOCK_USERS.length + 1}`,
      name: data.name,
      role: data.role,
      facilityName: facility?.name ?? 'Unknown facility',
      isActive: true,
    };
    MOCK_USERS.push(user);
    return user;
  }
  return apiClient.post<UserSummary>('/users', data);
}

import { apiClient } from '../../services/api';
import { User } from '../../types';

interface LoginResponse {
  token: string;
  user: User;
}

const USE_MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === 'true';

function mockUserFor(email: string): User {
  const base = { createdAt: new Date().toISOString() };
  if (email.includes('referr')) {
    return {
      ...base,
      id: 'mock-ref-1',
      name: 'Ama Mensah',
      email,
      role: 'REFERRING_WORKER',
      facilityId: 'fac-1',
    };
  }
  if (email.includes('receiv')) {
    return {
      ...base,
      id: 'mock-rec-1',
      name: 'Kofi Asante',
      email,
      role: 'RECEIVING_WORKER',
      facilityId: 'fac-2',
    };
  }
  return {
    ...base,
    id: 'mock-admin-1',
    name: 'Nana Owusu',
    email,
    role: 'ADMIN',
    facilityId: null,
  };
}

function mockLogin(email: string): Promise<LoginResponse> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ token: 'mock-dev-token', user: mockUserFor(email) }), 300),
  );
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  if (USE_MOCK_AUTH) {
    return mockLogin(email);
  }
  return apiClient.post<LoginResponse>('/auth/login', { email, password });
}

export function logoutRequest() {
  // If the backend tracks sessions server-side, call it here.
  // Otherwise this is a no-op and clearing local state is enough.
  return Promise.resolve();
}

import { apiClient } from '../../services/api';
import { User } from '../../types';

interface LoginResponse {
  token: string;
  user: User;
}

const USE_MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === 'true';

const MOCK_USER: User = {
  id: 'mock-admin-1',
  name: 'Nana Owusu',
  email: 'admin@refera.dev',
  role: 'ADMIN',
  facilityId: null,
  createdAt: new Date().toISOString(),
};

function mockLogin(): Promise<LoginResponse> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ token: 'mock-dev-token', user: MOCK_USER }), 300),
  );
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  if (USE_MOCK_AUTH) {
    return mockLogin();
  }
  return apiClient.post<LoginResponse>('/auth/login', { email, password });
}

export function logoutRequest() {
  // If the backend tracks sessions server-side, it will be here.
  return Promise.resolve();
}

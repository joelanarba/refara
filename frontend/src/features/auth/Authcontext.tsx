/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../../types';
import { AuthState, AuthContextValue } from './types';
import { loginRequest, logoutRequest } from './authService';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'maternalink_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Restore session on load
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { user, token } = JSON.parse(raw) as { user: User; token: string };
      setState({ user, token, isAuthenticated: true, isLoading: false });
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await loginRequest(email, password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    setState({ user, token, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    logoutRequest();
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
  );
}

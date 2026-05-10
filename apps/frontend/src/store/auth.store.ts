'use client'

import { create } from 'zustand';
import Cookies from 'js-cookie';
import api from '@/lib/axios';
import { AuthTokens } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,

  // call when starting app to check token
  checkAuth: () => {
    const token = Cookies.get('accessToken');
    set({ isAuthenticated: !!token, isLoading: false });
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthTokens>('/auth/login', {
      email,
      password,
    });
    Cookies.set('accessToken', data.accessToken, { expires: 1 });
    Cookies.set('refreshToken', data.refreshToken, { expires: 7 });
    set({ isAuthenticated: true });
  },

  logout: async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        await api.post(
          '/auth/logout',
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        );
      }
    } catch {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      set({ isAuthenticated: false });
    }
  },
}));

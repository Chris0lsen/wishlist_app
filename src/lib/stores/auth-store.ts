import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import type { AuthState, DecodedPayload } from '../types/types';

interface AuthStore extends AuthState {
  login: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  user: null,

  login: (accessToken) => {
    const decoded: DecodedPayload = jwtDecode(accessToken);
    set({
      isAuthenticated: true,
      accessToken,
      user: {
        userId: decoded.user_id,
        steamId: decoded.steam_id,
      },
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      accessToken: null,
      user: null,
    });
  },
}));

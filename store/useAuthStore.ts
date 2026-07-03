import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithApple, signOutWithApple, UserProfile } from '../services/auth';


interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'weather_user_profile';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initializeAuth: async () => {
    try {
      let savedUser: string | null = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        savedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
      } else {
        savedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      }

      if (savedUser) {
        const parsed = JSON.parse(savedUser) as UserProfile;
        set({ user: parsed, isAuthenticated: true });
      }
    } catch (e) {
      console.warn('Failed to initialize auth state:', e);
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithApple: async () => {
    set({ isLoading: true, error: null });
    try {
      const userProfile = await signInWithApple();
      
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
      } else {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
      }

      set({ user: userProfile, isAuthenticated: true });
    } catch (e: any) {
      console.error(e);
      set({ error: e?.message || 'Apple Sign-In failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOutWithApple();
      
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      } else {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }

      set({ user: null, isAuthenticated: false });
    } catch (e) {
      console.error('Failed to log out:', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));

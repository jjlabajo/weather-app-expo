import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadSettings, downloadSettings } from '../services/sync';
import { LanguageCode } from '../constants/translations';

export type TemperatureUnit = 'C' | 'F';

interface SettingsState {
  unit: TemperatureUnit;
  language: LanguageCode;
  isSyncing: boolean;
  isLoading: boolean;
  setUnit: (unit: TemperatureUnit, userUid?: string) => Promise<void>;
  toggleUnit: (userUid?: string) => Promise<void>;
  setLanguage: (language: LanguageCode, userUid?: string) => Promise<void>;
  initializeSettings: (userUid?: string) => Promise<void>;
  syncWithCloud: (userUid: string) => Promise<void>;
}

const SETTINGS_STORAGE_KEY = 'weather_temp_unit';
const LANGUAGE_STORAGE_KEY = 'weather_language';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  unit: 'C',
  language: 'en',
  isSyncing: false,
  isLoading: true,

  initializeSettings: async (userUid) => {
    set({ isLoading: true });
    try {
      // Load unit
      let localUnit: string | null = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        localUnit = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      } else {
        localUnit = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      }

      let activeUnit: TemperatureUnit = 'C';
      if (localUnit === 'C' || localUnit === 'F') {
        activeUnit = localUnit;
      }

      // Load language
      let localLang: string | null = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        localLang = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      } else {
        localLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      }

      let activeLang: LanguageCode = 'en';
      if (localLang === 'en' || localLang === 'es' || localLang === 'fr') {
        activeLang = localLang;
      }

      set({ unit: activeUnit, language: activeLang });

      if (userUid) {
        set({ isSyncing: true });
        const cloudSettings = await downloadSettings(userUid);
        if (cloudSettings) {
          activeUnit = cloudSettings.tempUnit;
          activeLang = cloudSettings.language;

          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(SETTINGS_STORAGE_KEY, activeUnit);
            window.localStorage.setItem(LANGUAGE_STORAGE_KEY, activeLang);
          } else {
            await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, activeUnit);
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, activeLang);
          }
          set({ unit: activeUnit, language: activeLang });
        } else {
          await uploadSettings(userUid, { tempUnit: activeUnit, language: activeLang });
        }
      }
    } catch (e) {
      console.warn('Failed to initialize settings:', e);
    } finally {
      set({ isLoading: false, isSyncing: false });
    }
  },

  setUnit: async (newUnit, userUid) => {
    try {
      set({ unit: newUnit });
      
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(SETTINGS_STORAGE_KEY, newUnit);
      } else {
        await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, newUnit);
      }

      if (userUid) {
        set({ isSyncing: true });
        await uploadSettings(userUid, { tempUnit: newUnit, language: get().language });
      }
    } catch (e) {
      console.warn('Failed to save temperature unit setting:', e);
    } finally {
      set({ isSyncing: false });
    }
  },

  toggleUnit: async (userUid) => {
    const nextUnit = get().unit === 'C' ? 'F' : 'C';
    await get().setUnit(nextUnit, userUid);
  },

  setLanguage: async (newLang, userUid) => {
    try {
      set({ language: newLang });

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      } else {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      }

      if (userUid) {
        set({ isSyncing: true });
        await uploadSettings(userUid, { tempUnit: get().unit, language: newLang });
      }
    } catch (e) {
      console.warn('Failed to save language setting:', e);
    } finally {
      set({ isSyncing: false });
    }
  },

  syncWithCloud: async (userUid) => {
    set({ isSyncing: true });
    try {
      const cloudSettings = await downloadSettings(userUid);
      if (cloudSettings) {
        const cloudUnit = cloudSettings.tempUnit;
        const cloudLang = cloudSettings.language;
        set({ unit: cloudUnit, language: cloudLang });
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(SETTINGS_STORAGE_KEY, cloudUnit);
          window.localStorage.setItem(LANGUAGE_STORAGE_KEY, cloudLang);
        } else {
          await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, cloudUnit);
          await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, cloudLang);
        }
      } else {
        await uploadSettings(userUid, { tempUnit: get().unit, language: get().language });
      }
    } catch (e) {
      console.warn('Failed to sync settings with cloud:', e);
    } finally {
      set({ isSyncing: false });
    }
  },
}));

export const convertTemp = (tempInC: number, unit: TemperatureUnit): number => {
  if (unit === 'F') {
    return (tempInC * 9) / 5 + 32;
  }
  return tempInC;
};

export const formatTemp = (tempInC: number, unit: TemperatureUnit): string => {
  return `${Math.round(convertTemp(tempInC, unit))}°${unit}`;
};

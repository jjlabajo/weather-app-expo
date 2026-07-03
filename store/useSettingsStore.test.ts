import { describe, it, expect, vi } from 'vitest';

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

import { convertTemp, formatTemp } from '../store/useSettingsStore';


describe('Temperature Unit Context Helpers', () => {
  describe('convertTemp', () => {

    it('returns the same temperature when unit is Celsius (C)', () => {
      expect(convertTemp(0, 'C')).toBe(0);
      expect(convertTemp(25, 'C')).toBe(25);
      expect(convertTemp(-10, 'C')).toBe(-10);
    });

    it('converts Celsius to Fahrenheit correctly (F)', () => {
      expect(convertTemp(0, 'F')).toBe(32);
      expect(convertTemp(100, 'F')).toBe(212);
      expect(convertTemp(-40, 'F')).toBe(-40);
      expect(convertTemp(20, 'F')).toBe(68);
    });
  });

  describe('formatTemp', () => {
    it('formats Celsius correctly', () => {
      expect(formatTemp(23.4, 'C')).toBe('23°C');
      expect(formatTemp(0, 'C')).toBe('0°C');
      expect(formatTemp(-5.8, 'C')).toBe('-6°C');
    });

    it('formats Fahrenheit correctly', () => {
      expect(formatTemp(20, 'F')).toBe('68°F');
      expect(formatTemp(0, 'F')).toBe('32°F');
      expect(formatTemp(-10, 'F')).toBe('14°F');
    });
  });
});

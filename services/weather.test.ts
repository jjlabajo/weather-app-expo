import { describe, it, expect } from 'vitest';
import { getWeatherIcon, getWeatherDescription } from './weather';

describe('Weather Service', () => {
  describe('getWeatherIcon', () => {
    it('returns sunny for code 0', () => {
      expect(getWeatherIcon(0)).toBe('sunny');
    });

    it('returns partly-sunny for codes 1-3', () => {
      expect(getWeatherIcon(1)).toBe('partly-sunny');
      expect(getWeatherIcon(2)).toBe('partly-sunny');
      expect(getWeatherIcon(3)).toBe('partly-sunny');
    });

    it('returns rainy for codes 61-65', () => {
      expect(getWeatherIcon(61)).toBe('rainy');
      expect(getWeatherIcon(65)).toBe('rainy');
    });

    it('returns thunderstorm for code 95', () => {
      expect(getWeatherIcon(95)).toBe('thunderstorm');
    });

    it('returns help-circle for unknown codes', () => {
      expect(getWeatherIcon(999)).toBe('help-circle');
    });
  });

  describe('getWeatherDescription', () => {
    it('returns Clear sky for code 0', () => {
      expect(getWeatherDescription(0)).toBe('Clear sky');
    });

    it('returns Fog for code 45', () => {
      expect(getWeatherDescription(45)).toBe('Fog');
    });

    it('returns Unknown for unknown codes', () => {
      expect(getWeatherDescription(999)).toBe('Unknown');
    });
  });
});

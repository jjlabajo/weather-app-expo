import axios from 'axios';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
    time: string;
    precipitation: number;
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
    precipitationSum: number[];
  };
  hourly: {
    time: string[];
    temperature: number[];
    weatherCode: number[];
  };
}

export interface LocationSearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const response = await axios.get(WEATHER_API_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,weather_code,precipitation',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
      hourly: 'temperature_2m,weather_code',
      timezone: 'auto',
    },
  });

  const { current, daily, hourly } = response.data;

  return {
    current: {
      temperature: current.temperature_2m,
      weatherCode: current.weather_code,
      time: current.time,
      precipitation: current.precipitation || 0,
    },
    daily: {
      time: daily.time,
      weatherCode: daily.weather_code,
      temperatureMax: daily.temperature_2m_max,
      temperatureMin: daily.temperature_2m_min,
      precipitationSum: daily.precipitation_sum || daily.time.map(() => 0),
    },
    hourly: {
      time: hourly.time,
      temperature: hourly.temperature_2m,
      weatherCode: hourly.weather_code,
    },
  };
};

export const searchLocations = async (query: string): Promise<LocationSearchResult[]> => {
  if (!query || query.length < 2) return [];

  const response = await axios.get(GEOCODING_API_URL, {
    params: {
      name: query,
      count: 10,
      language: 'en',
      format: 'json',
    },
  });

  return response.data.results || [];
};

export const getWeatherIcon = (code: number) => {
  // Mapping Open-Meteo codes to Ionicons/MaterialIcons names
  // https://open-meteo.com/en/docs
  if (code === 0) return 'sunny';
  if (code >= 1 && code <= 3) return 'partly-sunny';
  if (code === 45 || code === 48) return 'cloudy'; // Fog
  if (code >= 51 && code <= 55) return 'rainy'; // Drizzle
  if (code >= 61 && code <= 65) return 'rainy'; // Rain
  if (code >= 71 && code <= 77) return 'snow'; // Snow
  if (code >= 80 && code <= 82) return 'umbrella'; // Rain showers
  if (code >= 85 && code <= 86) return 'snow'; // Snow showers
  if (code === 95 || code === 96 || code === 99) return 'thunderstorm'; // Thunderstorm
  return 'help-circle';
};

export const getWeatherDescription = (code: number) => {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code === 95 || code === 96 || code === 99) return 'Thunderstorm';
  return 'Unknown';
};

export const getWeatherDescriptionKey = (code: number): string => {
  if (code === 0) return 'clearSky';
  if (code === 1) return 'mainlyClear';
  if (code === 2) return 'partlyCloudy';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code >= 61 && code <= 65) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rainShowers';
  if (code >= 85 && code <= 86) return 'snowShowers';
  if (code === 95 || code === 96 || code === 99) return 'thunderstorm';
  return 'unknown';
};


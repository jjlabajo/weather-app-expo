import * as Location from 'expo-location';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = async (): Promise<UserLocation | null> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    return null;
  }

  const location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lon,
    });

    if (results.length > 0) {
      const { city, region, country } = results[0];
      return city || region || country || 'Unknown Location';
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error);
  }
  return null;
};

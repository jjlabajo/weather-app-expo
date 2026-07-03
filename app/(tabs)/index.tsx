import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from '@/components/Themed';
import { getCurrentLocation, reverseGeocode } from '@/services/location';
import { fetchWeather, WeatherData, getWeatherIcon, getWeatherDescriptionKey } from '@/services/weather';
import { useSettingsStore, convertTemp } from '@/store/useSettingsStore';
import { translations } from '@/constants/translations';

export default function WeatherHomeScreen() {
  const [city, setCity] = useState<string>('detectingLocation');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const unit = useSettingsStore((state) => state.unit);
  const language = useSettingsStore((state) => state.language);

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userLoc = await getCurrentLocation();
      if (!userLoc) {
        setError('locationDenied');
        setLoading(false);
        return;
      }
      
      const [weatherData, cityName] = await Promise.all([
        fetchWeather(userLoc.latitude, userLoc.longitude),
        reverseGeocode(userLoc.latitude, userLoc.longitude)
      ]);
      
      setWeather(weatherData);
      setCity(cityName || 'Unknown Location');
    } catch (err) {
      console.error(err);
      setError('failedFetch');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{t('fetchingWeather')}</Text>
      </View>
    );
  }

  if (error) {
    const errorText = error === 'locationDenied' || error === 'failedFetch' ? t(error as any) : error;
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>{errorText}</Text>
        <TouchableOpacity style={styles.button} onPress={loadData}>
          <Text style={styles.buttonText}>{t('tryAgain')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayCity = city === 'detectingLocation' ? t('detectingLocation') : city;

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Ionicons name="location" size={20} color="#007AFF" />
        <Text style={styles.cityText}>{displayCity}</Text>
      </View>

      {weather && (
        <View style={styles.weatherContainer}>
          <Ionicons 
            name={getWeatherIcon(weather.current.weatherCode) as any} 
            size={120} 
            color="#007AFF" 
          />
          <Text style={styles.tempText}>{Math.round(convertTemp(weather.current.temperature, unit))}°{unit}</Text>
          <Text style={styles.descText}>
            {t(getWeatherDescriptionKey(weather.current.weatherCode) as any)}
          </Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>{t('highlights')}</Text>
        <View style={styles.row}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>{t('high')}</Text>
            <Text style={styles.infoValue}>{weather ? `${Math.round(convertTemp(weather.daily.temperatureMax[0], unit))}°` : '--'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>{t('low')}</Text>
            <Text style={styles.infoValue}>{weather ? `${Math.round(convertTemp(weather.daily.temperatureMin[0], unit))}°` : '--'}</Text>
          </View>
        </View>
      </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  cityText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#FFFFFF',
  },
  weatherContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  tempText: {
    fontSize: 80,
    fontWeight: '200',
    marginTop: 10,
    color: '#FFFFFF',
  },
  descText: {
    fontSize: 20,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  infoContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'transparent',
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    color: '#FF453A',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#0A84FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

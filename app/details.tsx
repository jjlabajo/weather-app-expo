import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Stack from 'expo-router/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from '@/components/Themed';
import { fetchWeather, WeatherData, getWeatherIcon, getWeatherDescriptionKey } from '@/services/weather';
import { useSettingsStore, convertTemp } from '@/store/useSettingsStore';
import { translations } from '@/constants/translations';

export default function WeatherDetailsScreen() {
  const { lat, lon, name } = useLocalSearchParams<{ lat: string; lon: string; name: string }>();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const unit = useSettingsStore((state) => state.unit);
  const language = useSettingsStore((state) => state.language);

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  };

  const loadWeather = async () => {
    try {
      setLoading(true);
      const data = await fetchWeather(parseFloat(lat), parseFloat(lon));
      setWeather(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [lat, lon]);

  const onRefresh = () => {
    setRefreshing(true);
    loadWeather();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const localeMap = { en: 'en-US', es: 'es-ES', fr: 'fr-FR' };
  const displayLocale = localeMap[language] || 'en-US';

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Stack.Screen options={{ title: name }} />
      
      {weather && (
        <>
          <View style={styles.header}>
            <Ionicons 
              name={getWeatherIcon(weather.current.weatherCode) as any} 
              size={100} 
              color="#007AFF" 
            />
            <Text style={styles.tempText}>{Math.round(convertTemp(weather.current.temperature, unit))}°{unit}</Text>
            <Text style={styles.descText}>
              {t(getWeatherDescriptionKey(weather.current.weatherCode) as any)}
            </Text>
          </View>

          <View style={styles.forecastContainer}>
            <Text style={styles.sectionTitle}>{t('forecastTitle')}</Text>
            {weather.daily.time.map((time, index) => (
              <View key={time} style={styles.forecastRow}>
                <Text style={styles.dateText}>
                  {index === 0 ? t('today') : new Date(time).toLocaleDateString(displayLocale, { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
                <Ionicons 
                  name={getWeatherIcon(weather.daily.weatherCode[index]) as any} 
                  size={24} 
                  color="#007AFF" 
                />
                <View style={styles.tempRange}>
                  <Text style={styles.maxTemp}>{Math.round(convertTemp(weather.daily.temperatureMax[index], unit))}°</Text>
                  <Text style={styles.minTemp}>{Math.round(convertTemp(weather.daily.temperatureMin[index], unit))}°</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  header: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'transparent',
  },
  tempText: {
    fontSize: 64,
    fontWeight: '200',
    marginTop: 10,
    color: '#FFFFFF',
  },
  descText: {
    fontSize: 20,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  forecastContainer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
    backgroundColor: 'transparent',
  },
  dateText: {
    flex: 2,
    fontSize: 16,
    color: '#FFFFFF',
  },
  tempRange: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  maxTemp: {
    fontSize: 16,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
    color: '#FFFFFF',
  },
  minTemp: {
    fontSize: 16,
    color: '#8E8E93',
    width: 40,
    textAlign: 'right',
  },
});

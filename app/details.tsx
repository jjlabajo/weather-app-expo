import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl, View, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Stack from 'expo-router/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/Themed';
import { fetchWeather, WeatherData, getWeatherIcon, getWeatherDescriptionKey } from '@/services/weather';
import { useSettingsStore, convertTemp } from '@/store/useSettingsStore';
import { translations } from '@/constants/translations';

// Colors for weather icons based on code
const getWeatherIconColor = (code: number): string => {
  if (code === 0) return '#FFD60A'; // Sunny (Gold)
  if (code >= 1 && code <= 3) return '#FFD60A'; // Partly cloudy (Gold)
  if (code === 45 || code === 48) return '#E5E5EA'; // Fog (Light Gray)
  if (code >= 51 && code <= 55) return '#64D2FF'; // Drizzle (Light Blue)
  if (code >= 61 && code <= 65) return '#0A84FF'; // Rain (Blue)
  if (code >= 71 && code <= 77) return '#FFFFFF'; // Snow (White)
  if (code >= 80 && code <= 82) return '#0A84FF'; // Rain showers
  if (code >= 85 && code <= 86) return '#FFFFFF'; // Snow showers
  if (code === 95 || code === 96 || code === 99) return '#FF9F0A'; // Thunderstorm (Orange)
  return '#0A84FF';
};

// Weather-specific linear gradients for the liquid glass background
const getWeatherGradient = (code: number): [string, string, ...string[]] => {
  if (code === 0) return ['#0B255E', '#050B1A']; // Clear sky (Deep Blue to Dark)
  if (code >= 1 && code <= 3) return ['#142544', '#060810']; // Partly cloudy
  if (code === 45 || code === 48) return ['#222835', '#0A0C10']; // Fog (Slate Gray to Dark)
  if (code >= 51 && code <= 65) return ['#121D35', '#05070D']; // Rain (Muted Blue-Gray to Dark)
  if (code >= 71 && code <= 77) return ['#242D3C', '#0B0D14']; // Snow (Cold Gray-Blue to Dark)
  if (code >= 80 && code <= 82) return ['#0D1A38', '#04070E']; // Rain showers
  if (code >= 85 && code <= 86) return ['#1A2538', '#080C14']; // Snow showers
  if (code === 95 || code === 96 || code === 99) return ['#13102C', '#04030E']; // Thunderstorm (Deep Purple to Dark)
  return ['#0B255E', '#050B1A'];
};

export default function WeatherDetailsScreen() {
  const { lat, lon, name } = useLocalSearchParams<{ lat: string; lon: string; name: string }>();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const unit = useSettingsStore((state) => state.unit);
  const toggleUnit = useSettingsStore((state) => state.toggleUnit);
  const language = useSettingsStore((state) => state.language);

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  };

  const localeMap = { en: 'en-US', es: 'es-ES', fr: 'fr-FR' };
  const displayLocale = localeMap[language] || 'en-US';

  const loadWeather = async () => {
    try {
      setDataLoading(true);
      const data = await fetchWeather(parseFloat(lat), parseFloat(lon));
      setWeather(data);
    } catch (error) {
      console.error(error);
    } finally {
      setDataLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [lat, lon]);

  useEffect(() => {
    if (backgroundImageSrc) {
      setImageLoaded(false);
    }
  }, [backgroundImageSrc]);

  const onRefresh = () => {
    setRefreshing(true);
    loadWeather();
  };

  const getHourlyForecast = () => {
    if (!weather || !weather.hourly) return [];
    
    const currentTimeStr = weather.current.time;
    let startIndex = weather.hourly.time.indexOf(currentTimeStr);
    
    if (startIndex === -1) {
      startIndex = weather.hourly.time.findIndex(t => t >= currentTimeStr);
    }
    
    if (startIndex === -1) {
      startIndex = 0;
    }
    
    const slice = [];
    for (let i = 0; i < 24; i++) {
      const idx = startIndex + i;
      if (idx < weather.hourly.time.length) {
        slice.push({
          time: weather.hourly.time[idx],
          temp: weather.hourly.temperature[idx],
          weatherCode: weather.hourly.weatherCode[idx],
        });
      }
    }
    return slice;
  };

  const formatHour = (timeStr: string, isFirst: boolean) => {
    if (isFirst) return 'Now';
    try {
      const parts = timeStr.split('T');
      if (parts.length === 2) {
        const hourPart = parts[1].split(':')[0];
        const hourVal = parseInt(hourPart, 10);
        const ampm = hourVal >= 12 ? 'pm' : 'am';
        const displayHour = hourVal % 12 === 0 ? 12 : hourVal % 12;
        return `${displayHour}${ampm}`;
      }
    } catch (e) {
      console.error('Error formatting hour:', e);
    }
    return timeStr;
  };

  const formatDay = (timeStr: string, index: number, locale: string) => {
    try {
      const [year, month, day] = timeStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      if (index === 0) {
        return t('today');
      }
      return date.toLocaleDateString(locale, { weekday: 'long' });
    } catch (e) {
      console.error('Error formatting day:', e);
      return timeStr;
    }
  };

  const getBackgroundImage = (code: number) => {
    if (code === 0 || code === 1) {
      return require('../assets/images/sunny_bg.jpg'); // Clear / mainly clear
    } else if (code === 2 || code === 3 || code === 45 || code === 48) {
      return require('../assets/images/cloudy_bg.jpg'); // Cloudy / Fog
    } else if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
      return require('../assets/images/rainy_bg.jpg'); // Rain / Drizzle
    } else {
      return require('../assets/images/stormy_bg.jpg'); // Snow / Storm
    }
  };

  const getBackgroundOpacity = (code: number) => {
    if (code === 0 || code === 1) {
      return 0.45; // Sunny is bright and light!
    } else if (code === 2 || code === 3 || code === 45 || code === 48) {
      return 0.25; // Cloudy
    } else if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
      return 0.22; // Rainy
    } else {
      return 0.18; // Stormy
    }
  };

  const hourlyData = getHourlyForecast();
  const backgroundColors = weather ? getWeatherGradient(weather.current.weatherCode) : ['#0B255E', '#050B1A'];
  const backgroundImageSrc = weather 
    ? getBackgroundImage(weather.current.weatherCode) 
    : null;

  const isLoading = (dataLoading || !imageLoaded) && !refreshing;

  return (
    <LinearGradient colors={backgroundColors} style={styles.gradientBg}>
      {backgroundImageSrc && (
        <Image 
          source={backgroundImageSrc} 
          style={[
            styles.backgroundImage,
            { opacity: imageLoaded && weather ? getBackgroundOpacity(weather.current.weatherCode) : 0 }
          ]} 
          resizeMode="cover"
          onLoad={() => setImageLoaded(true)}
          fadeDuration={0}
        />
      )}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
        }
      >
        <Stack.Screen 
          options={{ 
            title: '', 
            headerStyle: { backgroundColor: 'transparent' },
            headerTransparent: true,
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }} 
        />
        
        {weather && (
          <>
            {/* Main Weather Section */}
            <View style={styles.weatherHeader}>
              <Text style={styles.cityText}>{name}</Text>
              <TouchableOpacity onPress={() => toggleUnit()} activeOpacity={0.7} style={styles.tempPressable}>
                <Text style={styles.tempText}>{Math.round(convertTemp(weather.current.temperature, unit))}°{unit}</Text>
              </TouchableOpacity>
              <Text style={styles.descText}>
                {t(getWeatherDescriptionKey(weather.current.weatherCode) as any)}
              </Text>
              <Text style={styles.highLowText}>
                H: {Math.round(convertTemp(weather.daily.temperatureMax[0], unit))}°  L: {Math.round(convertTemp(weather.daily.temperatureMin[0], unit))}°
              </Text>
            </View>

            {/* Hourly Forecast Section */}
            <View style={styles.glassCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="time-outline" size={15} color="#FFFFFF" />
                <Text style={styles.cardTitle}>Hourly Forecast</Text>
              </View>
              <View style={styles.divider} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hourlyScroll}
              >
                {hourlyData.map((item, idx) => (
                  <View key={item.time} style={styles.hourlyItem}>
                    <Text style={styles.hourlyTime}>{formatHour(item.time, idx === 0)}</Text>
                    <Ionicons 
                      name={getWeatherIcon(item.weatherCode) as any} 
                      size={26} 
                      color={getWeatherIconColor(item.weatherCode)} 
                      style={styles.hourlyIcon}
                    />
                    <Text style={styles.hourlyTemp}>{Math.round(convertTemp(item.temp, unit))}°</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* 7-Day Forecast Section */}
            <View style={styles.glassCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="calendar-outline" size={15} color="#FFFFFF" />
                <Text style={styles.cardTitle}>7-Day Forecast</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.dailyTable}>
                {weather.daily.time.map((time, index) => (
                  <View 
                    key={time} 
                    style={[
                      styles.dailyRow, 
                      index === weather.daily.time.length - 1 && { borderBottomWidth: 0 }
                    ]}
                  >
                    <Text style={styles.dailyDayName}>
                      {formatDay(time, index, displayLocale)}
                    </Text>
                    <View style={styles.dailyIconContainer}>
                      <Ionicons 
                        name={getWeatherIcon(weather.daily.weatherCode[index]) as any} 
                        size={22} 
                        color={getWeatherIconColor(weather.daily.weatherCode[index])} 
                      />
                    </View>
                    <View style={styles.dailyTempContainer}>
                      <Text style={styles.dailyMinTemp}>
                        {Math.round(convertTemp(weather.daily.temperatureMin[index], unit))}°
                      </Text>
                      <Text style={styles.dailyMaxTemp}>
                        {Math.round(convertTemp(weather.daily.temperatureMax[index], unit))}°
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Precipitation & Map Section */}
            <View style={styles.glassCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="umbrella-outline" size={15} color="#FFFFFF" />
                <Text style={styles.cardTitle}>Precipitation Map</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.precipDetails}>
                <Text style={styles.precipValue}>
                  {weather.current.precipitation} mm
                </Text>
                <Text style={styles.precipText}>
                  {weather.current.precipitation > 0 
                    ? `Precipitation detected: ${weather.current.precipitation} mm.` 
                    : 'No precipitation expected currently.'}
                </Text>
              </View>
              
              <View style={styles.mapContainer}>
                <Image 
                  source={{ 
                    uri: `https://static-maps.yandex.ru/1.x/?ll=${parseFloat(lon)},${parseFloat(lat)}&z=11&l=map&size=450,250&lang=${language === 'es' ? 'es_ES' : language === 'fr' ? 'fr_FR' : 'en_US'}` 
                  }} 
                  style={styles.mapImage} 
                  resizeMode="cover"
                />
                <View style={styles.mapPinContainer}>
                  <Ionicons name="location" size={30} color="#FF3B30" style={styles.mapPin} />
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0A84FF" />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 110, // Allow margin for back chevron in headerTransparent layout
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  weatherHeader: {
    alignItems: 'center',
    marginBottom: 55,
  },
  cityText: {
    fontSize: 34,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tempPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempText: {
    fontSize: 88,
    fontWeight: '100',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 96,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  descText: {
    fontSize: 21,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: 6,
    textTransform: 'capitalize',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  highLowText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
    width: '100%',
  },
  hourlyScroll: {
    paddingRight: 10,
  },
  hourlyItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    marginRight: 12,
  },
  hourlyTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  hourlyIcon: {
    marginVertical: 8,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dailyTable: {
    width: '100%',
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dailyDayName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  dailyIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  dailyTempContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 100,
  },
  dailyMinTemp: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    width: 35,
    textAlign: 'right',
  },
  dailyMaxTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    width: 35,
    textAlign: 'right',
    marginLeft: 10,
  },
  precipDetails: {
    marginBottom: 10,
  },
  precipValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  precipText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPinContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  mapPin: {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});

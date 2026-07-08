import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from '@/components/Themed';
import { searchLocations, LocationSearchResult } from '@/services/weather';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/constants/translations';

const POPULAR_CITIES: LocationSearchResult[] = [
  { id: 1, name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { id: 2, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.0060 },
  { id: 3, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278 },
];

const MORE_CITIES: LocationSearchResult[] = [
  { id: 10, name: 'Dubai', country: 'United Arab Emirates', admin1: 'Dubai', latitude: 25.2048, longitude: 55.2708 },
  { id: 11, name: 'Cairo', country: 'Egypt', admin1: 'Cairo', latitude: 30.0444, longitude: 31.2357 },
  { id: 20, name: 'Seattle', country: 'United States', admin1: 'Washington', latitude: 47.6062, longitude: -122.3321 },
  { id: 21, name: 'Reykjavik', country: 'Iceland', admin1: 'Capital Region', latitude: 64.1466, longitude: -21.9426 },
  { id: 30, name: 'Bergen', country: 'Norway', admin1: 'Vestland', latitude: 60.3913, longitude: 5.3221 },
  { id: 31, name: 'Singapore', country: 'Singapore', admin1: 'Central Singapore', latitude: 1.3521, longitude: 103.8198 },
  { id: 40, name: 'Darwin', country: 'Australia', admin1: 'Northern Territory', latitude: -12.4637, longitude: 130.8456 },
  { id: 41, name: 'Miami', country: 'United States', admin1: 'Florida', latitude: 25.7617, longitude: -80.1918 },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const language = useSettingsStore((state) => state.language);

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const data = await searchLocations(query);
          setResults(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (item: LocationSearchResult) => {
    router.push({
      pathname: '/details',
      params: { 
        lat: item.latitude.toString(), 
        lon: item.longitude.toString(), 
        name: item.name 
      }
    });
  };

  const isQueryShort = query.length < 2;
  const sections = isQueryShort 
    ? [
        { title: t('popularCities'), data: POPULAR_CITIES },
        { title: t('moreCities'), data: MORE_CITIES },
      ]
    : [
        { title: '', data: results }
      ];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={t('searchPlaceholder')}
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#8E8E93"
          autoFocus
        />
        {loading && <ActivityIndicator size="small" color="#0A84FF" />}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section: { title } }) => (
          title ? (
            <Text style={styles.sectionHeader}>{title}</Text>
          ) : null
        )}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.resultItem} 
            onPress={() => handleSelect(item)}
          >
            <View style={{ backgroundColor: 'transparent' }}>
              <Text style={styles.cityName}>{item.name}</Text>
              <Text style={styles.countryName}>
                {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          !loading && !isQueryShort ? (
            <Text style={styles.emptyText}>{t('noLocations')}</Text>
          ) : null
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  listContent: {
    paddingBottom: 120,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 24,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
    backgroundColor: 'transparent',
  },
  cityName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  countryName: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#8E8E93',
    fontSize: 16,
  },
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from '@/components/Themed';
import { searchLocations, LocationSearchResult } from '@/services/weather';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations } from '@/constants/translations';

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
        {loading && <ActivityIndicator size="small" color="#007AFF" />}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
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
          !loading && query.length >= 2 ? (
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

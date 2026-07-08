import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from '@/components/Themed';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { translations, LanguageCode } from '@/constants/translations';

export default function SettingsScreen() {
  const { user, isAuthenticated, isLoading: isAuthLoading, loginWithApple, logout } = useAuthStore();
  const { unit, setUnit, language, setLanguage, isSyncing } = useSettingsStore();

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key];
  };

  const handleUnitChange = (newUnit: 'C' | 'F') => {
    setUnit(newUnit, user?.uid);
  };

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang, user?.uid);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('account')}</Text>
        {isAuthLoading ? (
          <View style={styles.card}>
            <ActivityIndicator size="small" color="#0A84FF" style={{ padding: 12 }} />
          </View>
        ) : isAuthenticated && user ? (
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={20} color="#8E8E93" />
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{user.fullName || 'Apple User'}</Text>
                <Text style={styles.profileEmail}>{user.email || 'Private Relay Email'}</Text>
              </View>
            </View>

            <View style={styles.syncStatusCard}>
              <Ionicons 
                name={isSyncing ? "sync" : "cloud-done"} 
                size={18} 
                color={isSyncing ? "#0A84FF" : "#30D158"} 
              />
              <Text style={[styles.syncStatusText, { color: isSyncing ? "#0A84FF" : "#30D158" }]}>
                {isSyncing ? t('syncing') : t('synced')}
              </Text>
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={logout} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={16} color="#FF453A" style={{ marginRight: 6 }} />
              <Text style={styles.signOutButtonText}>{t('signOut')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.accountIntroText}>{t('signInAppleText')}</Text>
            <TouchableOpacity style={styles.appleButton} onPress={loginWithApple} activeOpacity={0.8}>
              <Ionicons name="logo-apple" size={18} color="#000000" style={{ marginRight: 8 }} />
              <Text style={styles.appleButtonText}>{t('signInApple')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('preferences')}</Text>
        <View style={styles.card}>
          {/* Temperature Unit */}
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Ionicons name="thermometer-outline" size={22} color="#0A84FF" />
            </View>
            <View style={styles.settingDetails}>
              <Text style={styles.settingLabel}>{t('tempUnit')}</Text>
              <Text style={styles.settingSublabel}>{t('tempUnitSub')}</Text>
            </View>
          </View>
          
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, unit === 'C' && styles.activeToggle]}
              onPress={() => handleUnitChange('C')}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, unit === 'C' && styles.activeToggleText]}>{t('celsius')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, unit === 'F' && styles.activeToggle]}
              onPress={() => handleUnitChange('F')}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, unit === 'F' && styles.activeToggleText]}>{t('fahrenheit')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoDivider} />

          {/* Language Selector */}
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Ionicons name="language-outline" size={22} color="#0A84FF" />
            </View>
            <View style={styles.settingDetails}>
              <Text style={styles.settingLabel}>{t('languageLabel')}</Text>
              <Text style={styles.settingSublabel}>{t('languageSub')}</Text>
            </View>
          </View>

          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, language === 'en' && styles.activeToggle]}
              onPress={() => handleLanguageChange('en')}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, language === 'en' && styles.activeToggleText]}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, language === 'es' && styles.activeToggle]}
              onPress={() => handleLanguageChange('es')}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, language === 'es' && styles.activeToggleText]}>Español</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, language === 'fr' && styles.activeToggle]}
              onPress={() => handleLanguageChange('fr')}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, language === 'fr' && styles.activeToggleText]}>Français</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('appInfo')}</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('version')}</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('dataSource')}</Text>
            <Text style={styles.infoValue}>Open-Meteo API</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingDetails: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingSublabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 3,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: '#0A84FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 4,
  },
  infoDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#2C2C2E',
    marginVertical: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#8E8E93',
  },
  infoValue: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  accountIntroText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  appleButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileDetails: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileEmail: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  syncStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  syncStatusText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  signOutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF453A',
  },
});

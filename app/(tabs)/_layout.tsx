import Tabs from 'expo-router/tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 32,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.35)',
          backgroundColor: 'rgba(255, 255, 255, 0.28)', // Translucent light white glass
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.35,
          shadowRadius: 20,
          paddingBottom: 0,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          height: 52,
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#FFFFFF',
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

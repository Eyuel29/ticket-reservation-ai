import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function OperatorTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4f46e5', // Indigo 600
        tabBarInactiveTintColor: '#64748b', // Slate 500
        tabBarStyle: {
            borderTopColor: '#e2e8f0',
            backgroundColor: '#fff',
            height: Platform.OS === 'android' ? 65 : 90,
            paddingBottom: Platform.OS === 'android' ? 10 : 30,
            paddingTop: 5,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan Ticket',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Operator',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
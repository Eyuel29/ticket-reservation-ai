import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1e293b',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Venue Access', headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ title: 'Login', headerShown: false }} />
          
          {/* Delegate customer navigation to app/customer/_layout.tsx */}
          <Stack.Screen name="customer" options={{ headerShown: false }} />

          <Stack.Screen name="operator/scanner" options={{ title: 'Scan Ticket', presentation: 'modal' }} />
          <Stack.Screen name="operator/result" options={{ title: 'Validation Result', presentation: 'modal' }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
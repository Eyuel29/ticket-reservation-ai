import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#0f172a',
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
        headerBackTitle: "",
        contentStyle: { backgroundColor: '#f8fafc' },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ticket/[id]" options={{ title: 'Ticket Details' }} />
      <Stack.Screen name="reserve" options={{ title: 'Reserve Slot' }} />
    </Stack>
  );
}
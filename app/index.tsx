import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-between">
      <StatusBar style="light" />
      
      {/* Hero Section */}
      <View className="flex-1 px-8 justify-center items-center">
        <View className="bg-indigo-600/20 p-6 rounded-full mb-8">
            <Ionicons name="qr-code-outline" size={64} color="#818cf8" />
        </View>
        <Text className="text-5xl font-black text-white text-center tracking-tight mb-2">
          Venue<Text className="text-indigo-500">Access</Text>
        </Text>
        <Text className="text-slate-400 text-center text-lg leading-6 max-w-xs">
          Seamless ticket activation & entry validation for modern events.
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="px-6 pb-12 gap-y-4">
        <TouchableOpacity
          onPress={() => router.push('/auth/login?type=customer')}
          className="bg-indigo-600 py-5 rounded-3xl shadow-lg shadow-indigo-500/30 flex-row justify-center items-center"
        >
          <Text className="text-white text-lg font-bold mr-2">
            Enter as Customer
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/auth/login?type=operator')}
          className="bg-slate-800 py-5 rounded-3xl border border-slate-700 flex-row justify-center items-center"
        >
          <Text className="text-slate-200 text-lg font-bold">
            Operator Access
          </Text>
        </TouchableOpacity>

        <Text className="text-slate-600 text-center text-xs mt-4">
          v1.0.0 • Secure Entry System
        </Text>
      </View>
    </SafeAreaView>
  );
}
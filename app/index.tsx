import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <StatusBar style="light" />
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-4xl font-extrabold text-white mb-2 text-center">
          Venue<Text className="text-blue-500">Access</Text>
        </Text>
        <Text className="text-slate-400 text-center mb-12">
          Secure Ticket Activation & Validation System
        </Text>

        <View className="w-full gap-y-4">
          <TouchableOpacity
            onPress={() => router.push('/auth/login?type=customer')}
            className="bg-blue-600 p-6 rounded-2xl active:bg-blue-700"
          >
            <Text className="text-white text-xl font-bold text-center">
              Enter as Customer
            </Text>
            <Text className="text-blue-100 text-center mt-1">
              Activate tickets & Book slots
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/auth/login?type=operator')}
            className="bg-slate-700 p-6 rounded-2xl active:bg-slate-600 border border-slate-600"
          >
            <Text className="text-white text-xl font-bold text-center">
              Enter as Operator
            </Text>
            <Text className="text-slate-300 text-center mt-1">
              Scan & Validate Entry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
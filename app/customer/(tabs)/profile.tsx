import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/auth/login?type=customer');
  };

  return (
    <View className="flex-1 bg-slate-50 p-6">
      <View className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 items-center">
        <View className="w-20 h-20 bg-blue-100 rounded-full justify-center items-center mb-4">
            <Text className="text-2xl text-blue-600 font-bold">JD</Text>
        </View>
        <Text className="text-xl font-bold text-slate-800">John Doe</Text>
        <Text className="text-slate-500">customer@example.com</Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-white border border-red-200 p-4 rounded-xl flex-row justify-center items-center"
      >
        <Text className="text-red-600 font-bold">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
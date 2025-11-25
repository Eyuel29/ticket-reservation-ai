import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OperatorProfile() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/auth/login?type=operator');
  };

  return (
    <View className="flex-1 bg-slate-50 p-6 pt-16">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-slate-900">Operator Portal</Text>
        <Text className="text-slate-500">Manage venue entry and validation</Text>
      </View>

      <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 flex-row items-center">
        <View className="w-16 h-16 bg-indigo-100 rounded-full justify-center items-center mr-4">
            <Ionicons name="shield-checkmark" size={32} color="#4f46e5" />
        </View>
        <View>
            <Text className="text-xl font-bold text-slate-800">Gate Staff #04</Text>
            <Text className="text-slate-500">North Entrance</Text>
        </View>
      </View>

      <View className="flex-1">
        {/* Placeholder stats or settings */}
        <View className="flex-row justify-between mb-4">
            <View className="bg-white p-4 rounded-2xl flex-1 mr-2 shadow-sm border border-slate-100 items-center">
                <Text className="text-2xl font-bold text-slate-900">142</Text>
                <Text className="text-xs text-slate-400 font-bold uppercase">Scans Today</Text>
            </View>
            <View className="bg-white p-4 rounded-2xl flex-1 ml-2 shadow-sm border border-slate-100 items-center">
                <Text className="text-2xl font-bold text-emerald-600">98%</Text>
                <Text className="text-xs text-slate-400 font-bold uppercase">Valid Rate</Text>
            </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-white border border-red-200 py-4 rounded-2xl flex-row justify-center items-center mb-8"
      >
        <Ionicons name="log-out-outline" size={20} color="#dc2626" style={{ marginRight: 8 }} />
        <Text className="text-red-600 font-bold text-lg">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: 'customer' | 'operator' }>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    // Mock Authentication Logic
    if (type === 'operator') {
      router.replace('/operator/scanner');
    } else {
      router.replace('/customer/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 p-8 justify-center">
        <Text className="text-3xl font-bold text-slate-900 mb-2">
          {type === 'operator' ? 'Operator Login' : 'Customer Login'}
        </Text>
        <Text className="text-slate-500 mb-8">
          Sign in to access your {type === 'operator' ? 'dashboard' : 'tickets'}
        </Text>

        <View className="gap-y-4">
          <View>
            <Text className="text-slate-700 font-medium mb-1 ml-1">Email</Text>
            <TextInput
              className="bg-white border border-slate-200 p-4 rounded-xl text-slate-800"
              placeholder="name@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-slate-700 font-medium mb-1 ml-1">Password</Text>
            <TextInput
              className="bg-white border border-slate-200 p-4 rounded-xl text-slate-800"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-blue-600 p-4 rounded-xl items-center mt-4"
          >
            <Text className="text-white font-bold text-lg">Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} className="items-center mt-4">
            <Text className="text-slate-500">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
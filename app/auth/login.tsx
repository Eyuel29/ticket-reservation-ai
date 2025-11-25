import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: 'customer' | 'operator' }>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password to continue.');
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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8">
            <View className="flex-1 justify-center">
                <TouchableOpacity onPress={() => router.back()} className="mb-8 w-10 h-10 bg-slate-50 rounded-full justify-center items-center">
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>

                <Text className="text-3xl font-bold text-slate-900 mb-2">
                {type === 'operator' ? 'Operator Portal' : 'Welcome Back'}
                </Text>
                <Text className="text-slate-500 text-base mb-10">
                Sign in to {type === 'operator' ? 'start validating tickets' : 'manage your bookings'}.
                </Text>

                <View className="gap-y-5">
                    <View>
                        <Text className="text-slate-700 font-semibold mb-2 ml-1">Email Address</Text>
                        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:border-indigo-500 focus:bg-white">
                            <Ionicons name="mail-outline" size={20} color="#64748b" style={{marginRight: 10}} />
                            <TextInput
                                className="flex-1 text-slate-900 text-base"
                                placeholder="name@example.com"
                                placeholderTextColor="#94a3b8"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-slate-700 font-semibold mb-2 ml-1">Password</Text>
                        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:border-indigo-500 focus:bg-white">
                            <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={{marginRight: 10}} />
                            <TextInput
                                className="flex-1 text-slate-900 text-base"
                                placeholder="••••••••"
                                placeholderTextColor="#94a3b8"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        className="bg-indigo-600 py-4 rounded-2xl items-center shadow-lg shadow-indigo-500/20 mt-4 active:scale-95 transition-transform"
                    >
                        <Text className="text-white font-bold text-lg">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
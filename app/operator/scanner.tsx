import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900 p-8">
        <Ionicons name="camera-outline" size={64} color="white" style={{marginBottom: 20}} />
        <Text className="text-white text-center text-xl font-bold mb-4">
          Camera Access Required
        </Text>
        <Text className="text-slate-400 text-center mb-8">
            We need camera access to scan ticket QR codes.
        </Text>
        <TouchableOpacity onPress={requestPermission} className="bg-indigo-600 px-8 py-3 rounded-full">
            <Text className="text-white font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    router.replace({
        pathname: '/operator/result',
        params: { ticketCode: data }
    });
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <CameraView 
        style={StyleSheet.absoluteFillObject} 
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
            barcodeTypes: ["qr"],
        }}
      />
      
      {/* Modern Overlay */}
      <View className="flex-1 justify-between pb-10 pt-16 px-6">
        <View className="items-center">
            <View className="bg-black/60 px-4 py-2 rounded-full border border-white/10">
                <Text className="text-white font-medium">Point camera at ticket QR code</Text>
            </View>
        </View>

        <View className="items-center">
             <View className="w-72 h-72 border-2 border-indigo-500 rounded-3xl bg-transparent relative opacity-80">
                <View className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-xl -mt-1 -ml-1" />
                <View className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-xl -mt-1 -mr-1" />
                <View className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-xl -mb-1 -ml-1" />
                <View className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-xl -mb-1 -mr-1" />
             </View>
        </View>

        <TouchableOpacity 
            onPress={() => router.back()}
            className="self-center bg-white/20 p-4 rounded-full backdrop-blur-md"
        >
             <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
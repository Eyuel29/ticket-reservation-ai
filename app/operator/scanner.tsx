import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-center items-center bg-slate-900 p-6">
        <Text className="text-white text-center text-lg mb-6">
          We need your permission to use the camera for ticket scanning.
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    // Navigate to result screen with the code
    router.replace({
        pathname: '/operator/result',
        params: { ticketCode: data }
    });
  };

  return (
    <View className="flex-1 justify-center bg-black">
      <CameraView 
        style={StyleSheet.absoluteFillObject} 
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
            barcodeTypes: ["qr"],
        }}
      />
      
      {/* Overlay UI */}
      <View className="flex-1 bg-transparent">
        <View className="flex-1 bg-black/50" />
        <View className="flex-row h-64">
           <View className="flex-1 bg-black/50" />
           <View className="w-64 h-64 border-2 border-white bg-transparent rounded-lg justify-center items-center">
             <Text className="text-white/70 font-bold">Align QR Code</Text>
           </View>
           <View className="flex-1 bg-black/50" />
        </View>
        <View className="flex-1 bg-black/50 justify-center items-center">
             <Text className="text-white text-lg">Scanning...</Text>
        </View>
      </View>
    </View>
  );
}

import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { validateTicketScan } from '../../services/mockData';
import { useApp } from '../../context/AppContext';
import { Ticket } from '../../types';
import clsx from 'clsx';
import { Ionicons } from '@expo/vector-icons'; // Built-in with Expo

export default function ScanResult() {
  const { ticketCode } = useLocalSearchParams<{ ticketCode: string }>();
  const router = useRouter();
  const { refreshTickets } = useApp(); // Used to trigger global update if verified

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{valid: boolean; reason: string; ticket?: Ticket} | null>(null);

  useEffect(() => {
    // Simulate API verification delay
    setTimeout(() => {
       if (ticketCode) {
         const res = validateTicketScan(ticketCode);
         setResult(res);
         if (res.valid) {
             refreshTickets(); // Sync global state
         }
         setLoading(false);
       }
    }, 1000);
  }, [ticketCode]);

  const handleScanNext = () => {
    router.replace('/operator/scanner');
  };

  if (loading) {
    return (
        <View className="flex-1 justify-center items-center bg-slate-900">
            <ActivityIndicator size="large" color="#fff" />
            <Text className="text-white mt-4">Validating Ticket...</Text>
        </View>
    )
  }

  const isSuccess = result?.valid;
  const isWarning = !result?.valid && result?.ticket; // It exists but invalid state
  const isError = !result?.ticket; // Not found

  const bgColor = isSuccess ? 'bg-green-600' : (isWarning ? 'bg-orange-500' : 'bg-red-600');
  const iconName = isSuccess ? 'checkmark-circle' : 'alert-circle';

  return (
    <View className={clsx("flex-1 p-6 items-center justify-center", bgColor)}>
        <Ionicons name={iconName} size={100} color="white" />
        
        <Text className="text-3xl font-extrabold text-white mt-6 mb-2 text-center">
            {isSuccess ? "ACCESS GRANTED" : "ACCESS DENIED"}
        </Text>
        
        <Text className="text-white/90 text-xl text-center mb-8 font-medium">
            {result?.reason}
        </Text>

        {result?.ticket && (
            <View className="bg-white/90 w-full p-6 rounded-2xl mb-8">
                <Text className="text-xs text-slate-500 uppercase font-bold mb-1">Event</Text>
                <Text className="text-lg font-bold text-slate-900 mb-4">{result.ticket.eventName}</Text>

                <View className="flex-row justify-between mb-2">
                    <Text className="text-slate-500">Customer:</Text>
                    <Text className="font-bold text-slate-800">{result.ticket.customerName}</Text>
                </View>
                
                {result.ticket.reservation && (
                    <View className="flex-row justify-between mb-2">
                         <Text className="text-slate-500">Slot:</Text>
                         <Text className="font-bold text-slate-800">
                             {result.ticket.reservation.startTime} - {result.ticket.reservation.endTime}
                         </Text>
                    </View>
                )}
                 <View className="flex-row justify-between">
                     <Text className="text-slate-500">Status:</Text>
                     <Text className="font-bold text-slate-800">{result.ticket.status}</Text>
                </View>
            </View>
        )}

        <TouchableOpacity 
            onPress={handleScanNext}
            className="bg-white w-full py-4 rounded-xl items-center"
        >
            <Text className={clsx("font-bold text-lg", isSuccess ? "text-green-700" : "text-red-700")}>
                Scan Next Ticket
            </Text>
        </TouchableOpacity>
        
        {!isSuccess && result?.ticket && (
            <TouchableOpacity 
                onPress={() => alert('Override functionality would trigger Supervisor PIN entry.')}
                className="mt-4"
            >
                <Text className="text-white/80 underline text-sm">Manual Override</Text>
            </TouchableOpacity>
        )}
    </View>
  );
}

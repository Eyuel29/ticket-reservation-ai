import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { validateTicketScan } from '../../services/mockData';
import { useApp } from '../../context/AppContext';
import { Ticket } from '../../types';
import clsx from 'clsx';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function ScanResult() {
  const { ticketCode } = useLocalSearchParams<{ ticketCode: string }>();
  const router = useRouter();
  const { refreshTickets } = useApp();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{valid: boolean; reason: string; ticket?: Ticket} | null>(null);

  useEffect(() => {
    // Simulate processing delay
    const timer = setTimeout(() => {
       if (ticketCode) {
         const res = validateTicketScan(ticketCode);
         setResult(res);
         if (res.valid) {
             refreshTickets();
         }
         setLoading(false);
       }
    }, 800);
    return () => clearTimeout(timer);
  }, [ticketCode]);

  const handleScanNext = () => {
    // Since this is a modal, dismissing it returns to the underlying scanner tab
    if (router.canDismiss()) {
        router.dismiss();
    } else {
        router.replace('/operator/(tabs)');
    }
  };

  if (loading) {
    return (
        <View className="flex-1 justify-center items-center bg-slate-900">
            <StatusBar style="light" />
            <ActivityIndicator size="large" color="#818cf8" />
            <Text className="text-indigo-200 mt-4 font-medium">Verifying Ticket...</Text>
        </View>
    )
  }

  const isSuccess = result?.valid;
  const isWarning = !result?.valid && result?.ticket;
  
  // Dynamic Styles
  const bgClass = isSuccess ? 'bg-emerald-600' : (isWarning ? 'bg-amber-500' : 'bg-rose-600');
  const iconName = isSuccess ? 'checkmark-circle' : 'alert-circle';

  return (
    <View className={clsx("flex-1 px-8 justify-center", bgClass)}>
        <StatusBar style="light" />
        <View className="items-center mb-8">
            <Ionicons name={iconName} size={120} color="white" style={{ opacity: 0.9 }} />
            <Text className="text-4xl font-black text-white mt-4 text-center tracking-tight">
                {isSuccess ? "ACCESS GRANTED" : "ACCESS DENIED"}
            </Text>
            <Text className="text-white/80 text-lg text-center mt-2 font-medium">
                {result?.reason}
            </Text>
        </View>

        {result?.ticket && (
            <View className="bg-white rounded-3xl p-6 shadow-2xl mb-8">
                <Text className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Event</Text>
                <Text className="text-xl font-bold text-slate-900 mb-4">{result.ticket.eventName}</Text>

                <View className="flex-row justify-between mb-3 border-b border-slate-100 pb-3">
                    <Text className="text-slate-500 font-medium">Guest Name</Text>
                    <Text className="font-bold text-slate-800">{result.ticket.customerName}</Text>
                </View>
                
                {result.ticket.reservation && (
                    <View className="flex-row justify-between mb-3 border-b border-slate-100 pb-3">
                         <Text className="text-slate-500 font-medium">Time Slot</Text>
                         <Text className="font-bold text-slate-800">
                             {result.ticket.reservation.startTime} - {result.ticket.reservation.endTime}
                         </Text>
                    </View>
                )}
                 <View className="flex-row justify-between">
                     <Text className="text-slate-500 font-medium">Status</Text>
                     <Text className={clsx("font-bold", 
                        result.ticket.status === 'VERIFIED' ? 'text-emerald-600' : 'text-slate-800'
                     )}>
                         {result.ticket.status}
                     </Text>
                </View>
            </View>
        )}

        <TouchableOpacity 
            onPress={handleScanNext}
            className="bg-white/20 py-5 rounded-2xl items-center border border-white/30 active:bg-white/30"
        >
            <Text className="text-white font-bold text-lg">
                Scan Next Ticket
            </Text>
        </TouchableOpacity>
    </View>
  );
}
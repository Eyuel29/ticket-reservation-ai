import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { useEffect, useState } from 'react';
import { getAvailableSlots, reserveTicket } from '../../services/mockData';
import { Slot } from '../../types';
import { useApp } from '../../context/AppContext';
import clsx from 'clsx';
import { Ionicons } from '@expo/vector-icons';

export default function ReserveScreen() {
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  const router = useRouter();
  const { refreshTickets } = useApp();

  const [selectedDate, setSelectedDate] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      setSelectedSlot(null);
      getAvailableSlots(selectedDate)
        .then(setSlots)
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate]);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot || !ticketId) return;

    setSubmitting(true);
    try {
      await reserveTicket(ticketId, selectedDate, selectedSlot);
      await refreshTickets();
      Alert.alert('Confirmed!', 'Your spot has been reserved successfully.', [
        { 
            text: 'View Ticket', 
            onPress: () => {
                if (router.canDismiss()) {
                    router.dismissAll();
                }
                router.replace('/customer/(tabs)');
            } 
        }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to make reservation');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
        
        {/* Step 1: Calendar */}
        <View className="mb-8">
            <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
                    <Text className="text-indigo-600 font-bold">1</Text>
                </View>
                <Text className="text-xl font-bold text-slate-900">Choose Date</Text>
            </View>
            
            <View className="bg-white rounded-3xl shadow-sm shadow-slate-200 overflow-hidden border border-slate-100">
                <Calendar
                    minDate={today}
                    onDayPress={(day: any) => setSelectedDate(day.dateString)}
                    markedDates={{
                        [selectedDate]: { 
                            selected: true, 
                            selectedColor: '#4f46e5',
                            selectedTextColor: 'white'
                        }
                    }}
                    theme={{
                        todayTextColor: '#4f46e5',
                        arrowColor: '#1e293b',
                        textDayFontWeight: '600',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '500',
                        textDayFontSize: 16,
                    }}
                />
            </View>
        </View>

        {/* Step 2: Time Slots */}
        {selectedDate && (
            <View className="mb-8">
                <View className="flex-row items-center mb-4">
                    <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
                        <Text className="text-indigo-600 font-bold">2</Text>
                    </View>
                    <Text className="text-xl font-bold text-slate-900">
                        Choose Time <Text className="text-sm font-normal text-slate-500">for {selectedDate}</Text>
                    </Text>
                </View>
            
                {loadingSlots ? (
                    <View className="p-8 justify-center items-center bg-white rounded-2xl border border-slate-100">
                        <ActivityIndicator size="large" color="#4f46e5" />
                        <Text className="text-slate-400 mt-2 text-sm">Loading availability...</Text>
                    </View>
                ) : (
                    <View className="flex-row flex-wrap justify-between"> 
                    {slots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;
                        const isFull = slot.bookedCount >= slot.totalCapacity;
                        
                        return (
                        <TouchableOpacity
                            key={slot.id}
                            disabled={isFull}
                            onPress={() => setSelectedSlot(slot)}
                            className={clsx(
                                "w-[48%] p-4 rounded-2xl border-2 mb-3",
                                isSelected ? "border-indigo-500 bg-indigo-50" : "border-transparent bg-white shadow-sm shadow-slate-200",
                                isFull && "opacity-50 bg-slate-100 shadow-none border-slate-100"
                            )}
                        >
                            <Text className={clsx("font-bold text-base", isSelected ? "text-indigo-700" : "text-slate-800")}>
                                {slot.startTime}
                            </Text>
                            <Text className="text-xs text-slate-500 mt-1 font-medium">{slot.label}</Text>
                            <Text className={clsx("text-[10px] mt-2 font-bold uppercase", isFull ? "text-red-500" : "text-emerald-600")}>
                                {isFull ? "Full" : `${slot.totalCapacity - slot.bookedCount} left`}
                            </Text>
                        </TouchableOpacity>
                        )
                    })}
                    </View>
                )}
            </View>
        )}

       {/* Step 3: Confirmation */}
       {selectedDate && selectedSlot && (
            <View className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-indigo-500/10 mt-2">
                <Text className="text-lg font-bold text-slate-900 mb-4">Summary</Text>
                
                <View className="flex-row items-center mb-6">
                    <View className="flex-1">
                        <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Date</Text>
                        <Text className="font-bold text-slate-800 text-lg">{selectedDate}</Text>
                    </View>
                    <View className="w-[1px] h-8 bg-slate-200 mx-4" />
                    <View className="flex-1">
                        <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Time</Text>
                        <Text className="font-bold text-slate-800 text-lg">{selectedSlot.startTime} - {selectedSlot.endTime}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={submitting}
                    className={clsx(
                        "w-full py-4 rounded-2xl items-center flex-row justify-center",
                        submitting ? "bg-slate-300" : "bg-indigo-600 shadow-lg shadow-indigo-500/30"
                    )}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-white font-bold text-lg mr-2">Confirm Reservation</Text>
                            <Ionicons name="checkmark-circle" size={20} color="white" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
       )}
    </ScrollView>
  );
}
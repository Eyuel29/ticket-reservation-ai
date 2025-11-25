import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { useEffect, useState } from 'react';
import { getAvailableSlots, reserveTicket } from '../../services/mockData';
import { Slot } from '../../types';
import { useApp } from '../../context/AppContext';
import clsx from 'clsx';

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
      Alert.alert('Success', 'Reservation Confirmed!', [
        { 
            text: 'OK', 
            onPress: () => {
                // Redirect to Home (Dashboard)
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
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text className="text-xl font-bold text-slate-800 mb-4">1. Choose Date</Text>
        <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            <Calendar
            minDate={today}
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#3b82f6' }
            }}
            theme={{
                todayTextColor: '#3b82f6',
                arrowColor: '#3b82f6',
            }}
            />
        </View>

        {selectedDate && (
            <View className="mb-6">
            <Text className="text-xl font-bold text-slate-800 mb-4">
                2. Choose Time <Text className="text-sm font-normal text-slate-500">for {selectedDate}</Text>
            </Text>
            
            {loadingSlots ? (
                <View className="p-8 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : (
                <View className="flex-row flex-wrap gap-2"> 
                {slots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    const isFull = slot.bookedCount >= slot.totalCapacity;
                    
                    return (
                    <TouchableOpacity
                        key={slot.id}
                        disabled={isFull}
                        onPress={() => setSelectedSlot(slot)}
                        className={clsx(
                        "w-[48%] p-4 rounded-xl border-2 mb-2",
                        isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white",
                        isFull && "opacity-50 bg-slate-100"
                        )}
                    >
                        <Text className={clsx("font-bold", isSelected ? "text-blue-700" : "text-slate-800")}>
                        {slot.startTime} - {slot.endTime}
                        </Text>
                        <Text className="text-xs text-slate-500 mt-1">{slot.label}</Text>
                        <Text className={clsx("text-xs mt-2", isFull ? "text-red-500" : "text-green-600")}>
                        {isFull ? "Full" : `${slot.totalCapacity - slot.bookedCount} spots left`}
                        </Text>
                    </TouchableOpacity>
                    )
                })}
                </View>
            )}
            </View>
        )}

       {/* Confirmation Section moved here (under time selection) */}
       {selectedDate && selectedSlot && (
            <View className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-4">
                <Text className="text-lg font-bold text-slate-800 mb-4">3. Confirm Reservation</Text>
                
                <View className="bg-slate-50 p-4 rounded-xl mb-6">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-slate-500">Date:</Text>
                        <Text className="font-bold text-slate-900">{selectedDate}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-slate-500">Time Slot:</Text>
                        <Text className="font-bold text-slate-900">{selectedSlot.startTime} - {selectedSlot.endTime}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={submitting}
                    className={clsx(
                        "w-full py-4 rounded-xl items-center",
                        submitting ? "bg-slate-400" : "bg-blue-600"
                    )}
                >
                    <Text className="text-white font-bold text-lg">
                        {submitting ? 'Confirming...' : 'Confirm Reservation'}
                    </Text>
                </TouchableOpacity>
            </View>
       )}
    </ScrollView>
  );
}
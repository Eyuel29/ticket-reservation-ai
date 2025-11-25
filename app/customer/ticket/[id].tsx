import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';
import { TicketStatus } from '../../types';
import QRCode from 'react-native-qrcode-svg';
import { activateTicket } from '../../services/mockData';
import { useState } from 'react';

export default function TicketDetail() {
  const { id } = useLocalSearchParams();
  const { tickets, refreshTickets } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Ticket not found</Text>
      </View>
    );
  }

  const handleActivate = async () => {
    setLoading(true);
    try {
      await activateTicket(ticket.id);
      await refreshTickets();
      Alert.alert('Success', 'Ticket Activated! You can now reserve a time slot.');
    } catch (e) {
      Alert.alert('Error', 'Failed to activate ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = () => {
    router.push({
      pathname: '/customer/reserve',
      params: { ticketId: ticket.id }
    });
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="p-6">
        {/* Ticket Card */}
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <View className="items-center mb-6">
             <View className="mb-4">
                <StatusBadge status={ticket.status} />
             </View>
             
             {ticket.status === TicketStatus.RESERVED || ticket.status === TicketStatus.VERIFIED ? (
               <View className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                 <QRCode value={ticket.ticketCode} size={200} />
                 <Text className="text-center text-xs text-slate-400 mt-2">{ticket.ticketCode}</Text>
               </View>
             ) : (
               <View className="w-48 h-48 bg-slate-100 rounded-xl justify-center items-center border-2 border-dashed border-slate-300">
                 <Text className="text-slate-400 text-center px-4">
                   {ticket.status === TicketStatus.INACTIVE 
                     ? "Activate to generate QR" 
                     : "Reserve a slot to generate QR"}
                 </Text>
               </View>
             )}
          </View>

          <Text className="text-2xl font-bold text-slate-900 text-center mb-1">{ticket.eventName}</Text>
          <Text className="text-slate-500 text-center mb-6">{ticket.venue}</Text>

          <View className="space-y-4">
            <View className="flex-row justify-between border-b border-slate-100 pb-3">
              <Text className="text-slate-500">Customer</Text>
              <Text className="font-medium text-slate-800">{ticket.customerName}</Text>
            </View>
            <View className="flex-row justify-between border-b border-slate-100 pb-3">
              <Text className="text-slate-500">Purchased</Text>
              <Text className="font-medium text-slate-800">{ticket.purchaseDate}</Text>
            </View>
            {ticket.reservation && (
              <>
                <View className="flex-row justify-between border-b border-slate-100 pb-3">
                  <Text className="text-slate-500">Date</Text>
                  <Text className="font-medium text-blue-600">{ticket.reservation.date}</Text>
                </View>
                <View className="flex-row justify-between border-b border-slate-100 pb-3">
                  <Text className="text-slate-500">Time</Text>
                  <Text className="font-medium text-blue-600">
                    {ticket.reservation.startTime} - {ticket.reservation.endTime}
                  </Text>
                </View>
                <View className="flex-row justify-between pb-3">
                  <Text className="text-slate-500">Slot Type</Text>
                  <Text className="font-medium text-slate-800">{ticket.reservation.slotLabel}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-y-4">
          {ticket.status === TicketStatus.INACTIVE && (
            <TouchableOpacity
              onPress={handleActivate}
              disabled={loading}
              className={`bg-blue-600 p-4 rounded-xl items-center ${loading ? 'opacity-50' : ''}`}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? 'Activating...' : 'Activate Ticket'}
              </Text>
            </TouchableOpacity>
          )}

          {ticket.status === TicketStatus.ACTIVE && (
            <TouchableOpacity
              onPress={handleReserve}
              className="bg-purple-600 p-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-lg">Select Date & Time</Text>
            </TouchableOpacity>
          )}

          {ticket.status === TicketStatus.RESERVED && (
            <TouchableOpacity
              onPress={handleReserve}
              className="bg-white border border-purple-600 p-4 rounded-xl items-center"
            >
              <Text className="text-purple-600 font-bold text-lg">Change Reservation</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

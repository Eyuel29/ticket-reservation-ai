import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';
import { TicketStatus } from '../../types';
import QRCode from 'react-native-qrcode-svg';
import { activateTicket } from '../../services/mockData';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';

export default function TicketDetail() {
  const { id } = useLocalSearchParams();
  const { tickets, refreshTickets } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <Text className="text-slate-500">Ticket not found</Text>
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
    <ScrollView className="flex-1 bg-slate-100" contentContainerStyle={{ padding: 24 }}>
      {/* Visual Ticket Container */}
      <View className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8">
        {/* Ticket Header Image Placeholder / Pattern */}
        <View className="h-32 bg-indigo-600 justify-center items-center relative overflow-hidden">
            <View className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500 rounded-full opacity-50" />
            <View className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-400 rounded-full opacity-30" />
            <Ionicons name="ticket-outline" size={48} color="white" style={{ opacity: 0.8 }} />
        </View>

        <View className="p-6">
            <View className="flex-row justify-between items-start mb-6">
                <View className="flex-1 mr-2">
                    <Text className="text-2xl font-bold text-slate-900 leading-tight mb-2">{ticket.eventName}</Text>
                    <View className="flex-row items-center">
                        <Ionicons name="location-sharp" size={16} color="#64748b" />
                        <Text className="text-slate-500 font-medium ml-1">{ticket.venue}</Text>
                    </View>
                </View>
                <StatusBadge status={ticket.status} />
            </View>

            {/* Dashed Line */}
            <View className="flex-row items-center my-6 overflow-hidden">
                <View className="h-[1px] bg-slate-200 flex-1 border-dashed border-slate-300 border-t" style={{borderStyle: 'dashed', borderWidth: 1, borderColor: '#e2e8f0'}} />
            </View>

            {/* Details Grid */}
            <View className="flex-row flex-wrap">
                <View className="w-1/2 mb-4">
                    <Text className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Customer</Text>
                    <Text className="text-slate-800 font-semibold">{ticket.customerName}</Text>
                </View>
                <View className="w-1/2 mb-4">
                    <Text className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Purchased</Text>
                    <Text className="text-slate-800 font-semibold">{ticket.purchaseDate}</Text>
                </View>
                {ticket.reservation && (
                    <>
                        <View className="w-1/2 mb-4">
                            <Text className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Date</Text>
                            <Text className="text-indigo-600 font-bold">{ticket.reservation.date}</Text>
                        </View>
                        <View className="w-1/2 mb-4">
                            <Text className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time</Text>
                            <Text className="text-indigo-600 font-bold">{ticket.reservation.startTime} - {ticket.reservation.endTime}</Text>
                        </View>
                    </>
                )}
            </View>

            {/* QR Code Section */}
            <View className="mt-4 items-center bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                {ticket.status === TicketStatus.RESERVED || ticket.status === TicketStatus.VERIFIED ? (
                <>
                    <QRCode value={ticket.ticketCode} size={180} />
                    <Text className="text-center text-xs text-slate-400 mt-4 font-mono">{ticket.ticketCode}</Text>
                </>
                ) : (
                <View className="h-40 justify-center items-center">
                    <Ionicons name="qr-code-outline" size={64} color="#cbd5e1" />
                    <Text className="text-slate-400 text-center text-sm mt-2 max-w-[200px]">
                    {ticket.status === TicketStatus.INACTIVE 
                        ? "Activate to generate your entry code" 
                        : "Book a time slot to see your QR code"}
                    </Text>
                </View>
                )}
            </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="pb-10">
        {ticket.status === TicketStatus.INACTIVE && (
          <TouchableOpacity
            onPress={handleActivate}
            disabled={loading}
            className={`bg-indigo-600 py-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-indigo-500/20 ${loading ? 'opacity-80' : ''}`}
          >
            {loading ? <ActivityIndicator color="white" /> : (
                <>
                    <Ionicons name="flash" size={20} color="white" style={{marginRight: 8}} />
                    <Text className="text-white font-bold text-lg">Activate Ticket</Text>
                </>
            )}
          </TouchableOpacity>
        )}

        {ticket.status === TicketStatus.ACTIVE && (
          <TouchableOpacity
            onPress={handleReserve}
            className="bg-indigo-600 py-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-indigo-500/20"
          >
            <Ionicons name="calendar" size={20} color="white" style={{marginRight: 8}} />
            <Text className="text-white font-bold text-lg">Select Date & Time</Text>
          </TouchableOpacity>
        )}

        {ticket.status === TicketStatus.RESERVED && (
          <TouchableOpacity
            onPress={handleReserve}
            className="bg-white border border-indigo-200 py-4 rounded-2xl flex-row justify-center items-center"
          >
            <Text className="text-indigo-600 font-bold text-lg">Change Reservation</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
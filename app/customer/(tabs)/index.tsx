import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../../context/AppContext';
import StatusBadge from '../../../components/StatusBadge';
import { Ticket, TicketStatus } from '../../../types';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';

export default function Dashboard() {
  const router = useRouter();
  const { tickets, refreshTickets } = useApp();

  const renderItem = ({ item }: { item: Ticket }) => (
    <TouchableOpacity
      onPress={() => router.push(`/customer/ticket/${item.id}`)}
      activeOpacity={0.9}
      className="bg-white mx-6 mb-6 rounded-3xl shadow-sm shadow-slate-200 overflow-hidden"
    >
        {/* Card Header Gradient Strip */}
        <View className={clsx("h-2 w-full", 
            item.status === TicketStatus.ACTIVE ? "bg-indigo-500" : 
            item.status === TicketStatus.RESERVED ? "bg-violet-500" :
            item.status === TicketStatus.VERIFIED ? "bg-emerald-500" : "bg-slate-300"
        )} />

        <View className="p-5">
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-4">
                    <Text className="text-lg font-bold text-slate-900 leading-6 mb-1">
                        {item.eventName}
                    </Text>
                    <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={14} color="#64748b" />
                        <Text className="text-slate-500 text-sm ml-1 font-medium">{item.venue}</Text>
                    </View>
                </View>
                <StatusBadge status={item.status} />
            </View>

            <View className="border-t border-slate-100 pt-4 flex-row items-center justify-between">
                {item.status === TicketStatus.RESERVED || item.status === TicketStatus.VERIFIED ? (
                    <View className="flex-row items-center bg-violet-50 px-3 py-1.5 rounded-lg">
                        <Ionicons name="calendar" size={14} color="#7c3aed" />
                        <Text className="text-violet-700 text-xs font-bold ml-2">
                            {item.reservation?.date} • {item.reservation?.startTime}
                        </Text>
                    </View>
                ) : item.status === TicketStatus.INACTIVE ? (
                    <Text className="text-xs text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-lg">
                        Tap to Activate
                    </Text>
                ) : (
                    <View className="flex-row items-center">
                        <Text className="text-xs text-indigo-600 font-bold mr-1">Book your slot</Text>
                        <Ionicons name="arrow-forward" size={12} color="#4f46e5" />
                    </View>
                )}
                
                <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshTickets} tintColor="#4f46e5" />
        }
        ListHeaderComponent={
          <View className="px-6 mb-4">
            <Text className="text-3xl font-bold text-slate-900">My Tickets</Text>
            <Text className="text-slate-500 font-medium">Manage your upcoming events</Text>
          </View>
        }
      />
    </View>
  );
}
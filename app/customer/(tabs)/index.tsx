import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../../context/AppContext';
import StatusBadge from '../../../components/StatusBadge';
import { Ticket, TicketStatus } from '../../../types';

export default function Dashboard() {
  const router = useRouter();
  const { tickets, refreshTickets } = useApp();

  const renderItem = ({ item }: { item: Ticket }) => (
    <TouchableOpacity
      onPress={() => router.push(`/customer/ticket/${item.id}`)}
      className="bg-white p-4 mb-4 rounded-xl shadow-sm border border-slate-100"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-slate-800">{item.eventName}</Text>
          <Text className="text-slate-500 text-sm">{item.venue}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View className="mt-2 pt-2 border-t border-slate-100">
        {item.status === TicketStatus.RESERVED ? (
          <Text className="text-sm text-slate-600">
            📅 {item.reservation?.date} @ {item.reservation?.startTime}
          </Text>
        ) : item.status === TicketStatus.INACTIVE ? (
          <Text className="text-sm text-orange-500 font-medium">
            Action Required: Activate Ticket
          </Text>
        ) : (
          <Text className="text-sm text-blue-500 font-medium">
            Ready to Reserve
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshTickets} />
        }
        ListHeaderComponent={
          <View className="mb-6">
            <Text className="text-2xl font-bold text-slate-900">Your Tickets</Text>
            <Text className="text-slate-500">Manage activation and reservations</Text>
          </View>
        }
      />
    </View>
  );
}
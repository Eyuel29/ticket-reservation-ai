import { View, Text } from 'react-native';
import { TicketStatus } from '../types';
import clsx from 'clsx';

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const styles = {
    [TicketStatus.INACTIVE]: 'bg-slate-200 text-slate-700',
    [TicketStatus.ACTIVE]: 'bg-blue-100 text-blue-800',
    [TicketStatus.RESERVED]: 'bg-purple-100 text-purple-800',
    [TicketStatus.VERIFIED]: 'bg-green-100 text-green-800',
    [TicketStatus.EXPIRED]: 'bg-red-100 text-red-800',
  };

  return (
    <View className={clsx("px-3 py-1 rounded-full self-start", styles[status].split(' ')[0])}>
      <Text className={clsx("text-xs font-bold", styles[status].split(' ')[1])}>
        {status}
      </Text>
    </View>
  );
}

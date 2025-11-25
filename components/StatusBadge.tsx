import { View, Text } from 'react-native';
import { TicketStatus } from '../types';
import clsx from 'clsx';

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const styles = {
    [TicketStatus.INACTIVE]: 'bg-slate-100 text-slate-600',
    [TicketStatus.ACTIVE]: 'bg-indigo-100 text-indigo-700',
    [TicketStatus.RESERVED]: 'bg-violet-100 text-violet-700',
    [TicketStatus.VERIFIED]: 'bg-emerald-100 text-emerald-700',
    [TicketStatus.EXPIRED]: 'bg-rose-100 text-rose-700',
  };

  return (
    <View className={clsx("px-3 py-1.5 rounded-full self-start", styles[status].split(' ')[0])}>
      <Text className={clsx("text-[10px] font-bold uppercase tracking-wider", styles[status].split(' ')[1])}>
        {status}
      </Text>
    </View>
  );
}
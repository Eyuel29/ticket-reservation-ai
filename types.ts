export enum TicketStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  RESERVED = 'RESERVED',
  VERIFIED = 'VERIFIED',
  EXPIRED = 'EXPIRED',
}

export interface Slot {
  id: string;
  startTime: string; // "14:00"
  endTime: string;   // "16:00"
  totalCapacity: number;
  bookedCount: number;
  label: string;     // "Standard Entry"
}

export interface Ticket {
  id: string;
  ticketCode: string; // QR Data
  eventName: string;
  venue: string;
  customerName: string;
  purchaseDate: string;
  status: TicketStatus;
  activationDate?: string;
  reservation?: {
    date: string; // YYYY-MM-DD
    slotId: string;
    slotLabel: string;
    startTime: string;
    endTime: string;
  };
}

export type RootStackParamList = {
  index: undefined;
  'customer/dashboard': undefined;
  'customer/reserve': { ticketId: string };
  'customer/ticket': { ticketId: string };
  'operator/scanner': undefined;
  'operator/result': { ticketCode: string };
};

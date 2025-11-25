import { Ticket, TicketStatus, Slot } from '../types';

// Initial Mock Data
let TICKETS: Ticket[] = [
  {
    id: '1',
    ticketCode: 'TKT-FOOTBALL-001',
    eventName: 'Championship Final',
    venue: 'City Stadium',
    customerName: 'Maria Rodriguez',
    purchaseDate: '2025-09-15',
    status: TicketStatus.INACTIVE,
  },
  {
    id: '2',
    ticketCode: 'TKT-CINEMA-002',
    eventName: 'Avatar 3 (IMAX)',
    venue: 'Mega Cinema',
    customerName: 'James Smith',
    purchaseDate: '2025-11-01',
    status: TicketStatus.ACTIVE,
  },
  {
    id: '3',
    ticketCode: 'TKT-THEME-003',
    eventName: 'Adventure World 3-Day Pass',
    venue: 'Adventure World',
    customerName: 'Chen Family',
    purchaseDate: '2025-06-01',
    status: TicketStatus.RESERVED,
    activationDate: '2025-07-15',
    reservation: {
      date: '2025-07-21',
      slotId: 'slot-morning',
      slotLabel: 'Morning Entry',
      startTime: '09:00',
      endTime: '12:00'
    }
  }
];

// Mock Slots available for any given date
const SLOTS: Slot[] = [
  { id: '1', startTime: '12:00', endTime: '13:00', totalCapacity: 5000, bookedCount: 150, label: 'Early Access' },
  { id: '2', startTime: '13:00', endTime: '14:00', totalCapacity: 15000, bookedCount: 1200, label: 'General Entry A' },
  { id: '3', startTime: '14:00', endTime: '15:00', totalCapacity: 20000, bookedCount: 4500, label: 'General Entry B' },
  { id: '4', startTime: '15:00', endTime: '16:00', totalCapacity: 10000, bookedCount: 800, label: 'Late Entry' },
];

export const getTickets = () => Promise.resolve(TICKETS);

export const getTicketById = (id: string) => Promise.resolve(TICKETS.find(t => t.id === id));

export const getTicketByCode = (code: string) => Promise.resolve(TICKETS.find(t => t.ticketCode === code));

export const activateTicket = (id: string) => {
  const index = TICKETS.findIndex(t => t.id === id);
  if (index !== -1) {
    TICKETS[index] = { ...TICKETS[index], status: TicketStatus.ACTIVE, activationDate: new Date().toISOString() };
    return Promise.resolve(TICKETS[index]);
  }
  return Promise.reject('Ticket not found');
};

export const getAvailableSlots = (date: string) => {
  // Simulate network delay
  return new Promise<Slot[]>((resolve) => {
    setTimeout(() => resolve(SLOTS), 500);
  });
};

export const reserveTicket = (ticketId: string, date: string, slot: Slot) => {
  const index = TICKETS.findIndex(t => t.id === ticketId);
  if (index !== -1) {
    TICKETS[index] = {
      ...TICKETS[index],
      status: TicketStatus.RESERVED,
      reservation: {
        date,
        slotId: slot.id,
        slotLabel: slot.label,
        startTime: slot.startTime,
        endTime: slot.endTime
      }
    };
    return Promise.resolve(TICKETS[index]);
  }
  return Promise.reject('Ticket not found');
};

export const validateTicketScan = (code: string) => {
    const ticket = TICKETS.find(t => t.ticketCode === code);
    if (!ticket) return { valid: false, reason: 'Ticket not found in system.' };

    if (ticket.status === TicketStatus.INACTIVE) return { valid: false, reason: 'Ticket is INACTIVE. Please activate first.', ticket };
    if (ticket.status === TicketStatus.ACTIVE) return { valid: false, reason: 'Ticket not reserved. Please select a time slot.', ticket };
    if (ticket.status === TicketStatus.VERIFIED) return { valid: false, reason: 'Ticket ALREADY VERIFIED. Entry previously granted.', ticket };
    if (ticket.status === TicketStatus.EXPIRED) return { valid: false, reason: 'Ticket EXPIRED.', ticket };

    // Simulating Date Check (In a real app, compare with Today)
    // For demo purposes, we assume the reservation date is "Today" if it exists
    if (ticket.status === TicketStatus.RESERVED) {
        // Update to verified
        ticket.status = TicketStatus.VERIFIED;
        return { valid: true, reason: 'Valid Entry', ticket };
    }

    return { valid: false, reason: 'Unknown Status', ticket };
}

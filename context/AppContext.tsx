import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket } from '../types';
import { getTickets } from '../services/mockData';

interface AppContextType {
  tickets: Ticket[];
  refreshTickets: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const refreshTickets = async () => {
    const data = await getTickets();
    setTickets([...data]); // Force new reference
  };

  useEffect(() => {
    refreshTickets();
  }, []);

  return (
    <AppContext.Provider value={{ tickets, refreshTickets }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

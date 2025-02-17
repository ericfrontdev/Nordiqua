import { create } from 'zustand';

export interface Client {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  invoicesCount: number;
  totalAmount: number;
  status: 'active' | 'inactive';
}

interface ClientStore {
  clients: Client[];
  filters: {
    status: 'all' | 'active' | 'inactive';
    minInvoices: number | null;
    minAmount: number | null;
  };
  sort: {
    field: keyof Client | null;
    direction: 'asc' | 'desc';
  };
  searchQuery: string;
  addClient: (client: Omit<Client, 'id' | 'invoicesCount' | 'totalAmount' | 'status'>) => void;
  updateClient: (id: number, client: Partial<Client>) => void;
  removeClient: (id: number) => void;
  setFilters: (filters: Partial<ClientStore['filters']>) => void;
  setSort: (sort: Partial<ClientStore['sort']>) => void;
  setSearchQuery: (query: string) => void;
  getFilteredAndSortedClients: () => Client[];
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [
    {
      id: 1,
      name: 'Entreprise ABC',
      contact: 'Jean Dupont',
      email: 'contact@entrepriseabc.fr',
      phone: '+33 1 23 45 67 89',
      address: '123 rue de Paris, 75001 Paris',
      invoicesCount: 12,
      totalAmount: 15000,
      status: 'active',
    },
    {
      id: 2,
      name: 'Studio Design',
      contact: 'Marie Martin',
      email: 'marie@studiodesign.fr',
      phone: '+33 1 98 76 54 32',
      address: '456 avenue des Arts, 69002 Lyon',
      invoicesCount: 8,
      totalAmount: 8500,
      status: 'active',
    },
    {
      id: 3,
      name: 'Tech Solutions',
      contact: 'Pierre Dubois',
      email: 'pierre@techsolutions.fr',
      phone: '+33 1 45 67 89 10',
      address: '789 boulevard de l\'Innovation, 33000 Bordeaux',
      invoicesCount: 15,
      totalAmount: 22000,
      status: 'inactive',
    },
  ],
  filters: {
    status: 'all',
    minInvoices: null,
    minAmount: null,
  },
  sort: {
    field: null,
    direction: 'asc',
  },
  searchQuery: '',
  addClient: (clientData) =>
    set((state) => ({
      clients: [
        ...state.clients,
        {
          ...clientData,
          id: Math.max(0, ...state.clients.map((c) => c.id)) + 1,
          invoicesCount: 0,
          totalAmount: 0,
          status: 'active',
        },
      ],
    })),
  updateClient: (id, clientData) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...clientData } : client
      ),
    })),
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    })),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  setSort: (sort) =>
    set((state) => ({
      sort: { ...state.sort, ...sort },
    })),
  setSearchQuery: (query) =>
    set({ searchQuery: query }),
  getFilteredAndSortedClients: () => {
    const state = get();
    let filteredClients = [...state.clients];

    // Apply search
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filteredClients = filteredClients.filter(
        (client) =>
          client.name.toLowerCase().includes(query) ||
          client.contact.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (state.filters.status !== 'all') {
      filteredClients = filteredClients.filter(
        (client) => client.status === state.filters.status
      );
    }
    if (state.filters.minInvoices !== null) {
      filteredClients = filteredClients.filter(
        (client) => client.invoicesCount >= state.filters.minInvoices!
      );
    }
    if (state.filters.minAmount !== null) {
      filteredClients = filteredClients.filter(
        (client) => client.totalAmount >= state.filters.minAmount!
      );
    }

    // Apply sort
    if (state.sort.field) {
      filteredClients.sort((a, b) => {
        const aValue = a[state.sort.field!];
        const bValue = b[state.sort.field!];
        const modifier = state.sort.direction === 'asc' ? 1 : -1;

        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue as string) * modifier;
        }
        return ((aValue as number) - (bValue as number)) * modifier;
      });
    }

    return filteredClients;
  },
}));
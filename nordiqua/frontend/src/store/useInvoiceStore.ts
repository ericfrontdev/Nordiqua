import { create } from 'zustand'

export interface Invoice {
  id: string
  client: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
}

interface InvoiceStore {
  invoices: Invoice[]
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (invoice: Invoice) => void
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [
    {
      id: 'INV-2024-001',
      client: 'Entreprise ABC',
      date: '2024-02-25',
      amount: 2500,
      status: 'paid',
    },
    {
      id: 'INV-2024-002',
      client: 'Studio Design',
      date: '2024-02-24',
      amount: 1800,
      status: 'pending',
    },
    {
      id: 'INV-2024-003',
      client: 'Tech Solutions',
      date: '2024-02-23',
      amount: 3200,
      status: 'overdue',
    },
  ],
  addInvoice: (invoice) =>
    set((state) => ({
      invoices: [...state.invoices, invoice],
    })),
  updateInvoice: (invoice) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === invoice.id ? invoice : inv
      ),
    })),
}))

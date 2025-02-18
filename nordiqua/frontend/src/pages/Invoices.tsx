import React from 'react'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Download,
  Mail,
  ChevronDown,
  Check,
  TrendingUp,
  CreditCard,
  AlertCircle,
  LayoutGrid,
  List,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { CreateInvoiceDialog } from '@/components/CreateInvoiceDialog'
import { useInvoiceStore } from '@/store/useInvoiceStore'

const invoiceStats = [
  {
    name: 'Total des factures',
    value: '124 500 €',
    change: '+12.5%',
    icon: FileText,
    colors: {
      icon: ['#6366f1', '#4f46e5'],
      value: ['#4338ca', '#6366f1'],
    },
  },
  {
    name: 'Taux de recouvrement',
    value: '94%',
    change: '+2.3%',
    icon: TrendingUp,
    colors: {
      icon: ['#22c55e', '#16a34a'],
      value: ['#15803d', '#22c55e'],
    },
  },
  {
    name: 'Paiements en attente',
    value: '12 800 €',
    change: '4 retards',
    icon: CreditCard,
    colors: {
      icon: ['#f59e0b', '#d97706'],
      value: ['#b45309', '#f59e0b'],
    },
  },
]

const statusColors = {
  paid: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    label: 'Payée',
  },
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    label: 'En attente',
  },
  overdue: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    label: 'En retard',
  },
} as const

export function Invoices() {
  const { invoices } = useInvoiceStore()
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [isSortOpen, setIsSortOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const renderGridView = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="group glass-effect rounded-[2rem] p-4 md:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold">
                  {invoice.id}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {invoice.client}
                </p>
              </div>
            </div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[160px] bg-white rounded-lg p-1 shadow-md"
                  sideOffset={5}
                  align="end"
                >
                  <DropdownMenu.Item className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-[20px] cursor-pointer">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-[20px] cursor-pointer">
                    <Mail className="mr-2 h-4 w-4" />
                    Envoyer
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Montant</p>
                <p className="mt-1 text-base md:text-lg font-semibold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  {invoice.amount.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="mt-1 text-base font-medium">
                  {new Date(invoice.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                  statusColors[invoice.status].bg
                } ${statusColors[invoice.status].text}`}
              >
                {statusColors[invoice.status].label}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="glass-effect rounded-[2rem] overflow-hidden">
      <div className="min-w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100/20">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Numéro
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Client
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Montant
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Statut
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/20">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="group hover:bg-primary/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{invoice.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{invoice.client}</td>
                <td className="px-6 py-4 text-sm">
                  {new Date(invoice.date).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">
                    {invoice.amount.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                      statusColors[invoice.status].bg
                    } ${statusColors[invoice.status].text}`}
                  >
                    {statusColors[invoice.status].label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <div className="relative group/tooltip">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Télécharger
                      </div>
                    </div>
                    <div className="relative group/tooltip">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Envoyer
                      </div>
                    </div>
                    <DropdownMenu.Root>
                      <div className="relative group/tooltip">
                        <DropdownMenu.Trigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenu.Trigger>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Plus d'options
                        </div>
                      </div>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[160px] bg-white rounded-lg p-1 shadow-md"
                          sideOffset={5}
                          align="end"
                        >
                          <DropdownMenu.Item className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-[20px] cursor-pointer">
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-[20px] cursor-pointer">
                            <Mail className="mr-2 h-4 w-4" />
                            Envoyer
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Factures
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos factures et paiements
          </p>
        </div>
        <CreateInvoiceDialog />
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {invoiceStats.map((stat) => (
          <div
            key={stat.name}
            className="stat-card group"
            style={
              {
                '--icon-color-start': stat.colors.icon[0],
                '--icon-color-end': stat.colors.icon[1],
                '--value-color-start': stat.colors.value[0],
                '--value-color-end': stat.colors.value[1],
              } as React.CSSProperties
            }
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="stat-icon">
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 md:px-3 py-1 text-xs font-semibold ${
                    stat.name.includes('retard')
                      ? 'bg-red-50 text-red-600'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </h3>
                <p className="stat-value text-2xl md:text-4xl">{stat.value}</p>
              </div>
            </div>
            <div
              className="absolute bottom-0 right-0 -mb-6 -mr-6 opacity-[0.07] transition-transform duration-300 group-hover:scale-110"
              style={{ color: stat.colors.icon[0] }}
            >
              <stat.icon className="h-24 w-24 md:h-32 md:w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une facture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu.Root
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
          >
            <DropdownMenu.Trigger asChild>
              <Button
                variant="outline"
                className="rounded-xl flex-1 sm:flex-none"
              >
                <Filter className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filtres</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[200px] bg-white rounded-lg p-2 shadow-md"
                sideOffset={5}
              >
                <div className="p-2">
                  <h3 className="font-medium mb-2">Statut</h3>
                  <div className="space-y-2">
                    {['all', 'paid', 'pending', 'overdue'].map((status) => (
                      <button
                        key={status}
                        className="flex items-center w-full px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100"
                      >
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span className="ml-2">
                          {status === 'all'
                            ? 'Toutes'
                            : status === 'paid'
                            ? 'Payées'
                            : status === 'pending'
                            ? 'En attente'
                            : 'En retard'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <DropdownMenu.Root
            open={isSortOpen}
            onOpenChange={setIsSortOpen}
          >
            <DropdownMenu.Trigger asChild>
              <Button
                variant="outline"
                className="rounded-xl flex-1 sm:flex-none"
              >
                <ArrowUpDown className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Trier</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[200px] bg-white rounded-lg p-2 shadow-md"
                sideOffset={5}
              >
                {['date', 'amount', 'status'].map((field) => (
                  <button
                    key={field}
                    className="flex items-center w-full px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100"
                  >
                    <ArrowUpDown className="mr-2 h-4 w-4 text-primary" />
                    <span className="ml-2">
                      {field === 'date'
                        ? 'Date'
                        : field === 'amount'
                        ? 'Montant'
                        : 'Statut'}
                    </span>
                  </button>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <div className="flex gap-1 ml-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              className="rounded-xl"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              className="rounded-xl"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Invoices View */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}
    </div>
  )
}

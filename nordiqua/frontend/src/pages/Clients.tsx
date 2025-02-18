import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Mail,
  Phone,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  TrendingUp,
  MoreVertical,
  Edit,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { CreateClientDialog } from '@/components/CreateClientDialog'
import { EditClientDialog } from '@/components/EditClientDialog'
import { ContactClientDialog } from '@/components/ContactClientDialog'
import { useClientStore } from '@/store/useClientStore'

const clientStats = [
  {
    name: 'Clients actifs',
    value: '45',
    change: '+12%',
    icon: Building2,
    colors: {
      icon: ['#6366f1', '#4f46e5'],
      value: ['#4338ca', '#6366f1'],
    },
  },
  {
    name: "Chiffre d'affaires moyen",
    value: '12 500 €',
    change: '+8.5%',
    icon: TrendingUp,
    colors: {
      icon: ['#22c55e', '#16a34a'],
      value: ['#15803d', '#22c55e'],
    },
  },
  {
    name: 'Factures en cours',
    value: '28',
    change: '+5',
    icon: FileText,
    colors: {
      icon: ['#8b5cf6', '#7c3aed'],
      value: ['#6d28d9', '#8b5cf6'],
    },
  },
]

const sortOptions = [
  { label: 'Nom', field: 'name' },
  { label: 'Nombre de factures', field: 'invoicesCount' },
  { label: 'Montant total', field: 'totalAmount' },
] as const

export function Clients() {
  const {
    getFilteredAndSortedClients,
    setFilters,
    setSort,
    setSearchQuery,
    filters,
    sort,
    searchQuery,
  } = useClientStore()
  const [editingClient, setEditingClient] = React.useState<number | null>(null)
  const [contactingClient, setContactingClient] = React.useState<number | null>(
    null
  )
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [isSortOpen, setIsSortOpen] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  const clients = getFilteredAndSortedClients()

  const renderGridView = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {clients.map((client) => (
        <div
          key={client.id}
          className="group glass-effect rounded-[2rem] p-4 md:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-lg md:text-xl font-semibold text-primary">
                  {client.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold">
                  {client.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {client.contact}
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
                  <DropdownMenu.Item
                    className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-[20px] cursor-pointer"
                    onClick={() => setEditingClient(client.id)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          <div className="mt-6 space-y-3 md:space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span className="truncate">{client.email}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-2 h-4 w-4" />
              {client.phone}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Factures</p>
                <p className="mt-1 text-base md:text-lg font-semibold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  {client.invoicesCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="mt-1 text-base md:text-lg font-semibold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  {client.totalAmount.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-6 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl text-sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Factures</span>
              </Button>
              <Button
                size="sm"
                className="w-full rounded-xl text-sm"
                onClick={() => setContactingClient(client.id)}
              >
                <Mail className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Contacter</span>
              </Button>
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
                Client
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Téléphone
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Factures
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Total
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/20">
            {clients.map((client) => (
              <tr
                key={client.id}
                className="group hover:bg-primary/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{client.contact}</td>
                <td className="px-6 py-4 text-sm">{client.email}</td>
                <td className="px-6 py-4 text-sm">{client.phone}</td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">
                    {client.invoicesCount}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">
                    {client.totalAmount.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <div className="relative group/tooltip">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        onClick={() => setContactingClient(client.id)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Contacter le client
                      </div>
                    </div>
                    <div className="relative group/tooltip">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Voir les factures
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
                          <DropdownMenu.Item
                            className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-[20px] cursor-pointer"
                            onClick={() => setEditingClient(client.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
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
            Clients
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos relations clients
          </p>
        </div>
        <CreateClientDialog />
      </div>

      {/* Client Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {clientStats.map((stat) => (
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
                <span className="inline-flex items-center rounded-full px-2 md:px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600">
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
            placeholder="Rechercher un client..."
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
                    {['all', 'active', 'inactive'].map((status) => (
                      <button
                        key={status}
                        className="flex items-center w-full px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100"
                        onClick={() => setFilters({ status: status as any })}
                      >
                        {filters.status === status && (
                          <Check className="mr-2 h-4 w-4 text-primary" />
                        )}
                        <span className="ml-2">
                          {status === 'all'
                            ? 'Tous'
                            : status === 'active'
                            ? 'Actifs'
                            : 'Inactifs'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />
                <div className="p-2">
                  <h3 className="font-medium mb-2">Factures minimum</h3>
                  <div className="space-y-2">
                    {[null, 5, 10, 15].map((value) => (
                      <button
                        key={value === null ? 'all' : value}
                        className="flex items-center w-full px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100"
                        onClick={() => setFilters({ minInvoices: value })}
                      >
                        {filters.minInvoices === value && (
                          <Check className="mr-2 h-4 w-4 text-primary" />
                        )}
                        <span className="ml-2">
                          {value === null ? 'Tous' : `${value}+`}
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
                {sortOptions.map((option) => (
                  <button
                    key={option.field}
                    className="flex items-center w-full px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100"
                    onClick={() => {
                      if (sort.field === option.field) {
                        setSort({
                          direction: sort.direction === 'asc' ? 'desc' : 'asc',
                        })
                      } else {
                        setSort({ field: option.field, direction: 'asc' })
                      }
                    }}
                  >
                    {sort.field === option.field && (
                      <ArrowUpDown className="mr-2 h-4 w-4 text-primary" />
                    )}
                    <span className="ml-2">{option.label}</span>
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

      {/* Clients View */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {/* Edit Client Dialog */}
      {editingClient !== null && (
        <EditClientDialog
          client={clients.find((c) => c.id === editingClient)!}
          open={editingClient !== null}
          onOpenChange={(open) => !open && setEditingClient(null)}
        />
      )}

      {/* Contact Client Dialog */}
      {contactingClient !== null && (
        <ContactClientDialog
          client={clients.find((c) => c.id === contactingClient)!}
          open={contactingClient !== null}
          onOpenChange={(open) => !open && setContactingClient(null)}
        />
      )}
    </div>
  )
}

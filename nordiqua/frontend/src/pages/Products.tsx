import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Package,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Plus,
  ChevronDown,
  Check,
  Wrench,
  Box,
  LayoutGrid,
  List,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useProductStore } from '@/store/useProductStore';
import { CreateProductDialog } from '@/components/CreateProductDialog';
import { EditProductDialog } from '@/components/EditProductDialog';

const productStats = [
  {
    name: 'Produits actifs',
    value: '12',
    change: '+2',
    icon: Box,
    colors: {
      icon: ['#6366f1', '#4f46e5'],
      value: ['#4338ca', '#6366f1'],
    },
  },
  {
    name: 'Services actifs',
    value: '8',
    change: '+1',
    icon: Wrench,
    colors: {
      icon: ['#22c55e', '#16a34a'],
      value: ['#15803d', '#22c55e'],
    },
  },
  {
    name: 'Chiffre d\'affaires',
    value: '45 600 €',
    change: '+12.5%',
    icon: Package,
    colors: {
      icon: ['#8b5cf6', '#7c3aed'],
      value: ['#6d28d9', '#8b5cf6'],
    },
  },
];

export function Products() {
  const {
    getFilteredAndSortedProducts,
    setFilters,
    setSort,
    setSearchQuery,
    filters,
    sort,
    searchQuery,
  } = useProductStore();

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [editingProduct, setEditingProduct] = React.useState<number | null>(null);

  const products = getFilteredAndSortedProducts();

  const handleEdit = (productId: number) => {
    setEditingProduct(productId);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group glass-effect rounded-[2rem] p-4 md:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {product.type === 'product' ? (
                  <Box className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                ) : (
                  <Wrench className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.reference}
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
                    onClick={() => handleEdit(product.id)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Prix</p>
                <p className="mt-1 text-base md:text-lg font-semibold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  {product.price.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">TVA</p>
                <p className="mt-1 text-base md:text-lg font-semibold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  {product.tax}%
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                product.active
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
              }`}>
                {product.active ? 'Actif' : 'Inactif'}
              </span>
              <span className="text-sm text-muted-foreground">
                Par {product.unit}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="glass-effect rounded-[2rem] overflow-hidden">
      <div className="min-w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100/20">
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Produit</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Type</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Référence</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Prix</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">TVA</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Statut</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/20">
            {products.map((product) => (
              <tr key={product.id} className="group hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {product.type === 'product' ? (
                        <Box className="h-4 w-4 text-primary" />
                      ) : (
                        <Wrench className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {product.type === 'product' ? 'Produit' : 'Service'}
                </td>
                <td className="px-6 py-4 text-sm">{product.reference}</td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">
                    {product.price.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    / {product.unit}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">{product.tax}%</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                    product.active
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {product.active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <div className="relative group/tooltip">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        onClick={() => handleEdit(product.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Modifier le produit
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
                            onClick={() => handleEdit(product.id)}
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
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Produits et Services
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez votre catalogue de produits et services
          </p>
        </div>
        <CreateProductDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {productStats.map((stat) => (
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
            <div className="absolute bottom-0 right-0 -mb-6 -mr-6 opacity-[0.07] transition-transform duration-300 group-hover:scale-110">
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
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu.Root open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline" className="rounded-xl flex-1 sm:flex-none">
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
                  <h3 className="font-medium mb-2">Type</h3>
                  <div className="space-y-2">
                    {['all', 'product', 'service'].map((type) => (
                      <button
                        key={type}
                        className="flex items-center w-full px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100"
                        onClick={() => setFilters({ type: type as any })}
                      >
                        {filters.type === type && (
                          <Check className="mr-2 h-4 w-4 text-primary" />
                        )}
                        <span className="ml-2">
                          {type === 'all'
                            ? 'Tous'
                            : type === 'product'
                            ? 'Produits'
                            : 'Services'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />
                <div className="p-2">
                  <h3 className="font-medium mb-2">Statut</h3>
                  <div className="space-y-2">
                    {[null, true, false].map((value) => (
                      <button
                        key={value === null ? 'all' : value.toString()}
                        className="flex items-center w-full px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100"
                        onClick={() => setFilters({ active: value })}
                      >
                        {filters.active === value && (
                          <Check className="mr-2 h-4 w-4 text-primary" />
                        )}
                        <span className="ml-2">
                          {value === null
                            ? 'Tous'
                            : value
                            ? 'Actifs'
                            : 'Inactifs'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <DropdownMenu.Root open={isSortOpen} onOpenChange={setIsSortOpen}>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline" className="rounded-xl flex-1 sm:flex-none">
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
                {['name', 'price', 'reference'].map((field) => (
                  <button
                    key={field}
                    className="flex items-center w-full px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100"
                    onClick={() => {
                      if (sort.field === field) {
                        setSort({
                          direction: sort.direction === 'asc' ? 'desc' : 'asc',
                        });
                      } else {
                        setSort({ field: field as any, direction: 'asc' });
                      }
                    }}
                  >
                    {sort.field === field && (
                      <ArrowUpDown className="mr-2 h-4 w-4 text-primary" />
                    )}
                    <span className="ml-2">
                      {field === 'name'
                        ? 'Nom'
                        : field === 'price'
                        ? 'Prix'
                        : 'Référence'}
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

      {/* Products View */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {/* Edit Product Dialog */}
      {editingProduct !== null && (
        <EditProductDialog
          product={products.find((p) => p.id === editingProduct)!}
          open={editingProduct !== null}
          onOpenChange={(open) => !open && setEditingProduct(null)}
        />
      )}
    </div>
  );
}
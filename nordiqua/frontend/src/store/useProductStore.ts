import { create } from 'zustand';

export interface Product {
  id: number;
  name: string;
  type: 'product' | 'service';
  description: string;
  price: number;
  unit: string;
  tax: number;
  reference: string;
  active: boolean;
}

interface ProductStore {
  products: Product[];
  filters: {
    type: 'all' | 'product' | 'service';
    active: boolean | null;
  };
  sort: {
    field: keyof Product | null;
    direction: 'asc' | 'desc';
  };
  searchQuery: string;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  removeProduct: (id: number) => void;
  setFilters: (filters: Partial<ProductStore['filters']>) => void;
  setSort: (sort: Partial<ProductStore['sort']>) => void;
  setSearchQuery: (query: string) => void;
  getFilteredAndSortedProducts: () => Product[];
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [
    {
      id: 1,
      name: 'Consultation',
      type: 'service',
      description: 'Consultation standard (1 heure)',
      price: 80,
      unit: 'heure',
      tax: 20,
      reference: 'CONS-001',
      active: true,
    },
    {
      id: 2,
      name: 'Développement sur mesure',
      type: 'service',
      description: 'Développement de fonctionnalités spécifiques',
      price: 95,
      unit: 'heure',
      tax: 20,
      reference: 'DEV-001',
      active: true,
    },
    {
      id: 3,
      name: 'Pack maintenance',
      type: 'product',
      description: 'Pack de maintenance mensuel',
      price: 299,
      unit: 'mois',
      tax: 20,
      reference: 'PACK-001',
      active: true,
    },
  ],
  filters: {
    type: 'all',
    active: true,
  },
  sort: {
    field: null,
    direction: 'asc',
  },
  searchQuery: '',

  addProduct: (productData) =>
    set((state) => ({
      products: [
        ...state.products,
        {
          ...productData,
          id: Math.max(0, ...state.products.map((p) => p.id)) + 1,
        },
      ],
    })),

  updateProduct: (id, productData) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...productData } : product
      ),
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
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

  getFilteredAndSortedProducts: () => {
    const state = get();
    let filteredProducts = [...state.products];

    // Appliquer la recherche
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.reference.toLowerCase().includes(query)
      );
    }

    // Appliquer les filtres
    if (state.filters.type !== 'all') {
      filteredProducts = filteredProducts.filter(
        (product) => product.type === state.filters.type
      );
    }
    if (state.filters.active !== null) {
      filteredProducts = filteredProducts.filter(
        (product) => product.active === state.filters.active
      );
    }

    // Appliquer le tri
    if (state.sort.field) {
      filteredProducts.sort((a, b) => {
        const aValue = a[state.sort.field!];
        const bValue = b[state.sort.field!];
        const modifier = state.sort.direction === 'asc' ? 1 : -1;

        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue as string) * modifier;
        }
        return ((aValue as number) - (bValue as number)) * modifier;
      });
    }

    return filteredProducts;
  },
}));
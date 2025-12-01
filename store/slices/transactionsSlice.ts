import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, FilterOptions } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface TransactionsState {
  items: Transaction[];
  filters: FilterOptions;
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [
    {
      id: '1',
      type: 'income',
      amount: 5000,
      currency: 'USD',
      category: 'salary',
      description: 'Monthly Salary',
      date: '2025-12-01',
      isRecurring: true,
      tags: ['work'],
      createdAt: '2025-12-01T00:00:00Z',
      updatedAt: '2025-12-01T00:00:00Z',
    },
    {
      id: '2',
      type: 'expense',
      amount: 1200,
      currency: 'USD',
      category: 'rent',
      description: 'Monthly Rent',
      date: '2025-12-01',
      isRecurring: true,
      tags: ['housing'],
      createdAt: '2025-12-01T00:00:00Z',
      updatedAt: '2025-12-01T00:00:00Z',
    },
    {
      id: '3',
      type: 'expense',
      amount: 150,
      currency: 'USD',
      category: 'groceries',
      description: 'Weekly Groceries',
      date: '2025-11-28',
      isRecurring: false,
      tags: ['food'],
      createdAt: '2025-11-28T00:00:00Z',
      updatedAt: '2025-11-28T00:00:00Z',
    },
    {
      id: '4',
      type: 'expense',
      amount: 85,
      currency: 'USD',
      category: 'utilities',
      description: 'Electric Bill',
      date: '2025-11-25',
      isRecurring: true,
      tags: ['bills'],
      createdAt: '2025-11-25T00:00:00Z',
      updatedAt: '2025-11-25T00:00:00Z',
    },
    {
      id: '5',
      type: 'income',
      amount: 500,
      currency: 'USD',
      category: 'freelance',
      description: 'Freelance Project',
      date: '2025-11-20',
      isRecurring: false,
      tags: ['work', 'freelance'],
      createdAt: '2025-11-20T00:00:00Z',
      updatedAt: '2025-11-20T00:00:00Z',
    },
    {
      id: '6',
      type: 'expense',
      amount: 45,
      currency: 'USD',
      category: 'entertainment',
      description: 'Netflix & Spotify',
      date: '2025-11-15',
      isRecurring: true,
      tags: ['subscriptions'],
      createdAt: '2025-11-15T00:00:00Z',
      updatedAt: '2025-11-15T00:00:00Z',
    },
    {
      id: '7',
      type: 'expense',
      amount: 200,
      currency: 'USD',
      category: 'shopping',
      description: 'New Clothes',
      date: '2025-11-10',
      isRecurring: false,
      tags: ['personal'],
      createdAt: '2025-11-10T00:00:00Z',
      updatedAt: '2025-11-10T00:00:00Z',
    },
    {
      id: '8',
      type: 'expense',
      amount: 60,
      currency: 'USD',
      category: 'transport',
      description: 'Gas',
      date: '2025-11-08',
      isRecurring: false,
      tags: ['car'],
      createdAt: '2025-11-08T00:00:00Z',
      updatedAt: '2025-11-08T00:00:00Z',
    },
  ],
  filters: {
    type: 'all',
  },
  isLoading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      state.items.unshift({
        ...action.payload,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      });
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    setFilters: (state, action: PayloadAction<FilterOptions>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { type: 'all' };
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setFilters,
  clearFilters,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;

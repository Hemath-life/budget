import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecurringTransaction } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface RecurringState {
  items: RecurringTransaction[];
}

const initialState: RecurringState = {
  items: [
    {
      id: '1',
      type: 'income',
      amount: 5000,
      currency: 'USD',
      category: 'salary',
      description: 'Monthly Salary',
      frequency: 'monthly',
      startDate: '2025-01-01',
      nextDueDate: '2026-01-01',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      type: 'expense',
      amount: 1200,
      currency: 'USD',
      category: 'rent',
      description: 'Monthly Rent',
      frequency: 'monthly',
      startDate: '2025-01-01',
      nextDueDate: '2026-01-01',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '3',
      type: 'expense',
      amount: 15,
      currency: 'USD',
      category: 'subscriptions',
      description: 'Netflix Subscription',
      frequency: 'monthly',
      startDate: '2025-01-01',
      nextDueDate: '2026-01-01',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '4',
      type: 'expense',
      amount: 10,
      currency: 'USD',
      category: 'subscriptions',
      description: 'Spotify Subscription',
      frequency: 'monthly',
      startDate: '2025-01-01',
      nextDueDate: '2026-01-01',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '5',
      type: 'expense',
      amount: 150,
      currency: 'USD',
      category: 'groceries',
      description: 'Weekly Groceries',
      frequency: 'weekly',
      startDate: '2025-01-01',
      nextDueDate: '2025-12-08',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
    },
  ],
};

const recurringSlice = createSlice({
  name: 'recurring',
  initialState,
  reducers: {
    addRecurring: (state, action: PayloadAction<Omit<RecurringTransaction, 'id' | 'createdAt'>>) => {
      state.items.push({
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
      });
    },
    updateRecurring: (state, action: PayloadAction<RecurringTransaction>) => {
      const index = state.items.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteRecurring: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(r => r.id !== action.payload);
    },
    toggleActive: (state, action: PayloadAction<string>) => {
      const recurring = state.items.find(r => r.id === action.payload);
      if (recurring) {
        recurring.isActive = !recurring.isActive;
      }
    },
    updateNextDueDate: (state, action: PayloadAction<{ id: string; nextDueDate: string }>) => {
      const recurring = state.items.find(r => r.id === action.payload.id);
      if (recurring) {
        recurring.nextDueDate = action.payload.nextDueDate;
      }
    },
  },
});

export const { addRecurring, updateRecurring, deleteRecurring, toggleActive, updateNextDueDate } = recurringSlice.actions;
export default recurringSlice.reducer;

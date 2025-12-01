import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Budget } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface BudgetsState {
  items: Budget[];
}

const initialState: BudgetsState = {
  items: [
    {
      id: '1',
      category: 'groceries',
      amount: 500,
      currency: 'USD',
      period: 'monthly',
      spent: 150,
      startDate: '2025-12-01',
      createdAt: '2025-12-01T00:00:00Z',
    },
    {
      id: '2',
      category: 'entertainment',
      amount: 200,
      currency: 'USD',
      period: 'monthly',
      spent: 45,
      startDate: '2025-12-01',
      createdAt: '2025-12-01T00:00:00Z',
    },
    {
      id: '3',
      category: 'dining',
      amount: 300,
      currency: 'USD',
      period: 'monthly',
      spent: 120,
      startDate: '2025-12-01',
      createdAt: '2025-12-01T00:00:00Z',
    },
    {
      id: '4',
      category: 'transport',
      amount: 250,
      currency: 'USD',
      period: 'monthly',
      spent: 60,
      startDate: '2025-12-01',
      createdAt: '2025-12-01T00:00:00Z',
    },
    {
      id: '5',
      category: 'shopping',
      amount: 400,
      currency: 'USD',
      period: 'monthly',
      spent: 200,
      startDate: '2025-12-01',
      createdAt: '2025-12-01T00:00:00Z',
    },
  ],
};

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    addBudget: (state, action: PayloadAction<Omit<Budget, 'id' | 'createdAt'>>) => {
      state.items.push({
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
      });
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.items.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(b => b.id !== action.payload);
    },
    updateSpent: (state, action: PayloadAction<{ category: string; amount: number }>) => {
      const budget = state.items.find(b => b.category === action.payload.category);
      if (budget) {
        budget.spent += action.payload.amount;
      }
    },
    resetBudgets: (state) => {
      state.items.forEach(budget => {
        budget.spent = 0;
      });
    },
  },
});

export const { addBudget, updateBudget, deleteBudget, updateSpent, resetBudgets } = budgetsSlice.actions;
export default budgetsSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Goal } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface GoalsState {
  items: Goal[];
}

const initialState: GoalsState = {
  items: [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 3500,
      currency: 'USD',
      deadline: '2026-06-01',
      icon: 'Shield',
      color: '#10B981',
      isCompleted: false,
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Vacation Fund',
      targetAmount: 5000,
      currentAmount: 2000,
      currency: 'USD',
      deadline: '2025-08-01',
      icon: 'Plane',
      color: '#3B82F6',
      isCompleted: false,
      createdAt: '2025-01-15T00:00:00Z',
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 2000,
      currentAmount: 1800,
      currency: 'USD',
      deadline: '2025-03-01',
      icon: 'Laptop',
      color: '#8B5CF6',
      isCompleted: false,
      createdAt: '2025-02-01T00:00:00Z',
    },
    {
      id: '4',
      name: 'Car Down Payment',
      targetAmount: 8000,
      currentAmount: 1500,
      currency: 'USD',
      deadline: '2026-12-01',
      icon: 'Car',
      color: '#F59E0B',
      isCompleted: false,
      createdAt: '2025-03-01T00:00:00Z',
    },
  ],
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<Omit<Goal, 'id' | 'createdAt' | 'isCompleted'>>) => {
      state.items.push({
        ...action.payload,
        id: generateId(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
      });
    },
    updateGoal: (state, action: PayloadAction<Goal>) => {
      const index = state.items.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(g => g.id !== action.payload);
    },
    contributeToGoal: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const goal = state.items.find(g => g.id === action.payload.id);
      if (goal) {
        goal.currentAmount += action.payload.amount;
        if (goal.currentAmount >= goal.targetAmount) {
          goal.isCompleted = true;
        }
      }
    },
    markGoalComplete: (state, action: PayloadAction<string>) => {
      const goal = state.items.find(g => g.id === action.payload);
      if (goal) {
        goal.isCompleted = true;
      }
    },
  },
});

export const { addGoal, updateGoal, deleteGoal, contributeToGoal, markGoalComplete } = goalsSlice.actions;
export default goalsSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reminder } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface RemindersState {
  items: Reminder[];
}

const initialState: RemindersState = {
  items: [
    {
      id: '1',
      title: 'Rent Payment',
      amount: 1200,
      currency: 'USD',
      dueDate: '2025-12-05',
      category: 'rent',
      isRecurring: true,
      frequency: 'monthly',
      isPaid: false,
      notifyBefore: 3,
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Electric Bill',
      amount: 85,
      currency: 'USD',
      dueDate: '2025-12-10',
      category: 'utilities',
      isRecurring: true,
      frequency: 'monthly',
      isPaid: false,
      notifyBefore: 5,
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '3',
      title: 'Internet Bill',
      amount: 60,
      currency: 'USD',
      dueDate: '2025-12-15',
      category: 'utilities',
      isRecurring: true,
      frequency: 'monthly',
      isPaid: false,
      notifyBefore: 5,
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '4',
      title: 'Car Insurance',
      amount: 150,
      currency: 'USD',
      dueDate: '2025-12-20',
      category: 'insurance',
      isRecurring: true,
      frequency: 'monthly',
      isPaid: false,
      notifyBefore: 7,
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '5',
      title: 'Phone Bill',
      amount: 45,
      currency: 'USD',
      dueDate: '2025-12-08',
      category: 'utilities',
      isRecurring: true,
      frequency: 'monthly',
      isPaid: false,
      notifyBefore: 3,
      createdAt: '2025-01-01T00:00:00Z',
    },
  ],
};

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    addReminder: (state, action: PayloadAction<Omit<Reminder, 'id' | 'createdAt'>>) => {
      state.items.push({
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
      });
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.items.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(r => r.id !== action.payload);
    },
    markAsPaid: (state, action: PayloadAction<string>) => {
      const reminder = state.items.find(r => r.id === action.payload);
      if (reminder) {
        reminder.isPaid = true;
      }
    },
    markAsUnpaid: (state, action: PayloadAction<string>) => {
      const reminder = state.items.find(r => r.id === action.payload);
      if (reminder) {
        reminder.isPaid = false;
      }
    },
  },
});

export const { addReminder, updateReminder, deleteReminder, markAsPaid, markAsUnpaid } = remindersSlice.actions;
export default remindersSlice.reducer;

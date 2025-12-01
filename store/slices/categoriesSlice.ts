import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface CategoriesState {
  items: Category[];
}

const initialState: CategoriesState = {
  items: [
    // Income categories
    { id: 'salary', name: 'Salary', type: 'income', icon: 'Briefcase', color: '#10B981' },
    { id: 'freelance', name: 'Freelance', type: 'income', icon: 'Laptop', color: '#3B82F6' },
    { id: 'investments', name: 'Investments', type: 'income', icon: 'TrendingUp', color: '#8B5CF6' },
    { id: 'rental', name: 'Rental Income', type: 'income', icon: 'Home', color: '#F59E0B' },
    { id: 'gifts-income', name: 'Gifts', type: 'income', icon: 'Gift', color: '#EC4899' },
    { id: 'other-income', name: 'Other Income', type: 'income', icon: 'Plus', color: '#6B7280' },
    
    // Expense categories
    { id: 'rent', name: 'Rent', type: 'expense', icon: 'Home', color: '#EF4444' },
    { id: 'groceries', name: 'Groceries', type: 'expense', icon: 'ShoppingCart', color: '#F97316' },
    { id: 'utilities', name: 'Utilities', type: 'expense', icon: 'Zap', color: '#EAB308' },
    { id: 'transport', name: 'Transportation', type: 'expense', icon: 'Car', color: '#84CC16' },
    { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#06B6D4' },
    { id: 'shopping', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#8B5CF6' },
    { id: 'healthcare', name: 'Healthcare', type: 'expense', icon: 'Heart', color: '#EC4899' },
    { id: 'education', name: 'Education', type: 'expense', icon: 'GraduationCap', color: '#14B8A6' },
    { id: 'dining', name: 'Dining', type: 'expense', icon: 'Utensils', color: '#F43F5E' },
    { id: 'travel', name: 'Travel', type: 'expense', icon: 'Plane', color: '#0EA5E9' },
    { id: 'subscriptions', name: 'Subscriptions', type: 'expense', icon: 'CreditCard', color: '#A855F7' },
    { id: 'insurance', name: 'Insurance', type: 'expense', icon: 'Shield', color: '#64748B' },
    { id: 'gifts', name: 'Gifts', type: 'expense', icon: 'Gift', color: '#FB7185' },
    { id: 'other', name: 'Other', type: 'expense', icon: 'MoreHorizontal', color: '#9CA3AF' },
  ],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Omit<Category, 'id'>>) => {
      state.items.push({
        ...action.payload,
        id: generateId(),
      });
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;

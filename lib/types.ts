// Core Types for the Money Management Application

export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  isRecurring: boolean;
  recurringId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RecurringTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextDueDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  currency: string;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  spent: number;
  startDate: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline: string;
  category?: string;
  icon: string;
  color: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  amount: number;
  currency: string;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  isPaid: boolean;
  notifyBefore: number; // days before
  createdAt: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to base currency (USD)
}

export interface AppSettings {
  defaultCurrency: string;
  currencies: Currency[];
  theme: 'light' | 'dark' | 'system';
  dateFormat: string;
  language: string;
  notificationsEnabled: boolean;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  monthlyComparison: {
    income: number;
    expenses: number;
    change: number;
  };
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface FilterOptions {
  type?: TransactionType | 'all';
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

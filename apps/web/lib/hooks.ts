'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  budgetsApi,
  categoriesApi,
  currenciesApi,
  dashboardApi,
  goalsApi,
  recurringApi,
  remindersApi,
  settingsApi,
  subscriptionApi,
  transactionsApi,
  usersApi,
} from './api';
import type {
  Budget,
  Category,
  Currency,
  Goal,
  RecurringTransaction,
  Reminder,
  Transaction,
} from './types';

// Query Keys
export const queryKeys = {
  transactions: ['transactions'] as const,
  transaction: (id: string) => ['transactions', id] as const,
  categories: ['categories'] as const,
  category: (id: string) => ['categories', id] as const,
  budgets: ['budgets'] as const,
  budget: (id: string) => ['budgets', id] as const,
  goals: ['goals'] as const,
  goal: (id: string) => ['goals', id] as const,
  reminders: ['reminders'] as const,
  reminder: (id: string) => ['reminders', id] as const,
  recurring: ['recurring'] as const,
  recurringItem: (id: string) => ['recurring', id] as const,
  settings: ['settings'] as const,
  currencies: ['currencies'] as const,
  dashboard: ['dashboard'] as const,
  subscription: ['subscription'] as const,
};

// ============ TRANSACTIONS HOOKS ============
export function useTransactions(
  params?: Parameters<typeof transactionsApi.getAll>[0],
) {
  return useQuery({
    queryKey: [...queryKeys.transactions, params],
    queryFn: () => transactionsApi.getAll(params),
  });
}

export function usePaginatedTransactions(
  params: Parameters<typeof transactionsApi.getPaginated>[0],
) {
  return useQuery({
    queryKey: [...queryKeys.transactions, 'paginated', params],
    queryFn: () => transactionsApi.getPaginated(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => transactionsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      transactionsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.transaction(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
    },
  });
}

// ============ CATEGORIES HOOKS ============
export function useCategories(type?: 'income' | 'expense') {
  return useQuery({
    queryKey: [...queryKeys.categories, type],
    queryFn: () => categoriesApi.getAll(type),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

// ============ BUDGETS HOOKS ============
export function useBudgets() {
  return useQuery({
    queryKey: queryKeys.budgets,
    queryFn: budgetsApi.getAll,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: budgetsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) =>
      budgetsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: budgetsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

// ============ GOALS HOOKS ============
export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: goalsApi.getAll,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Goal> }) =>
      goalsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useContributeToGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      goalsApi.contribute(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

// ============ REMINDERS HOOKS ============
export function useReminders(status?: 'paid' | 'unpaid') {
  return useQuery({
    queryKey: [...queryKeys.reminders, status],
    queryFn: () => remindersApi.getAll(status),
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: remindersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Reminder> }) =>
      remindersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: remindersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useMarkReminderPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: remindersApi.markPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useMarkReminderUnpaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: remindersApi.markUnpaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

// ============ RECURRING HOOKS ============
export function useRecurring(status?: 'active' | 'inactive') {
  return useQuery({
    queryKey: [...queryKeys.recurring, status],
    queryFn: () => recurringApi.getAll(status),
  });
}

export function useCreateRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recurringApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recurring });
    },
  });
}

export function useUpdateRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<RecurringTransaction>;
    }) => recurringApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recurring });
    },
  });
}

export function useDeleteRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recurringApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recurring });
    },
  });
}

export function useToggleRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recurringApi.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recurring });
    },
  });
}

// ============ SETTINGS HOOKS ============
export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsApi.get,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}

export function usePatchSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.patch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}

// ============ CURRENCIES HOOKS ============
export function useCurrencies() {
  return useQuery({
    queryKey: queryKeys.currencies,
    queryFn: currenciesApi.getAll,
  });
}

export function useCreateCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: currenciesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencies });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}

export function useUpdateCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: Partial<Currency> }) =>
      currenciesApi.update(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencies });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}

export function useDeleteCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: currenciesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currencies });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}

// ============ DASHBOARD HOOKS ============
export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardApi.get,
  });
}

// ============ SUBSCRIPTION HOOKS ============
export function useSubscription(userId?: string) {
  return useQuery({
    queryKey: [...queryKeys.subscription, userId],
    queryFn: () => subscriptionApi.get(userId),
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription });
    },
  });
}

// ============ USER HOOKS ============
export function useUpdateUser() {
  return useMutation({
    mutationFn: usersApi.updateMe,
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: usersApi.deleteMe,
  });
}

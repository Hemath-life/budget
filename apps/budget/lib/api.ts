// API client for all endpoints

const API_BASE = '/api';

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - clear auth and redirect
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        // Only redirect if not already on auth pages
        if (
          !window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/signup')
        ) {
          window.location.href = '/login';
        }
      }
      throw new Error('Unauthorized');
    }

    const error = await response
      .json()
      .catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

// Types
import type {
  AppSettings,
  Budget,
  Category,
  Currency,
  Goal,
  RecurringTransaction,
  Reminder,
  Transaction,
} from './types';

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ============ AUTH ============
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user?: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signup: (credentials: SignupCredentials) =>
    fetchApi<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  },

  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  },

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
      localStorage.setItem('isAuthenticated', 'true');
    }
  },

  getToken: () => getAuthToken(),
};

// ============ TRANSACTIONS ============
export const transactionsApi = {
  getAll: (params?: {
    type?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set('type', params.type);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    const query = searchParams.toString();
    return fetchApi<Transaction[]>(`/transactions${query ? `?${query}` : ''}`);
  },

  getPaginated: (params: {
    type?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    page: number;
    pageSize: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.type && params.type !== 'all')
      searchParams.set('type', params.type);
    if (params.category && params.category !== 'all')
      searchParams.set('category', params.category);
    if (params.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params.dateTo) searchParams.set('dateTo', params.dateTo);
    if (params.search) searchParams.set('search', params.search);
    searchParams.set('page', params.page.toString());
    searchParams.set('pageSize', params.pageSize.toString());
    const query = searchParams.toString();
    return fetchApi<PaginatedResponse<Transaction>>(`/transactions?${query}`);
  },

  getById: (id: string) => fetchApi<Transaction>(`/transactions/${id}`),

  create: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) =>
    fetchApi<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Transaction>) =>
    fetchApi<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/transactions/${id}`, { method: 'DELETE' }),
};

// ============ CATEGORIES ============
export const categoriesApi = {
  getAll: (type?: 'income' | 'expense') => {
    const query = type ? `?type=${type}` : '';
    return fetchApi<Category[]>(`/categories${query}`);
  },

  getById: (id: string) => fetchApi<Category>(`/categories/${id}`),

  create: (data: Omit<Category, 'id'>) =>
    fetchApi<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Category>) =>
    fetchApi<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),
};

// ============ BUDGETS ============
export const budgetsApi = {
  getAll: () => fetchApi<Budget[]>('/budgets'),

  getById: (id: string) => fetchApi<Budget>(`/budgets/${id}`),

  create: (data: Omit<Budget, 'id' | 'createdAt'>) =>
    fetchApi<Budget>('/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Budget>) =>
    fetchApi<Budget>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/budgets/${id}`, { method: 'DELETE' }),
};

// ============ GOALS ============
export const goalsApi = {
  getAll: () => fetchApi<Goal[]>('/goals'),

  getById: (id: string) => fetchApi<Goal>(`/goals/${id}`),

  create: (data: Omit<Goal, 'id' | 'createdAt'>) =>
    fetchApi<Goal>('/goals', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Goal>) =>
    fetchApi<Goal>(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/goals/${id}`, { method: 'DELETE' }),

  contribute: (id: string, amount: number) =>
    fetchApi<Goal>(`/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ amount }),
    }),
};

// ============ REMINDERS ============
export const remindersApi = {
  getAll: (status?: 'paid' | 'unpaid') => {
    const query = status ? `?status=${status}` : '';
    return fetchApi<Reminder[]>(`/reminders${query}`);
  },

  getById: (id: string) => fetchApi<Reminder>(`/reminders/${id}`),

  create: (data: Omit<Reminder, 'id' | 'createdAt'>) =>
    fetchApi<Reminder>('/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Reminder>) =>
    fetchApi<Reminder>(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/reminders/${id}`, { method: 'DELETE' }),

  markPaid: (id: string) =>
    fetchApi<Reminder>(`/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'markPaid' }),
    }),

  markUnpaid: (id: string) =>
    fetchApi<Reminder>(`/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'markUnpaid' }),
    }),
};

// ============ RECURRING ============
export const recurringApi = {
  getAll: (status?: 'active' | 'inactive') => {
    const query = status ? `?status=${status}` : '';
    return fetchApi<RecurringTransaction[]>(`/recurring${query}`);
  },

  getById: (id: string) => fetchApi<RecurringTransaction>(`/recurring/${id}`),

  create: (data: Omit<RecurringTransaction, 'id' | 'createdAt'>) =>
    fetchApi<RecurringTransaction>('/recurring', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<RecurringTransaction>) =>
    fetchApi<RecurringTransaction>(`/recurring/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/recurring/${id}`, { method: 'DELETE' }),

  toggle: (id: string) =>
    fetchApi<RecurringTransaction>(`/recurring/${id}`, { method: 'PATCH' }),
};

// ============ SETTINGS ============
export const settingsApi = {
  get: () => fetchApi<AppSettings>('/settings'),

  update: (data: Partial<AppSettings>) =>
    fetchApi<AppSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: (data: Partial<AppSettings>) =>
    fetchApi<AppSettings>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ============ CURRENCIES ============
export const currenciesApi = {
  getAll: () => fetchApi<Currency[]>('/currencies'),

  getByCode: (code: string) => fetchApi<Currency>(`/currencies/${code}`),

  create: (data: Currency) =>
    fetchApi<Currency>('/currencies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (code: string, data: Partial<Currency>) =>
    fetchApi<Currency>(`/currencies/${code}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (code: string) =>
    fetchApi<{ success: boolean }>(`/currencies/${code}`, { method: 'DELETE' }),
};

// ============ DASHBOARD ============
export interface DashboardData {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    currentMonth: { income: number; expenses: number; balance: number };
    lastMonth: { income: number; expenses: number; balance: number };
    savingsRate: number;
  };
  recentTransactions: Transaction[];
  expensesByCategory: { category: string; total: number }[];
  upcomingReminders: Reminder[];
  budgets: Budget[];
  goals: Goal[];
}

export const dashboardApi = {
  get: () => fetchApi<DashboardData>('/dashboard'),
};

// ============ SUBSCRIPTION ============
import type { Subscription, SubscriptionCheckout } from './types';

export const subscriptionApi = {
  get: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return fetchApi<Subscription>(`/subscription${query}`);
  },

  create: (data: SubscriptionCheckout & { userId?: string }) =>
    fetchApi<Subscription>('/subscription', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (data: { planId: string; userId?: string }) =>
    fetchApi<Subscription>('/subscription', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  cancel: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return fetchApi<{ success: boolean; message: string }>(
      `/subscription${query}`,
      { method: 'DELETE' }
    );
  },
};

// ============ SEED ============
export interface SeedResponse {
  message: string;
  counts: {
    categories: number;
    transactions: number;
    budgets: number;
    goals: number;
    reminders: number;
    recurring: number;
  };
}

export const seedApi = {
  seed: () =>
    fetchApi<SeedResponse>('/seed', {
      method: 'POST',
    }),
};

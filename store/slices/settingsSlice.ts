import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings, Currency } from '@/lib/types';

const defaultCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.88 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 17.15 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 4.97 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1298.50 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 10.65 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 10.42 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', rate: 6.87 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.64 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.62 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 89.50 },
];

const initialState: AppSettings = {
  defaultCurrency: 'USD',
  currencies: defaultCurrencies,
  theme: 'system',
  dateFormat: 'MMM dd, yyyy',
  language: 'en',
  notificationsEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDefaultCurrency: (state, action: PayloadAction<string>) => {
      state.defaultCurrency = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setDateFormat: (state, action: PayloadAction<string>) => {
      state.dateFormat = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
    updateCurrencyRate: (state, action: PayloadAction<{ code: string; rate: number }>) => {
      const currency = state.currencies.find(c => c.code === action.payload.code);
      if (currency) {
        currency.rate = action.payload.rate;
      }
    },
    addCurrency: (state, action: PayloadAction<Currency>) => {
      if (!state.currencies.find(c => c.code === action.payload.code)) {
        state.currencies.push(action.payload);
      }
    },
  },
});

export const {
  setDefaultCurrency,
  setTheme,
  setDateFormat,
  setLanguage,
  toggleNotifications,
  updateCurrencyRate,
  addCurrency,
} = settingsSlice.actions;

export default settingsSlice.reducer;

import type { LocaleMessages } from '../types';

export const enMessages = {
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    confirm: 'Confirm',
    continue: 'Continue',
    loading: 'Loading…',
    retry: 'Try again',
    searchPlaceholder: 'Search…',
    yes: 'Yes',
    no: 'No',
    close: 'Close',
  },
  navigation: {
    home: 'Home',
    dashboard: 'Dashboard',
    billing: 'Billing',
    analytics: 'Analytics',
    settings: 'Settings',
    support: 'Support',
  },
  status: {
    success: 'Success',
    pending: 'Pending',
    warning: 'Warning',
    error: 'Something went wrong',
    empty: 'Nothing to show yet',
  },
  table: {
    empty: 'No records found',
    loading: 'Loading rows…',
    totalLabel: '{{count}} total',
    selectedLabel: '{{count}} selected',
  },
  form: {
    required: 'This field is required',
    invalidEmail: 'Enter a valid email address',
    minLength: 'Must be at least {{count}} characters',
    maxLength: 'Must be {{count}} characters or fewer',
    patternMismatch: 'Value does not match the expected format',
  },
  actions: {
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    submit: 'Submit',
    reset: 'Reset',
  },
} as const satisfies LocaleMessages;

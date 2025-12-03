import type { LocaleRegistry } from '../types';
import { enMessages } from './en';
import { esMessages } from './es';

export const localeRegistry = {
  en: {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    direction: 'ltr',
    messages: enMessages,
  },
  es: {
    code: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    direction: 'ltr',
    messages: esMessages,
  },
} as const satisfies LocaleRegistry<'en' | 'es'>;

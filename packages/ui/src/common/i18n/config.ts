import {
  defaultLocale,
  locales,
  type LocaleCode,
  type TranslatorFormats,
} from '#/assets/i18n';

export const DEFAULT_LOCALE_STORAGE_KEY = 'ui-i18n.locale';

export type LocaleDetector = () => LocaleCode | undefined;

const SUPPORTED_LOCALES = Object.keys(locales) as LocaleCode[];

export const isSupportedLocale = (
  candidate?: string | null,
): candidate is LocaleCode => {
  if (!candidate) {
    return false;
  }

  return (SUPPORTED_LOCALES as string[]).includes(candidate);
};

export const normalizeLocale = (
  candidate?: string | null,
): LocaleCode | undefined => {
  if (!candidate) {
    return undefined;
  }

  const lowered = candidate.toLowerCase();

  if (isSupportedLocale(lowered)) {
    return lowered;
  }

  const [base] = lowered.split('-');
  if (isSupportedLocale(base)) {
    return base;
  }

  return undefined;
};

export const detectBrowserLocale: LocaleDetector = () => {
  if (typeof navigator === 'undefined') {
    return undefined;
  }

  const candidates: string[] = [];

  if (Array.isArray(navigator.languages)) {
    candidates.push(...navigator.languages);
  }

  if (typeof navigator.language === 'string') {
    candidates.push(navigator.language);
  }

  for (const code of candidates) {
    const normalized = normalizeLocale(code);
    if (normalized) {
      return normalized;
    }
  }

  return undefined;
};

export interface I18nConfig {
  defaultLocale?: LocaleCode;
  fallbackLocale?: LocaleCode;
  storageKey?: string | null;
  detectLocale?: LocaleDetector | false;
  formats?: TranslatorFormats;
  onMissingKey?: (details: {
    locale: LocaleCode;
    namespace: string;
    key: string;
  }) => void;
  applyDirectionToDocument?: boolean;
}

export function resolveConfig(config?: I18nConfig) {
  const fallbackLocale =
    config?.fallbackLocale && isSupportedLocale(config.fallbackLocale)
      ? config.fallbackLocale
      : undefined;

  const normalizedDefault =
    config?.defaultLocale && isSupportedLocale(config.defaultLocale)
      ? config.defaultLocale
      : undefined;

  return {
    defaultLocale: normalizedDefault ?? fallbackLocale ?? defaultLocale,
    fallbackLocale: fallbackLocale ?? normalizedDefault ?? defaultLocale,
    storageKey:
      config?.storageKey === null
        ? null
        : (config?.storageKey ?? DEFAULT_LOCALE_STORAGE_KEY),
    detectLocale:
      config?.detectLocale === false
        ? undefined
        : (config?.detectLocale ?? detectBrowserLocale),
    formats: config?.formats,
    onMissingKey: config?.onMissingKey,
    applyDirectionToDocument: config?.applyDirectionToDocument ?? true,
  };
}

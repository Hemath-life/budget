import { localeRegistry } from './locales';
import type {
  FormatterOverrides,
  LocaleDirection,
  ReplacementDescriptor,
  ReplacementPrimitive,
  ReplacementValue,
  Replacements,
  TranslateOptions as BaseTranslateOptions,
  TranslatorOptions as BaseTranslatorOptions,
} from './types';

export const locales = localeRegistry;

export type LocaleCode = keyof typeof locales;

type LocaleEntry = (typeof locales)[LocaleCode];
type LocaleMessages = LocaleEntry['messages'];

type AnyLocale = (typeof locales)[keyof typeof locales];
type AnyMessages = AnyLocale['messages'];

export type TranslationNamespace = keyof AnyMessages;
export type TranslationKey<N extends TranslationNamespace> =
  keyof AnyMessages[N];

export type TranslateOptions = BaseTranslateOptions<LocaleCode>;
export type TranslatorOptions = BaseTranslatorOptions<LocaleCode>;
export type TranslatorFormats = FormatterOverrides<LocaleCode>;
export type {
  LocaleDescriptor,
  LocaleDirection,
  LocaleMessages,
  ReplacementDescriptor,
  ReplacementPrimitive,
  ReplacementValue,
} from './types';

const DEFAULT_LOCALE: LocaleCode = 'en';
const DEFAULT_DIRECTION: LocaleDirection = 'ltr';
const MISSING_TEMPLATE = (namespace: string, key: string) =>
  `[missing:${namespace}.${key}]`;

const numberFormattersCache = new Map<string, Intl.NumberFormat>();
const dateFormattersCache = new Map<string, Intl.DateTimeFormat>();

function resolveLocale(locale: LocaleCode | undefined): LocaleCode {
  if (locale && locales[locale]) {
    return locale;
  }

  return DEFAULT_LOCALE;
}

function getMessage<N extends TranslationNamespace>(
  locale: LocaleCode,
  namespace: N,
  key: TranslationKey<N>,
): string | undefined {
  const entry = locales[locale];
  if (!entry) {
    return undefined;
  }

  const namespaceMessages = entry.messages[namespace];
  if (!namespaceMessages) {
    return undefined;
  }

  if (Object.prototype.hasOwnProperty.call(namespaceMessages, key)) {
    const result = namespaceMessages[key as keyof typeof namespaceMessages];
    return typeof result === 'string' ? result : undefined;
  }

  return undefined;
}

function formatNumber(
  value: number,
  locale: LocaleCode,
  overrides?: TranslatorFormats,
  options?: Intl.NumberFormatOptions,
): string {
  if (overrides?.number) {
    return overrides.number(value, locale);
  }

  const cacheKey = `${locale}:${JSON.stringify(options ?? {})}`;
  const cached = numberFormattersCache.get(cacheKey);
  if (cached) {
    return cached.format(value);
  }

  const formatter = new Intl.NumberFormat(locale, options);
  numberFormattersCache.set(cacheKey, formatter);
  return formatter.format(value);
}

function formatDate(
  value: Date | number | string,
  locale: LocaleCode,
  overrides?: TranslatorFormats,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (overrides?.date) {
    return overrides.date(value, locale, options);
  }

  const dateValue =
    value instanceof Date
      ? value
      : typeof value === 'number'
        ? new Date(value)
        : new Date(Date.parse(value));

  if (Number.isNaN(dateValue.getTime())) {
    return '';
  }

  const cacheKey = `${locale}:${JSON.stringify(options ?? {})}`;
  const cached = dateFormattersCache.get(cacheKey);
  if (cached) {
    return cached.format(dateValue);
  }

  const formatter = new Intl.DateTimeFormat(locale, options);
  dateFormattersCache.set(cacheKey, formatter);
  return formatter.format(dateValue);
}

function formatBoolean(
  value: boolean,
  locale: LocaleCode,
  overrides?: TranslatorFormats,
): string {
  if (overrides?.boolean) {
    return overrides.boolean(value, locale);
  }

  return value ? 'true' : 'false';
}

function isReplacementDescriptor(
  value: ReplacementPrimitive | ReplacementDescriptor,
): value is ReplacementDescriptor {
  return typeof value === 'object' && value !== null && 'value' in value;
}

function formatPrimitive(
  value: ReplacementPrimitive,
  locale: LocaleCode,
  formats?: TranslatorFormats,
  options?: Intl.DateTimeFormatOptions | Intl.NumberFormatOptions,
): string {
  if (value instanceof Date) {
    return formatDate(
      value,
      locale,
      formats,
      options as Intl.DateTimeFormatOptions | undefined,
    );
  }

  if (typeof value === 'number') {
    return formatNumber(
      value,
      locale,
      formats,
      options as Intl.NumberFormatOptions | undefined,
    );
  }

  if (typeof value === 'boolean') {
    return formatBoolean(value, locale, formats);
  }

  return String(value);
}

function applyReplacements(
  template: string,
  replacements: Replacements | undefined,
  locale: LocaleCode,
  formats?: TranslatorFormats,
): string {
  if (!replacements) {
    return template;
  }

  return template.replace(/{{\s*([^}]+)\s*}}/g, (match, rawKey) => {
    const key = rawKey.trim();
    if (!(key in replacements)) {
      return match;
    }

    const replacement = replacements[key] as ReplacementValue;

    if (isReplacementDescriptor(replacement)) {
      return formatPrimitive(
        replacement.value,
        locale,
        formats,
        replacement.options,
      );
    }

    return formatPrimitive(
      replacement as ReplacementPrimitive,
      locale,
      formats,
    );
  });
}

function computeFallback(
  locale: LocaleCode,
  fallback?: LocaleCode,
): LocaleCode {
  if (fallback && locales[fallback]) {
    return fallback;
  }

  return DEFAULT_LOCALE;
}

export interface Translator {
  readonly locale: LocaleCode;
  readonly fallbackLocale: LocaleCode;
  readonly direction: LocaleEntry['direction'];
  translate<N extends TranslationNamespace>(
    namespace: N,
    key: TranslationKey<N>,
    options?: Omit<TranslateOptions, 'locale' | 'fallbackLocale'>,
  ): string;
  has<N extends TranslationNamespace>(
    namespace: N,
    key: TranslationKey<N>,
    targetLocale?: LocaleCode,
  ): boolean;
}

function translateInternal<N extends TranslationNamespace>(
  namespace: N,
  key: TranslationKey<N>,
  options: TranslateOptions = {},
): string {
  const requestedLocale = resolveLocale(options.locale);
  const fallbackLocale = computeFallback(
    requestedLocale,
    options.fallbackLocale,
  );

  const template =
    getMessage(requestedLocale, namespace, key) ??
    (fallbackLocale !== requestedLocale
      ? getMessage(fallbackLocale, namespace, key)
      : undefined);

  if (!template) {
    return MISSING_TEMPLATE(String(namespace), String(key));
  }

  return applyReplacements(
    template,
    options.replacements,
    requestedLocale,
    options.formats,
  );
}

export function translate<N extends TranslationNamespace>(
  namespace: N,
  key: TranslationKey<N>,
  options?: TranslateOptions,
): string {
  return translateInternal(namespace, key, options);
}

export interface CreateTranslatorConfig
  extends Partial<Omit<TranslatorOptions, 'locale'>> {
  locale?: LocaleCode;
  onMissingKey?: (details: {
    locale: LocaleCode;
    namespace: string;
    key: string;
  }) => void;
}

export function createTranslator(
  config: CreateTranslatorConfig = {},
): Translator {
  const locale = resolveLocale(config.locale);
  const fallbackLocale = computeFallback(locale, config.fallbackLocale);
  const formats = config.formats;
  const onMissingKey = config.onMissingKey;

  return {
    locale,
    fallbackLocale,
    direction: locales[locale]?.direction ?? DEFAULT_DIRECTION,
    translate<N extends TranslationNamespace>(
      namespace: N,
      key: TranslationKey<N>,
      options?: Omit<TranslateOptions, 'locale' | 'fallbackLocale'>,
    ) {
      const output = translateInternal(namespace, key, {
        ...options,
        locale,
        fallbackLocale,
        formats: options?.formats ?? formats,
      });

      if (onMissingKey && output.startsWith('[missing:')) {
        onMissingKey({
          locale,
          namespace: String(namespace),
          key: String(key),
        });
      }

      return output;
    },
    has<N extends TranslationNamespace>(
      namespace: N,
      key: TranslationKey<N>,
      targetLocale: LocaleCode = locale,
    ) {
      const candidateLocale = resolveLocale(targetLocale);
      return Boolean(getMessage(candidateLocale, namespace, key));
    },
  };
}

export interface LocaleSummary {
  code: LocaleCode;
  label: string;
  nativeLabel: string;
  direction: LocaleDirection;
}

export const availableLocales: LocaleSummary[] = Object.values(locales).map(
  (entry) => ({
    code: entry.code,
    label: entry.label,
    nativeLabel: entry.nativeLabel,
    direction: entry.direction ?? DEFAULT_DIRECTION,
  }),
);

export function getLocale(locale: LocaleCode) {
  return locales[locale];
}

export const defaultLocale: LocaleCode = DEFAULT_LOCALE;

import {
  availableLocales,
  createTranslator,
  defaultLocale,
  locales,
  type LocaleCode,
  type LocaleDirection,
  type LocaleSummary,
  type TranslateOptions,
  type TranslationKey,
  type TranslationNamespace,
  type Translator,
  type TranslatorFormats,
} from '#/assets/i18n';
import { normalizeLocale, resolveConfig, type I18nConfig } from './config';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

const isBrowser = typeof window !== 'undefined';

interface StoredLocale {
  read(): LocaleCode | undefined;
  write(locale: LocaleCode): void;
  clear(): void;
}

function createStore(storageKey: string | null): StoredLocale {
  if (!storageKey || !isBrowser) {
    return {
      read: () => undefined,
      write: () => undefined,
      clear: () => undefined,
    };
  }

  return {
    read: () => {
      const stored = window.localStorage.getItem(storageKey);
      return normalizeLocale(stored);
    },
    write: (locale) => {
      window.localStorage.setItem(storageKey, locale);
    },
    clear: () => {
      window.localStorage.removeItem(storageKey);
    },
  };
}

export interface I18nContextValue {
  locale: LocaleCode;
  fallbackLocale: LocaleCode;
  direction: LocaleDirection;
  translator: Translator;
  formats?: TranslatorFormats;
  availableLocales: LocaleSummary[];
  setLocale: (nextLocale: LocaleCode) => void;
  resetLocale: () => void;
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

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  children: ReactNode;
  config?: I18nConfig;
}

function resolveInitialLocale(
  storage: StoredLocale,
  config: ReturnType<typeof resolveConfig>,
): LocaleCode {
  const stored = storage.read();
  if (stored && locales[stored]) {
    return stored;
  }

  const detected = config.detectLocale?.();
  if (detected && locales[detected]) {
    return detected;
  }

  if (config.defaultLocale && locales[config.defaultLocale]) {
    return config.defaultLocale;
  }

  return defaultLocale;
}

export function I18nProvider({ children, config }: I18nProviderProps) {
  const resolvedConfig = useMemo(() => resolveConfig(config), [config]);
  const storageRef = useRef(createStore(resolvedConfig.storageKey));

  const [locale, setLocaleState] = useState<LocaleCode>(() =>
    resolveInitialLocale(storageRef.current, resolvedConfig),
  );

  const effectiveFallback = useMemo(() => {
    if (
      resolvedConfig.fallbackLocale &&
      locales[resolvedConfig.fallbackLocale]
    ) {
      return resolvedConfig.fallbackLocale;
    }

    return defaultLocale;
  }, [resolvedConfig.fallbackLocale]);

  useEffect(() => {
    storageRef.current = createStore(resolvedConfig.storageKey);
  }, [resolvedConfig.storageKey]);

  useEffect(() => {
    storageRef.current.write(locale);
  }, [locale, resolvedConfig.storageKey]);

  const translator = useMemo(
    () =>
      createTranslator({
        locale,
        fallbackLocale: effectiveFallback,
        formats: resolvedConfig.formats,
        onMissingKey: resolvedConfig.onMissingKey,
      }),
    [
      effectiveFallback,
      locale,
      resolvedConfig.formats,
      resolvedConfig.onMissingKey,
    ],
  );

  useEffect(() => {
    if (!resolvedConfig.applyDirectionToDocument) {
      return;
    }

    if (!isBrowser) {
      return;
    }

    document.documentElement.setAttribute('dir', translator.direction ?? 'ltr');
  }, [translator.direction, resolvedConfig.applyDirectionToDocument]);

  const setLocale = useCallback((nextLocale: LocaleCode) => {
    if (!locales[nextLocale]) {
      return;
    }

    setLocaleState(nextLocale);
  }, []);

  const resetLocale = useCallback(() => {
    const fallback = resolvedConfig.defaultLocale ?? defaultLocale;
    setLocale(fallback);
  }, [resolvedConfig.defaultLocale, setLocale]);

  const contextValue = useMemo<I18nContextValue>(() => {
    const translateWithContext = <N extends TranslationNamespace>(
      namespace: N,
      key: TranslationKey<N>,
      options?: Omit<TranslateOptions, 'locale' | 'fallbackLocale'>,
    ) =>
      translator.translate(namespace, key, {
        ...options,
        formats: options?.formats ?? resolvedConfig.formats,
      });

    const has = <N extends TranslationNamespace>(
      namespace: N,
      key: TranslationKey<N>,
      targetLocale?: LocaleCode,
    ) => translator.has(namespace, key, targetLocale);

    return {
      locale,
      fallbackLocale: effectiveFallback,
      direction: translator.direction ?? 'ltr',
      translator,
      formats: resolvedConfig.formats,
      availableLocales,
      setLocale,
      resetLocale,
      translate: translateWithContext,
      has,
    };
  }, [
    effectiveFallback,
    locale,
    resolvedConfig.formats,
    resetLocale,
    setLocale,
    translator,
  ]);

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}

export function useI18nContext() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18nContext must be used within an <I18nProvider>.');
  }

  return context;
}

export function useTranslate() {
  const { translate: translateWithContext } = useI18nContext();
  return translateWithContext;
}

export function useLocale() {
  const { locale, setLocale, availableLocales: options } = useI18nContext();
  return { locale, setLocale, availableLocales: options };
}

export const I18nConsumer = I18nContext.Consumer;

type ExtractNamespace = TranslationNamespace;
type ExtractKey<N extends ExtractNamespace> = TranslationKey<N>;

type TranslateArgs<N extends ExtractNamespace> = [
  namespace: N,
  key: ExtractKey<N>,
  options?: Omit<TranslateOptions, 'locale' | 'fallbackLocale'>,
];

export function useScopedTranslator<N extends ExtractNamespace>(namespace: N) {
  const { translate: translateWithContext } = useI18nContext();

  return useCallback(
    (key: ExtractKey<N>, options?: TranslateArgs<N>[2]) =>
      translateWithContext(namespace, key, options),
    [namespace, translateWithContext],
  );
}

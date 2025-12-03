export type LocaleDirection = 'ltr' | 'rtl';

export type TranslationPrimitive = string;

export type TranslationNamespace = Record<string, TranslationPrimitive>;

export type LocaleMessages = Record<string, TranslationNamespace>;

export type ReplacementPrimitive = string | number | boolean | Date;

export interface ReplacementDescriptor {
  value: ReplacementPrimitive;
  options?: Intl.DateTimeFormatOptions | Intl.NumberFormatOptions;
}

export type ReplacementValue = ReplacementPrimitive | ReplacementDescriptor;

export type Replacements = Record<string, ReplacementValue>;

export type FormatterOverrides<TCode extends string = string> = {
  number?: (value: number, locale: TCode) => string;
  date?: (
    value: Date | number | string,
    locale: TCode,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  boolean?: (value: boolean, locale: TCode) => string;
};

export interface LocaleDescriptor<TCode extends string = string> {
  code: TCode;
  label: string;
  nativeLabel: string;
  direction?: LocaleDirection;
  messages: LocaleMessages;
}

export type LocaleRegistry<TCode extends string = string> = Record<TCode, LocaleDescriptor<TCode>>;

export interface TranslateOptions<TCode extends string = string> {
  locale?: TCode;
  fallbackLocale?: TCode;
  replacements?: Replacements;
  formats?: FormatterOverrides<TCode>;
}

export interface TranslatorOptions<TCode extends string = string>
  extends Omit<TranslateOptions<TCode>, 'locale'> {
  locale: TCode;
  onMissingKey?: (details: { locale: TCode; namespace: string; key: string }) => void;
}

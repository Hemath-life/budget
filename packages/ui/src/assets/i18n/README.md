# UI i18n assets

This module bundles reusable locale assets and lightweight helpers so consuming apps can ship a consistent translation experience without committing to a specific i18n runtime up front.

## What’s included

- Locale metadata (`code`, display labels, text direction).
- Namespaced message dictionaries with sensible defaults (`common`, `navigation`, `status`, `table`, `form`, `actions`).
- A `translate` helper and a factory for locale-scoped translators with fallback and interpolation support.
- Number and date formatting backed by the platform’s `Intl` APIs, plus override hooks for customised formats.

## Quick start

```ts
import { createTranslator, translate, defaultLocale } from '@repo/ui/assets/i18n';

// Eager, locale-scoped translator
const t = createTranslator({ locale: 'es' });

// Later in UI code
const loadingLabel = t.translate('common', 'loading');

// On-demand translation with custom replacements
const progress = translate('table', 'totalLabel', {
  locale: defaultLocale,
  replacements: { count: 1280 },
});
```

### Placeholder interpolation

Use `{{placeholder}}` tokens inside messages. Supported replacement values:

- `string`
- `number` (formatted with `Intl.NumberFormat`)
- `Date | number | string` (coerced to `Date`, formatted with `Intl.DateTimeFormat`)
- `boolean`
- `{ value, options }` descriptor for fine-grained control (number/date options)

You can override formatting globally per translator:

```ts
const t = createTranslator({
  locale: 'en',
  formats: {
    number: (value, locale) =>
      new Intl.NumberFormat(locale, { notation: 'compact' }).format(value),
  },
});
```

## Adding new locales

1. Duplicate `locales/en.ts` into `locales/<code>.ts` and supply translations.
2. Append the locale to `locales/index.ts` with metadata.
3. Re-export any additional namespaces if needed.
4. Run `pnpm --filter @repo/ui typecheck` to regenerate type safety.

That’s it—the `locale` union and namespaced key types update automatically.

## React provider option

If you want shared state and automatic RTL handling, pair the assets with the `I18nProvider` from `@repo/ui/common/i18n`.

```tsx
import { I18nProvider } from '@repo/ui/common/i18n';

function App() {
  return (
    <I18nProvider
      config={{
        storageKey: 'my-app.locale',
        fallbackLocale: 'en',
      }}
    >
      {/* rest of your tree */}
    </I18nProvider>
  );
}
```

- Detects persisted or browser-preferred locales (configurable).
- Persists changes via `localStorage` (or disable with `storageKey: null`).
- Exposes hooks: `useI18nContext`, `useTranslate`, `useLocale`, and `useScopedTranslator`.
- Automatically updates `document.dir` when enabled (default).

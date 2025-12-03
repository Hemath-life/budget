# @repo/tailwind-config

Shared Tailwind CSS configuration for the Budget App monorepo.

## 📚 Overview

This package provides shared Tailwind CSS styles and configuration.

## 🚀 Usage

### Import the Shared Styles

In your app's CSS file:

```css
@import '@repo/tailwind-config/style.css';
```

### Extend the Configuration

In your `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Your customizations
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
} satisfies Config;
```

## 📦 Exports

| Export | Description |
|--------|-------------|
| `@repo/tailwind-config/style.css` | Base styles and animations |

## 📁 Structure

```
tools/tailwind/
├── style.css         # Shared styles
├── package.json
└── eslint.config.js
```

## 🎨 Included Features

- Base reset styles
- Animation utilities (via `tailwindcss-animate`)
- CSS custom properties for theming
- Consistent spacing and sizing scales

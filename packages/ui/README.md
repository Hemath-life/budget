# @repo/ui

Shared UI component library for the Budget App monorepo.

## 📚 Overview

This package provides reusable React components built with:
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling

## 📦 Installation

This package is automatically available in the monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

## 🚀 Usage

### Import Components

```typescript
// Import from main entry
import { Button, Card, Input } from '@repo/ui';

// Import from specific modules
import { Button } from '@repo/ui/components/ui';
import { useToast } from '@repo/ui/hooks';
import { cn } from '@repo/ui/lib';
```

### Available Exports

| Export Path | Description |
|-------------|-------------|
| `@repo/ui` | Main entry point |
| `@repo/ui/components` | All components |
| `@repo/ui/components/ui` | UI primitives |
| `@repo/ui/lib` | Utility functions |
| `@repo/ui/hooks` | Custom hooks |
| `@repo/ui/dialogs` | Dialog components |
| `@repo/ui/forms` | Form components |
| `@repo/ui/loaders` | Loading components |
| `@repo/ui/errors` | Error components |
| `@repo/ui/empty` | Empty state components |
| `@repo/ui/header` | Header components |
| `@repo/ui/layout` | Layout components |
| `@repo/ui/nbars` | Navigation bars |
| `@repo/ui/pages` | Page components |
| `@repo/ui/common` | Common utilities |

## 🛠️ Development

### Building

```bash
# From monorepo root
pnpm build --filter @repo/ui

# Watch mode
pnpm dev --filter @repo/ui
```

### Adding New Components

Use shadcn/ui CLI to add new components:

```bash
# From monorepo root
pnpm ui-add button
```

### Storybook

```bash
# Start Storybook
pnpm storybook
```

## 📁 Structure

```
packages/ui/
├── src/
│   ├── index.ts          # Main exports
│   ├── assets/           # Static assets
│   ├── common/           # Common utilities
│   ├── components/       # React components
│   │   ├── ui/           # UI primitives
│   │   └── ...
│   ├── config/           # Configuration
│   ├── dialogs/          # Dialog components
│   ├── empty/            # Empty states
│   ├── errors/           # Error components
│   ├── forms/            # Form components
│   ├── header/           # Header components
│   ├── hooks/            # Custom hooks
│   ├── layout/           # Layout components
│   ├── lib/              # Utilities
│   ├── loaders/          # Loading states
│   ├── nbars/            # Navigation bars
│   ├── pages/            # Page components
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── components.json       # shadcn/ui config
├── package.json
└── tsconfig.json
```

## 🎨 Theming

Components use CSS variables for theming. Configure in your app's `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}
```

## 📝 Contributing

When adding new components:

1. Create the component in the appropriate directory
2. Export from the relevant index file
3. Add TypeScript types
4. Add Storybook story
5. Update this README if needed

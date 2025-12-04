# Contributing to Budget App

Thank you for your interest in contributing! This document provides guidelines and workflows for contributing to this monorepo.

## 📋 Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Adding New Features](#adding-new-features)

## 🛠️ Development Setup

### Prerequisites

- **Node.js** >= 22.10.0 (see `.nvmrc`)
- **pnpm** 10.13.1 or later

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-org/budget-app.git
cd budget-app

# Install dependencies
pnpm install

# Copy environment files
pnpm env:copy-example

# Set up the database
pnpm db:push

# Start development
pnpm dev
```

### Editor Setup

We recommend using **VS Code** with the following extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

## 📁 Project Structure

```
budget-app/
├── apps/                    # Application packages
│   └── budget/              # Main Next.js web app
├── packages/                # Shared packages
│   ├── ui/                  # UI component library
│   └── utils/               # Shared utilities
└── tools/                   # Tooling configurations
    ├── eslint/              # ESLint config
    ├── prettier/            # Prettier config
    ├── tailwind/            # Tailwind config
    └── typescript/          # TypeScript config
```

### Package Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Apps | `@budget-app/<name>` | `@budget-app/web` |
| Shared Packages | `@repo/<name>` | `@repo/ui` |
| Tooling | `@repo/<name>-config` | `@repo/eslint-config` |

## 🔄 Development Workflow

### Running the Development Server

```bash
# Run all apps
pnpm dev

# Run a specific app
pnpm dev --filter @budget-app/web

# Watch mode with continue on error
pnpm dev --continue
```

### Building

```bash
# Build all packages
pnpm build

# Build a specific package
pnpm build --filter @repo/ui
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm test --filter @budget-app/web
```

## 📝 Coding Standards

### TypeScript

- Enable strict mode in all packages
- Use explicit types for function parameters and return values
- Avoid `any` type; use `unknown` when necessary
- Use type imports: `import type { ... }`

```typescript
// ✅ Good
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Bad
export function calculateTotal(items: any) {
  return items.reduce((sum: any, item: any) => sum + item.price, 0);
}
```

### React Components

- Use functional components with hooks
- Co-locate related files (component, styles, tests)
- Use named exports for components
- Prefix custom hooks with `use`

```typescript
// ✅ Good
export function BudgetCard({ budget }: BudgetCardProps) {
  // ...
}

// ❌ Bad
export default function ({ budget }) {
  // ...
}
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | kebab-case | `budget-card.tsx` |
| Hooks | camelCase with `use` prefix | `usebudgets.ts` |
| Utils | kebab-case | `format-currency.ts` |
| Types | kebab-case | `budget.types.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_ENDPOINTS.ts` |

### Imports

Order imports as follows:
1. React and Next.js imports
2. External library imports
3. Internal package imports (`@repo/*`, `@budget-app/*`)
4. Relative imports
5. Type imports

```typescript
// React/Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// External libraries
import { format } from 'date-fns';

// Internal packages
import { Button } from '@repo/ui/components';
import { formatCurrency } from '@repo/utils';

// Relative imports
import { BudgetCard } from './budget-card';

// Types
import type { Budget } from '@/lib/types';
```

### CSS/Styling

- Use Tailwind CSS for styling
- Use `cn()` utility for conditional classes
- Keep component-specific styles in the component file
- Use CSS variables for theming

```typescript
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-6 shadow-sm',
        className
      )}
      {...props}
    />
  );
}
```

## 💬 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |

### Scopes

Use the package name as scope:
- `web` - Main web application
- `ui` - UI package
- `utils` - Utils package
- `eslint` - ESLint config
- `root` - Root level changes

### Examples

```bash
feat(web): add budget creation form
fix(ui): correct button disabled state styling
docs(root): update README with new commands
chore(eslint): update eslint rules for react-hooks
```

## 🔀 Pull Request Process

### Before Submitting

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**

3. **Run quality checks**
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm format
   ```

4. **Commit your changes** following the commit guidelines

5. **Push to your branch**
   ```bash
   git push origin feat/your-feature-name
   ```

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] TypeScript types are properly defined
- [ ] All lint and type checks pass
- [ ] Documentation is updated if needed
- [ ] PR description clearly describes the changes
- [ ] Linked relevant issues

### Review Process

1. Create a Pull Request with a clear description
2. Request review from maintainers
3. Address any feedback
4. Once approved, the PR will be merged

## ➕ Adding New Features

### Adding a New Page/Route

1. Create the page in `apps/web/app/(dashboard)/`
2. Add necessary API routes in `apps/web/app/api/`
3. Create components in `apps/web/components/`
4. Add types to `apps/web/lib/types.ts`

### Adding a New Shared Component

1. Create the component in `packages/ui/src/components/`
2. Export from the appropriate index file
3. Add to package exports if needed
4. Document usage in Storybook

### Adding a New Utility Function

1. Add to `packages/utils/src/`
2. Export from the index file
3. Add TypeScript types
4. Document with JSDoc comments

## 🐛 Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment information (OS, Node version, etc.)

## 💡 Feature Requests

Feature requests are welcome! Please include:

- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Mockups or examples (if applicable)

---

Thank you for contributing! 🎉

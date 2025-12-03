# @repo/eslint-config

Shared ESLint configuration for the Budget App monorepo.

## 📚 Overview

This package provides consistent ESLint rules across all packages in the monorepo.

## 📦 Available Configurations

| Config | Description | Use For |
|--------|-------------|---------|
| `@repo/eslint-config/base` | Base TypeScript rules | Node.js packages |
| `@repo/eslint-config/react` | React + TypeScript rules | React applications |

## 🚀 Usage

### For a React/Next.js App

```javascript
// eslint.config.mjs
import reactConfig from '@repo/eslint-config/react';

export default [
  ...reactConfig,
  {
    // Your custom overrides
  }
];
```

### For a Node.js Package

```javascript
// eslint.config.js
import baseConfig from '@repo/eslint-config/base';

export default [
  ...baseConfig,
  {
    // Your custom overrides
  }
];
```

## 🔧 Included Rules

### Base Configuration
- TypeScript recommended rules
- Import ordering
- Turbo lint rules
- Prettier integration

### React Configuration
- All base rules
- React recommended rules
- React Hooks rules
- JSX accessibility rules

## 📁 Structure

```
tools/eslint/
├── base.js           # Base TypeScript config
├── react.js          # React config (extends base)
├── package.json
└── tsconfig.json
```

## 📝 Customization

Override rules in your package's `eslint.config.js`:

```javascript
import baseConfig from '@repo/eslint-config/base';

export default [
  ...baseConfig,
  {
    rules: {
      // Your overrides
      '@typescript-eslint/no-unused-vars': 'warn',
    }
  }
];
```

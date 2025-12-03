# @repo/typescript-config

Shared TypeScript configurations for the Budget App monorepo.

## 📚 Overview

This package provides base TypeScript configurations that can be extended by other packages.

## 📦 Available Configurations

| Config                  | Description                  | Use For            |
| ----------------------- | ---------------------------- | ------------------ |
| `base.json`             | Base configuration           | General packages   |
| `internal-package.json` | For internal shared packages | `@repo/*` packages |
| `vite.json`             | Vite applications            | Vite-based apps    |

## 🚀 Usage

### For a Shared Package

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/internal-package.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### For a Next.js App

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "src", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### For a Vite App

```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/vite.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## 📁 Structure

```
tools/typescript/
├── base.json              # Base configuration
├── internal-package.json  # For internal packages
├── vite.json             # For Vite apps
└── package.json
```

## 🔧 Base Configuration

The base configuration includes:

- Strict mode enabled
- ES2022 target
- ESNext module
- Bundler module resolution
- Declaration files generation
- Strict null checks
- No implicit any

## 📝 Customization

Extend and override in your package's `tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    // Your overrides
    "strict": true,
    "noUnusedLocals": true
  }
}
```

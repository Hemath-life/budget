# Architecture

This document describes the high-level architecture of the Budget App monorepo.

## Overview

Budget App is built as a **Turborepo** monorepo, allowing for:

- Shared code across multiple applications
- Consistent tooling and configuration
- Efficient builds with caching
- Independent versioning of packages

## Monorepo Structure

```
budget-app/
├── apps/                    # Deployable applications
├── packages/                # Shared libraries and packages
├── tools/                   # Shared tooling configurations
└── docs/                    # Documentation
```

### Apps (`/apps`)

Deployable applications that are the end products.

| App      | Package Name      | Description                  |
| -------- | ----------------- | ---------------------------- |
| `budget` | `@budget-app/web` | Main Next.js web application |

### Packages (`/packages`)

Shared libraries used across applications.

| Package | Name          | Description                |
| ------- | ------------- | -------------------------- |
| `ui`    | `@repo/ui`    | Shared React UI components |
| `utils` | `@repo/utils` | Shared utility functions   |
| `mds`   | -             | Markdown documentation     |

### Tools (`/tools`)

Shared tooling configurations.

| Tool         | Name                      | Description                |
| ------------ | ------------------------- | -------------------------- |
| `eslint`     | `@repo/eslint-config`     | ESLint configuration       |
| `prettier`   | `@repo/prettier-config`   | Prettier configuration     |
| `tailwind`   | `@repo/tailwind-config`   | Tailwind CSS configuration |
| `typescript` | `@repo/typescript-config` | TypeScript configuration   |

## Dependency Graph

```
@budget-app/web
    ├── @repo/ui
    │   ├── @repo/eslint-config
    │   ├── @repo/prettier-config
    │   ├── @repo/tailwind-config
    │   └── @repo/typescript-config
    └── @repo/utils
        ├── @repo/eslint-config
        ├── @repo/prettier-config
        └── @repo/typescript-config
```

## Build Pipeline

Turborepo manages the build pipeline with:

1. **Dependency Ordering**: Packages are built in the correct order
2. **Caching**: Build outputs are cached to speed up subsequent builds
3. **Parallel Execution**: Independent tasks run in parallel

### Key Tasks

| Task        | Description                    |
| ----------- | ------------------------------ |
| `build`     | Build all packages and apps    |
| `dev`       | Start development servers      |
| `lint`      | Run ESLint across all packages |
| `typecheck` | Run TypeScript type checking   |
| `format`    | Check Prettier formatting      |

## Technology Decisions

### Why Turborepo?

- **Speed**: Incremental builds with remote caching
- **Simplicity**: Easy to set up and maintain
- **Flexibility**: Works with any package manager

### Why pnpm?

- **Disk Space**: Efficient storage with hard links
- **Speed**: Faster than npm/yarn
- **Strict**: Prevents phantom dependencies
- **Workspace**: Excellent monorepo support

### Why Next.js?

- **Performance**: Server-side rendering and static generation
- **DX**: Great developer experience
- **Ecosystem**: Rich plugin ecosystem
- **Deployment**: Easy deployment to Vercel

## Adding New Packages

### New Application

1. Create directory: `apps/<app-name>`
2. Initialize with `pnpm init`
3. Name it `@budget-app/<app-name>`
4. Add necessary dependencies
5. Configure build scripts

### New Shared Package

1. Create directory: `packages/<package-name>`
2. Initialize with `pnpm init`
3. Name it `@repo/<package-name>`
4. Configure TypeScript and build scripts
5. Export from package entry point

## Environment Configuration

Each app manages its own environment variables:

```
apps/budget/.env.local      # Local development
apps/budget/.env.example    # Template for setup
```

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Configure build settings for each app
3. Set environment variables
4. Deploy

### Self-Hosted

1. Build all packages: `pnpm build`
2. Copy app build output to server
3. Run with Node.js or container

## Further Reading

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Next.js Documentation](https://nextjs.org/docs)

# Budget App

A comprehensive personal finance and budget management application built with modern web technologies.

## 📚 Overview

This is a **Turborepo** monorepo containing a full-stack budget management application with the following features:

- 💰 **Budget Tracking** - Create and manage budgets across categories
- 📊 **Expense Management** - Track daily expenses and transactions
- 🎯 **Financial Goals** - Set and monitor savings goals
- 🔄 **Recurring Transactions** - Automate recurring bills and income
- ⏰ **Reminders** - Get notified about upcoming bills
- 📈 **Reports & Analytics** - Visualize spending patterns
- 📤 **Data Export** - Export your financial data

## 🏗️ Project Structure

```
budget-app/
├── apps/                    # Application packages
│   └── budget/              # Main Next.js web application (@budget-app/web)
│       ├── app/             # Next.js App Router pages
│       │   ├── (auth)/      # Authentication pages (login, signup)
│       │   ├── (dashboard)/ # Dashboard and feature pages
│       │   └── api/         # API routes
│       ├── components/      # React components
│       │   ├── budgets/     # Budget management components
│       │   ├── categories/  # Category management
│       │   ├── dashboard/   # Dashboard widgets
│       │   ├── goals/       # Goal tracking
│       │   ├── transactions/# Transaction components
│       │   └── ui/          # Shared UI components
│       ├── lib/             # Utilities and services
│       └── public/          # Static assets
│
├── packages/                # Shared packages
│   ├── ui/                  # Shared UI component library (@repo/ui)
│   │   ├── components/      # Reusable React components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # UI utilities
│   ├── utils/               # Shared utilities (@repo/utils)
│   │   └── tanstack/        # TanStack Query utilities
│   └── mds/                 # Markdown documentation
│
├── tools/                   # Shared tooling configurations
│   ├── eslint/              # ESLint configuration (@repo/eslint-config)
│   ├── prettier/            # Prettier configuration (@repo/prettier-config)
│   ├── tailwind/            # Tailwind CSS configuration (@repo/tailwind-config)
│   └── typescript/          # TypeScript configuration (@repo/typescript-config)
│
├── package.json             # Root package.json with workspace scripts
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── turbo.json               # Turborepo pipeline configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 22.10.0
- **pnpm** 10.13.1 or later

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/budget-app.git
   cd budget-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   pnpm env:copy-example
   ```
   Then edit the `.env` files in each app with your configuration.

4. **Set up the database**
   ```bash
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

The app will be available at [http://localhost:3000](http://localhost:3000).

## 📜 Available Scripts

### Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm start` | Start all apps in production mode |
| `pnpm clean` | Clean all build artifacts and node_modules |

### Database

| Command | Description |
|---------|-------------|
| `pnpm db:push` | Push database schema changes |
| `pnpm db:studio` | Open Drizzle Studio for database management |

### Code Quality

| Command | Description |
|---------|-------------|
| `pnpm lint` | Run ESLint across all packages |
| `pnpm lint:fix` | Fix linting issues automatically |
| `pnpm format` | Check code formatting with Prettier |
| `pnpm format:fix` | Fix formatting issues |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm knip` | Find unused code and dependencies |

### UI Development

| Command | Description |
|---------|-------------|
| `pnpm ui-add` | Add new shadcn/ui components |
| `pnpm storybook` | Start Storybook development server |

## 📦 Packages

### Apps

| Package | Description |
|---------|-------------|
| `@budget-app/web` | Main Next.js web application |

### Shared Packages

| Package | Description |
|---------|-------------|
| `@repo/ui` | Shared React UI components (shadcn/ui based) |
| `@repo/utils` | Shared utility functions and hooks |

### Tooling

| Package | Description |
|---------|-------------|
| `@repo/eslint-config` | Shared ESLint configuration |
| `@repo/prettier-config` | Shared Prettier configuration |
| `@repo/tailwind-config` | Shared Tailwind CSS configuration |
| `@repo/typescript-config` | Shared TypeScript configuration |

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Database**: SQLite with [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)

### Tooling
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linting**: [ESLint 9](https://eslint.org/)
- **Formatting**: [Prettier](https://prettier.io/)
- **Type Checking**: [TypeScript 5](https://www.typescriptlang.org/)

## 🗂️ Adding New Packages

### Adding a new app

```bash
mkdir -p apps/new-app
cd apps/new-app
pnpm init
```

Update the `package.json` with the proper name following the convention: `@budget-app/<app-name>`

### Adding a new shared package

```bash
mkdir -p packages/new-package
cd packages/new-package
pnpm init
```

Update the `package.json` with the proper name following the convention: `@repo/<package-name>`

### Adding dependencies

```bash
# Add to a specific package
pnpm add <package> --filter @budget-app/web

# Add to root (for tooling)
pnpm add -D <package> -w

# Add from catalog
pnpm add <package>@catalog: --filter @repo/ui
```

## 🔧 Configuration

### Environment Variables

Each app may have its own `.env` file. See `.env.example` in each app for required variables.

### Turborepo

The `turbo.json` file defines the build pipeline and caching strategy. Key features:

- **Remote Caching**: Enable by setting up Vercel Remote Cache
- **Parallel Execution**: Tasks run in parallel where possible
- **Dependency Tracking**: Automatic rebuilds when dependencies change

## 📝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## 📄 License

This project is licensed under the MIT License.

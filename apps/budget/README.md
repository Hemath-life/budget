# @budget-app/web

The main Next.js web application for the Budget App monorepo.

## 📚 Overview

This is the primary user-facing application that provides:

- 💰 Budget creation and management
- 📊 Expense tracking and categorization
- 🎯 Financial goal setting and progress tracking
- 🔄 Recurring transaction management
- ⏰ Bill reminders and notifications
- 📈 Financial reports and analytics
- 📤 Data export capabilities

## 🏗️ Project Structure

```
apps/budget/
├── app/                     # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── login/           # Login page
│   │   └── signup/          # Signup page
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── budgets/         # Budget management
│   │   ├── categories/      # Category management
│   │   ├── dashboard/       # Main dashboard
│   │   ├── expenses/        # Expense tracking
│   │   ├── export/          # Data export
│   │   ├── goals/           # Financial goals
│   │   ├── income/          # Income tracking
│   │   ├── recurring/       # Recurring transactions
│   │   ├── reminders/       # Bill reminders
│   │   ├── reports/         # Financial reports
│   │   ├── settings/        # User settings
│   │   └── transactions/    # Transaction history
│   └── api/                 # API routes
├── components/              # React components
│   ├── budgets/             # Budget-related components
│   ├── categories/          # Category components
│   ├── dashboard/           # Dashboard widgets
│   ├── goals/               # Goal components
│   ├── landing/             # Landing page components
│   ├── layout/              # Layout components
│   ├── providers/           # Context providers
│   ├── recurring/           # Recurring transaction components
│   ├── reminders/           # Reminder components
│   ├── reports/             # Report components
│   ├── settings/            # Settings components
│   ├── shared/              # Shared components
│   ├── transactions/        # Transaction components
│   └── ui/                  # UI primitives (shadcn/ui)
├── lib/                     # Utilities and services
│   ├── api.ts               # API client
│   ├── auth.ts              # Authentication utilities
│   ├── db.ts                # Database client
│   ├── hooks.ts             # Custom React hooks
│   ├── plans.ts             # Subscription plans
│   ├── types.ts             # TypeScript types
│   ├── utils.ts             # Utility functions
│   └── services/            # Business logic services
├── public/                  # Static assets
└── plan/                    # Documentation
    └── DATABASE_DESIGN.md   # Database schema documentation
```

## 🚀 Development

### Prerequisites

From the monorepo root:

```bash
# Install all dependencies
pnpm install

# Copy environment files
pnpm env:copy-example

# Set up the database
pnpm db:push
```

### Running the App

```bash
# From monorepo root
pnpm dev

# Or specifically this app
pnpm dev --filter @budget-app/web
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Building

```bash
# Build this app
pnpm build --filter @budget-app/web
```

### Linting

```bash
# Lint this app
pnpm lint --filter @budget-app/web
```

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable              | Description          | Required |
| --------------------- | -------------------- | -------- |
| `DATABASE_URL`        | SQLite database path | Yes      |
| `NEXT_PUBLIC_APP_URL` | Application URL      | Yes      |
| `NODE_ENV`            | Environment mode     | No       |

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Radix UI + shadcn/ui
- **Styling**: Tailwind CSS 4
- **State**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Database**: SQLite + better-sqlite3
- **Charts**: Recharts
- **Animations**: Framer Motion

## 📦 Dependencies

### Internal Packages

- `@repo/ui` - Shared UI components
- `@repo/utils` - Shared utilities

### Key External Dependencies

- `next` - React framework
- `react` / `react-dom` - UI library
- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form management
- `zod` - Schema validation
- `better-sqlite3` - SQLite database
- `recharts` - Charting library
- `framer-motion` - Animations
- `lucide-react` - Icons

## 🗂️ API Routes

| Route               | Description            |
| ------------------- | ---------------------- |
| `/api/budgets`      | Budget CRUD operations |
| `/api/categories`   | Category management    |
| `/api/transactions` | Transaction operations |
| `/api/goals`        | Financial goals        |
| `/api/recurring`    | Recurring transactions |
| `/api/reminders`    | Bill reminders         |
| `/api/dashboard`    | Dashboard data         |
| `/api/settings`     | User settings          |
| `/api/export`       | Data export            |

## 🔒 Authentication

Authentication is handled via the `(auth)` route group with:

- `/login` - User login
- `/signup` - New user registration

Protected routes are in the `(dashboard)` route group.

## 📝 Contributing

See the [CONTRIBUTING.md](../../CONTRIBUTING.md) in the monorepo root for development guidelines.

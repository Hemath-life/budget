# Errors & Empty States Module Instructions

> Guidelines for using error and empty state components in `@repo/ui`

---

## 📦 Import

```typescript
// Error Components
import { NotFound, ServerError, UnauthorizedError } from '@repo/ui/errors';

// Empty State Components
import {
  EmptyState,
  NoSearchResults,
  NoData,
  EmptyInbox,
} from '@repo/ui/empty';
```

---

## 🧩 Error Components

| Component           | HTTP Status | Use Case                 |
| ------------------- | ----------- | ------------------------ |
| `NotFound`          | 404         | Page/resource not found  |
| `ServerError`       | 500         | Server/unexpected errors |
| `UnauthorizedError` | 401/403     | Authentication required  |

---

## ❌ NotFound - 404 Page

For when a page or resource doesn't exist.

### Usage

```typescript
import { NotFound } from '@repo/ui/errors';

// In app/not-found.tsx (Next.js)
export default function NotFoundPage() {
  return (
    <NotFound
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      backUrl="/"
      backLabel="Back to Home"
    />
  );
}
```

### With Custom Actions

```typescript
<NotFound
  title="Budget Not Found"
  description="This budget may have been deleted or you don't have access."
  backUrl="/budgets"
  backLabel="View All Budgets"
  showHomeLink
/>
```

### Props

```typescript
interface NotFoundProps {
  title?: string; // Default: "Page Not Found"
  description?: string; // Default: Generic message
  backUrl?: string; // Default: "/"
  backLabel?: string; // Default: "Go Back"
  showHomeLink?: boolean; // Show additional home link
  className?: string;
}
```

---

## 💥 ServerError - 500 Page

For server errors and unexpected failures.

### Usage

```typescript
import { ServerError } from '@repo/ui/errors';

// In app/error.tsx (Next.js)
export default function ErrorPage({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ServerError
      title="Something Went Wrong"
      description="An unexpected error occurred. Please try again."
      onRetry={reset}
      showDetails={process.env.NODE_ENV === 'development'}
      errorDetails={error.message}
    />
  );
}
```

### Props

```typescript
interface ServerErrorProps {
  title?: string; // Default: "Server Error"
  description?: string;
  onRetry?: () => void; // Retry callback
  showDetails?: boolean; // Show error details (dev only)
  errorDetails?: string; // Error message/stack
  backUrl?: string;
  className?: string;
}
```

---

## 🔒 UnauthorizedError - 401/403 Page

For authentication and authorization errors.

### Usage

```typescript
import { UnauthorizedError } from '@repo/ui/errors';

// When user isn't authenticated
<UnauthorizedError
  title="Sign In Required"
  description="Please sign in to access this page."
  loginUrl="/login"
  loginLabel="Sign In"
/>

// When user lacks permission
<UnauthorizedError
  title="Access Denied"
  description="You don't have permission to view this page."
  backUrl="/dashboard"
  backLabel="Back to Dashboard"
/>
```

### Props

```typescript
interface UnauthorizedErrorProps {
  title?: string; // Default: "Unauthorized"
  description?: string;
  loginUrl?: string; // Login page URL
  loginLabel?: string; // Default: "Sign In"
  backUrl?: string;
  backLabel?: string;
  className?: string;
}
```

---

## 🧩 Empty State Components

| Component         | Use Case               |
| ----------------- | ---------------------- |
| `EmptyState`      | Generic empty state    |
| `NoSearchResults` | Search with no results |
| `NoData`          | No data in a section   |
| `EmptyInbox`      | No items in a list     |

---

## 📭 EmptyState - Generic Empty State

Flexible empty state for any situation.

### Usage

```typescript
import { EmptyState } from '@repo/ui/empty';
import { FolderOpen, Plus } from 'lucide-react';

<EmptyState
  icon={<FolderOpen className="h-12 w-12" />}
  title="No Categories"
  description="Get started by creating your first category."
  action={
    <Button onClick={() => setIsDialogOpen(true)}>
      <Plus className="mr-2 h-4 w-4" />
      Add Category
    </Button>
  }
/>
```

### Inline Empty State

```typescript
// For tables or lists
<EmptyState
  variant="inline"
  icon={<FileText className="h-8 w-8" />}
  title="No transactions"
  description="Transactions will appear here."
/>
```

### Props

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'inline' | 'card';
  className?: string;
}
```

---

## 🔍 NoSearchResults - Search Empty State

For search queries with no results.

### Usage

```typescript
import { NoSearchResults } from '@repo/ui/empty';

{filteredItems.length === 0 ? (
  <NoSearchResults
    query={searchQuery}
    onClear={() => setSearchQuery('')}
    suggestions={['Try different keywords', 'Check your spelling']}
  />
) : (
  <ItemList items={filteredItems} />
)}
```

### Props

```typescript
interface NoSearchResultsProps {
  query?: string; // The search query
  onClear?: () => void; // Clear search callback
  suggestions?: string[]; // Helpful suggestions
  className?: string;
}
```

---

## 📊 NoData - Section Empty State

For sections with no data yet.

### Usage

```typescript
import { NoData } from '@repo/ui/empty';

{goals.length === 0 ? (
  <NoData
    title="No Goals Yet"
    description="Set a savings goal to start tracking your progress."
    action={
      <Button onClick={openCreateDialog}>
        Create Goal
      </Button>
    }
  />
) : (
  <GoalsList goals={goals} />
)}
```

---

## 📬 EmptyInbox - List Empty State

For empty lists or inboxes.

### Usage

```typescript
import { EmptyInbox } from '@repo/ui/empty';

{notifications.length === 0 ? (
  <EmptyInbox
    title="All Caught Up"
    description="You have no new notifications."
  />
) : (
  <NotificationList items={notifications} />
)}
```

---

## 🎨 Common Patterns

### Conditional Empty States

```typescript
function TransactionList({ transactions, isLoading, searchQuery }) {
  if (isLoading) {
    return <Skeleton className="h-[200px]" />;
  }

  if (transactions.length === 0 && searchQuery) {
    return (
      <NoSearchResults
        query={searchQuery}
        onClear={() => setSearchQuery('')}
      />
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="h-12 w-12" />}
        title="No Transactions"
        description="Add your first transaction to get started."
        action={
          <Button onClick={openCreateDialog}>
            Add Transaction
          </Button>
        }
      />
    );
  }

  return <TransactionTable transactions={transactions} />;
}
```

### Error Boundary Pattern

```typescript
// app/dashboard/error.tsx
'use client';

import { ServerError } from '@repo/ui/errors';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ServerError
      title="Dashboard Error"
      description="Failed to load dashboard data."
      onRetry={reset}
    />
  );
}
```

### Protected Route Pattern

```typescript
// With auth check
function ProtectedPage({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-screen" />;
  }

  if (!isAuthenticated) {
    return (
      <UnauthorizedError
        title="Sign In Required"
        description="Please sign in to continue."
        loginUrl="/login"
      />
    );
  }

  return children;
}
```

### Empty State in Cards

```typescript
<Card>
  <CardHeader>
    <CardTitle>Recent Activity</CardTitle>
  </CardHeader>
  <CardContent>
    {activities.length === 0 ? (
      <EmptyState
        variant="inline"
        icon={<Activity className="h-8 w-8" />}
        title="No recent activity"
      />
    ) : (
      <ActivityList activities={activities} />
    )}
  </CardContent>
</Card>
```

---

## ✅ Best Practices

### 1. Always Provide Actions

```typescript
// ✅ Good - gives user a clear next step
<EmptyState
  title="No Categories"
  description="Create categories to organize your expenses."
  action={<Button>Create Category</Button>}
/>

// ❌ Avoid - no way for user to proceed
<EmptyState
  title="No Categories"
/>
```

### 2. Use Appropriate Component

```typescript
// 404 errors → NotFound
// Server errors → ServerError
// Auth errors → UnauthorizedError
// Empty lists with search → NoSearchResults
// Empty lists without search → EmptyState / NoData
```

### 3. Helpful Descriptions

```typescript
// ✅ Good - explains what to do
<NoSearchResults
  query={query}
  suggestions={[
    'Try searching with fewer words',
    'Check your spelling',
    'Use different keywords',
  ]}
/>

// ❌ Avoid - not helpful
<NoSearchResults query={query} />
```

### 4. Match Empty State to Context

```typescript
// Full page empty state
<EmptyState variant="default" ... />

// Inside card/table
<EmptyState variant="inline" ... />

// Standalone card
<EmptyState variant="card" ... />
```

---

## 📚 Related

- [Layout Instructions](./layout.instructions.md) - Page layouts
- [Components Instructions](./components.instructions.md) - UI components
- [Loaders Instructions](./loaders.instructions.md) - Loading states

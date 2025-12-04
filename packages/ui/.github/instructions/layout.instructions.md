# Layout Module Instructions

> Guidelines for using page layout components in `@repo/ui/layout`

---

## 📦 Import

```typescript
import { AppLayout, AuthLayout, Section, Main } from '@repo/ui/layout';
```

---

## 🧩 Available Components

| Component    | Description                 | Use Case             |
| ------------ | --------------------------- | -------------------- |
| `AppLayout`  | Main application wrapper    | Dashboard pages      |
| `AuthLayout` | Authentication page wrapper | Login, signup pages  |
| `Section`    | Content section container   | Page sections        |
| `Main`       | Main content wrapper        | Primary content area |

---

## 🏠 AppLayout - Dashboard Pages

The main layout for authenticated pages with sidebar navigation.

### Usage

```typescript
import { AppLayout } from '@repo/ui/layout';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <h1>Dashboard Content</h1>
        {/* Page content */}
      </div>
    </AppLayout>
  );
}
```

### With Custom Props

```typescript
<AppLayout
  sidebar={<CustomSidebar />}
  header={<CustomHeader />}
  className="bg-background"
>
  {/* Content */}
</AppLayout>
```

### Features

- Responsive sidebar (collapsible on mobile)
- Header with user menu
- Main content area with scroll
- Breadcrumb support

---

## 🔐 AuthLayout - Authentication Pages

Clean layout for login, signup, and authentication-related pages.

### Usage

```typescript
import { AuthLayout } from '@repo/ui/layout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <LoginForm />
      </div>
    </AuthLayout>
  );
}
```

### With Branding

```typescript
<AuthLayout
  logo={<Logo />}
  title="Budget App"
  description="Track your finances"
>
  <LoginForm />
</AuthLayout>
```

### Features

- Centered content
- Optional logo/branding
- Clean, minimal design
- Full height viewport

---

## 📄 Section - Content Sections

Container for page sections with consistent styling.

### Basic Usage

```typescript
import { Section } from '@repo/ui/layout';

<Section>
  <h2>Recent Transactions</h2>
  <TransactionList />
</Section>
```

### With Title and Actions

```typescript
<Section
  title="Budgets"
  description="Manage your monthly budgets"
  action={
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Budget
    </Button>
  }
>
  <BudgetList />
</Section>
```

### Variants

```typescript
// Default - with padding and background
<Section>Content</Section>

// Transparent - no background
<Section variant="transparent">Content</Section>

// Card - card-like appearance
<Section variant="card">Content</Section>
```

### Props

```typescript
interface SectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'transparent' | 'card';
  className?: string;
}
```

---

## 📐 Main - Content Wrapper

Wrapper for the main content area with consistent padding and max-width.

### Usage

```typescript
import { Main } from '@repo/ui/layout';

export default function ExpensesPage() {
  return (
    <Main>
      <h1 className="text-3xl font-bold mb-6">Expenses</h1>
      <ExpenseList />
    </Main>
  );
}
```

### With Custom Width

```typescript
// Full width
<Main className="max-w-full">
  <WideContent />
</Main>

// Narrow content
<Main className="max-w-2xl mx-auto">
  <NarrowForm />
</Main>
```

### Features

- Consistent padding
- Responsive max-width
- Proper spacing from header/sidebar

---

## 🎨 Layout Patterns

### Dashboard Page Pattern

```typescript
import { AppLayout, Section, Main } from '@repo/ui/layout';

export default function DashboardPage() {
  return (
    <AppLayout>
      <Main>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button>Export</Button>
        </div>

        {/* Stats Cards */}
        <Section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard title="Total Budget" value="$4,500" />
          <StatCard title="Total Spent" value="$2,340" />
          <StatCard title="Remaining" value="$2,160" />
          <StatCard title="Goals" value="3 Active" />
        </Section>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <Section title="Recent Transactions">
            <TransactionList />
          </Section>
          <Section title="Budget Overview">
            <BudgetChart />
          </Section>
        </div>
      </Main>
    </AppLayout>
  );
}
```

### Settings Page Pattern

```typescript
import { AppLayout, Section, Main } from '@repo/ui/layout';

export default function SettingsPage() {
  return (
    <AppLayout>
      <Main className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          <Section variant="card" title="Profile">
            <ProfileForm />
          </Section>

          <Section variant="card" title="Preferences">
            <PreferencesForm />
          </Section>

          <Section variant="card" title="Notifications">
            <NotificationSettings />
          </Section>

          <Section variant="card" title="Danger Zone">
            <DeleteAccountSection />
          </Section>
        </div>
      </Main>
    </AppLayout>
  );
}
```

### List Page Pattern (CRUD)

```typescript
import { AppLayout, Section, Main } from '@repo/ui/layout';

export default function CategoriesPage() {
  return (
    <AppLayout>
      <Main>
        {/* Header with Action */}
        <Section
          title="Categories"
          description="Manage expense and income categories"
          action={
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          }
        />

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <Input placeholder="Search categories..." />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            {/* ... */}
          </Select>
        </div>

        {/* List/Table */}
        <Section variant="card">
          <CategoryTable categories={categories} />
        </Section>

        {/* Dialogs */}
        <EditDialog ... />
        <AlertDialog ... />
      </Main>
    </AppLayout>
  );
}
```

### Auth Page Pattern

```typescript
import { AuthLayout } from '@repo/ui/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/components';

export default function LoginPage() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-muted-foreground">
            Sign in to your account
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
```

---

## ✅ Best Practices

### 1. Use Consistent Page Structure

```typescript
// Every dashboard page should follow this structure:
<AppLayout>
  <Main>
    {/* Page Header */}
    {/* Page Content */}
    {/* Dialogs (at end) */}
  </Main>
</AppLayout>
```

### 2. Use Section for Grouping

```typescript
// Group related content in Sections
<Section title="Overview">
  {/* Overview content */}
</Section>

<Section title="Details">
  {/* Details content */}
</Section>
```

### 3. Responsive Layouts

```typescript
// Use responsive grid for cards/sections
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### 4. Consistent Spacing

```typescript
// Use consistent spacing classes
<Main>
  <h1 className="text-3xl font-bold mb-6">Title</h1>
  <div className="space-y-6">
    <Section>...</Section>
    <Section>...</Section>
  </div>
</Main>
```

---

## 📚 Related

- [Components Instructions](./components.instructions.md) - UI components
- [Header Instructions](./header.instructions.md) - Header components
- [Navigation Instructions](./nbars.instructions.md) - Navigation components

# Loaders & Navigation Module Instructions

> Guidelines for using loading and navigation components in `@repo/ui`

---

## 📦 Import

```typescript
// Loaders
import { NavigationProgress } from '@repo/ui/loaders';

// Navigation Bars
import { AppSidebar, BreadcrumbNav, MobileNav } from '@repo/ui/nbars';

// Header
import { AppHeader, UserMenu, ThemeToggle } from '@repo/ui/header';
```

---

## ⏳ NavigationProgress

Shows a progress bar during page navigation (useful for Next.js route transitions).

### Usage in Layout

```typescript
// app/template.tsx
import { NavigationProgress } from '@repo/ui/loaders';

export default function Template({ children }) {
  return (
    <>
      <NavigationProgress />
      {children}
    </>
  );
}
```

### Customization

```typescript
<NavigationProgress
  color="#3b82f6"          // Progress bar color
  height={3}               // Bar height in pixels
  delay={100}              // Delay before showing (ms)
/>
```

### Props

```typescript
interface NavigationProgressProps {
  color?: string; // Default: theme primary
  height?: number; // Default: 2
  delay?: number; // Default: 0
  className?: string;
}
```

---

## 📍 BreadcrumbNav

Shows current location in navigation hierarchy.

### Usage

```typescript
import { BreadcrumbNav } from '@repo/ui/nbars';

<BreadcrumbNav
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Budgets', href: '/budgets' },
    { label: 'Monthly Budget' }, // Current page (no href)
  ]}
/>
```

### In Page Layout

```typescript
function BudgetDetailPage({ budget }) {
  return (
    <Main>
      <BreadcrumbNav
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Budgets', href: '/budgets' },
          { label: budget.name },
        ]}
      />
      <h1 className="text-3xl font-bold mt-4">{budget.name}</h1>
      {/* Content */}
    </Main>
  );
}
```

### Props

```typescript
interface BreadcrumbItem {
  label: string;
  href?: string; // If omitted, treated as current page
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode; // Default: "/"
  className?: string;
}
```

---

## 📱 AppSidebar

Main application sidebar navigation.

### Usage

```typescript
import { AppSidebar } from '@repo/ui/nbars';

<AppSidebar
  items={[
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Reports', href: '/reports', icon: BarChart },
      ],
    },
    {
      title: 'Finance',
      items: [
        { label: 'Transactions', href: '/transactions', icon: Receipt },
        { label: 'Budgets', href: '/budgets', icon: Wallet },
        { label: 'Categories', href: '/categories', icon: Folder },
      ],
    },
  ]}
  activeHref={pathname}
/>
```

### Props

```typescript
interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface AppSidebarProps {
  items: NavGroup[];
  activeHref?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  footer?: React.ReactNode;
  className?: string;
}
```

---

## 📱 MobileNav

Bottom navigation for mobile devices.

### Usage

```typescript
import { MobileNav } from '@repo/ui/nbars';

<MobileNav
  items={[
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Budgets', href: '/budgets', icon: Wallet },
    { label: 'Add', href: '/add', icon: Plus, highlight: true },
    { label: 'Goals', href: '/goals', icon: Target },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]}
  activeHref={pathname}
/>
```

### Props

```typescript
interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean; // Emphasized item (like FAB)
}

interface MobileNavProps {
  items: MobileNavItem[];
  activeHref?: string;
  className?: string;
}
```

---

## 🎯 AppHeader

Application header with user menu and actions.

### Usage

```typescript
import { AppHeader } from '@repo/ui/header';

<AppHeader
  title="Budget App"
  user={{
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg',
  }}
  onLogout={handleLogout}
/>
```

### With Breadcrumb

```typescript
<AppHeader
  breadcrumb={
    <BreadcrumbNav
      items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings' },
      ]}
    />
  }
  user={user}
/>
```

### Props

```typescript
interface AppHeaderProps {
  title?: string;
  logo?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  onLogout?: () => void;
  actions?: React.ReactNode;
  className?: string;
}
```

---

## 👤 UserMenu

User profile dropdown menu.

### Usage

```typescript
import { UserMenu } from '@repo/ui/header';

<UserMenu
  user={{
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg',
  }}
  menuItems={[
    { label: 'Profile', href: '/settings/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Help', href: '/help', icon: HelpCircle },
    { type: 'separator' },
    { label: 'Sign Out', onClick: handleLogout, icon: LogOut },
  ]}
/>
```

### Props

```typescript
interface UserMenuProps {
  user: {
    name: string;
    email?: string;
    avatar?: string;
  };
  menuItems: MenuItem[];
  className?: string;
}

interface MenuItem {
  label?: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  type?: 'separator';
}
```

---

## 🌓 ThemeToggle

Toggle between light/dark mode.

### Usage

```typescript
import { ThemeToggle } from '@repo/ui/header';

// In header or settings
<ThemeToggle />

// With label
<ThemeToggle showLabel />
```

### Props

```typescript
interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}
```

---

## 🎨 Complete Navigation Pattern

```typescript
// app/(dashboard)/layout.tsx
import { AppLayout, Main } from '@repo/ui/layout';
import { AppSidebar, MobileNav, BreadcrumbNav } from '@repo/ui/nbars';
import { AppHeader } from '@repo/ui/header';
import { NavigationProgress } from '@repo/ui/loaders';

const navItems = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: Home },
      { label: 'Reports', href: '/reports', icon: BarChart },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Transactions', href: '/transactions', icon: Receipt },
      { label: 'Budgets', href: '/budgets', icon: Wallet },
      { label: 'Goals', href: '/goals', icon: Target },
      { label: 'Categories', href: '/categories', icon: Folder },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

const mobileNavItems = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Budgets', href: '/budgets', icon: Wallet },
  { label: 'Add', href: '/transactions/new', icon: Plus, highlight: true },
  { label: 'Goals', href: '/goals', icon: Target },
  { label: 'More', href: '/settings', icon: Menu },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      <NavigationProgress />
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <AppSidebar items={navItems} activeHref={pathname} />
        </div>

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <AppHeader user={user} onLogout={logout} />

          {/* Main Content */}
          <main className="flex-1 overflow-auto pb-16 md:pb-0">
            {children}
          </main>

          {/* Mobile Bottom Nav */}
          <div className="md:hidden">
            <MobileNav items={mobileNavItems} activeHref={pathname} />
          </div>
        </div>
      </div>
    </>
  );
}
```

---

## ✅ Best Practices

### 1. Show Progress During Navigation

```typescript
// Always include NavigationProgress in layouts
<NavigationProgress />
```

### 2. Consistent Sidebar Structure

```typescript
// Group navigation items logically
const navItems = [
  { title: 'Main', items: [...] },      // Primary navigation
  { title: 'Finance', items: [...] },   // Feature-specific
  { title: 'Settings', items: [...] },  // Settings at bottom
];
```

### 3. Mobile-First Navigation

```typescript
// Prioritize 4-5 most important items for mobile
const mobileNavItems = [
  // Most used items only
  { label: 'Home', ... },
  { label: 'Primary Action', ..., highlight: true },
  { label: 'More', ... }, // For access to other items
];
```

### 4. Active State Indication

```typescript
// Always pass current path for active state
<AppSidebar
  items={navItems}
  activeHref={usePathname()}
/>
```

---

## 📚 Related

- [Layout Instructions](./layout.instructions.md) - Page layouts
- [Components Instructions](./components.instructions.md) - UI components

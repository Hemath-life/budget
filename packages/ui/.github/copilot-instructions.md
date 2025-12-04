# GitHub Copilot Instructions for @repo/ui

> This document provides comprehensive guidelines for GitHub Copilot to generate consistent, high-quality, and reusable code for the `@repo/ui` shared component library.

---

## 📋 Table of Contents

1. [Package Overview](#package-overview)
2. [Architecture & Structure](#architecture--structure)
3. [Coding Standards](#coding-standards)
4. [Component Patterns](#component-patterns)
5. [Type Definitions](#type-definitions)
6. [Styling Guidelines](#styling-guidelines)
7. [Export Conventions](#export-conventions)
8. [Hook Patterns](#hook-patterns)
9. [Form Components](#form-components)
10. [Dialog Components](#dialog-components)
11. [Layout Components](#layout-components)
12. [Error & Empty States](#error--empty-states)
13. [Testing Guidelines](#testing-guidelines)
14. [Documentation](#documentation)

---

## 📦 Package Overview

### Purpose

`@repo/ui` is a shared UI component library for the Budget App monorepo, built with:

- **React** - Component framework
- **Radix UI** - Accessible primitives
- **shadcn/ui** - Beautiful, customizable components
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety
- **class-variance-authority (CVA)** - Variant management

### Key Principles

1. **Reusability** - Components should be generic and configurable
2. **Accessibility** - All components must be accessible (ARIA, keyboard navigation)
3. **Type Safety** - Full TypeScript coverage with exported types
4. **Consistency** - Follow established patterns and naming conventions
5. **Composition** - Prefer composition over configuration

---

## 🏗️ Architecture & Structure

### Directory Structure

```
packages/ui/src/
├── index.ts              # Main entry point - re-exports core modules
├── assets/               # Static assets (icons, images, i18n)
│   └── i18n/             # Internationalization files
├── common/               # Shared utilities and common components
│   ├── font/             # Font configuration
│   ├── i18n/             # i18n utilities
│   ├── search/           # Search components
│   ├── table/            # Table utilities
│   └── theme/            # Theme configuration
├── components/           # React components
│   └── ui/               # Base shadcn/ui components
│       └── custom/       # Custom extended components
├── config/               # Configuration files
├── dialogs/              # Dialog/Modal components
├── empty/                # Empty state components
├── errors/               # Error page components
├── forms/                # Form field components
│   └── sections/         # Reusable form sections
├── header/               # Header components
├── hooks/                # Custom React hooks
├── layout/               # Layout components
├── lib/                  # Utility functions
├── loaders/              # Loading state components
├── nbars/                # Navigation bars (sidebar, topbar)
├── pages/                # Full page components
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

### Module Organization

Each module directory should contain:

- `index.ts` - Barrel export file
- Component files (`.tsx`)
- Type definitions (inline or separate `.types.ts`)
- Styles if needed (prefer Tailwind)

---

## 📝 Coding Standards

### File Naming

```
✅ Correct:
- button.tsx              # Base component (lowercase)
- form-field.tsx          # Multi-word component (kebab-case)
- use-dialog-state.tsx    # Custom hook (use- prefix)
- base-dialog.tsx         # Base/abstract component
- PageHeader.tsx          # Page-level component (PascalCase for complex)

❌ Avoid:
- Button.tsx              # Don't use PascalCase for base components
- formField.tsx           # Don't use camelCase
- UseDialogState.tsx      # Don't capitalize hooks
```

### Import Order

```typescript
// 1. React and core libraries
import * as React from 'react';
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

// 3. Internal aliases (using #/)
import { cn } from '#/lib/utils';
import { Button } from '#/components/ui/button';

// 4. Relative imports
import { type CustomType } from './types';

// 5. Types (use type imports when possible)
import type { ComponentProps, ReactNode } from 'react';
```

### TypeScript Guidelines

```typescript
// ✅ Export types alongside components
export interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

// ✅ Use React.ComponentProps for extending HTML elements
interface InputProps extends React.ComponentProps<'input'> {
  error?: string;
}

// ✅ Use descriptive generic names
function useDialogState<T extends string | boolean>(
  initialState: T | null = null
) { ... }

// ✅ Export types from index files
export { FormField, type FormFieldProps } from './form-field';
```

---

## 🧩 Component Patterns

### Base Component Template

```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '#/lib/utils';

// 1. Define variants using CVA
const componentVariants = cva(
  'base-classes here', // Base styles
  {
    variants: {
      variant: {
        default: 'default-variant-classes',
        secondary: 'secondary-variant-classes',
      },
      size: {
        default: 'default-size-classes',
        sm: 'small-size-classes',
        lg: 'large-size-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// 2. Define props interface
export interface ComponentNameProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof componentVariants> {
  // Additional custom props
  customProp?: string;
}

// 3. Create component using function declaration
function ComponentName({
  className,
  variant,
  size,
  customProp,
  ...props
}: ComponentNameProps) {
  return (
    <div
      data-slot="component-name"
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// 4. Export component and variants
export { ComponentName, componentVariants };
```

### Compound Component Pattern

```typescript
// For complex components with sub-components
import * as React from 'react';
import { cn } from '#/lib/utils';

// Root component
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('rounded-xl border bg-card', className)}
      {...props}
    />
  );
}

// Sub-components
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex flex-col gap-1.5 p-6', className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('font-semibold leading-none', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('p-6 pt-0', className)}
      {...props}
    />
  );
}

// Export all parts
export { Card, CardHeader, CardTitle, CardContent };
```

### Slot Pattern (Polymorphic Components)

```typescript
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

interface PolymorphicProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
}

function PolymorphicButton({
  asChild = false,
  className,
  ...props
}: PolymorphicProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={className} {...props} />;
}

// Usage:
// <PolymorphicButton asChild><Link href="/">Home</Link></PolymorphicButton>
```

---

## 🎨 Styling Guidelines

### Tailwind CSS Conventions

```typescript
// ✅ Use cn() for conditional classes
import { cn } from '#/lib/utils';

<div className={cn(
  'base-classes',
  variant === 'primary' && 'primary-classes',
  disabled && 'opacity-50 pointer-events-none',
  className, // Always spread className last
)} />

// ✅ Use CSS variables for theming
'bg-background text-foreground'
'border-border'
'text-muted-foreground'
'bg-primary text-primary-foreground'
'bg-destructive text-destructive-foreground'

// ✅ Use responsive prefixes
'flex flex-col md:flex-row lg:grid lg:grid-cols-3'

// ✅ Use dark mode variants
'bg-white dark:bg-gray-900'
'border-gray-200 dark:border-gray-800'
```

### Size Classes Convention

```typescript
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full w-[95vw] h-[95vh]',
};

// For icons and buttons
const iconSizes = {
  sm: 'size-4',
  default: 'size-5',
  lg: 'size-6',
};
```

### Data Attributes

```typescript
// ✅ Use data-slot for component identification
<button data-slot="button" />
<div data-slot="card-header" />

// ✅ Use data-state for state management
<div data-state={isOpen ? 'open' : 'closed'} />
```

---

## 📤 Export Conventions

### Index File Pattern

```typescript
// src/components/ui/index.ts

// Named exports with explicit type exports
export { Button, buttonVariants, type ButtonProps } from './button';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

// For hooks
export { useDialogState } from './use-dialog-state';
export type { DialogState } from './use-dialog-state';
```

### Module Barrel Exports

```typescript
// src/forms/index.ts

// Export component and type together
export { FormSection, type FormSectionProps } from './form-section';
export { SelectField, type SelectFieldProps } from './select-field';
export { FormField, type FormFieldProps } from './form-field';

// Re-export sub-modules
export {
  AddressSection,
  type AddressSectionProps,
  type AddressData,
} from './sections/address-section';
```

### Package.json Exports

```json
{
  "exports": {
    ".": {
      "types": "./dist/src/index.d.ts",
      "default": "./src/index.ts"
    },
    "./components/ui": {
      "types": "./dist/src/components/ui/index.d.ts",
      "default": "./src/components/ui/index.ts"
    },
    "./hooks": {
      "types": "./dist/src/hooks/index.d.ts",
      "default": "./src/hooks/index.ts"
    }
  }
}
```

---

## 🪝 Hook Patterns

### Custom Hook Template

```typescript
import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook description
 * @param initialState - Initial state description
 * @returns Object containing state and handlers
 * @example
 * const { value, setValue, reset } = useCustomHook('initial');
 */
export function useCustomHook<T>(initialState: T) {
  const [value, setValue] = useState<T>(initialState);

  const reset = useCallback(() => {
    setValue(initialState);
  }, [initialState]);

  const computedValue = useMemo(() => {
    // Computed logic
    return value;
  }, [value]);

  return {
    value,
    setValue,
    reset,
    computedValue,
  } as const;
}

// Export default for backward compatibility if needed
export default useCustomHook;
```

### Dialog State Hook Pattern

```typescript
/**
 * Hook for managing dialog/modal state with type-safe actions
 * @template T - Union type of possible dialog states
 * @param initialState - Initial dialog state
 * @returns Tuple of [current state, toggle function]
 * @example
 * const [dialog, setDialog] = useDialogState<'edit' | 'delete'>();
 * setDialog('edit'); // Opens edit dialog
 * setDialog('edit'); // Closes (toggles) edit dialog
 */
export function useDialogState<T extends string | boolean>(
  initialState: T | null = null,
) {
  const [open, _setOpen] = useState<T | null>(initialState);

  const setOpen = useCallback((value: T | null) => {
    _setOpen((prev) => (prev === value ? null : value));
  }, []);

  return [open, setOpen] as const;
}
```

---

## 📝 Form Components

### Form Field Pattern

```typescript
import type { ChangeEvent, ReactNode } from 'react';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';

export interface FormFieldProps {
  // Required props
  id: string;
  label: ReactNode;
  value: string | number | Date;
  onChange: (value: string) => void;

  // Optional configuration
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  required?: boolean;
  disabled?: boolean;

  // Validation
  error?: string;
  description?: string;
  maxLength?: number;
  min?: string | number;
  max?: string | number;

  // Customization
  className?: string;
  children?: ReactNode;      // For custom input rendering
  labelAddon?: ReactNode;    // Additional label content
}

export function FormField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  error,
  description,
  className = '',
  children,
  labelAddon,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor={id}
          className={error ? 'text-destructive' : ''}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {labelAddon}
      </div>

      {children ?? (
        <Input
          id={id}
          type={type}
          value={String(value || '')}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={error ? 'border-destructive' : ''}
          {...inputProps}
        />
      )}

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
```

### Form Section Pattern

```typescript
export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  className,
  collapsible = false,
  defaultOpen = true,
}: FormSectionProps) {
  // Implementation with optional Collapsible wrapper
}
```

---

## 💬 Dialog Components

### Base Dialog Pattern

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';
import { cn } from '#/lib/utils';

export interface BaseDialogProps {
  // State
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Content
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;

  // Customization
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full w-[95vw] h-[95vh]',
};

export function BaseDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  className,
  contentClassName,
  headerClassName,
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(sizeClasses[size], contentClassName, className)}
      >
        <DialogHeader className={cn('text-left', headerClassName)}>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

### Specialized Dialogs

```typescript
// Confirmation Dialog
export interface ConfirmationDialogProps
  extends Omit<BaseDialogProps, 'children'> {
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
}

// Form Dialog
export interface FormDialogProps<T> extends BaseDialogProps {
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: Partial<T>;
  isLoading?: boolean;
  submitText?: string;
}

// View Dialog (read-only)
export interface ViewDialogProps extends BaseDialogProps {
  data: Record<string, unknown>;
  fields: Array<{
    key: string;
    label: string;
    render?: (value: unknown) => ReactNode;
  }>;
}
```

---

## 📐 Layout Components

### Layout Pattern

```typescript
import { cn } from '#/lib/utils';

interface LayoutProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  grid?: boolean;
}

export function Layout({ fixed, grid, className, ...props }: LayoutProps) {
  return (
    <section
      className={cn(
        grid && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        fixed && 'no-scrollbar overflow-auto pt-4 relative',
        className,
      )}
      {...props}
    />
  );
}

Layout.displayName = 'Layout';
```

### Main Content Area

```typescript
interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
}

export function Main({ fixed, className, ...props }: MainProps) {
  return (
    <main
      className={cn(
        'peer-[.header-fixed]/header:mt-[var(--header-height)]',
        fixed && 'fixed-main',
        className,
      )}
      {...props}
    />
  );
}
```

---

## ⚠️ Error & Empty States

### Error Component Pattern

```typescript
import { Button } from '#/components/ui/button';
import { cn } from '#/lib/utils';

interface ErrorPageProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean;
  code?: string | number;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  onRetry?: () => void;
}

export function ErrorPage({
  className,
  minimal = false,
  code = '500',
  title = 'Something went wrong',
  message = 'We apologize for the inconvenience.',
  showHomeButton = true,
  showBackButton = true,
  onRetry,
}: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && (
          <h1 className="text-[7rem] leading-tight font-bold">{code}</h1>
        )}
        <span className="font-medium">{title}</span>
        <p className="text-muted-foreground text-center">{message}</p>

        {!minimal && (
          <div className="mt-6 flex gap-4">
            {showBackButton && (
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
            )}
            {onRetry && (
              <Button variant="outline" onClick={onRetry}>
                Try Again
              </Button>
            )}
            {showHomeButton && (
              <Button onClick={() => router.push('/')}>
                Back to Home
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Empty State Pattern

```typescript
interface EmptyCardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyCard({
  icon,
  title,
  description,
  action,
  className,
}: EmptyCardProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className,
    )}>
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

---

## 🧪 Testing Guidelines

### Component Test Template

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports asChild prop', () => {
    render(
      <Button asChild>
        <a href="/">Link Button</a>
      </Button>
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
```

### Hook Test Template

```typescript
import { renderHook, act } from '@testing-library/react';
import { useDialogState } from './use-dialog-state';

describe('useDialogState', () => {
  it('initializes with null by default', () => {
    const { result } = renderHook(() => useDialogState());
    expect(result.current[0]).toBeNull();
  });

  it('toggles state correctly', () => {
    const { result } = renderHook(() => useDialogState<'edit'>());

    act(() => {
      result.current[1]('edit');
    });
    expect(result.current[0]).toBe('edit');

    act(() => {
      result.current[1]('edit');
    });
    expect(result.current[0]).toBeNull();
  });
});
```

---

## 📖 Documentation

### JSDoc Standards

```typescript
/**
 * A customizable button component with multiple variants and sizes.
 *
 * @component
 * @example
 * // Default button
 * <Button>Click me</Button>
 *
 * @example
 * // Destructive variant with loading state
 * <Button variant="destructive" disabled={isLoading}>
 *   {isLoading ? 'Deleting...' : 'Delete'}
 * </Button>
 *
 * @example
 * // As a link using asChild
 * <Button asChild>
 *   <Link href="/dashboard">Go to Dashboard</Link>
 * </Button>
 */
export function Button({ ... }: ButtonProps) { ... }

/**
 * Custom hook for managing modal/dialog state with toggle behavior.
 *
 * @template T - The type of dialog state (typically a string union)
 * @param {T | null} initialState - The initial state of the dialog
 * @returns {readonly [T | null, (value: T | null) => void]} A tuple containing
 *   the current state and a setter function that toggles the state
 *
 * @example
 * // Basic usage with string union
 * const [dialogType, setDialogType] = useDialogState<'create' | 'edit' | 'delete'>();
 *
 * // Open create dialog
 * setDialogType('create');
 *
 * // Close dialog (toggle same value)
 * setDialogType('create');
 */
export function useDialogState<T extends string | boolean>(...) { ... }
```

### Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <IconPlus className="size-4" />
        Add Item
      </>
    ),
  },
};
```

---

## ✅ Checklist for New Components

When creating a new component, ensure:

- [ ] Props interface is exported with the component
- [ ] Component uses `cn()` for className merging
- [ ] Component spreads `className` prop last
- [ ] Component uses `data-slot` attribute
- [ ] Component supports `ref` forwarding if needed
- [ ] Component has proper TypeScript types
- [ ] Component is exported from the module's `index.ts`
- [ ] Component has JSDoc documentation
- [ ] Component follows naming conventions
- [ ] Component is accessible (keyboard, ARIA)
- [ ] Component uses CSS variables for theming
- [ ] Component has Storybook story (if applicable)

---

## 🔄 Common Patterns Quick Reference

```typescript
// ✅ Extending HTML element props
interface Props extends React.ComponentProps<'div'> { ... }

// ✅ Merging classNames
className={cn(baseClasses, conditionalClass, className)}

// ✅ Forwarding refs
const Component = React.forwardRef<HTMLDivElement, Props>((props, ref) => ...)

// ✅ Type-safe event handlers
onChange={(e: React.ChangeEvent<HTMLInputElement>) => ...}

// ✅ Default props
function Component({ size = 'default', variant = 'primary', ...props }: Props)

// ✅ Render prop pattern
children?: ReactNode | ((props: RenderProps) => ReactNode)

// ✅ Polymorphic component
const Comp = asChild ? Slot : 'button';
```

---

## 📚 Resources

- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Class Variance Authority](https://cva.style/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

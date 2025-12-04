# @repo/ui - Instruction Index

> Quick reference to all module-specific instructions

---

## 📚 Module Instructions

| Module                   | File                                                                       | Description                             |
| ------------------------ | -------------------------------------------------------------------------- | --------------------------------------- |
| **Forms**                | [forms.instructions.md](./forms.instructions.md)                           | Form fields, validation, patterns       |
| **Dialogs**              | [dialogs.instructions.md](./dialogs.instructions.md)                       | Modals, confirmations, alerts           |
| **Components**           | [components.instructions.md](./components.instructions.md)                 | Base UI components (Button, Card, etc.) |
| **Layout**               | [layout.instructions.md](./layout.instructions.md)                         | Page layouts (AppLayout, Section)       |
| **Hooks**                | [hooks.instructions.md](./hooks.instructions.md)                           | Custom React hooks                      |
| **Errors & Empty**       | [errors-empty.instructions.md](./errors-empty.instructions.md)             | Error pages, empty states               |
| **Navigation & Loaders** | [navigation-loaders.instructions.md](./navigation-loaders.instructions.md) | Sidebar, breadcrumbs, progress          |

---

## 🚀 Quick Start

### Import Paths

```typescript
// Forms
import { FormField, SelectField, DateField, SwitchField } from '@repo/ui/forms';

// Dialogs
import { AlertDialog, EditDialog, ContributeDialog } from '@repo/ui/dialogs';

// Components
import { Button, Card, Input, Select, Badge } from '@repo/ui/components';

// Layout
import { AppLayout, AuthLayout, Section, Main } from '@repo/ui/layout';

// Hooks
import { useDialogState, useIsMobile } from '@repo/ui/hooks';

// Errors
import { NotFound, ServerError, UnauthorizedError } from '@repo/ui/errors';

// Empty States
import { EmptyState, NoSearchResults, NoData } from '@repo/ui/empty';

// Loaders
import { NavigationProgress } from '@repo/ui/loaders';

// Navigation
import { AppSidebar, BreadcrumbNav, MobileNav } from '@repo/ui/nbars';

// Header
import { AppHeader, UserMenu, ThemeToggle } from '@repo/ui/header';
```

---

## 🎯 Common Patterns

### CRUD Page Pattern

```typescript
import { AppLayout, Section, Main } from '@repo/ui/layout';
import { AlertDialog, EditDialog } from '@repo/ui/dialogs';
import { FormField, SelectField } from '@repo/ui/forms';
import { useDialogState } from '@repo/ui/hooks';
import { EmptyState } from '@repo/ui/empty';
import { Button, Card } from '@repo/ui/components';

function ItemManager() {
  const dialog = useDialogState<Item>();
  const deleteDialog = useDialogState<Item>();

  return (
    <AppLayout>
      <Main>
        <Section
          title="Items"
          action={<Button onClick={dialog.open}>Add Item</Button>}
        >
          {items.length === 0 ? (
            <EmptyState
              title="No Items"
              action={<Button onClick={dialog.open}>Create First Item</Button>}
            />
          ) : (
            <ItemList
              items={items}
              onEdit={dialog.openForEdit}
              onDelete={deleteDialog.openForEdit}
            />
          )}
        </Section>

        <EditDialog
          open={dialog.isOpen}
          onOpenChange={(open) => !open && dialog.close()}
          title={dialog.editItem ? 'Edit Item' : 'Create Item'}
        >
          <FormField id="name" label="Name" ... />
          <SelectField id="category" label="Category" ... />
        </EditDialog>

        <AlertDialog
          open={deleteDialog.isOpen}
          onOpenChange={(open) => !open && deleteDialog.close()}
          title="Delete Item"
          variant="delete"
          onConfirm={() => handleDelete(deleteDialog.editItem!.id)}
        />
      </Main>
    </AppLayout>
  );
}
```

---

## 📖 Main Documentation

For comprehensive documentation, see the main [Copilot Instructions](../copilot-instructions.md).

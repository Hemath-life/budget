# Hooks Module Instructions

> Guidelines for using custom React hooks in `@repo/ui/hooks`

---

## 📦 Import

```typescript
import { useDialogState, useIsMobile } from '@repo/ui/hooks';
```

---

## 🧩 Available Hooks

| Hook             | Description                             | Use Case            |
| ---------------- | --------------------------------------- | ------------------- |
| `useDialogState` | Manage dialog open/close and edit state | CRUD dialogs        |
| `useIsMobile`    | Detect mobile viewport                  | Responsive behavior |

---

## 💬 useDialogState - Dialog State Management

Manages dialog visibility and edit item state for CRUD operations.

### Basic Usage

```typescript
import { useDialogState } from '@repo/ui/hooks';

function CategoryManager() {
  const {
    isOpen,          // Is dialog open
    editItem,        // Item being edited (null for create)
    open,            // Open dialog
    close,           // Close dialog
    openForEdit,     // Open dialog with item
    reset,           // Reset state
  } = useDialogState<Category>();

  return (
    <>
      <Button onClick={open}>Add Category</Button>

      <CategoryList
        onEdit={(category) => openForEdit(category)}
      />

      <EditDialog
        open={isOpen}
        onOpenChange={(open) => !open && close()}
        title={editItem ? 'Edit Category' : 'Create Category'}
      >
        <CategoryForm
          initialData={editItem}
          onSubmit={(data) => {
            if (editItem) {
              updateCategory(editItem.id, data);
            } else {
              createCategory(data);
            }
            close();
          }}
        />
      </EditDialog>
    </>
  );
}
```

### Full API

```typescript
interface UseDialogState<T> {
  isOpen: boolean;
  editItem: T | null;
  open: () => void;
  close: () => void;
  openForEdit: (item: T) => void;
  reset: () => void;
  setIsOpen: (open: boolean) => void;
  setEditItem: (item: T | null) => void;
}
```

### Advanced Usage

```typescript
import { useDialogState } from '@repo/ui/hooks';

function BudgetManager() {
  // Create dialog
  const createDialog = useDialogState();

  // Edit dialog (separate from create)
  const editDialog = useDialogState<Budget>();

  // Delete confirmation
  const deleteDialog = useDialogState<Budget>();

  return (
    <>
      <Button onClick={createDialog.open}>New Budget</Button>

      <BudgetList
        onEdit={(budget) => editDialog.openForEdit(budget)}
        onDelete={(budget) => deleteDialog.openForEdit(budget)}
      />

      {/* Create Dialog */}
      <EditDialog
        open={createDialog.isOpen}
        onOpenChange={(open) => !open && createDialog.close()}
        title="Create Budget"
      >
        <BudgetForm onSubmit={handleCreate} />
      </EditDialog>

      {/* Edit Dialog */}
      <EditDialog
        open={editDialog.isOpen}
        onOpenChange={(open) => !open && editDialog.close()}
        title="Edit Budget"
      >
        <BudgetForm
          initialData={editDialog.editItem}
          onSubmit={handleUpdate}
        />
      </EditDialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => !open && deleteDialog.close()}
        title="Delete Budget"
        description={`Delete "${deleteDialog.editItem?.name}"?`}
        variant="delete"
        onConfirm={() => handleDelete(deleteDialog.editItem!.id)}
      />
    </>
  );
}
```

### With Form Reset

```typescript
function TransactionForm() {
  const dialog = useDialogState<Transaction>();
  const [formData, setFormData] = useState(initialState);

  // Reset form when dialog closes or editItem changes
  useEffect(() => {
    if (dialog.editItem) {
      setFormData({
        amount: dialog.editItem.amount,
        description: dialog.editItem.description,
        // ...
      });
    } else {
      setFormData(initialState);
    }
  }, [dialog.editItem]);

  const handleClose = () => {
    dialog.close();
    setFormData(initialState); // Reset form
  };

  return (
    <EditDialog
      open={dialog.isOpen}
      onOpenChange={(open) => !open && handleClose()}
      ...
    />
  );
}
```

---

## 📱 useIsMobile - Mobile Detection

Detects if the current viewport is mobile-sized.

### Basic Usage

```typescript
import { useIsMobile } from '@repo/ui/hooks';

function Navigation() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileNav />;
  }

  return <DesktopNav />;
}
```

### Custom Breakpoint

```typescript
import { useIsMobile } from '@repo/ui/hooks';

function Component() {
  // Default breakpoint is 768px
  const isMobile = useIsMobile();

  // Custom breakpoint
  const isTablet = useIsMobile(1024);

  // ...
}
```

### With Responsive Dialog

```typescript
import { useIsMobile } from '@repo/ui/hooks';
import { Dialog, Drawer } from '@repo/ui/components';

function ResponsiveDialog({ open, onOpenChange, children }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {children}
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}
```

### With Layout Adjustments

```typescript
import { useIsMobile } from '@repo/ui/hooks';

function Dashboard() {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
    )}>
      <StatCard />
      <StatCard />
      <StatCard />
      <StatCard />
    </div>
  );
}
```

---

## 🎨 Common Patterns

### Combined Dialog Management

```typescript
import { useDialogState, useIsMobile } from '@repo/ui/hooks';

function ItemManager() {
  const dialog = useDialogState<Item>();
  const isMobile = useIsMobile();

  return (
    <EditDialog
      open={dialog.isOpen}
      onOpenChange={(open) => !open && dialog.close()}
      size={isMobile ? 'full' : 'md'}
      title={dialog.editItem ? 'Edit Item' : 'New Item'}
    >
      {/* Form */}
    </EditDialog>
  );
}
```

### Multiple CRUD Dialogs Pattern

```typescript
import { useDialogState } from '@repo/ui/hooks';

interface UseManagerDialogs<T> {
  create: UseDialogState<never>;
  edit: UseDialogState<T>;
  delete: UseDialogState<T>;
  view: UseDialogState<T>;
}

function useManagerDialogs<T>(): UseManagerDialogs<T> {
  return {
    create: useDialogState(),
    edit: useDialogState<T>(),
    delete: useDialogState<T>(),
    view: useDialogState<T>(),
  };
}

// Usage
function GoalManager() {
  const dialogs = useManagerDialogs<Goal>();

  return (
    <>
      <Button onClick={dialogs.create.open}>Add Goal</Button>

      <GoalList
        onEdit={(goal) => dialogs.edit.openForEdit(goal)}
        onDelete={(goal) => dialogs.delete.openForEdit(goal)}
        onView={(goal) => dialogs.view.openForEdit(goal)}
      />

      <EditDialog open={dialogs.create.isOpen} ... />
      <EditDialog open={dialogs.edit.isOpen} ... />
      <AlertDialog open={dialogs.delete.isOpen} ... />
      <ViewDialog open={dialogs.view.isOpen} ... />
    </>
  );
}
```

---

## ✅ Best Practices

### 1. Type Your Dialog State

```typescript
// ✅ Good - typed for the item being edited
const dialog = useDialogState<Category>();

// ❌ Avoid - no type information
const dialog = useDialogState();
```

### 2. Reset State on Close

```typescript
// ✅ Good - reset form when closing
const handleClose = () => {
  dialog.close();
  resetForm();
};

<EditDialog
  onOpenChange={(open) => !open && handleClose()}
/>
```

### 3. Use Separate Dialogs for Different Actions

```typescript
// ✅ Good - separate dialog state for different actions
const createDialog = useDialogState();
const editDialog = useDialogState<Item>();
const deleteDialog = useDialogState<Item>();

// ❌ Avoid - one dialog for everything (complex logic)
const dialog = useDialogState<Item>();
const [mode, setMode] = useState<'create' | 'edit' | 'delete'>('create');
```

### 4. Prefer CSS for Responsive Over JS

```typescript
// ✅ Good - CSS-first responsive
<div className="hidden md:block">Desktop</div>
<div className="md:hidden">Mobile</div>

// Use useIsMobile only when CSS isn't enough
// (different component types, different data loading, etc.)
```

---

## 📚 Related

- [Dialogs Instructions](./dialogs.instructions.md) - Dialog components
- [Forms Instructions](./forms.instructions.md) - Form components
- [Components Instructions](./components.instructions.md) - UI components

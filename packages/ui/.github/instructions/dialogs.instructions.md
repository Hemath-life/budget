# Dialogs Module Instructions

> Guidelines for using dialog/modal components in `@repo/ui/dialogs`

---

## 📦 Import

```typescript
import {
  AlertDialog,
  EditDialog,
  ContributeDialog,
  ConfirmationDialog,
  FormDialog,
  ViewDialog,
  FileUploadDialog,
  SearchDialog,
  BaseDialog,
} from '@repo/ui/dialogs';
```

---

## 🧩 Available Dialogs

| Component            | Use Case                       | When to Use                      |
| -------------------- | ------------------------------ | -------------------------------- |
| `AlertDialog`        | Delete confirmations, warnings | Destructive actions, alerts      |
| `EditDialog`         | Create/edit forms              | CRUD operations                  |
| `ContributeDialog`   | Quick amount entry             | Goal contributions, quick inputs |
| `ConfirmationDialog` | Generic confirmations          | Yes/no decisions                 |
| `FormDialog`         | Form submission                | Custom form dialogs              |
| `ViewDialog`         | Read-only display              | Viewing details                  |
| `FileUploadDialog`   | File uploads                   | Drag & drop file input           |
| `SearchDialog`       | Searchable selection           | Picking from large lists         |
| `BaseDialog`         | Custom implementations         | Building custom dialogs          |

---

## 🔴 AlertDialog - Delete & Warning Confirmations

### Use Cases

- Delete confirmations
- Warning messages
- Error acknowledgments
- Destructive action confirmations

### Variants

- `info` - Blue, informational
- `success` - Green, positive actions
- `warning` - Yellow, caution needed
- `error` - Red, error states
- `delete` - Red with trash icon

### Examples

```typescript
import { AlertDialog } from '@repo/ui/dialogs';

// Delete Confirmation
<AlertDialog
  open={!!deleteId}
  onOpenChange={() => setDeleteId(null)}
  title="Delete Category"
  description="Are you sure you want to delete this category? This action cannot be undone."
  variant="delete"
  onConfirm={handleDelete}
  confirmText="Delete"
  isLoading={isDeleting}
/>

// Warning Dialog
<AlertDialog
  open={showWarning}
  onOpenChange={setShowWarning}
  title="Unsaved Changes"
  description="You have unsaved changes. Are you sure you want to leave?"
  variant="warning"
  onConfirm={handleLeave}
  confirmText="Leave"
  cancelText="Stay"
/>

// Error Acknowledgment
<AlertDialog
  open={showError}
  onOpenChange={setShowError}
  title="Operation Failed"
  description="Failed to save changes. Please try again."
  variant="error"
  onConfirm={() => setShowError(false)}
  confirmText="OK"
  showCancel={false}
/>

// Success Notification
<AlertDialog
  open={showSuccess}
  onOpenChange={setShowSuccess}
  title="Success!"
  description="Your budget has been created successfully."
  variant="success"
  onConfirm={() => setShowSuccess(false)}
  confirmText="Great"
/>
```

### Props

```typescript
interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'delete';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string; // Default: 'Confirm'
  cancelText?: string; // Default: 'Cancel'
  isLoading?: boolean;
  icon?: React.ReactNode; // Custom icon override
  className?: string;
}
```

---

## ✏️ EditDialog - Create/Edit Forms

### Use Cases

- Creating new items
- Editing existing items
- Settings forms
- Multi-field input forms

### Sizes

- `sm` - Small forms (1-3 fields)
- `md` - Medium forms (default)
- `lg` - Large forms (many fields)
- `xl` - Extra large forms
- `full` - Full screen (complex forms)

### Examples

```typescript
import { EditDialog } from '@repo/ui/dialogs';
import { FormField, SelectField, DateField } from '@repo/ui/forms';

// Create Dialog
<EditDialog
  open={isDialogOpen}
  onOpenChange={(open) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  }}
  title="Create Budget"
  description="Set up a new budget for a category"
  onSubmit={handleSubmit}
  submitText="Create"
  isLoading={isSubmitting}
>
  <FormField
    id="amount"
    label="Budget Amount"
    type="number"
    value={amount}
    onChange={setAmount}
    required
  />
  <SelectField
    id="category"
    label="Category"
    value={category}
    onChange={setCategory}
    options={categories}
    required
  />
</EditDialog>

// Edit Dialog
<EditDialog
  open={!!editItem}
  onOpenChange={(open) => !open && setEditItem(null)}
  title="Edit Goal"
  onSubmit={handleUpdate}
  submitText="Update"
  size="lg"
>
  <FormField id="name" label="Goal Name" value={name} onChange={setName} required />
  <FormField id="target" label="Target Amount" type="number" value={target} onChange={setTarget} />
  <DateField id="deadline" label="Deadline" value={deadline} onChange={setDeadline} />
</EditDialog>

// Large Scrollable Dialog
<EditDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Complete Profile"
  size="lg"
  scrollable
  maxScrollHeight="max-h-[60vh]"
  onSubmit={handleSave}
>
  {/* Multiple form sections */}
  <FormSection title="Personal Info">
    <FormField id="name" ... />
    <FormField id="email" ... />
  </FormSection>
  <FormSection title="Preferences">
    <SwitchField id="notifications" ... />
  </FormSection>
</EditDialog>

// Without Cancel Button (wizard step)
<EditDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Step 1: Basic Info"
  showCancel={false}
  submitText="Next"
  onSubmit={handleNext}
>
  {/* Fields */}
</EditDialog>
```

### Props

```typescript
interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onSubmit?: () => void | Promise<void>;
  onCancel?: () => void;
  submitText?: string; // Default: 'Save'
  cancelText?: string; // Default: 'Cancel'
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
  showCancel?: boolean; // Default: true
  showSubmit?: boolean; // Default: true
  submitVariant?: 'default' | 'destructive' | 'outline' | 'secondary';
  scrollable?: boolean;
  maxScrollHeight?: string;
  className?: string;
  footerClassName?: string;
  footer?: React.ReactNode; // Custom footer override
}
```

---

## 💰 ContributeDialog - Quick Amount Entry

### Use Cases

- Adding contributions to goals
- Quick payment entries
- Simple single-field forms

### Example

```typescript
import { ContributeDialog } from '@repo/ui/dialogs';
import { FormField } from '@repo/ui/forms';

<ContributeDialog
  open={isContributeOpen}
  onOpenChange={setIsContributeOpen}
  title="Add Contribution"
  description="Add funds to your savings goal"
  onSubmit={handleContribute}
  submitText="Add"
  isLoading={isContributing}
>
  <FormField
    id="amount"
    label="Amount"
    type="number"
    value={contributeAmount}
    onChange={setContributeAmount}
    placeholder="0.00"
    min={0}
    step={0.01}
    required
  />
</ContributeDialog>
```

### Props

```typescript
interface ContributeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string; // Default: 'Add Contribution'
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  onSubmit: () => void | Promise<void>;
  onCancel?: () => void;
  submitText?: string; // Default: 'Add'
  cancelText?: string; // Default: 'Cancel'
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
  className?: string;
}
```

---

## ✅ ConfirmationDialog - Generic Confirmations

### Use Cases

- Action confirmations
- Yes/no decisions
- Proceed/cancel choices

### Types

- `info` - Informational (blue)
- `success` - Positive action (green)
- `warning` - Caution needed (yellow)
- `error` - Destructive action (red)

### Example

```typescript
import { ConfirmationDialog } from '@repo/ui/dialogs';

<ConfirmationDialog
  open={showConfirm}
  onOpenChange={setShowConfirm}
  title="Confirm Action"
  description="Are you sure you want to proceed with this action?"
  type="warning"
  onConfirm={handleConfirm}
  confirmText="Proceed"
  cancelText="Cancel"
  isDestructive={false}
/>
```

---

## 📂 FileUploadDialog - File Uploads

### Use Cases

- Document uploads
- Image uploads
- Bulk file imports

### Example

```typescript
import { FileUploadDialog } from '@repo/ui/dialogs';

<FileUploadDialog
  open={isUploadOpen}
  onOpenChange={setIsUploadOpen}
  title="Upload Documents"
  onUpload={handleUpload}
  acceptedFileTypes={['image/*', 'application/pdf']}
  maxFileSize={10 * 1024 * 1024} // 10MB
  maxFiles={5}
  showPreview
/>
```

---

## 🔍 SearchDialog - Searchable Selection

### Use Cases

- Selecting from large lists
- Searching categories/items
- Filterable selection

### Example

```typescript
import { SearchDialog, type SearchItem } from '@repo/ui/dialogs';

const items: SearchItem[] = categories.map(c => ({
  id: c.id,
  title: c.name,
  subtitle: c.type,
}));

<SearchDialog
  open={isSearchOpen}
  onOpenChange={setIsSearchOpen}
  title="Select Category"
  items={items}
  onSelect={handleSelect}
  searchPlaceholder="Search categories..."
  emptyMessage="No categories found"
/>
```

---

## 👁️ ViewDialog - Read-Only Display

### Use Cases

- Viewing item details
- Read-only information
- Preview content

### Example

```typescript
import { ViewDialog } from '@repo/ui/dialogs';

<ViewDialog
  open={isViewOpen}
  onOpenChange={setIsViewOpen}
  title="Transaction Details"
  showCloseButton
  scrollable
>
  <div className="space-y-4">
    <div>
      <p className="text-sm text-muted-foreground">Amount</p>
      <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
    </div>
    <div>
      <p className="text-sm text-muted-foreground">Date</p>
      <p>{formatDate(transaction.date)}</p>
    </div>
  </div>
</ViewDialog>
```

---

## 🔄 Migration from Raw Dialogs

### Before (Verbose)

```typescript
// ❌ Don't do this anymore
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/components/ui';

<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Category</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete this category?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### After (Clean)

```typescript
// ✅ Use reusable dialogs
import { AlertDialog } from '@repo/ui/dialogs';

<AlertDialog
  open={!!deleteId}
  onOpenChange={() => setDeleteId(null)}
  title="Delete Category"
  description="Are you sure you want to delete this category?"
  variant="delete"
  onConfirm={handleDelete}
  confirmText="Delete"
/>
```

---

## ✅ Best Practices

### 1. Reset Form on Close

```typescript
<EditDialog
  open={isOpen}
  onOpenChange={(open) => {
    setIsOpen(open);
    if (!open) resetForm(); // Reset when closing
  }}
  ...
/>
```

### 2. Handle Edit State

```typescript
// Use editItem to control open state and dynamic title
<EditDialog
  open={!!editItem || isCreateOpen}
  onOpenChange={(open) => {
    if (!open) {
      setEditItem(null);
      setIsCreateOpen(false);
      resetForm();
    }
  }}
  title={editItem ? 'Edit Budget' : 'Create Budget'}
  submitText={editItem ? 'Update' : 'Create'}
  ...
/>
```

### 3. Show Loading State

```typescript
<AlertDialog
  isLoading={isDeleting}
  onConfirm={async () => {
    await deleteItem();
    // Dialog auto-closes after onConfirm completes
  }}
  ...
/>
```

### 4. Use Appropriate Variants

```typescript
// Delete actions → variant="delete"
// Warnings → variant="warning"
// Success messages → variant="success"
// Errors → variant="error"
// Information → variant="info" (default)
```

---

## 📚 Related

- [Forms Instructions](./forms.instructions.md) - Form field components
- [Components Instructions](./components.instructions.md) - Base UI components

# Components Module Instructions

> Guidelines for using base UI components in `@repo/ui/components`

---

## 📦 Import

```typescript
// Import individual components
import { Button, Card, Input, Select } from '@repo/ui/components';

// Or from ui subpath
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/ui/components/ui';
```

---

## 🧩 Available Components

### Core Components

| Component  | Description            | Use Case              |
| ---------- | ---------------------- | --------------------- |
| `Button`   | Primary action element | All clickable actions |
| `Input`    | Text input field       | Form text entry       |
| `Label`    | Form field labels      | Labeling form inputs  |
| `Textarea` | Multi-line input       | Long text entry       |

### Selection Components

| Component      | Description        | Use Case                   |
| -------------- | ------------------ | -------------------------- |
| `Select`       | Dropdown selection | Single option selection    |
| `Checkbox`     | Toggle checkbox    | Boolean selections         |
| `RadioGroup`   | Radio button group | Mutually exclusive options |
| `Switch`       | Toggle switch      | Boolean settings           |
| `Popover`      | Floating content   | Menus, pickers             |
| `DropdownMenu` | Dropdown actions   | Context menus              |
| `Command`      | Command palette    | Search/select interfaces   |

### Layout Components

| Component     | Description           | Use Case              |
| ------------- | --------------------- | --------------------- |
| `Card`        | Content container     | Content cards         |
| `Separator`   | Visual divider        | Section separation    |
| `Tabs`        | Tab navigation        | Tabbed interfaces     |
| `Table`       | Data tables           | Tabular data display  |
| `ScrollArea`  | Scrollable region     | Overflow content      |
| `Collapsible` | Expand/collapse       | Accordion content     |
| `Accordion`   | Multi-panel accordion | FAQ, expandable lists |

### Feedback Components

| Component  | Description         | Use Case               |
| ---------- | ------------------- | ---------------------- |
| `Badge`    | Status indicators   | Tags, labels, counts   |
| `Progress` | Progress indicator  | Loading, completion    |
| `Skeleton` | Loading placeholder | Content loading states |
| `Toast`    | Notifications       | User feedback          |
| `Tooltip`  | Hover tooltips      | Additional info        |
| `Sonner`   | Toast notifications | Notifications          |

### Dialog Components (Primitives)

| Component     | Description        | Use Case      |
| ------------- | ------------------ | ------------- |
| `Dialog`      | Modal dialog       | Custom modals |
| `AlertDialog` | Alert modal        | Confirmations |
| `Sheet`       | Slide-out panel    | Side panels   |
| `Drawer`      | Bottom/side drawer | Mobile menus  |

### Form Components

| Component  | Description  | Use Case       |
| ---------- | ------------ | -------------- |
| `Calendar` | Date picker  | Date selection |
| `Slider`   | Range slider | Numeric ranges |

---

## 🎨 Button Component

### Variants

```typescript
import { Button } from '@repo/ui/components';

// Variants
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Style</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### With Icons

```typescript
import { Plus, Trash, Edit } from 'lucide-react';

<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>

<Button variant="destructive">
  <Trash className="mr-2 h-4 w-4" />
  Delete
</Button>

<Button size="icon" variant="ghost">
  <Edit className="h-4 w-4" />
</Button>
```

### Loading State

```typescript
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    'Save Changes'
  )}
</Button>
```

---

## 📦 Card Component

### Structure

```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@repo/ui/components';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### Dashboard Card Example

```typescript
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
    <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$4,500.00</div>
    <p className="text-xs text-muted-foreground">
      +20% from last month
    </p>
  </CardContent>
</Card>
```

---

## 📝 Input Component

### Basic Usage

```typescript
import { Input, Label } from '@repo/ui/components';

// With Label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="name@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

// With Icon
<div className="relative">
  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input placeholder="Search..." className="pl-8" />
</div>
```

---

## 📋 Select Component

### Basic Usage

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="food">Food</SelectItem>
    <SelectItem value="transport">Transport</SelectItem>
    <SelectItem value="entertainment">Entertainment</SelectItem>
  </SelectContent>
</Select>
```

### With Groups

```typescript
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Expense</SelectLabel>
      <SelectItem value="food">Food</SelectItem>
      <SelectItem value="transport">Transport</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>Income</SelectLabel>
      <SelectItem value="salary">Salary</SelectItem>
      <SelectItem value="bonus">Bonus</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

---

## 📊 Table Component

### Basic Table

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Category</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item.category}</TableCell>
        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 🏷️ Badge Component

### Variants

```typescript
import { Badge } from '@repo/ui/components';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>

// Custom colors with className
<Badge className="bg-green-500 text-white">Active</Badge>
<Badge className="bg-yellow-500 text-white">Pending</Badge>
```

---

## 📑 Tabs Component

### Basic Usage

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components';

<Tabs defaultValue="overview" className="space-y-4">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="reports">Reports</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <OverviewContent />
  </TabsContent>
  <TabsContent value="analytics">
    <AnalyticsContent />
  </TabsContent>
  <TabsContent value="reports">
    <ReportsContent />
  </TabsContent>
</Tabs>
```

---

## 💬 Toast Notifications

### Using Sonner

```typescript
import { toast } from 'sonner';

// Success
toast.success('Item created successfully');

// Error
toast.error('Failed to save changes');

// Warning
toast.warning('This action cannot be undone');

// With description
toast.success('Budget Updated', {
  description: 'Your budget has been saved.',
});

// With action
toast('Item deleted', {
  action: {
    label: 'Undo',
    onClick: () => handleUndo(),
  },
});
```

---

## 🔧 Dialog Primitives

> **Note:** For common use cases, prefer `@repo/ui/dialogs` (AlertDialog, EditDialog, etc.)
> Use these primitives only for custom implementations.

### Custom Dialog Example

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Custom Dialog</DialogTitle>
      <DialogDescription>
        Custom dialog content goes here.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Content */}
    </div>
    <DialogFooter>
      <Button onClick={() => setIsOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 📱 Sheet Component (Side Panels)

```typescript
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Settings</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>
        Configure your preferences
      </SheetDescription>
    </SheetHeader>
    <div className="py-4">
      {/* Settings content */}
    </div>
  </SheetContent>
</Sheet>
```

---

## ✅ Best Practices

### 1. Use Consistent Spacing

```typescript
// Use space-y for vertical spacing
<div className="space-y-4">
  <Input />
  <Input />
  <Button>Submit</Button>
</div>

// Use gap for flex/grid
<div className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</div>
```

### 2. Use Semantic Variants

```typescript
// Primary actions → default variant
<Button>Save Changes</Button>

// Secondary actions → outline/secondary
<Button variant="outline">Cancel</Button>

// Destructive actions → destructive variant
<Button variant="destructive">Delete</Button>
```

### 3. Responsive Design

```typescript
// Use responsive classes
<Card className="w-full md:w-1/2 lg:w-1/3">

// Responsive layouts
<div className="flex flex-col sm:flex-row gap-4">

// Responsive dialog sizes
<DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
```

### 4. Accessibility

```typescript
// Always include labels
<Label htmlFor="email">Email</Label>
<Input id="email" aria-describedby="email-error" />
<p id="email-error" className="text-red-500 text-sm">
  Please enter a valid email
</p>

// Use aria attributes
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>
```

---

## 📚 Related

- [Forms Instructions](./forms.instructions.md) - Form field components
- [Dialogs Instructions](./dialogs.instructions.md) - Dialog components
- [Layout Instructions](./layout.instructions.md) - Page layouts

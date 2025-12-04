# Tables Module Instructions

## Module Overview

The Tables module (`@repo/ui/tables`) provides a complete, reusable data table solution built on `@tanstack/react-table`. It includes a generic DataTable component and supporting utilities for sorting, filtering, pagination, and row actions.

## Import Pattern

```tsx
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
  DataTableViewOptions,
  DataTableFacetedFilter,
  DataTableRowActions,
  type ColumnDef,
  type DataTableProps,
} from '@repo/ui/tables';
```

## Components

### DataTable

The main data table component with built-in state management.

```tsx
interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  emptyMessage?: string;
  enableRowSelection?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;
  pageSize?: number;
  toolbar?: React.ComponentType<{ table: Table<TData> }>;
  pagination?: React.ComponentType<{ table: Table<TData> }>;
  className?: string;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
}
```

**Usage:**

```tsx
const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => formatCurrency(row.getValue('amount')),
  },
];

<DataTable
  columns={columns}
  data={transactions}
  toolbar={TransactionToolbar}
  pagination={DataTablePagination}
  enableRowSelection
/>;
```

### DataTableColumnHeader

Sortable column header with dropdown menu.

```tsx
<DataTableColumnHeader column={column} title="Column Name" />
```

**Features:**

- Click to toggle sort (asc/desc)
- Visual sort indicators
- Option to hide column

### DataTablePagination

Pagination controls component.

```tsx
<DataTablePagination
  table={table}
  pageSizeOptions={[10, 20, 50, 100]}
  showSelectedCount={true}
/>
```

**Features:**

- First/Previous/Next/Last navigation
- Page size selector
- Current page indicator
- Selected row count

### DataTableToolbar

Configurable toolbar with search and filters.

```tsx
function MyToolbar(props: { table: Table<MyData> }) {
  return (
    <DataTableToolbar
      {...props}
      searchColumn="name"
      searchPlaceholder="Search transactions..."
      filters={[
        {
          columnId: 'category',
          title: 'Category',
          options: [
            { label: 'Food', value: 'food' },
            { label: 'Transport', value: 'transport' },
          ],
        },
        {
          columnId: 'status',
          title: 'Status',
          options: [
            { label: 'Completed', value: 'completed' },
            { label: 'Pending', value: 'pending' },
          ],
        },
      ]}
      rightContent={<Button>Export</Button>}
    />
  );
}
```

### DataTableFacetedFilter

Multi-select filter for categorical data.

```tsx
<DataTableFacetedFilter
  column={table.getColumn('category')}
  title="Category"
  options={[
    { label: 'Food', value: 'food', icon: FoodIcon },
    { label: 'Transport', value: 'transport', icon: CarIcon },
  ]}
/>
```

**Features:**

- Multi-select checkboxes
- Search within options
- Faceted counts
- Badge display for selected items

### DataTableViewOptions

Column visibility toggle dropdown.

```tsx
<DataTableViewOptions table={table} label="Columns" />
```

### DataTableRowActions

Row-level actions dropdown.

```tsx
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';

{
  id: 'actions',
  cell: ({ row }) => (
    <DataTableRowActions
      row={row}
      actions={[
        {
          key: 'view',
          label: 'View Details',
          icon: IconEye,
          onClick: (data) => viewItem(data.id),
        },
        {
          key: 'edit',
          label: 'Edit',
          icon: IconEdit,
          onClick: (data) => editItem(data),
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: IconTrash,
          onClick: (data) => deleteItem(data.id),
          className: 'text-red-500!',
          separator: true,
        },
      ]}
    />
  ),
}
```

**Action Configuration:**

```tsx
interface RowAction<TData> {
  key: string; // Unique identifier
  label: string; // Display text
  icon?: ComponentType; // Optional icon
  onClick: (row: TData) => void;
  className?: string; // Custom styling
  separator?: boolean; // Show separator before
  disabled?: boolean | ((row: TData) => boolean);
  hidden?: boolean | ((row: TData) => boolean);
}
```

## Complete Example

```tsx
'use client';

import { useState } from 'react';
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
  DataTableRowActions,
  type ColumnDef,
} from '@repo/ui/tables';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

// Define columns
const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => formatDate(row.getValue('date')),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => formatCurrency(row.getValue('amount')),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        actions={[
          { key: 'edit', label: 'Edit', icon: IconEdit, onClick: handleEdit },
          {
            key: 'delete',
            label: 'Delete',
            icon: IconTrash,
            onClick: handleDelete,
            className: 'text-red-500!',
            separator: true,
          },
        ]}
      />
    ),
  },
];

// Create custom toolbar
function TransactionToolbar(props: { table: Table<Transaction> }) {
  return (
    <DataTableToolbar
      {...props}
      searchColumn="description"
      searchPlaceholder="Search transactions..."
      filters={[
        {
          columnId: 'category',
          title: 'Category',
          options: categories.map((c) => ({ label: c.name, value: c.id })),
        },
      ]}
    />
  );
}

// Main component
export function TransactionList({ transactions }: Props) {
  return (
    <DataTable
      columns={columns}
      data={transactions}
      toolbar={TransactionToolbar}
      pagination={DataTablePagination}
      emptyMessage="No transactions found."
    />
  );
}
```

## Column Definition Tips

### Basic Column

```tsx
{
  accessorKey: 'fieldName',
  header: 'Header Text',
}
```

### Sortable Column

```tsx
{
  accessorKey: 'fieldName',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Header" />
  ),
}
```

### Custom Cell Rendering

```tsx
{
  accessorKey: 'amount',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Amount" />
  ),
  cell: ({ row }) => {
    const amount = row.getValue('amount') as number;
    return (
      <span className={amount < 0 ? 'text-red-500' : 'text-green-500'}>
        {formatCurrency(amount)}
      </span>
    );
  },
}
```

### Filterable Column (for faceted filter)

```tsx
{
  accessorKey: 'category',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Category" />
  ),
  filterFn: (row, id, value) => {
    return value.includes(row.getValue(id));
  },
}
```

### Column with Custom Width

```tsx
{
  accessorKey: 'id',
  header: 'ID',
  meta: {
    className: 'w-[100px]',
  },
}
```

### Non-sortable, Non-hideable Column

```tsx
{
  accessorKey: 'name',
  header: 'Name',
  enableSorting: false,
  enableHiding: false,
}
```

## Best Practices

1. **Define columns outside component** to prevent unnecessary re-renders
2. **Use `filterFn`** for columns that will use faceted filters
3. **Provide `getRowId`** when using row selection for consistent IDs
4. **Use `emptyMessage`** for better UX when data is empty
5. **Create custom toolbar** for complex filtering needs
6. **Use conditional actions** with `hidden` and `disabled` functions

## Type Exports

The module re-exports useful types from `@tanstack/react-table`:

```tsx
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  Row,
  Column,
  Table,
} from '@repo/ui/tables';
```

## Migration from Local Tables

If migrating from inline table implementations:

1. Move column definitions to use `DataTableColumnHeader`
2. Replace custom pagination with `DataTablePagination`
3. Use `DataTableToolbar` for search and filters
4. Use `DataTableRowActions` for action menus
5. Wrap everything with `DataTable` component

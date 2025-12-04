# Reusable Table Component

This directory contains a comprehensive, reusable table component built with TanStack Table (React Table v8) and designed to work seamlessly across your monorepo.

## Components

### 1. `DataTable` - Main Table Component

The core table component with built-in features for sorting, filtering, pagination, row selection, and more.

### 2. `DataTableColumnHeader` - Column Header with Sorting

A pre-built column header component with sorting capabilities.

### 3. `DataTableToolbar` - Table Toolbar

Default toolbar with search and filter controls.

### 4. `DataTablePagination` - Pagination Controls

Pagination component with page size selector and navigation buttons.

## Basic Usage

```tsx
import { DataTable } from '@repo/ui/common';
import { type ColumnDef } from '@tanstack/react-table';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
];

function UsersPage() {
  const users: User[] = [...]; // Your data

  return (
    <DataTable
      columns={columns}
      data={users}
      searchKey="name"
      searchPlaceholder="Search users..."
      enablePagination
      enableRowSelection
      enableSorting
      enableFiltering
    />
  );
}
```

## Advanced Usage

### With Custom Toolbar

```tsx
import { DataTable, DataTableToolbar } from '@repo/ui/common';
import { Button } from '@repo/ui/components/ui/button';

function UsersWithCustomActions() {
  return (
    <DataTable
      columns={columns}
      data={users}
      toolbar={({ table }) => (
        <DataTableToolbar
          table={table}
          searchKey="name"
          searchPlaceholder="Search users..."
          actions={
            <Button onClick={() => console.log('Add user')}>Add User</Button>
          }
        />
      )}
    />
  );
}
```

### With Row Actions

```tsx
import {
  DropdownMenu,
  DropdownMenuItem,
} from '@repo/ui/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';

const columns: ColumnDef<User>[] = [
  // ... other columns
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleEdit(row.original)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
```

### With Row Selection

```tsx
import { Checkbox } from '@repo/ui/components/ui/checkbox';

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // ... other columns
];

function UsersWithSelection() {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  return (
    <DataTable
      columns={columns}
      data={users}
      enableRowSelection
      onRowSelectionChange={setSelectedRows}
    />
  );
}
```

### With Loading and Error States

```tsx
function UsersWithStates() {
  const { data: users, loading, error } = useUsers();

  return (
    <DataTable
      columns={columns}
      data={users || []}
      loading={loading}
      error={error}
      loadingMessage="Loading users..."
      errorMessage="Failed to load users"
    />
  );
}
```

### With Custom Column Styling

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      className: 'min-w-[200px] font-semibold', // Custom styling
    },
  },
];
```

## Component Props

### DataTable Props

| Prop                   | Type                                           | Default                | Description                     |
| ---------------------- | ---------------------------------------------- | ---------------------- | ------------------------------- |
| `columns`              | `ColumnDef<TData>[]`                           | Required               | Column definitions              |
| `data`                 | `TData[]`                                      | Required               | Table data                      |
| `searchKey`            | `string`                                       | -                      | Column key for search           |
| `searchPlaceholder`    | `string`                                       | "Search..."            | Search input placeholder        |
| `enableSearch`         | `boolean`                                      | `true`                 | Enable search functionality     |
| `enablePagination`     | `boolean`                                      | `true`                 | Enable pagination               |
| `enableRowSelection`   | `boolean`                                      | `false`                | Enable row selection            |
| `enableSorting`        | `boolean`                                      | `true`                 | Enable column sorting           |
| `enableFiltering`      | `boolean`                                      | `true`                 | Enable filtering                |
| `enableColumnHiding`   | `boolean`                                      | `false`                | Enable column visibility toggle |
| `pageSize`             | `number`                                       | `10`                   | Initial page size               |
| `pageSizeOptions`      | `number[]`                                     | `[10, 20, 30, 40, 50]` | Page size options               |
| `emptyMessage`         | `string`                                       | "No results found."    | Empty state message             |
| `loading`              | `boolean`                                      | `false`                | Loading state                   |
| `error`                | `Error \| null`                                | `null`                 | Error state                     |
| `onRowClick`           | `(row: Row<TData>) => void`                    | -                      | Row click handler               |
| `onRowSelectionChange` | `(selection: Record<string, boolean>) => void` | -                      | Selection change handler        |
| `toolbar`              | `ComponentType`                                | -                      | Custom toolbar component        |
| `pagination`           | `ComponentType`                                | -                      | Custom pagination component     |

### DataTableColumnHeader Props

| Prop        | Type                    | Description                |
| ----------- | ----------------------- | -------------------------- |
| `column`    | `Column<TData, TValue>` | Column instance from table |
| `title`     | `string`                | Column header title        |
| `className` | `string`                | Optional CSS classes       |

## Examples in the Codebase

### Academic Years Table

See: `apps/school-fe/src/routes/_auth/_admin/academic.tsx`

```tsx
<DataTable
  columns={columns}
  data={academics}
  searchKey="name"
  searchPlaceholder="Search academic years..."
  enablePagination={true}
  enableRowSelection={true}
  enableSorting={true}
  enableFiltering={true}
  pageSize={10}
/>
```

### Transactions Table (can be updated)

See: `apps/school-fe/src/features/transactions/TransactionsTable.tsx`

Current implementation uses manual table setup. Can be simplified to:

```tsx
<DataTable
  columns={transactionColumns}
  data={transactions}
  toolbar={TransactionTableToolbar}
  pagination={DataTablePagination}
  enableRowSelection
  defaultSorting={[{ id: 'createdAt', desc: true }]}
/>
```

## Best Practices

1. **Column Definitions**: Define columns outside the component or use `useMemo` to prevent re-renders
2. **Search Key**: Ensure the `searchKey` matches an actual column's `accessorKey`
3. **Row Selection**: When enabling row selection, add a select column as the first column
4. **Custom Styling**: Use the `meta.className` property for column-specific styles
5. **Type Safety**: Use TypeScript generics for proper type checking: `DataTable<YourDataType>`

## Extending the Components

You can extend these components by:

1. Creating wrapper components with preset configurations
2. Adding custom toolbar components with domain-specific actions
3. Creating custom cell renderers for specific data types
4. Implementing bulk actions for selected rows

## Migration Guide

To migrate from manual table implementations:

1. Replace manual `useReactTable` setup with `<DataTable>`
2. Keep your existing column definitions
3. Replace custom toolbar with `DataTableToolbar` or pass as prop
4. Replace custom pagination with `DataTablePagination` or pass as prop
5. Remove manual state management (sorting, filtering, pagination)

Before:

```tsx
const table = useReactTable({
  data,
  columns,
  // ... lots of configuration
});

return (
  <div>
    <CustomToolbar table={table} />
    <Table>{/* Manual table rendering */}</Table>
    <CustomPagination table={table} />
  </div>
);
```

After:

```tsx
return (
  <DataTable
    columns={columns}
    data={data}
    toolbar={CustomToolbar}
    pagination={CustomPagination}
  />
);
```

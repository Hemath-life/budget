'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { cn } from '#/lib/utils';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Custom className for the column header and cells */
    className: string;
  }
}

/**
 * Props for the DataTable component
 *
 * @template TData - The type of data in the table
 * @template TValue - The type of value in each cell
 */
export interface DataTableProps<TData, TValue = unknown> {
  /** Column definitions for the table */
  columns: ColumnDef<TData, TValue>[];
  /** Data array to display in the table */
  data: TData[];
  /** Message to display when there's no data */
  emptyMessage?: string;
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Enable pagination */
  enablePagination?: boolean;
  /** Enable column visibility toggle */
  enableColumnVisibility?: boolean;
  /** Initial page size */
  pageSize?: number;
  /** Custom toolbar component */
  toolbar?: React.ComponentType<{
    table: ReturnType<typeof useReactTable<TData>>;
  }>;
  /** Custom pagination component */
  pagination?: React.ComponentType<{
    table: ReturnType<typeof useReactTable<TData>>;
  }>;
  /** Additional className for the container */
  className?: string;
  /** Additional className for the table wrapper */
  tableClassName?: string;
  /** Callback when row selection changes */
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  /** Get row ID for selection */
  getRowId?: (row: TData) => string;
}

/**
 * A fully-featured, generic data table component built on @tanstack/react-table.
 *
 * Features:
 * - Sorting (click column headers)
 * - Filtering (via toolbar)
 * - Pagination
 * - Column visibility toggle
 * - Row selection
 * - Responsive design
 *
 * @example Basic usage
 * ```tsx
 * import { DataTable, type ColumnDef } from '@repo/ui/tables';
 *
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * const columns: ColumnDef<User>[] = [
 *   { accessorKey: 'name', header: 'Name' },
 *   { accessorKey: 'email', header: 'Email' },
 * ];
 *
 * <DataTable columns={columns} data={users} />
 * ```
 *
 * @example With custom toolbar and pagination
 * ```tsx
 * import {
 *   DataTable,
 *   DataTableToolbar,
 *   DataTablePagination,
 * } from '@repo/ui/tables';
 *
 * <DataTable
 *   columns={columns}
 *   data={users}
 *   toolbar={DataTableToolbar}
 *   pagination={DataTablePagination}
 *   enableRowSelection
 * />
 * ```
 */
export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  emptyMessage = 'No results.',
  enableRowSelection = false,
  enablePagination = true,
  enableColumnVisibility = true,
  pageSize = 10,
  toolbar: Toolbar,
  pagination: Pagination,
  className,
  tableClassName,
  onRowSelectionChange,
  getRowId,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility: enableColumnVisibility ? columnVisibility : {},
      rowSelection,
      columnFilters,
      pagination: enablePagination ? pagination : undefined,
    },
    enableRowSelection,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(newSelection);
      onRowSelectionChange?.(newSelection);
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId,
  });

  return (
    <div className={cn('space-y-4', className)}>
      {Toolbar && <Toolbar table={table} />}

      <div className={cn('overflow-hidden rounded-md border', tableClassName)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={header.column.columnDef.meta?.className ?? ''}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ''}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {Pagination && enablePagination && <Pagination table={table} />}
    </div>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';
import { memo, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { type DataTableProps } from './types';

// Loading skeleton component
const TableSkeleton = memo(({ columns }: { columns: number }) => (
  <div className="space-y-4">
    <div className="flex justify-between">
      <div className="h-8 w-64 bg-muted animate-pulse rounded" />
      <div className="h-8 w-32 bg-muted animate-pulse rounded" />
    </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <div className="h-4 bg-muted animate-pulse rounded" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: columns }).map((_, j) => (
                <TableCell key={j}>
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
));
TableSkeleton.displayName = 'TableSkeleton';

// Empty state component
const EmptyState = memo(
  ({ message, className }: { message: string; className?: string }) => (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12',
        className,
      )}
    >
      <div className="text-center">
        <div className="text-sm font-medium text-muted-foreground">
          {message}
        </div>
      </div>
    </div>
  ),
);
EmptyState.displayName = 'EmptyState';

// Error state component
const ErrorState = memo(
  ({
    error,
    onRetry,
    className,
  }: {
    error: Error;
    onRetry?: () => void;
    className?: string;
  }) => (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12',
        className,
      )}
    >
      <div className="text-center">
        <div className="text-sm font-medium text-destructive mb-2">
          Error: {error.message}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  ),
);
ErrorState.displayName = 'ErrorState';

export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  enableSearch = true,
  enablePagination = true,
  enableRowSelection = false,
  enableSorting = true,
  enableFiltering = true,
  enableColumnHiding = false,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  emptyMessage = 'No results found.',
  loadingMessage = 'Loading...',
  errorMessage = 'Something went wrong.',
  className = '',
  loading = false,
  error = null,
  defaultSorting = [],
  defaultColumnVisibility = {},
  defaultColumnFilters = [],
  onRowSelectionChange,
  onRowClick,
  onRowDoubleClick,
  onColumnSort,
  onColumnFilter,
  toolbar: ToolbarComponent,
  pagination: PaginationComponent,
  emptyState: EmptyStateComponent = EmptyState,
  loadingState: LoadingStateComponent = () => (
    <TableSkeleton columns={columns.length} />
  ),
  errorState: ErrorStateComponent = ErrorState,
  actions,
  bulkActions: BulkActionsComponent,
}: DataTableProps<TData, TValue>) {
  // Memoized state initialization
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(defaultColumnFilters);
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);

  // Memoized event handlers
  const handleRowSelectionChange = useCallback(
    (updaterOrValue: any) => {
      setRowSelection(updaterOrValue);
      if (typeof updaterOrValue === 'object') {
        onRowSelectionChange?.(updaterOrValue);
      }
    },
    [onRowSelectionChange],
  );

  const handleSortingChange = useCallback(
    (updaterOrValue: any) => {
      setSorting(updaterOrValue);
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting);
        if (newSorting.length > 0) {
          onColumnSort?.(newSorting[0].id, newSorting[0].desc ? 'desc' : 'asc');
        }
      }
    },
    [onColumnSort, sorting],
  );

  const handleColumnFiltersChange = useCallback(
    (updaterOrValue: any) => {
      setColumnFilters(updaterOrValue);
      if (typeof updaterOrValue === 'function') {
        const newFilters = updaterOrValue(columnFilters);
        newFilters.forEach((filter: any) => {
          onColumnFilter?.(filter.id, filter.value);
        });
      }
    },
    [onColumnFilter, columnFilters],
  );

  const handleRowClick = useCallback(
    (row: any) => {
      onRowClick?.(row);
    },
    [onRowClick],
  );

  const handleRowDoubleClick = useCallback(
    (row: any) => {
      onRowDoubleClick?.(row);
    },
    [onRowDoubleClick],
  );

  // Memoized table configuration
  const tableConfig = useMemo(
    () => ({
      data,
      columns,
      state: {
        sorting,
        columnVisibility,
        rowSelection,
        columnFilters,
      },
      initialState: {
        pagination: {
          pageSize,
        },
      },
      enableRowSelection,
      onRowSelectionChange: handleRowSelectionChange,
      onSortingChange: enableSorting ? handleSortingChange : undefined,
      onColumnFiltersChange: enableFiltering
        ? handleColumnFiltersChange
        : undefined,
      onColumnVisibilityChange: setColumnVisibility,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
      getPaginationRowModel: enablePagination
        ? getPaginationRowModel()
        : undefined,
      getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
      getFacetedRowModel: enableFiltering ? getFacetedRowModel() : undefined,
      getFacetedUniqueValues: enableFiltering
        ? getFacetedUniqueValues()
        : undefined,
    }),
    [
      data,
      columns,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pageSize,
      enableRowSelection,
      handleRowSelectionChange,
      enableSorting,
      handleSortingChange,
      enableFiltering,
      handleColumnFiltersChange,
    ],
  );

  const table = useReactTable<TData>(tableConfig as any);

  // Memoized selected rows for bulk actions
  const selectedRows = useMemo(
    () => table.getFilteredSelectedRowModel().rows,
    [table, rowSelection],
  );

  // Loading state
  if (loading) {
    return <LoadingStateComponent message={loadingMessage} />;
  }

  // Error state
  if (error) {
    return <ErrorStateComponent error={error} />;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      {(enableSearch || enableFiltering || enableColumnHiding || actions) && (
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            {enableSearch && searchKey && (
              <input
                placeholder={searchPlaceholder}
                value={
                  (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                className="max-w-sm px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
          </div>
          <div className="flex items-center space-x-2">{actions}</div>
        </div>
      )}

      {/* Custom Toolbar */}
      {ToolbarComponent && (
        <ToolbarComponent
          table={table as any}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
          enableSearch={enableSearch}
          enableFiltering={enableFiltering}
          enableColumnHiding={enableColumnHiding}
          actions={actions}
        />
      )}

      {/* Bulk Actions */}
      {BulkActionsComponent && selectedRows.length > 0 && (
        <BulkActionsComponent
          table={table as any}
          selectedRows={selectedRows as any}
          onAction={(action, rows) => {
            // Handle bulk action
            console.log(`Bulk action: ${action}`, rows);
          }}
        />
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        header.column.columnDef.meta?.className,
                        header.column.getCanSort() &&
                          'cursor-pointer select-none',
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'group/row',
                    (onRowClick || onRowDoubleClick) &&
                      'cursor-pointer hover:bg-muted/50',
                  )}
                  onClick={() => handleRowClick(row)}
                  onDoubleClick={() => handleRowDoubleClick(row)}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
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
                  <EmptyStateComponent message={emptyMessage} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Built-in Pagination */}
      {enablePagination && !PaginationComponent && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {enableRowSelection && (
              <>
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </>
            )}
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="h-8 w-[70px] rounded border border-input px-2 text-sm"
              >
                {pageSizeOptions.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 p-0 border rounded disabled:opacity-50 hover:bg-accent"
              >
                <span className="sr-only">Go to first page</span>
                {'<<'}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 p-0 border rounded disabled:opacity-50 hover:bg-accent"
              >
                <span className="sr-only">Go to previous page</span>
                {'<'}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8 p-0 border rounded disabled:opacity-50 hover:bg-accent"
              >
                <span className="sr-only">Go to next page</span>
                {'>'}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8 p-0 border rounded disabled:opacity-50 hover:bg-accent"
              >
                <span className="sr-only">Go to last page</span>
                {'>>'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Pagination */}
      {PaginationComponent && (
        <PaginationComponent
          table={table as any}
          pageSizeOptions={pageSizeOptions}
          enableRowSelection={enableRowSelection}
        />
      )}
    </div>
  );
}

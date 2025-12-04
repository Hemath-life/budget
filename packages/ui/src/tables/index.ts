/**
 * @repo/ui Tables Module
 *
 * Reusable data table components built on @tanstack/react-table.
 * Provides a complete data table solution with sorting, filtering,
 * pagination, and column visibility controls.
 *
 * @example
 * ```tsx
 * import {
 *   DataTable,
 *   DataTableColumnHeader,
 *   DataTablePagination,
 *   DataTableToolbar,
 *   DataTableViewOptions,
 *   DataTableFacetedFilter,
 *   DataTableRowActions,
 *   type ColumnDef,
 * } from '@repo/ui/tables';
 *
 * const columns: ColumnDef<User>[] = [
 *   {
 *     accessorKey: 'name',
 *     header: ({ column }) => (
 *       <DataTableColumnHeader column={column} title="Name" />
 *     ),
 *   },
 * ];
 *
 * <DataTable columns={columns} data={users} />
 * ```
 *
 * @module @repo/ui/tables
 */

// Core data table component
export { DataTable, type DataTableProps } from './data-table';

// Table utilities
export {
  DataTableColumnHeader,
  type DataTableColumnHeaderProps,
} from './data-table-column-header';
export {
  DataTableFacetedFilter,
  type DataTableFacetedFilterProps,
  type FacetedFilterOption,
} from './data-table-faceted-filter';
export {
  DataTablePagination,
  type DataTablePaginationProps,
} from './data-table-pagination';
export {
  DataTableRowActions,
  type DataTableRowActionsProps,
  type RowAction,
} from './data-table-row-actions';
export {
  DataTableToolbar,
  type DataTableToolbarProps,
  type ToolbarFilter,
} from './data-table-toolbar';

// Re-export common types from @tanstack/react-table
export type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  Table,
  VisibilityState,
} from '@tanstack/react-table';

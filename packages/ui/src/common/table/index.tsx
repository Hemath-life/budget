/**
 * Table Components & Utilities
 *
 * A comprehensive set of table components and utilities built on top of TanStack Table.
 * Provides type-safe column helpers, data table components, and pre-built status badges.
 *
 * @example
 * ```tsx
 * import { DataTable, createDateColumn, createTextColumn } from '@repo/ui/common';
 *
 * const columns = [
 *   createDateColumn({ accessorKey: 'createdAt', headerTitle: 'Created' }),
 *   createTextColumn({ accessorKey: 'name', headerTitle: 'Name' }),
 * ];
 *
 * <DataTable columns={columns} data={data} />
 * ```
 */

// ============================================================================
// Main Components
// ============================================================================

/**
 * Main data table component with built-in features:
 * - Pagination
 * - Sorting
 * - Filtering
 * - Search
 * - Row selection
 * - Column visibility
 */
export { DataTable } from './data-table';

/**
 * Sortable column header component
 * Use inside custom column definitions for sorting functionality
 */
export { DataTableColumnHeader } from './data-table-column-header';

/**
 * Table toolbar with search, filters, and column visibility controls
 */
export { DataTableToolbar } from './data-table-toolbar';

/**
 * Pagination controls with page size selector
 */
export { DataTablePagination } from './data-table-pagination';

/**
 * Row actions menu with edit, delete, and custom actions
 */
export { DataTableRowActions } from './data-table-row-actions';

// ============================================================================
// Types
// ============================================================================

export type {
  DataTableRowActionsProps,
  RowAction,
  RowActionGroup,
} from './data-table-row-actions';

export type {
  DataTableConfig,
  DataTableProps,
  DataTableToolbarProps,
  DataTablePaginationProps,
  DataTableBulkActionsProps,
  DataTableColumnHeaderProps,
} from './types';

export type {
  CheckboxColumnOptions,
  IdColumnOptions,
  IconTextColumnOptions,
  StatusBadgeConfig,
  StatusBadgeColumnOptions,
  DateColumnOptions,
  TextColumnOptions,
  ActionsColumnOptions,
} from './column-helpers';

// ============================================================================
// Column Helper Functions
// ============================================================================

/**
 * Creates a checkbox column for row selection
 * @example
 * createCheckboxColumn<User>()
 */
export { createCheckboxColumn } from './column-helpers';

/**
 * Creates an ID column with monospace font
 * @example
 * createIdColumn({ accessorKey: 'id', headerTitle: 'ID' })
 */
export { createIdColumn } from './column-helpers';

/**
 * Creates a column with icon and text, optionally with subtitle
 * @example
 * createIconTextColumn({
 *   accessorKey: 'name',
 *   headerTitle: 'Role',
 *   icon: Shield,
 *   subtitle: (row) => `${row.permissions.length} permissions`
 * })
 */
export { createIconTextColumn } from './column-helpers';

/**
 * Creates a status badge column with custom styling
 * @example
 * createStatusBadgeColumn({
 *   accessorKey: 'status',
 *   headerTitle: 'Status',
 *   getStatus: (row) => createActiveInactiveStatus(row.isActive)
 * })
 */
export { createStatusBadgeColumn } from './column-helpers';

/**
 * Creates a date column with optional time display
 * @example
 * createDateColumn({
 *   accessorKey: 'createdAt',
 *   headerTitle: 'Created',
 *   showTime: true
 * })
 */
export { createDateColumn } from './column-helpers';

/**
 * Creates a text column with optional formatting
 * @example
 * createTextColumn({
 *   accessorKey: 'description',
 *   headerTitle: 'Description',
 *   formatter: (value) => value || '—'
 * })
 */
export { createTextColumn } from './column-helpers';

export { createNumberColumn } from './column-helpers';
/**
 * Creates an actions column with edit, delete, and custom actions
 * @example
 * createActionsColumn({
 *   getActions: (row) => ({
 *     onEdit: () => handleEdit(row),
 *     onDelete: () => handleDelete(row.id),
 *     actions: [{ label: 'Duplicate', icon: Copy, onClick: () => duplicate(row) }]
 *   })
 * })
 */
export { createActionsColumn } from './column-helpers';

// ============================================================================
// Status Badge Helper Functions
// ============================================================================

/**
 * Creates an active/inactive status badge configuration
 * @example
 * createActiveInactiveStatus(user.isActive, 'Active', 'Inactive')
 */
export { createActiveInactiveStatus } from './column-helpers';

/**
 * Creates a deleted status badge configuration
 * @example
 * createDeletedStatus(user.isDeleted)
 */
export { createDeletedStatus } from './column-helpers';

/**
 * Creates a current status badge (handles both active/inactive and current states)
 * @example
 * createCurrentStatus(session.isCurrent, session.isActive)
 */
export { createCurrentStatus } from './column-helpers';

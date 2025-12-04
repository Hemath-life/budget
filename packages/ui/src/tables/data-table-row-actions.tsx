'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import * as React from 'react';
import { Button } from '#/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';
import { cn } from '#/lib/utils';

/**
 * Configuration for a row action
 */
export interface RowAction<TData> {
  /** Unique key for the action */
  key: string;
  /** Display label for the action */
  label: string;
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Click handler with row data */
  onClick: (row: TData) => void;
  /** Optional className for styling (e.g., for destructive actions) */
  className?: string;
  /** Show separator before this action */
  separator?: boolean;
  /** Disable this action */
  disabled?: boolean | ((row: TData) => boolean);
  /** Hide this action */
  hidden?: boolean | ((row: TData) => boolean);
}

/**
 * Props for the DataTableRowActions component
 *
 * @template TData - The type of data in the table
 */
export interface DataTableRowActionsProps<TData> {
  /** The row instance from useReactTable */
  row: Row<TData>;
  /** Array of action configurations */
  actions: RowAction<TData>[];
  /** Additional className for the trigger button */
  className?: string;
}

/**
 * A dropdown menu component for row-level actions in DataTable.
 *
 * Features:
 * - Configurable action items
 * - Support for icons
 * - Separators between action groups
 * - Conditional visibility and disabled states
 * - Consistent styling
 *
 * @example Basic usage in column definition
 * ```tsx
 * import { DataTableRowActions, type ColumnDef } from '@repo/ui/tables';
 * import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
 *
 * const columns: ColumnDef<User>[] = [
 *   // ... other columns
 *   {
 *     id: 'actions',
 *     cell: ({ row }) => (
 *       <DataTableRowActions
 *         row={row}
 *         actions={[
 *           {
 *             key: 'view',
 *             label: 'View',
 *             icon: IconEye,
 *             onClick: (user) => router.push(`/users/${user.id}`),
 *           },
 *           {
 *             key: 'edit',
 *             label: 'Edit',
 *             icon: IconEdit,
 *             onClick: (user) => setEditUser(user),
 *           },
 *           {
 *             key: 'delete',
 *             label: 'Delete',
 *             icon: IconTrash,
 *             onClick: (user) => setDeleteUser(user),
 *             className: 'text-red-500!',
 *             separator: true,
 *           },
 *         ]}
 *       />
 *     ),
 *   },
 * ];
 * ```
 *
 * @example With conditional actions
 * ```tsx
 * <DataTableRowActions
 *   row={row}
 *   actions={[
 *     {
 *       key: 'approve',
 *       label: 'Approve',
 *       onClick: (item) => approve(item.id),
 *       hidden: (item) => item.status === 'approved',
 *     },
 *     {
 *       key: 'delete',
 *       label: 'Delete',
 *       onClick: (item) => deleteItem(item.id),
 *       disabled: (item) => item.status === 'locked',
 *     },
 *   ]}
 * />
 * ```
 */
export function DataTableRowActions<TData>({
  row,
  actions,
  className,
}: DataTableRowActionsProps<TData>) {
  const data = row.original;

  // Filter out hidden actions
  const visibleActions = actions.filter((action) => {
    if (typeof action.hidden === 'function') {
      return !action.hidden(data);
    }
    return !action.hidden;
  });

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'data-[state=open]:bg-muted flex h-8 w-8 p-0',
            className,
          )}
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {visibleActions.map((action, index) => {
          const isDisabled =
            typeof action.disabled === 'function'
              ? action.disabled(data)
              : action.disabled;

          return (
            <React.Fragment key={action.key}>
              {action.separator && index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => action.onClick(data)}
                disabled={isDisabled}
                className={action.className}
              >
                {action.label}
                {action.icon && (
                  <DropdownMenuShortcut>
                    <action.icon className="h-4 w-4" />
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';

import { Button } from '#/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '#/components/ui/dropdown-menu';
import { cn } from '#/lib/utils';

/**
 * Props for the DataTableViewOptions component
 *
 * @template TData - The type of data in the table
 */
export interface DataTableViewOptionsProps<TData> {
  /** The table instance from useReactTable */
  table: Table<TData>;
  /** Button label text */
  label?: string;
  /** Additional className for the button */
  className?: string;
}

/**
 * Column visibility toggle dropdown for DataTable.
 *
 * Features:
 * - Toggle individual column visibility
 * - Only shows columns that can be hidden
 * - Checkbox-style selection
 *
 * @example Basic usage in toolbar
 * ```tsx
 * import { DataTableViewOptions } from '@repo/ui/tables';
 *
 * function MyToolbar({ table }) {
 *   return (
 *     <div className="flex items-center justify-between">
 *       <div>Filters...</div>
 *       <DataTableViewOptions table={table} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Custom label
 * ```tsx
 * <DataTableViewOptions table={table} label="Columns" />
 * ```
 */
export function DataTableViewOptions<TData>({
  table,
  label = 'View',
  className,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('ml-auto hidden h-8 lg:flex', className)}
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

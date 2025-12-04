'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';
import * as React from 'react';

import {
  DataTableFacetedFilter,
  type FacetedFilterOption,
} from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { cn } from '#/lib/utils';

/**
 * Configuration for a toolbar filter
 */
export interface ToolbarFilter {
  /** Column ID to filter */
  columnId: string;
  /** Display title for the filter */
  title: string;
  /** Filter options */
  options: FacetedFilterOption[];
}

/**
 * Props for the DataTableToolbar component
 *
 * @template TData - The type of data in the table
 */
export interface DataTableToolbarProps<TData> {
  /** The table instance from useReactTable */
  table: Table<TData>;
  /** Column ID for the search input filter */
  searchColumn?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Faceted filters configuration */
  filters?: ToolbarFilter[];
  /** Show view options dropdown */
  showViewOptions?: boolean;
  /** Additional content to render on the right side */
  rightContent?: React.ReactNode;
  /** Additional className for the container */
  className?: string;
}

/**
 * A configurable toolbar component for DataTable with search, filters, and view options.
 *
 * Features:
 * - Text search input for a specific column
 * - Multiple faceted filters
 * - Reset filters button
 * - Column visibility options
 * - Customizable with additional content
 *
 * @example Basic usage with search
 * ```tsx
 * import { DataTable, DataTableToolbar } from '@repo/ui/tables';
 *
 * function MyToolbar(props) {
 *   return (
 *     <DataTableToolbar
 *       {...props}
 *       searchColumn="name"
 *       searchPlaceholder="Search users..."
 *     />
 *   );
 * }
 *
 * <DataTable columns={columns} data={users} toolbar={MyToolbar} />
 * ```
 *
 * @example With faceted filters
 * ```tsx
 * function MyToolbar(props) {
 *   return (
 *     <DataTableToolbar
 *       {...props}
 *       searchColumn="name"
 *       searchPlaceholder="Search..."
 *       filters={[
 *         {
 *           columnId: 'status',
 *           title: 'Status',
 *           options: [
 *             { label: 'Active', value: 'active' },
 *             { label: 'Inactive', value: 'inactive' },
 *           ],
 *         },
 *         {
 *           columnId: 'category',
 *           title: 'Category',
 *           options: [
 *             { label: 'Food', value: 'food' },
 *             { label: 'Transport', value: 'transport' },
 *           ],
 *         },
 *       ]}
 *     />
 *   );
 * }
 * ```
 *
 * @example With custom right content
 * ```tsx
 * function MyToolbar(props) {
 *   return (
 *     <DataTableToolbar
 *       {...props}
 *       searchColumn="name"
 *       rightContent={<Button>Add New</Button>}
 *     />
 *   );
 * }
 * ```
 */
export function DataTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder = 'Filter...',
  filters = [],
  showViewOptions = true,
  rightContent,
  className,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {/* Search input */}
        {searchColumn && (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {/* Faceted filters */}
        <div className="flex gap-x-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            if (!column) return null;
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            );
          })}
        </div>

        {/* Reset button */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Right side content */}
      <div className="flex items-center space-x-2">
        {rightContent}
        {showViewOptions && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}

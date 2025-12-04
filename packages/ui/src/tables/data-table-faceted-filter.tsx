'use client';

import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { type Column } from '@tanstack/react-table';
import * as React from 'react';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '#/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover';
import { Separator } from '#/components/ui/separator';
import { cn } from '#/lib/utils';

/**
 * Option type for faceted filter
 */
export interface FacetedFilterOption {
  /** Display label for the option */
  label: string;
  /** Value to filter by */
  value: string;
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Props for the DataTableFacetedFilter component
 *
 * @template TData - The type of data in the table
 * @template TValue - The type of value in the column
 */
export interface DataTableFacetedFilterProps<TData, TValue> {
  /** The column instance from useReactTable */
  column?: Column<TData, TValue>;
  /** The title/label for the filter */
  title?: string;
  /** Available filter options */
  options: FacetedFilterOption[];
}

/**
 * A multi-select faceted filter component for DataTable columns.
 *
 * Features:
 * - Multi-select filtering
 * - Search within options
 * - Faceted counts (shows count of each option)
 * - Badge display of selected options
 * - Clear all functionality
 *
 * @example Basic usage in toolbar
 * ```tsx
 * import { DataTableFacetedFilter } from '@repo/ui/tables';
 *
 * function MyToolbar({ table }) {
 *   return (
 *     <div className="flex gap-2">
 *       {table.getColumn('status') && (
 *         <DataTableFacetedFilter
 *           column={table.getColumn('status')}
 *           title="Status"
 *           options={[
 *             { label: 'Active', value: 'active' },
 *             { label: 'Inactive', value: 'inactive' },
 *             { label: 'Pending', value: 'pending' },
 *           ]}
 *         />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example With icons
 * ```tsx
 * import { IconCheck, IconX } from '@tabler/icons-react';
 *
 * <DataTableFacetedFilter
 *   column={table.getColumn('status')}
 *   title="Status"
 *   options={[
 *     { label: 'Active', value: 'active', icon: IconCheck },
 *     { label: 'Inactive', value: 'inactive', icon: IconX },
 *   ]}
 * />
 * ```
 */
export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        'border-primary flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground h-4 w-4" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

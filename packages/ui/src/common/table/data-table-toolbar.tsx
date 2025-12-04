import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Search, X } from 'lucide-react';

interface DataTableToolbarProps {
  table: any;
  searchKey?: string;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  actions?: React.ReactNode;
}

export function DataTableToolbar({
  table,
  searchKey,
  searchPlaceholder = 'Search...',
  enableSearch = true,
  actions,
}: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {enableSearch && searchKey && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-8 max-w-sm"
            />
          </div>
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
}

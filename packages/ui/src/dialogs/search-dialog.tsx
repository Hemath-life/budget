import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '#/lib/utils';
import { Input } from '#/components/ui/input';
import { Button } from '#/components/ui/button';
import { DialogFooter } from '#/components/ui/dialog';
import { BaseDialog, type BaseDialogProps } from './base-dialog';

export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  data?: any;
}

export interface SearchDialogProps<T = SearchItem> extends Omit<BaseDialogProps, 'children'> {
  items: T[];
  onSelect: (item: T) => void;
  onCancel?: () => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  renderItem?: (item: T, index: number) => React.ReactNode;
  filterItems?: (items: T[], searchTerm: string) => T[];
  showSearch?: boolean;
  selectText?: string;
  cancelText?: string;
  maxHeight?: string;
}

const defaultFilterItems = <T extends SearchItem>(items: T[], searchTerm: string): T[] => {
  if (!searchTerm.trim()) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => 
    item.title.toLowerCase().includes(term) ||
    item.subtitle?.toLowerCase().includes(term)
  );
};

const defaultRenderItem = <T extends SearchItem>(item: T, index: number) => (
  <div key={item.id} className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors">
    <div className="font-medium">{item.title}</div>
    {item.subtitle && (
      <div className="text-sm text-muted-foreground mt-1">{item.subtitle}</div>
    )}
    {item.content && (
      <div className="mt-2">{item.content}</div>
    )}
  </div>
);

export function SearchDialog<T extends SearchItem = SearchItem>({
  items,
  onSelect,
  onCancel,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No items found',
  isLoading = false,
  renderItem = defaultRenderItem,
  filterItems = defaultFilterItems,
  showSearch = true,
  selectText = 'Select',
  cancelText = 'Cancel',
  maxHeight = 'max-h-96',
  onOpenChange,
  ...dialogProps
}: SearchDialogProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const filteredItems = filterItems(items, searchTerm);

  const handleCancel = () => {
    onCancel?.();
    setSearchTerm('');
    setSelectedItem(null);
    onOpenChange(false);
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    setSearchTerm('');
    setSelectedItem(null);
    onOpenChange(false);
  };

  const handleItemClick = (item: T) => {
    setSelectedItem(item);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <BaseDialog {...dialogProps} onOpenChange={onOpenChange}>
      <div className="space-y-4">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        <div className={cn('border rounded-md overflow-y-auto', maxHeight)}>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'cursor-pointer transition-colors rounded-md',
                    selectedItem?.id === item.id && 'bg-primary/10 border border-primary'
                  )}
                >
                  {renderItem(item, index)}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={() => selectedItem && handleSelect(selectedItem)}
            disabled={isLoading || !selectedItem}
          >
            {selectText}
          </Button>
        </DialogFooter>
      </div>
    </BaseDialog>
  );
}

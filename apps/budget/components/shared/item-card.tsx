'use client';

import { cn } from '@/lib/utils';
import { Button, Card } from '@repo/ui/components/ui';
import { Pencil, Trash2 } from 'lucide-react';

interface ItemCardProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function ItemCard({
  children,
  onEdit,
  onDelete,
  className,
}: ItemCardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">{children}</div>
        {(onEdit || onDelete) && (
          <div className="flex gap-1 ml-2">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// Category icon with color
interface CategoryIconProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const iconSizes = {
  sm: { outer: 'h-8 w-8', inner: 'h-3 w-3' },
  md: { outer: 'h-10 w-10', inner: 'h-4 w-4' },
  lg: { outer: 'h-12 w-12', inner: 'h-5 w-5' },
};

export function CategoryIcon({ color, size = 'md' }: CategoryIconProps) {
  const sizes = iconSizes[size];
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center',
        sizes.outer
      )}
      style={{ backgroundColor: color + '20' }}
    >
      <div
        className={cn('rounded-full', sizes.inner)}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// Transaction type icon
interface TransactionIconProps {
  type: 'income' | 'expense';
  icon?: React.ReactNode;
}

export function TransactionIcon({ type, icon }: TransactionIconProps) {
  return (
    <div
      className={cn(
        'h-8 w-8 rounded-full flex items-center justify-center',
        type === 'income'
          ? 'bg-green-100 dark:bg-green-900/20'
          : 'bg-red-100 dark:bg-red-900/20'
      )}
    >
      {icon}
    </div>
  );
}

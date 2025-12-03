import { MoreHorizontal, Edit, Trash2, RotateCcw, type LucideIcon } from 'lucide-react';
import { Button } from '#/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';

export interface RowAction<TData> {
  label: string;
  icon?: LucideIcon;
  onClick: (data: TData) => void;
  variant?: 'default' | 'destructive' | 'success';
  className?: string;
  show?: (data: TData) => boolean;
}

export interface RowActionGroup<TData> {
  actions: RowAction<TData>[];
}

export interface DataTableRowActionsProps<TData> {
  row: TData;
  actions?: RowAction<TData>[];
  groups?: RowActionGroup<TData>[];
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
  onRestore?: (data: TData) => void;
  isDeleted?: boolean;
  menuLabel?: string;
}

export function DataTableRowActions<TData>({
  row,
  actions = [],
  groups = [],
  onEdit,
  onDelete,
  onRestore,
  isDeleted = false,
  menuLabel,
}: DataTableRowActionsProps<TData>) {
  // Build default actions based on props
  const defaultActions: RowAction<TData>[] = [];

  if (onEdit && !isDeleted) {
    defaultActions.push({
      label: 'Edit',
      icon: Edit,
      onClick: onEdit,
      show: () => !isDeleted,
    });
  }

  if (onDelete && !isDeleted) {
    defaultActions.push({
      label: 'Delete',
      icon: Trash2,
      onClick: onDelete,
      variant: 'destructive',
      show: () => !isDeleted,
    });
  }

  if (onRestore && isDeleted) {
    defaultActions.push({
      label: 'Restore',
      icon: RotateCcw,
      onClick: onRestore,
      variant: 'success',
      show: () => isDeleted,
    });
  }

  // Combine default actions with custom actions
  const allActions = [...defaultActions, ...actions];

  // Filter actions based on show condition
  const visibleActions = allActions.filter((action) =>
    action.show ? action.show(row) : true
  );

  // Process groups
  const visibleGroups = groups.map((group) => ({
    actions: group.actions.filter((action) =>
      action.show ? action.show(row) : true
    ),
  }));

  const hasVisibleActions =
    visibleActions.length > 0 || visibleGroups.some((g) => g.actions.length > 0);

  if (!hasVisibleActions) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {menuLabel && <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>}
        {menuLabel && visibleActions.length > 0 && <DropdownMenuSeparator />}

        {visibleActions.map((action, index) => {
          const Icon = action.icon;
          const className = getActionClassName(action.variant, action.className);

          return (
            <DropdownMenuItem
              key={index}
              onClick={() => action.onClick(row)}
              className={className}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {action.label}
            </DropdownMenuItem>
          );
        })}

        {visibleGroups.map((group, groupIndex) => {
          if (group.actions.length === 0) return null;

          return (
            <div key={groupIndex}>
              {(visibleActions.length > 0 || groupIndex > 0) && (
                <DropdownMenuSeparator />
              )}
              {group.actions.map((action, actionIndex) => {
                const Icon = action.icon;
                const className = getActionClassName(
                  action.variant,
                  action.className
                );

                return (
                  <DropdownMenuItem
                    key={actionIndex}
                    onClick={() => action.onClick(row)}
                    className={className}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {action.label}
                  </DropdownMenuItem>
                );
              })}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getActionClassName(
  variant?: 'default' | 'destructive' | 'success',
  customClassName?: string
): string {
  const baseClassName = customClassName || '';

  switch (variant) {
    case 'destructive':
      return `text-destructive ${baseClassName}`.trim();
    case 'success':
      return `text-green-600 ${baseClassName}`.trim();
    default:
      return baseClassName;
  }
}

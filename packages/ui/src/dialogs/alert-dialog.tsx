import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog as AlertDialogPrimitive,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2,
  XCircle,
} from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Alert dialog variant types
 */
export type AlertDialogVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'delete';

/**
 * Props for the AlertDialog component
 */
export interface AlertDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Dialog description/message */
  description: string;
  /** Visual variant of the dialog */
  variant?: AlertDialogVariant;
  /** Callback when confirm button is clicked */
  onConfirm: () => void | Promise<void>;
  /** Callback when cancel button is clicked */
  onCancel?: () => void;
  /** Text for confirm button */
  confirmText?: string;
  /** Text for cancel button */
  cancelText?: string;
  /** Whether the dialog is in loading state */
  isLoading?: boolean;
  /** Custom icon to display */
  icon?: React.ReactNode;
  /** Additional class for the content */
  className?: string;
}

/**
 * Configuration for each variant
 */
const variantConfig = {
  info: {
    icon: Info,
    iconClassName: 'text-blue-600',
    buttonVariant: 'default' as const,
    buttonClassName: '',
  },
  success: {
    icon: CheckCircle,
    iconClassName: 'text-green-600',
    buttonVariant: 'default' as const,
    buttonClassName: 'bg-green-600 hover:bg-green-700',
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: 'text-yellow-600',
    buttonVariant: 'default' as const,
    buttonClassName: 'bg-yellow-600 hover:bg-yellow-700',
  },
  error: {
    icon: XCircle,
    iconClassName: 'text-red-600',
    buttonVariant: 'destructive' as const,
    buttonClassName: '',
  },
  delete: {
    icon: Trash2,
    iconClassName: 'text-red-600',
    buttonVariant: 'destructive' as const,
    buttonClassName: 'bg-red-600 hover:bg-red-700',
  },
};

/**
 * AlertDialog - A reusable alert/confirmation dialog component
 *
 * @description
 * Use this component for:
 * - Delete confirmations
 * - Action confirmations
 * - Warning messages
 * - Success/error notifications that require acknowledgment
 *
 * @example
 * // Delete confirmation
 * <AlertDialog
 *   open={!!deleteId}
 *   onOpenChange={() => setDeleteId(null)}
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item? This action cannot be undone."
 *   variant="delete"
 *   onConfirm={handleDelete}
 *   confirmText="Delete"
 * />
 *
 * @example
 * // Warning confirmation
 * <AlertDialog
 *   open={showWarning}
 *   onOpenChange={setShowWarning}
 *   title="Unsaved Changes"
 *   description="You have unsaved changes. Are you sure you want to leave?"
 *   variant="warning"
 *   onConfirm={handleLeave}
 *   confirmText="Leave"
 *   cancelText="Stay"
 * />
 */
export function AlertDialogComponent({
  open,
  onOpenChange,
  title,
  description,
  variant = 'info',
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  icon,
  className,
}: AlertDialogProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    await onConfirm();
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialogPrimitive open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn('max-w-md', className)}>
        <AlertDialogHeader className="text-center sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {icon ?? (
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
                  variant === 'delete' || variant === 'error'
                    ? 'bg-red-100 dark:bg-red-950'
                    : variant === 'warning'
                      ? 'bg-yellow-100 dark:bg-yellow-950'
                      : variant === 'success'
                        ? 'bg-green-100 dark:bg-green-950'
                        : 'bg-blue-100 dark:bg-blue-950',
                )}
              >
                <IconComponent
                  className={cn('h-6 w-6', config.iconClassName)}
                />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <AlertDialogTitle className="text-center sm:text-left">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center sm:text-left">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex-col-reverse gap-2 sm:flex-row">
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn('w-full sm:w-auto', config.buttonClassName)}
          >
            {isLoading ? 'Loading...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPrimitive>
  );
}

// Named export for consistency
export { AlertDialogComponent as AlertDialog };

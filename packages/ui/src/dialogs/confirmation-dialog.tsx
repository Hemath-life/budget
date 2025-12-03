import { Button } from '#/components/ui/button';
import { DialogFooter } from '#/components/ui/dialog';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { BaseDialog, type BaseDialogProps } from './base-dialog';

export interface ConfirmationDialogProps
  extends Omit<BaseDialogProps, 'children'> {
  type?: 'info' | 'success' | 'warning' | 'error';
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDestructive?: boolean;
  message?: React.ReactNode;
}

const typeConfig = {
  info: {
    icon: Info,
    className: 'text-blue-600',
  },
  success: {
    icon: CheckCircle,
    className: 'text-green-600',
  },
  warning: {
    icon: AlertTriangle,
    className: 'text-yellow-600',
  },
  error: {
    icon: XCircle,
    className: 'text-red-600',
  },
};

export function ConfirmationDialog({
  type = 'info',
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  isDestructive = false,
  message,
  onOpenChange,
  description,
  ...dialogProps
}: ConfirmationDialogProps) {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <BaseDialog
      {...dialogProps}
      onOpenChange={onOpenChange}
      description={description}
      size="sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <IconComponent
            className={cn('mt-1 h-5 w-5 flex-shrink-0', config.className)}
          />
          <div className="flex-1">
            {message && (
              <div className="text-sm text-muted-foreground">{message}</div>
            )}
          </div>
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
            variant={isDestructive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </div>
    </BaseDialog>
  );
}

import { Button } from '#/components/ui/button';
import { DialogFooter } from '#/components/ui/dialog';
import { cn } from '../lib/utils';
import { BaseDialog, type BaseDialogProps } from './base-dialog';

export interface FormDialogProps extends Omit<BaseDialogProps, 'children'> {
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelText?: string;
  submitText?: string;
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
  footerClassName?: string;
  showCancel?: boolean;
  showSubmit?: boolean;
  submitVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  children: React.ReactNode;
}

export function FormDialog({
  onCancel,
  onSubmit,
  cancelText = 'Cancel',
  submitText = 'Submit',
  isLoading = false,
  isSubmitDisabled = false,
  footerClassName,
  showCancel = true,
  showSubmit = true,
  submitVariant = 'default',
  children,
  onOpenChange,
  ...dialogProps
}: FormDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleSubmit = () => {
    onSubmit?.();
  };

  return (
    <BaseDialog {...dialogProps} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-4">
        <div className="flex-1">{children}</div>
        <DialogFooter className={cn(footerClassName)}>
          {showCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
          )}
          {showSubmit && (
            <Button
              type="button"
              variant={submitVariant}
              onClick={handleSubmit}
              disabled={isLoading || isSubmitDisabled}
            >
              {submitText}
            </Button>
          )}
        </DialogFooter>
      </div>
    </BaseDialog>
  );
}

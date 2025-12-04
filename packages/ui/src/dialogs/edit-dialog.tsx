import { cn } from '../lib/utils';
import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';
import { ScrollArea } from '#/components/ui/scroll-area';

/**
 * Size variants for the EditDialog
 */
export type EditDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Props for the EditDialog component
 */
export interface EditDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Optional dialog description */
  description?: string;
  /** Dialog content (form fields) */
  children: React.ReactNode;
  /** Size variant */
  size?: EditDialogSize;
  /** Callback when form is submitted */
  onSubmit?: () => void | Promise<void>;
  /** Callback when cancel button is clicked */
  onCancel?: () => void;
  /** Text for submit button */
  submitText?: string;
  /** Text for cancel button */
  cancelText?: string;
  /** Whether the dialog is in loading state */
  isLoading?: boolean;
  /** Whether the submit button is disabled */
  isSubmitDisabled?: boolean;
  /** Whether to show the cancel button */
  showCancel?: boolean;
  /** Whether to show the submit button */
  showSubmit?: boolean;
  /** Variant for submit button */
  submitVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  /** Whether content should be scrollable */
  scrollable?: boolean;
  /** Maximum height for scrollable content */
  maxScrollHeight?: string;
  /** Additional class for the content */
  className?: string;
  /** Additional class for the footer */
  footerClassName?: string;
  /** Custom footer content (replaces default buttons) */
  footer?: React.ReactNode;
}

/**
 * Size class mappings
 */
const sizeClasses: Record<EditDialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[95vw] w-full h-[95vh]',
};

/**
 * EditDialog - A reusable dialog for creating and editing items
 *
 * @description
 * Use this component for:
 * - Create/Add forms
 * - Edit/Update forms
 * - Settings panels
 * - Any form-based dialog interaction
 *
 * @example
 * // Basic create dialog
 * <EditDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Create Category"
 *   onSubmit={handleSubmit}
 *   submitText="Create"
 * >
 *   <FormField id="name" label="Name" value={name} onChange={setName} />
 * </EditDialog>
 *
 * @example
 * // Edit dialog with loading state
 * <EditDialog
 *   open={!!editItem}
 *   onOpenChange={(open) => !open && setEditItem(null)}
 *   title="Edit Budget"
 *   onSubmit={handleUpdate}
 *   submitText="Update"
 *   isLoading={isUpdating}
 * >
 *   <FormField id="amount" label="Amount" value={amount} onChange={setAmount} />
 * </EditDialog>
 *
 * @example
 * // Large scrollable dialog
 * <EditDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="User Profile"
 *   size="lg"
 *   scrollable
 *   maxScrollHeight="max-h-[60vh]"
 * >
 *   {/* Multiple form sections *\/}
 * </EditDialog>
 */
export function EditDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  onSubmit,
  onCancel,
  submitText = 'Save',
  cancelText = 'Cancel',
  isLoading = false,
  isSubmitDisabled = false,
  showCancel = true,
  showSubmit = true,
  submitVariant = 'default',
  scrollable = false,
  maxScrollHeight = 'max-h-[60vh]',
  className,
  footerClassName,
  footer,
}: EditDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    await onSubmit?.();
  };

  const content = scrollable ? (
    <ScrollArea className={cn('w-full', maxScrollHeight)}>
      <div className="space-y-4 py-4 px-1">{children}</div>
    </ScrollArea>
  ) : (
    <div className="space-y-4 py-4">{children}</div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          sizeClasses[size],
          size === 'full' && 'overflow-hidden',
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {content}

        {footer ?? (
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
                {isLoading ? 'Saving...' : submitText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

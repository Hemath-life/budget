import { PlusCircle } from 'lucide-react';
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

/**
 * Size variants for the ContributeDialog
 */
export type ContributeDialogSize = 'sm' | 'md';

/**
 * Props for the ContributeDialog component
 */
export interface ContributeDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title?: string;
  /** Optional dialog description */
  description?: string;
  /** Dialog content (form fields) */
  children: React.ReactNode;
  /** Size variant */
  size?: ContributeDialogSize;
  /** Callback when contribution is submitted */
  onSubmit: () => void | Promise<void>;
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
  /** Additional class for the content */
  className?: string;
}

/**
 * Size class mappings
 */
const sizeClasses: Record<ContributeDialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
};

/**
 * ContributeDialog - A specialized dialog for adding contributions (e.g., to goals)
 *
 * @description
 * Use this component for:
 * - Adding contributions to savings goals
 * - Quick amount entry dialogs
 * - Simple single-field forms
 *
 * @example
 * <ContributeDialog
 *   open={isContributeOpen}
 *   onOpenChange={setIsContributeOpen}
 *   title="Add Contribution"
 *   onSubmit={handleContribute}
 *   submitText="Add"
 * >
 *   <FormField
 *     id="amount"
 *     label="Amount"
 *     type="number"
 *     value={amount}
 *     onChange={setAmount}
 *   />
 * </ContributeDialog>
 */
export function ContributeDialog({
  open,
  onOpenChange,
  title = 'Add Contribution',
  description,
  children,
  size = 'sm',
  onSubmit,
  onCancel,
  submitText = 'Add',
  cancelText = 'Cancel',
  isLoading = false,
  isSubmitDisabled = false,
  className,
}: ContributeDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    await onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <PlusCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">{children}</div>

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
            onClick={handleSubmit}
            disabled={isLoading || isSubmitDisabled}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Adding...' : submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

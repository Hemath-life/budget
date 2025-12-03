import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '#/components/ui/button';
import { ScrollArea } from '#/components/ui/scroll-area';
import { BaseDialog, type BaseDialogProps } from './base-dialog';

export interface ViewDialogProps extends BaseDialogProps {
  showCloseButton?: boolean;
  closeButtonClassName?: string;
  scrollable?: boolean;
  maxHeight?: string;
}

export function ViewDialog({
  showCloseButton = true,
  closeButtonClassName,
  scrollable = true,
  maxHeight = 'max-h-[80vh]',
  children,
  onOpenChange,
  ...dialogProps
}: ViewDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  const content = scrollable ? (
    <ScrollArea className={cn('w-full', maxHeight)}>
      <div className="p-1">{children}</div>
    </ScrollArea>
  ) : (
    <div className={cn('w-full', maxHeight, 'overflow-hidden')}>
      {children}
    </div>
  );

  return (
    <BaseDialog {...dialogProps} onOpenChange={onOpenChange}>
      <div className="relative">
        {showCloseButton && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'absolute right-0 top-0 h-6 w-6 p-0 hover:bg-muted',
              closeButtonClassName
            )}
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
        {content}
      </div>
    </BaseDialog>
  );
}

'use client';

import { AlertDialog } from '@repo/ui/dialogs';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmLabel = 'Delete',
  isLoading = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      variant="delete"
      onConfirm={onConfirm}
      confirmText={confirmLabel}
      isLoading={isLoading}
    />
  );
}

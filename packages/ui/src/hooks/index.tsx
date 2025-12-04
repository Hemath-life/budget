/**
 * Custom React Hooks
 *
 * @description
 * Reusable hooks for common UI patterns.
 *
 * @example
 * import { useDialogState, useIsMobile } from '@repo/ui/hooks';
 *
 * const [dialog, setDialog] = useDialogState<'create' | 'edit' | 'delete'>();
 * const isMobile = useIsMobile();
 */

// Dialog state management
export { default as useDialogState } from './use-dialog-state';
export type { default as UseDialogState } from './use-dialog-state';

// Responsive hooks
export { useIsMobile } from './use-mobile';

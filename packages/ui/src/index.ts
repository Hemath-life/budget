/**
 * @repo/ui - Shared UI Component Library
 *
 * @description
 * This is the main entry point for the @repo/ui package.
 * For better tree-shaking, prefer importing from specific modules:
 *
 * @example
 * // Recommended: Import from specific modules
 * import { Button, Card } from '@repo/ui/components/ui';
 * import { FormField, DateField } from '@repo/ui/forms';
 * import { AlertDialog, EditDialog } from '@repo/ui/dialogs';
 * import { DataTable, DataTableColumnHeader } from '@repo/ui/tables';
 * import { useDialogState } from '@repo/ui/hooks';
 * import { cn } from '@repo/ui/lib';
 *
 * @example
 * // Alternative: Import from main entry (less tree-shakeable)
 * import { PageHeader, FormField, BaseDialog } from '@repo/ui';
 */

// Header components
export * from './header';

// Layout components
export * from './layout';

// Form field components
export * from './forms';

// Dialog/Modal components
export * from './dialogs';

// Table components (re-export key utilities)
// Note: For full table functionality, import from '@repo/ui/tables'
export {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
} from './tables';

// Common utilities and components
export * from './common';

// Internationalization assets
export * from './assets/i18n';

// Base Dialog Components
export { BaseDialog, type BaseDialogProps } from './base-dialog';
export { FormDialog, type FormDialogProps } from './form-dialog';

// Alert & Confirmation Dialogs
export {
  AlertDialog,
  AlertDialogComponent,
  type AlertDialogProps,
  type AlertDialogVariant,
} from './alert-dialog';
export {
  ConfirmationDialog,
  type ConfirmationDialogProps,
} from './confirmation-dialog';

// Edit & Create Dialogs
export {
  ContributeDialog,
  type ContributeDialogProps,
  type ContributeDialogSize,
} from './contribute-dialog';
export {
  EditDialog,
  type EditDialogProps,
  type EditDialogSize,
} from './edit-dialog';

// View & Display Dialogs
export { ViewDialog, type ViewDialogProps } from './view-dialog';

// Specialized Dialogs
export {
  FileUploadDialog,
  type FileUploadDialogProps,
} from './file-upload-dialog';
export {
  SearchDialog,
  type SearchDialogProps,
  type SearchItem,
} from './search-dialog';

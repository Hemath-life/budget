import { type ColumnDef, type Table, type Row, type Column } from '@tanstack/react-table';
import { type ReactNode, type ComponentType } from 'react';

// Base table configuration
export interface DataTableConfig<TData> {
  // Core settings
  enableSearch?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableColumnHiding?: boolean;
  enableColumnResizing?: boolean;
  
  // Pagination settings
  pageSize?: number;
  pageSizeOptions?: number[];
  
  // Search settings
  searchKey?: string;
  searchPlaceholder?: string;
  
  // Display settings
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  
  // State settings
  defaultSorting?: Array<{ id: string; desc: boolean }>;
  defaultColumnVisibility?: Record<string, boolean>;
  defaultColumnFilters?: Array<{ id: string; value: any }>;
}

// Enhanced data table props
export interface DataTableProps<TData, TValue = unknown> extends DataTableConfig<TData> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  loading?: boolean;
  error?: Error | null;
  
  // Custom components
  toolbar?: ComponentType<DataTableToolbarProps<TData>>;
  pagination?: ComponentType<DataTablePaginationProps<TData>>;
  emptyState?: ComponentType<{ message: string }>;
  loadingState?: ComponentType<{ message: string }>;
  errorState?: ComponentType<{ error: Error; onRetry?: () => void }>;
  
  // Event handlers
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;
  onRowClick?: (row: Row<TData>) => void;
  onRowDoubleClick?: (row: Row<TData>) => void;
  onColumnSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  onColumnFilter?: (columnId: string, value: any) => void;
  
  // Actions
  actions?: ReactNode;
  bulkActions?: ComponentType<DataTableBulkActionsProps<TData>>;
}

// Toolbar props
export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  enableFiltering?: boolean;
  enableColumnHiding?: boolean;
  actions?: ReactNode;
}

// Pagination props
export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  enableRowSelection?: boolean;
}

// Bulk actions props
export interface DataTableBulkActionsProps<TData> {
  table: Table<TData>;
  selectedRows: Row<TData>[];
  onAction: (action: string, rows: Row<TData>[]) => void;
}

// Column header props
export interface DataTableColumnHeaderProps {
  column: Column<any, unknown>;
  title: string;
  className?: string;
}

// Cell wrapper props
export interface DataTableCellProps<TData> {
  row: Row<TData>;
  column: Column<TData>;
  value: any;
  className?: string;
}

// Form-specific types for transaction tables
export interface FormFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: string[] | { value: string; label: string }[];
  validation?: (value: any) => string | null;
  dependsOn?: string; // For conditional fields
  rows?: number; // For textarea
  step?: string; // For number inputs
  min?: string | number;
  max?: string | number;
}

// Table action configuration
export interface TableAction<TData = any> {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (rows: Row<TData>[]) => void;
  disabled?: (rows: Row<TData>[]) => boolean;
  confirmationMessage?: string;
}

// Filter configuration
export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'text';
  options?: Array<{ value: string; label: string; count?: number }>;
  placeholder?: string;
}

// Export types for re-use
export type {
  Table,
  Row,
  Column,
  ColumnDef,
} from '@tanstack/react-table';

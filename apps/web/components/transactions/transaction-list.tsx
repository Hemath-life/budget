'use client';

import { EmptyState } from '@/components/shared/empty-state';
import {
  useCategories,
  useDeleteTransaction,
  usePaginatedTransactions,
  useSettings,
} from '@/lib/hooks';
import type { Transaction } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge, Button, Input } from '@repo/ui/components/ui';
import { AlertDialog } from '@repo/ui/dialogs';
import { SelectField } from '@repo/ui/forms';
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
  type ColumnDef,
  type RowAction,
} from '@repo/ui/tables';
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface TransactionListProps {
  filterType?: 'income' | 'expense' | 'all';
  showFilters?: boolean;
}

// Custom debounce hook
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function TransactionList({
  filterType = 'all',
  showFilters = true,
}: TransactionListProps) {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();
  const deleteTransaction = useDeleteTransaction();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(filterType);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce search term
  const debouncedSearch = useDebounceValue(searchTerm, 300);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [typeFilter, categoryFilter, debouncedSearch, pageSize]);

  // Fetch paginated transactions
  const { data, isLoading, isFetching } = usePaginatedTransactions({
    type: typeFilter,
    category: categoryFilter,
    search: debouncedSearch,
    page,
    pageSize,
  });

  const transactions = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || 0;

  const getCategoryName = (
    category: string | { id: string; name?: string }
  ) => {
    if (typeof category === 'object' && category.name) {
      return category.name;
    }
    const categoryId = typeof category === 'object' ? category.id : category;
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || categoryId;
  };

  const getCategoryColor = (
    category: string | { id: string; color?: string }
  ) => {
    if (typeof category === 'object' && category.color) {
      return category.color;
    }
    const categoryId = typeof category === 'object' ? category.id : category;
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.color || '#6B7280';
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteTransaction.mutate(deleteId, {
        onSuccess: () => {
          toast.success('Transaction deleted');
          setDeleteId(null);
        },
        onError: () => {
          toast.error('Failed to delete transaction');
          setDeleteId(null);
        },
      });
    }
  };

  // Row actions configuration
  const rowActions: RowAction<Transaction>[] = [
    {
      key: 'edit',
      label: 'Edit',
      icon: Pencil,
      onClick: (transaction) => router.push(`/transactions/${transaction.id}`),
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: (transaction) => setDeleteId(transaction.id),
      className: 'text-red-600',
      separator: true,
    },
  ];

  // Column definitions using DataTable
  const columns: ColumnDef<Transaction>[] = useMemo(
    () => [
      {
        accessorKey: 'description',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <div className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  transaction.type === 'income'
                    ? 'bg-green-100 dark:bg-green-900/20'
                    : 'bg-red-100 dark:bg-red-900/20'
                }`}
              >
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                {transaction.isRecurring && (
                  <Badge variant="outline" className="text-xs mt-1">
                    Recurring
                  </Badge>
                )}
              </div>
            </div>
          );
        },
        meta: { className: 'w-[35%]' },
      },
      {
        accessorKey: 'category',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ row }) => {
          const category = row.original.category;
          if (!category) return null;
          return (
            <Badge
              variant="outline"
              style={{
                borderColor: getCategoryColor(category),
                color: getCategoryColor(category),
              }}
            >
              {getCategoryName(category)}
            </Badge>
          );
        },
        meta: { className: 'w-[15%]' },
      },
      {
        accessorKey: 'date',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDate(row.original.date)}
          </span>
        ),
        meta: { className: 'w-[15%]' },
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Amount"
            className="justify-end"
          />
        ),
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <div
              className={`text-right font-semibold ${
                transaction.type === 'income'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(
                transaction.amount,
                transaction.currency || settings?.defaultCurrency || 'INR'
              )}
            </div>
          );
        },
        meta: { className: 'w-[20%] text-right' },
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DataTableRowActions row={row} actions={rowActions} />
        ),
        meta: { className: 'w-[50px]' },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings?.defaultCurrency]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <SelectField
              id="type-filter"
              hideLabel
              value={typeFilter}
              onChange={setTypeFilter}
              placeholder="Type"
              triggerClassName="w-full sm:w-[150px]"
              options={[
                { label: 'All Types', value: 'all' },
                { label: 'Income', value: 'income' },
                { label: 'Expense', value: 'expense' },
              ]}
            />
            <SelectField
              id="category-filter"
              hideLabel
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder="Category"
              triggerClassName="w-full sm:w-[180px]"
              options={[
                { label: 'All Categories', value: 'all' },
                ...categories.map((cat) => ({
                  label: cat.name,
                  value: cat.id,
                  color: cat.color,
                })),
              ]}
            />
          </div>
        )}

        <div className="relative flex-1 flex flex-col min-h-0">
          {isFetching && !isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {transactions.length === 0 && total === 0 ? (
            <EmptyState
              title="No transactions yet"
              description="Start tracking your finances by adding your first transaction, or load sample data to explore the app."
              actionLabel="Add Transaction"
              actionHref="/transactions/add"
              icon={
                <ArrowUpRight className="h-12 w-12 text-muted-foreground/50" />
              }
            />
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No transactions match your filters</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setCategoryFilter('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              {/* DataTable with scrollable body */}
              <div className="overflow-auto h-[465px]">
                <DataTable
                  columns={columns}
                  data={transactions}
                  enablePagination={false}
                  enableColumnVisibility={false}
                  emptyMessage="No transactions found"
                  getRowId={(row) => row.id}
                />
              </div>

              {/* Server-side Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1} to{' '}
                    {Math.min(page * pageSize, total)} of {total} transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Rows per page:
                    </span>
                    <SelectField
                      id="page-size"
                      hideLabel
                      value={pageSize.toString()}
                      onChange={(value) => setPageSize(Number(value))}
                      triggerClassName="w-[70px] h-8"
                      options={['10', '25', '50', '100']}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1 mx-2">
                    <span className="text-sm font-medium">Page {page}</span>
                    <span className="text-sm text-muted-foreground">
                      of {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        variant="delete"
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </>
  );
}

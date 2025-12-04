'use client';

/**
 * Example DataTable Usage Component
 *
 * This file demonstrates how to use the reusable DataTable components
 * from @repo/ui/tables in the Next.js budget app.
 *
 * Note: This is an example/reference implementation.
 * The actual transaction-list uses server-side pagination
 * which requires a different approach.
 */

import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge, Button } from '@repo/ui/components/ui';
import { AlertDialog } from '@repo/ui/dialogs';
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableRowActions,
  DataTableToolbar,
  type ColumnDef,
  type Table,
} from '@repo/ui/tables';
import { ArrowDownRight, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Example transaction type
interface Transaction {
  id: string;
  description: string;
  category: string;
  categoryColor: string;
  date: string;
  amount: number;
  currency: string;
  type: 'income' | 'expense';
  isRecurring?: boolean;
}

// Define columns with sorting support
const createColumns = (
  onDelete: (transaction: Transaction) => void
): ColumnDef<Transaction>[] => [
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
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <Badge
          variant="outline"
          style={{
            borderColor: transaction.categoryColor,
            color: transaction.categoryColor,
          }}
        >
          {transaction.category}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.getValue('date'))}
      </span>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <span
          className={`font-semibold ${
            transaction.type === 'income'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount, transaction.currency)}
        </span>
      );
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={row.getValue('type') === 'income' ? 'default' : 'secondary'}
      >
        {row.getValue('type')}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        actions={[
          {
            key: 'edit',
            label: 'Edit',
            icon: Pencil,
            onClick: (transaction) => {
              // Navigate to edit page
              window.location.href = `/transactions/${transaction.id}`;
            },
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: Trash2,
            onClick: onDelete,
            className: 'text-red-500!',
            separator: true,
          },
        ]}
      />
    ),
  },
];

// Custom toolbar with filters
function TransactionsToolbar({ table }: { table: Table<Transaction> }) {
  return (
    <DataTableToolbar
      table={table}
      searchColumn="description"
      searchPlaceholder="Search transactions..."
      filters={[
        {
          columnId: 'type',
          title: 'Type',
          options: [
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
          ],
        },
      ]}
      rightContent={
        <Button asChild>
          <Link href="/transactions/add">Add Transaction</Link>
        </Button>
      }
    />
  );
}

interface TransactionDataTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

/**
 * Example DataTable implementation for transactions.
 *
 * This demonstrates how to use the @repo/ui/tables components
 * with client-side sorting, filtering, and pagination.
 *
 * @example
 * ```tsx
 * <TransactionDataTable
 *   transactions={transactions}
 *   onDelete={(id) => deleteTransaction.mutate(id)}
 * />
 * ```
 */
export function TransactionDataTable({
  transactions,
  onDelete,
}: TransactionDataTableProps) {
  const [deleteTransaction, setDeleteTransaction] =
    useState<Transaction | null>(null);

  const columns = createColumns((transaction) =>
    setDeleteTransaction(transaction)
  );

  const handleDelete = () => {
    if (deleteTransaction) {
      onDelete(deleteTransaction.id);
      setDeleteTransaction(null);
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={transactions}
        toolbar={TransactionsToolbar}
        pagination={DataTablePagination}
        emptyMessage="No transactions found."
        enableRowSelection
      />

      <AlertDialog
        open={!!deleteTransaction}
        onOpenChange={() => setDeleteTransaction(null)}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        variant="delete"
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </>
  );
}

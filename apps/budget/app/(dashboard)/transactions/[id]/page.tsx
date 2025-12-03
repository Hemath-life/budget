'use client';

import { use } from 'react';
import { useTransactions } from '@/lib/hooks';
import { TransactionForm } from '@/apps/components/transactions/transaction-form';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditTransactionPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const { data: transactions = [], isLoading } = useTransactions();
  const transaction = transactions.find((t) => t.id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!transaction) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TransactionForm transaction={transaction} mode="edit" />
    </div>
  );
}

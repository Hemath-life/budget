'use client';

import { use } from 'react';
import { useAppSelector } from '@/store/hooks';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { notFound } from 'next/navigation';

export default function EditTransactionPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const transactions = useAppSelector((state) => state.transactions.items);
  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TransactionForm transaction={transaction} mode="edit" />
    </div>
  );
}

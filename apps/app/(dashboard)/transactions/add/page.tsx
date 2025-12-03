import { TransactionForm } from '@/apps/components/transactions/transaction-form';

export default function AddTransactionPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <TransactionForm mode="add" />
    </div>
  );
}

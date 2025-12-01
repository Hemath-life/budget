import { TransactionList } from '@/components/transactions/transaction-list';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage all your transactions
        </p>
      </div>
      <TransactionList />
    </div>
  );
}

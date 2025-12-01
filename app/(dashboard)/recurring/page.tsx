'use client';

import { RecurringManager } from '@/components/recurring/recurring-manager';

export default function RecurringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Recurring Transactions</h1>
        <p className="text-muted-foreground">Manage your automatic income and expenses</p>
      </div>

      <RecurringManager />
    </div>
  );
}

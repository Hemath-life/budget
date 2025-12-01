'use client';

import { BudgetManager } from '@/components/budgets/budget-manager';

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Budgets</h1>
        <p className="text-muted-foreground">Plan and track your spending limits</p>
      </div>

      <BudgetManager />
    </div>
  );
}

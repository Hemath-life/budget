'use client';

import { BudgetManager } from '@/components/budgets/budget-manager';
import { Button } from '@repo/ui/components/ui';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function BudgetsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">
            Plan and track your spending limits
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      <BudgetManager
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
}

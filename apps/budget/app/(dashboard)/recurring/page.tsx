'use client';

import { useState } from 'react';
import { RecurringManager } from '@/components/recurring/recurring-manager';
import { Button } from '@repo/ui/components/ui';
import { Plus } from 'lucide-react';

export default function RecurringPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recurring Transactions</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your automatic income and expenses</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Recurring
        </Button>
      </div>

      <RecurringManager isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </div>
  );
}

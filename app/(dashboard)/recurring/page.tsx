'use client';

import { useState } from 'react';
import { RecurringManager } from '@/components/recurring/recurring-manager';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function RecurringPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recurring Transactions</h1>
          <p className="text-muted-foreground">Manage your automatic income and expenses</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Recurring
        </Button>
      </div>

      <RecurringManager isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </div>
  );
}

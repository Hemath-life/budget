'use client';

import { GoalManager } from '@/components/goals/goal-manager';
import { Button } from '@repo/ui/components/ui';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function GoalsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financial Goals</h1>
          <p className="text-muted-foreground">
            Set and track your savings goals
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <GoalManager
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
}

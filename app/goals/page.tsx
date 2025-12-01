'use client';

import { GoalManager } from '@/components/goals/goal-manager';

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Goals</h1>
        <p className="text-muted-foreground">Set and track your savings goals</p>
      </div>

      <GoalManager />
    </div>
  );
}

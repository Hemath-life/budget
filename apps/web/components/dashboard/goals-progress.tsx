'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui';
import { useGoals, useSettings } from '@/lib/hooks';
import { formatCurrency, formatDate, calculatePercentage } from '@/lib/utils';
import { Progress } from '@repo/ui/components/ui';
import Link from 'next/link';
import { Target, Loader2 } from 'lucide-react';

export function GoalsProgress() {
  const { data: goals = [], isLoading: goalsLoading } = useGoals();
  const { data: settings } = useSettings();

  const activeGoals = goals.filter((g) => !g.isCompleted);

  if (goalsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Goals Progress</CardTitle>
        <Link href="/goals" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeGoals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No active goals. <Link href="/goals" className="text-primary hover:underline">Create one</Link>
            </p>
          ) : (
            activeGoals.slice(0, 3).map((goal) => {
              const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: goal.color + '20' }}
                      >
                        <Target className="h-4 w-4" style={{ color: goal.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{goal.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {formatDate(goal.deadline)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium" style={{ color: goal.color }}>
                      {percentage}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(goal.currentAmount, goal.currency || settings?.defaultCurrency || 'INR')}</span>
                    <span>{formatCurrency(goal.targetAmount, goal.currency || settings?.defaultCurrency || 'INR')}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

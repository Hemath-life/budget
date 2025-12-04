'use client';

import { cn, formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui';
import { Sparkles, Target } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
}

interface GoalsCardProps {
  goals: Goal[];
  currency: string;
}

const colorMap: Record<string, { bg: string; progress: string; text: string }> =
  {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      progress: 'bg-gradient-to-r from-blue-500 to-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      progress: 'bg-gradient-to-r from-purple-500 to-purple-400',
      text: 'text-purple-600 dark:text-purple-400',
    },
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      progress: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      progress: 'bg-gradient-to-r from-orange-500 to-orange-400',
      text: 'text-orange-600 dark:text-orange-400',
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-900/30',
      progress: 'bg-gradient-to-r from-pink-500 to-pink-400',
      text: 'text-pink-600 dark:text-pink-400',
    },
  };

export function GoalsCard({ goals, currency }: GoalsCardProps) {
  const displayGoals = goals.slice(0, 3);

  return (
    <Card className="h-full bg-gradient-to-br from-background to-amber-50/30 dark:to-amber-950/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-base font-semibold">
              Financial Goals
            </CardTitle>
          </div>
          <Sparkles className="h-4 w-4 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayGoals.map((goal) => {
          const percentage = Math.round(
            (goal.currentAmount / goal.targetAmount) * 100
          );
          const colors = colorMap[goal.color] || colorMap.blue;

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn('w-2 h-2 rounded-full', colors.progress)}
                  />
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {goal.name}
                  </span>
                </div>
                <span className={cn('text-xs font-semibold', colors.text)}>
                  {percentage}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      colors.progress
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatCurrency(goal.currentAmount, currency)}
                </span>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No goals set yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}

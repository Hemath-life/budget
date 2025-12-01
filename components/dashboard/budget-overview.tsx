'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/store/hooks';
import { formatCurrency, calculatePercentage } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export function BudgetOverview() {
  const budgets = useAppSelector((state) => state.budgets.items);
  const categories = useAppSelector((state) => state.categories.items);
  const settings = useAppSelector((state) => state.settings);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || '#6B7280';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget Overview</CardTitle>
        <Link href="/budgets" className="text-sm text-primary hover:underline">
          Manage budgets
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No budgets set. <Link href="/budgets" className="text-primary hover:underline">Create one</Link>
            </p>
          ) : (
            budgets.slice(0, 4).map((budget) => {
              const percentage = calculatePercentage(budget.spent, budget.amount);
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(budget.category) }}
                      />
                      <span className="text-sm font-medium">
                        {getCategoryName(budget.category)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(budget.spent, budget.currency || settings.defaultCurrency)} / {formatCurrency(budget.amount, budget.currency || settings.defaultCurrency)}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={Math.min(percentage, 100)} className="h-2" />
                    <div
                      className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage}% used</span>
                    <span>
                      {formatCurrency(Math.max(budget.amount - budget.spent, 0), budget.currency || settings.defaultCurrency)} remaining
                    </span>
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

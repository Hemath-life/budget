'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui';
import { useBudgets, useCategories, useSettings } from '@/lib/hooks';
import { formatCurrency, calculatePercentage } from '@/lib/utils';
import { Progress } from '@repo/ui/components/ui';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export function BudgetOverview() {
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();

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

  if (budgetsLoading) {
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
                      {formatCurrency(budget.spent, budget.currency || settings?.defaultCurrency || 'INR')} / {formatCurrency(budget.amount, budget.currency || settings?.defaultCurrency || 'INR')}
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
                      {formatCurrency(Math.max(budget.amount - budget.spent, 0), budget.currency || settings?.defaultCurrency || 'INR')} remaining
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

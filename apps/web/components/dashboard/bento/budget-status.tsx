'use client';

import { cn, formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui';
import { Sparkles, Wallet } from 'lucide-react';

interface BudgetStatusProps {
  budgets: Array<{
    id: string;
    name: string;
    spent: number;
    limit: number;
    color: string;
  }>;
  currency: string;
}

const colorMap: Record<string, { gradient: string; bg: string; text: string }> =
  {
    blue: {
      gradient: 'from-blue-500 to-cyan-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      gradient: 'from-purple-500 to-pink-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400',
    },
    emerald: {
      gradient: 'from-emerald-500 to-teal-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    orange: {
      gradient: 'from-orange-500 to-amber-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-600 dark:text-orange-400',
    },
    rose: {
      gradient: 'from-rose-500 to-pink-400',
      bg: 'bg-rose-100 dark:bg-rose-900/30',
      text: 'text-rose-600 dark:text-rose-400',
    },
  };

export function BudgetStatus({ budgets, currency }: BudgetStatusProps) {
  const displayBudgets = budgets.slice(0, 4);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
  const overallPercentage =
    totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  return (
    <Card className="h-full bg-gradient-to-br from-indigo-50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/10 border-indigo-200/50 dark:border-indigo-800/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <CardTitle className="text-base font-semibold text-indigo-900 dark:text-indigo-100">
              Budget Status
            </CardTitle>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            <span>{overallPercentage}% used</span>
            <Sparkles className="h-3 w-3" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {/* Overall progress ring */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-white/50 dark:bg-white/5">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-indigo-200 dark:text-indigo-900/50"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#budgetGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${overallPercentage * 1.76} 176`}
              />
              <defs>
                <linearGradient
                  id="budgetGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {overallPercentage}%
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
              {formatCurrency(totalLimit, currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalSpent, currency)} spent
            </p>
          </div>
        </div>

        {/* Individual budgets */}
        <div className="space-y-3">
          {displayBudgets.map((budget) => {
            const percentage = Math.round((budget.spent / budget.limit) * 100);
            const colors = colorMap[budget.color] || colorMap.blue;
            const isOverBudget = percentage > 100;

            return (
              <div key={budget.id} className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-1 h-8 rounded-full bg-gradient-to-b',
                    colors.gradient
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">
                      {budget.name}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        isOverBudget ? 'text-rose-500' : colors.text
                      )}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full bg-gradient-to-r transition-all duration-500',
                        isOverBudget
                          ? 'from-rose-500 to-rose-400'
                          : colors.gradient
                      )}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No budgets set
          </div>
        )}
      </CardContent>
    </Card>
  );
}

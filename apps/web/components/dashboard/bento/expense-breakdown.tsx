'use client';

import { cn, formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui';
import {
  Car,
  CreditCard,
  Gamepad2,
  Home,
  ShoppingCart,
  Utensils,
} from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface ExpenseBreakdownProps {
  expenses: Expense[];
  totalExpenses: number;
  currency: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  Shopping: ShoppingCart,
  Transport: Car,
  Housing: Home,
  Food: Utensils,
  Entertainment: Gamepad2,
  default: CreditCard,
};

const colorClasses: Record<string, { bg: string; text: string; bar: string }> =
  {
    rose: {
      bg: 'bg-rose-100 dark:bg-rose-900/30',
      text: 'text-rose-600 dark:text-rose-400',
      bar: 'bg-gradient-to-r from-rose-500 to-rose-400',
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      bar: 'bg-gradient-to-r from-blue-500 to-blue-400',
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-gradient-to-r from-amber-500 to-amber-400',
    },
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400',
      bar: 'bg-gradient-to-r from-purple-500 to-purple-400',
    },
  };

export function ExpenseBreakdown({
  expenses,
  totalExpenses,
  currency,
}: ExpenseBreakdownProps) {
  const displayExpenses = expenses.slice(0, 5);

  return (
    <Card className="h-full border overflow-hidden bg-gradient-to-br from-rose-500/5 via-transparent to-transparent dark:from-rose-500/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10">
              <CreditCard className="h-4 w-4 text-rose-500" />
            </div>
            <CardTitle className="text-base font-semibold">
              Expense Breakdown
            </CardTitle>
          </div>
          <span className="text-lg font-bold text-rose-500">
            {formatCurrency(totalExpenses, currency)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {displayExpenses.map((expense) => {
          const Icon = categoryIcons[expense.category] || categoryIcons.default;
          const colors = colorClasses[expense.color] || colorClasses.rose;

          return (
            <div key={expense.id} className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', colors.bg)}>
                <Icon className={cn('h-4 w-4', colors.text)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">
                    {expense.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(expense.amount, currency)}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      colors.bar
                    )}
                    style={{ width: `${expense.percentage}%` }}
                  />
                </div>
              </div>
              <span
                className={cn(
                  'text-xs font-semibold min-w-[40px] text-right',
                  colors.text
                )}
              >
                {expense.percentage}%
              </span>
            </div>
          );
        })}

        {expenses.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No expenses recorded
          </div>
        )}
      </CardContent>
    </Card>
  );
}

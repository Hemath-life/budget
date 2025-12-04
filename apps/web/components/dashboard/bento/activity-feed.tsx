'use client';

import { cn, formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui';
import { Activity, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface ActivityFeedProps {
  transactions: Transaction[];
  currency: string;
}

export function ActivityFeed({ transactions, currency }: ActivityFeedProps) {
  const displayTransactions = transactions.slice(0, 6);

  return (
    <Card className="h-full bg-gradient-to-br from-background to-slate-50/50 dark:to-slate-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          <CardTitle className="text-base font-semibold">
            Recent Activity
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayTransactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className={cn(
              'flex items-center justify-between py-2',
              index !== displayTransactions.length - 1 &&
                'border-b border-border/50'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'p-2 rounded-full',
                  transaction.type === 'income'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                    : 'bg-rose-100 dark:bg-rose-900/30'
                )}
              >
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate max-w-[140px]">
                  {transaction.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  'text-sm font-semibold',
                  transaction.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount, currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                {transaction.date}
              </p>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  );
}

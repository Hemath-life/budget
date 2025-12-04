'use client';

import { cn, formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@repo/ui/components/ui';
import {
  CreditCard,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  type: 'income' | 'expense' | 'balance' | 'savings';
  currency: string;
}

const config = {
  income: {
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-teal-400',
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20',
    border: 'border-emerald-200/50 dark:border-emerald-800/30',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    textColor: 'text-emerald-900 dark:text-emerald-100',
  },
  expense: {
    icon: CreditCard,
    gradient: 'from-rose-500 to-pink-400',
    bg: 'bg-gradient-to-br from-rose-50 to-pink-50/50 dark:from-rose-950/30 dark:to-pink-950/20',
    border: 'border-rose-200/50 dark:border-rose-800/30',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-600 dark:text-rose-400',
    textColor: 'text-rose-900 dark:text-rose-100',
  },
  balance: {
    icon: Wallet,
    gradient: 'from-blue-500 to-cyan-400',
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/20',
    border: 'border-blue-200/50 dark:border-blue-800/30',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
    textColor: 'text-blue-900 dark:text-blue-100',
  },
  savings: {
    icon: PiggyBank,
    gradient: 'from-purple-500 to-violet-400',
    bg: 'bg-gradient-to-br from-purple-50 to-violet-50/50 dark:from-purple-950/30 dark:to-violet-950/20',
    border: 'border-purple-200/50 dark:border-purple-800/30',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
    textColor: 'text-purple-900 dark:text-purple-100',
  },
};

export function StatCard({
  title,
  value,
  change,
  type,
  currency,
}: StatCardProps) {
  const {
    icon: Icon,
    bg,
    border,
    iconBg,
    iconColor,
    textColor,
    gradient,
  } = config[type];
  const isPositive = change >= 0;

  return (
    <Card className={cn('h-full overflow-hidden', bg, border)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className={cn('p-2 rounded-lg', iconBg)}>
            <Icon className={cn('h-4 w-4', iconColor)} />
          </div>
          <div
            className={cn(
              'flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full',
              isPositive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-2.5 w-2.5" />
            ) : (
              <TrendingDown className="h-2.5 w-2.5" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
          <span className={cn('text-lg font-bold tracking-tight', textColor)}>
            {formatCurrency(value, currency)}
          </span>
        </div>

        {/* Decorative gradient bar */}
        <div
          className={cn(
            'h-0.5 w-full mt-3 rounded-full bg-gradient-to-r opacity-60',
            gradient
          )}
        />
      </CardContent>
    </Card>
  );
}

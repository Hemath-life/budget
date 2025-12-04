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
    gradient: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
  expense: {
    icon: CreditCard,
    gradient: 'bg-rose-500',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
  },
  balance: {
    icon: Wallet,
    gradient: 'bg-blue-500',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  savings: {
    icon: PiggyBank,
    gradient: 'bg-purple-500',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
};

export function StatCard({
  title,
  value,
  change,
  type,
  currency,
}: StatCardProps) {
  const { icon: Icon, iconBg, iconColor, gradient } = config[type];
  const isPositive = change >= 0;

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className={cn('p-2 rounded-lg', iconBg)}>
            <Icon className={cn('h-4 w-4', iconColor)} />
          </div>
          <div
            className={cn(
              'flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full',
              isPositive
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-rose-500/10 text-rose-500'
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
          <span className="text-lg font-bold tracking-tight">
            {formatCurrency(value, currency)}
          </span>
        </div>

        {/* Accent bar */}
        <div className={cn('h-0.5 w-full mt-3 rounded-full', gradient)} />
      </CardContent>
    </Card>
  );
}

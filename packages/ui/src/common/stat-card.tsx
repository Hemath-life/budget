'use client';

import { Card, CardContent } from '#/components/ui';
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';

export type StatType = 'income' | 'expense' | 'balance' | 'savings';

export interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  type?: StatType;
  currency?: string;
  formatCurrency?: (amount: number, currency: string) => string;
}

// Default currency formatter
const defaultFormatCurrency = (amount: number, currency: string): string => {
  if (!currency) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const config: Record<
  StatType,
  {
    icon: typeof TrendingUp;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  income: {
    icon: TrendingUp,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-l-emerald-500',
  },
  expense: {
    icon: TrendingDown,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    borderColor: 'border-l-rose-500',
  },
  balance: {
    icon: Wallet,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-l-blue-500',
  },
  savings: {
    icon: DollarSign,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-l-purple-500',
  },
};

export function StatCard({
  title,
  value,
  change = 0,
  type = 'balance',
  currency = 'USD',
  formatCurrency = defaultFormatCurrency,
}: StatCardProps) {
  const { icon: Icon, color, borderColor } = config[type];
  const isPositive = change >= 0;

  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-xl font-bold tabular-nums">
              {currency ? formatCurrency(value, currency) : value}
            </p>
            {change !== 0 && (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-rose-500" />
                )}
                <span
                  className={`text-xs font-medium ${
                    isPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {Math.abs(change)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last period
                </span>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg ${config[type].bgColor}`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

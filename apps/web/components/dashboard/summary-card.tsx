'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui';
import { cn, formatCurrency, calculateChange } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number;
  previousValue?: number;
  currency: string;
  type: 'income' | 'expense' | 'balance' | 'savings';
  icon?: React.ReactNode;
}

export function SummaryCard({ title, value, previousValue, currency, type, icon }: SummaryCardProps) {
  const change = previousValue !== undefined ? calculateChange(value, previousValue) : null;
  const isPositive = change !== null && change >= 0;

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'income':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'expense':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'balance':
        return <Wallet className="h-5 w-5 text-blue-500" />;
      case 'savings':
        return <PiggyBank className="h-5 w-5 text-purple-500" />;
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-600 dark:text-green-400';
      case 'expense':
        return 'text-red-600 dark:text-red-400';
      case 'balance':
        return value >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
      case 'savings':
        return 'text-purple-600 dark:text-purple-400';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', getValueColor())}>
          {formatCurrency(Math.abs(value), currency)}
        </div>
        {change !== null && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            )}
            <span className={cn(isPositive ? 'text-green-500' : 'text-red-500')}>
              {Math.abs(change)}%
            </span>
            <span>vs last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

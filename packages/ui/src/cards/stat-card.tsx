'use client';

import { Card, CardContent } from '#/components/ui';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export type StatType = 'income' | 'expense' | 'balance' | 'savings';

export interface StatCardProps {
  title: string;
  value: string | number;
  previousValue?: string;
  change?: number;
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

export function StatCard({
  title,
  value,
  previousValue,
  change,
  currency = 'USD',
  formatCurrency = defaultFormatCurrency,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const hasChange = change !== undefined && change !== 0;

  const displayValue =
    typeof value === 'number' && currency
      ? formatCurrency(value, currency)
      : value;

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Title */}
          <p className="text-xs font-medium text-muted-foreground">{title}</p>

          {/* Value */}
          <p className="text-2xl font-bold tracking-tight tabular-nums">
            {displayValue}
          </p>

          {/* Previous value and change */}
          {(previousValue || hasChange) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {previousValue && <span>{previousValue}</span>}
              {hasChange && (
                <div className="flex items-center gap-1">
                  <div
                    className={`flex items-center justify-center w-4 h-4 rounded ${
                      isPositive
                        ? 'bg-emerald-100 dark:bg-emerald-950/50'
                        : 'bg-rose-100 dark:bg-rose-950/50'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="h-2.5 w-2.5 text-rose-600 dark:text-rose-400" />
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      isPositive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {change}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

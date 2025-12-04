'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '#/components/ui';

export type StatType = 'income' | 'expense' | 'balance' | 'savings';

export interface StatCardProps {
  title: string;
  value: string | number;
  previousValue?: string;
  change?: number;
  icon?: StatType | LucideIcon;
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

const iconConfig: Record<
  StatType,
  { icon: LucideIcon; color: string; bgColor: string }
> = {
  income: {
    icon: TrendingUp,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-950/50',
  },
  expense: {
    icon: TrendingDown,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-950/50',
  },
  balance: {
    icon: Wallet,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-950/50',
  },
  savings: {
    icon: PiggyBank,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-950/50',
  },
};

export function StatCard({
  title,
  value,
  previousValue,
  change,
  icon,
  currency = 'USD',
  formatCurrency = defaultFormatCurrency,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const hasChange = change !== undefined && change !== 0;

  const displayValue =
    typeof value === 'number' && currency
      ? formatCurrency(value, currency)
      : value;

  // Determine icon to show
  const getIconConfig = () => {
    if (!icon) return null;
    if (typeof icon === 'string' && icon in iconConfig) {
      return iconConfig[icon as StatType];
    }
    // Custom icon passed
    return {
      icon: icon as LucideIcon,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    };
  };

  const iconData = getIconConfig();
  const IconComponent = iconData?.icon;

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
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

          {/* Icon */}
          {IconComponent && iconData && (
            <div className={`p-2 rounded-lg ${iconData.bgColor}`}>
              <IconComponent className={`h-4 w-4 ${iconData.color}`} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

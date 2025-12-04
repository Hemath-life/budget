'use client';

import { cn, formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui';
import { TrendingDown, TrendingUp, Users } from 'lucide-react';

interface VisitorsCardProps {
  totalIncome: number;
  previousIncome: number;
  currency: string;
}

export function VisitorsCard({
  totalIncome,
  previousIncome,
  currency,
}: VisitorsCardProps) {
  const change =
    previousIncome > 0
      ? Math.round(((totalIncome - previousIncome) / previousIncome) * 100)
      : 0;
  const isPositive = change >= 0;

  return (
    <Card className="h-full bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
              Income
            </CardTitle>
          </div>
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              isPositive
                ? 'bg-emerald-200/60 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-300'
                : 'bg-red-200/60 text-red-700 dark:bg-red-800/40 dark:text-red-300'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
            {formatCurrency(totalIncome, currency)}
          </div>
          <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
            Total income this month
          </p>

          {/* Mini progress bars */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-emerald-200/60 dark:bg-emerald-800/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  style={{ width: '75%' }}
                />
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                75%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-emerald-200/60 dark:bg-emerald-800/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  style={{ width: '45%' }}
                />
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                45%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

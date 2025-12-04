'use client';

import { StatCard } from '@/components/dashboard/bento/stat-card';
import {
  DateFilter,
  getDefaultDateRange,
} from '@/components/shared/date-filter';
import { DonutChart } from '@/components/shared/donut-chart';
import { useCategories, useSettings, useTransactions } from '@/lib/hooks';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function IncomePage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();
  const [dateRange, setDateRange] = useState(getDefaultDateRange);

  const currency = settings?.defaultCurrency || 'INR';
  const incomeTransactions = transactions.filter((t) => t.type === 'income');

  // Filter by date range
  const filteredTransactions = incomeTransactions.filter((t) => {
    const date = new Date(t.date);
    return date >= dateRange.from && date <= dateRange.to;
  });

  const totalIncome = filteredTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  // Previous period calculation (same duration before the selected range)
  const rangeDuration = dateRange.to.getTime() - dateRange.from.getTime();
  const prevPeriodEnd = new Date(dateRange.from.getTime() - 1);
  const prevPeriodStart = new Date(prevPeriodEnd.getTime() - rangeDuration);

  const prevPeriodTransactions = incomeTransactions.filter((t) => {
    const date = new Date(t.date);
    return date >= prevPeriodStart && date <= prevPeriodEnd;
  });
  const prevPeriodIncome = prevPeriodTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  // Calculate change percentage
  const incomeChange =
    prevPeriodIncome > 0
      ? Math.round(((totalIncome - prevPeriodIncome) / prevPeriodIncome) * 100)
      : 0;

  // Income by category (filtered)
  const incomeByCategory = filteredTransactions.reduce((acc, t) => {
    const categoryKey = t.category?.id || t.categoryId;
    acc[categoryKey] = (acc[categoryKey] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(incomeByCategory).map(
    ([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        name: category?.name || categoryId,
        value: amount,
        color: category?.color || '#10B981',
      };
    }
  );

  // All time totals for stats
  const allTimeIncome = incomeTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Income</h1>
          <p className="text-muted-foreground">
            Track and analyze your income sources
          </p>
        </div>
        <Link href="/transactions/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Income
          </Button>
        </Link>
      </div>

      <DateFilter onFilterChange={setDateRange} />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Period Income"
          value={totalIncome}
          change={incomeChange}
          currency={currency}
          type="income"
        />
        <StatCard
          title="Previous Period"
          value={prevPeriodIncome}
          change={0}
          currency={currency}
          type="income"
        />
        <StatCard
          title="All Time"
          value={allTimeIncome}
          change={0}
          currency={currency}
          type="income"
        />
        <StatCard
          title="Sources"
          value={Object.keys(incomeByCategory).length}
          change={0}
          currency=""
          type="balance"
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Income by Source</CardTitle>
          <CardDescription>Track where your money comes from</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px]">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No income data for this period
            </div>
          ) : (
            <DonutChart
              data={chartData}
              total={totalIncome}
              currency={currency}
              centerLabel="Total"
              type="income"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

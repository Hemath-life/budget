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

export default function ExpensesPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();
  const [dateRange, setDateRange] = useState(getDefaultDateRange);

  const currency = settings?.defaultCurrency || 'INR';
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  // Filter by date range
  const filteredTransactions = expenseTransactions.filter((t) => {
    const date = new Date(t.date);
    return date >= dateRange.from && date <= dateRange.to;
  });

  const totalExpenses = filteredTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  // Previous period calculation (same duration before the selected range)
  const rangeDuration = dateRange.to.getTime() - dateRange.from.getTime();
  const prevPeriodEnd = new Date(dateRange.from.getTime() - 1);
  const prevPeriodStart = new Date(prevPeriodEnd.getTime() - rangeDuration);

  const prevPeriodTransactions = expenseTransactions.filter((t) => {
    const date = new Date(t.date);
    return date >= prevPeriodStart && date <= prevPeriodEnd;
  });
  const prevPeriodExpenses = prevPeriodTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  // Calculate change percentage
  const expenseChange =
    prevPeriodExpenses > 0
      ? Math.round(
          ((totalExpenses - prevPeriodExpenses) / prevPeriodExpenses) * 100
        )
      : 0;

  // Expenses by category (filtered)
  const expensesByCategory = filteredTransactions.reduce((acc, t) => {
    const categoryKey = t.category?.id || t.categoryId;
    acc[categoryKey] = (acc[categoryKey] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(
    ([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        name: category?.name || categoryId,
        value: amount,
        color: category?.color || '#EF4444',
      };
    }
  );

  // All time totals for stats
  const allTimeExpenses = expenseTransactions.reduce(
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
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">
            Track and analyze your spending
          </p>
        </div>
        <Link href="/transactions/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </Link>
      </div>

      <DateFilter onFilterChange={setDateRange} />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Period Expenses"
          value={totalExpenses}
          change={expenseChange}
          currency={currency}
          type="expense"
        />
        <StatCard
          title="Previous Period"
          value={prevPeriodExpenses}
          change={0}
          currency={currency}
          type="expense"
        />
        <StatCard
          title="All Time"
          value={allTimeExpenses}
          change={0}
          currency={currency}
          type="expense"
        />
        <StatCard
          title="Categories"
          value={Object.keys(expensesByCategory).length}
          change={0}
          currency=""
          type="balance"
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>See where your money is going</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px]">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No expense data for this period
            </div>
          ) : (
            <DonutChart
              data={chartData}
              total={totalExpenses}
              currency={currency}
              centerLabel="Total"
              type="expense"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

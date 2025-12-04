'use client';

import { StatCard } from '@/components/dashboard/bento/stat-card';
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

export default function IncomePage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();

  const currency = settings?.defaultCurrency || 'INR';
  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Current month income
  const now = new Date();
  const currentMonthIncome = incomeTransactions
    .filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Last month income
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthIncome = incomeTransactions
    .filter((t) => {
      const date = new Date(t.date);
      return date >= lastMonth && date <= lastMonthEnd;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate change percentage
  const incomeChange =
    lastMonthIncome > 0
      ? Math.round(
          ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
        )
      : 0;

  // Income by category
  const incomeByCategory = incomeTransactions.reduce((acc, t) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={totalIncome}
          change={0}
          currency={currency}
          type="income"
        />
        <StatCard
          title="This Month"
          value={currentMonthIncome}
          change={incomeChange}
          currency={currency}
          type="income"
        />
        <StatCard
          title="Last Month"
          value={lastMonthIncome}
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
              No income data yet
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

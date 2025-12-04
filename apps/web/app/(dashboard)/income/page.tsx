'use client';

import { SummaryCard } from '@/components/dashboard/summary-card';
import { DonutChart } from '@/components/shared/donut-chart';
import { TransactionList } from '@/components/transactions/transaction-list';
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
    <div className="space-y-4">
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

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Income"
          value={totalIncome}
          currency={currency}
          type="income"
        />
        <SummaryCard
          title="This Month"
          value={currentMonthIncome}
          previousValue={lastMonthIncome}
          currency={currency}
          type="income"
        />
        <SummaryCard
          title="Income Sources"
          value={Object.keys(incomeByCategory).length}
          currency=""
          type="income"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-[420px]">
          <CardHeader className="pb-2">
            <CardTitle>Income by Source</CardTitle>
            <CardDescription>Track where your money comes from</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
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

        <Card className="h-[420px] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Recent Income</CardTitle>
            <CardDescription>Your latest income activity</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <TransactionList
              filterType="income"
              showFilters={false}
              showPagination={false}
              limit={5}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

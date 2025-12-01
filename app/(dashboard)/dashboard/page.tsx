'use client';

import { useTransactions, useSettings } from '@/lib/hooks';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { BudgetOverview } from '@/components/dashboard/budget-overview';
import { GoalsProgress } from '@/components/dashboard/goals-progress';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { UpcomingBills } from '@/components/dashboard/upcoming-bills';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: settings } = useSettings();

  // Calculate summary data
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= currentMonthStart;
  });

  const lastMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= lastMonthStart && date <= lastMonthEnd;
  });

  const currentIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthIncome = lastMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpenses = lastMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savings = currentIncome - currentExpenses;

  const currency = settings?.defaultCurrency || 'INR';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your financial overview.
          </p>
        </div>
        <Link href="/transactions/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Income"
          value={currentIncome}
          previousValue={lastMonthIncome}
          currency={currency}
          type="income"
        />
        <SummaryCard
          title="Total Expenses"
          value={currentExpenses}
          previousValue={lastMonthExpenses}
          currency={currency}
          type="expense"
        />
        <SummaryCard
          title="Balance"
          value={balance}
          currency={currency}
          type="balance"
        />
        <SummaryCard
          title="Monthly Savings"
          value={savings}
          currency={currency}
          type="savings"
        />
      </div>

      {/* Charts */}
      <ExpenseChart />

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTransactions />
        <div className="space-y-6">
          <BudgetOverview />
          <GoalsProgress />
        </div>
      </div>

      {/* Upcoming Bills */}
      <UpcomingBills />
    </div>
  );
}

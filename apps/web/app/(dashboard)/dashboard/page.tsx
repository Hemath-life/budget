'use client';

import {
  ActivityFeed,
  BudgetStatus,
  ExpenseBreakdown,
  GoalsCard,
  RevenueChart,
  StatCard,
} from '@/components/dashboard/bento';
import { EmptyState } from '@/components/shared/empty-state';
import {
  useBudgets,
  useGoals,
  useSettings,
  useTransactions,
} from '@/lib/hooks';
import { Button } from '@repo/ui/components/ui';
import { LayoutDashboard, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: settings } = useSettings();
  const { data: budgets = [] } = useBudgets();
  const { data: goals = [] } = useGoals();

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

  // Calculate income change percentage
  const incomeChange =
    lastMonthIncome > 0
      ? Math.round(((currentIncome - lastMonthIncome) / lastMonthIncome) * 100)
      : 0;
  const expenseChange =
    lastMonthExpenses > 0
      ? Math.round(
          ((currentExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
        )
      : 0;

  // Generate monthly revenue data for chart
  const getMonthlyData = () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentMonth = now.getMonth();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = now.getFullYear() - (currentMonth - i < 0 ? 1 : 0);
      const monthStart = new Date(year, monthIndex, 1);
      const monthEnd = new Date(year, monthIndex + 1, 0);

      const monthTransactions = transactions.filter((t) => {
        const date = new Date(t.date);
        return date >= monthStart && date <= monthEnd;
      });

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        month: months[monthIndex],
        income,
        expense,
      });
    }

    return data;
  };

  // Transform budgets for BudgetStatus component
  const budgetData = budgets.map((budget, index) => {
    const colors = ['blue', 'purple', 'emerald', 'orange', 'rose'];

    return {
      id: budget.id,
      name: budget.category || 'Budget',
      spent: budget.spent,
      limit: budget.amount,
      color: colors[index % colors.length],
    };
  });

  // Transform goals for GoalsCard component
  const goalsData = goals.map((goal, index) => {
    const colors = ['blue', 'purple', 'emerald', 'orange', 'pink'];
    return {
      id: goal.id,
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      color: colors[index % colors.length],
    };
  });

  // Transform expenses for ExpenseBreakdown component
  const expenseByCategory = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const categoryName = t.category?.name || 'Other';
      acc[categoryName] = (acc[categoryName] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const expenseBreakdown = Object.entries(expenseByCategory)
    .map(([category, amount], index) => {
      const colors = ['rose', 'blue', 'amber', 'emerald', 'purple'];
      return {
        id: category,
        category,
        amount,
        percentage:
          currentExpenses > 0
            ? Math.round((amount / currentExpenses) * 100)
            : 0,
        color: colors[index % colors.length],
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Transform transactions for ActivityFeed
  const recentTransactions = transactions.slice(0, 10).map((t) => ({
    id: t.id,
    description: t.description,
    amount: t.amount,
    type: t.type as 'income' | 'expense',
    category: t.category?.name || 'Other',
    date: new Date(t.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show empty state if no transactions
  if (transactions.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome! Let&apos;s get started with your financial journey.
          </p>
        </div>
        <EmptyState
          title="No transactions yet"
          description="Start tracking your finances by adding your first transaction, or load sample data to explore all features."
          icon={<LayoutDashboard className="h-8 w-8 text-muted-foreground" />}
        >
          <Link href="/transactions/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
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

      {/* Bento Grid Layout */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Row 1: Stats */}
        <StatCard
          title="Total Income"
          value={currentIncome}
          change={incomeChange}
          type="income"
          currency={currency}
        />
        <StatCard
          title="Total Expenses"
          value={currentExpenses}
          change={expenseChange}
          type="expense"
          currency={currency}
        />
        <StatCard
          title="Balance"
          value={balance}
          change={0}
          type="balance"
          currency={currency}
        />
        <StatCard
          title="Monthly Savings"
          value={savings}
          change={0}
          type="savings"
          currency={currency}
        />
      </div>

      {/* Row 2: Revenue Chart + Budget Status */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart
            data={getMonthlyData()}
            currency={currency}
            totalRevenue={currentIncome}
            change={incomeChange}
          />
        </div>
        <BudgetStatus budgets={budgetData} currency={currency} />
      </div>

      {/* Row 3: Expense Breakdown + Goals + Activity */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <ExpenseBreakdown
          expenses={expenseBreakdown}
          totalExpenses={currentExpenses}
          currency={currency}
        />
        <GoalsCard goals={goalsData} currency={currency} />
        <ActivityFeed transactions={recentTransactions} currency={currency} />
      </div>
    </div>
  );
}

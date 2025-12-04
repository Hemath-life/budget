'use client';

import { StatCard } from '@/components/dashboard/bento/stat-card';
import {
  useBudgets,
  useCategories,
  useGoals,
  useSettings,
  useTransactions,
} from '@/lib/hooks';
import { calculatePercentage, formatCurrency, formatDate } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from '@repo/ui/components/ui';
import { SelectField } from '@repo/ui/forms';
import { Loader2, Target, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

export function ReportsView() {
  const { data: transactions = [], isLoading: transLoading } =
    useTransactions();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();
  const { data: goals = [] } = useGoals();
  const { data: budgets = [] } = useBudgets();

  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'all':
      default:
        return transactions;
    }

    return transactions.filter((t) => new Date(t.date) >= startDate);
  }, [transactions, timeRange]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? calculatePercentage(netSavings, totalIncome) : 0;

  const currency = settings?.defaultCurrency || 'INR';

  // Goals calculations
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);
  const goalsProgress = calculatePercentage(totalSaved, totalTarget);

  // Budget calculations
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCount = budgets.filter((b) => b.spent > b.amount).length;
  const onTrackCount = budgets.filter((b) => b.spent <= b.amount).length;
  const spendingProgress = calculatePercentage(totalSpent, totalBudget);

  // Category breakdown for expenses
  const expensesByCategory = useMemo(() => {
    const expenses = filteredTransactions.filter((t) => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      const categoryKey = t.category?.id || t.categoryId;
      acc[categoryKey] = (acc[categoryKey] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          name: category?.name || categoryId,
          value: amount,
          color: category?.color || '#6B7280',
          percentage: calculatePercentage(amount, totalExpenses),
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, categories, totalExpenses]);

  // Income by category
  const incomeByCategory = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === 'income');
    const grouped = income.reduce((acc, t) => {
      const categoryKey = t.category?.id || t.categoryId;
      acc[categoryKey] = (acc[categoryKey] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          name: category?.name || categoryId,
          value: amount,
          color: category?.color || '#10B981',
          percentage: calculatePercentage(amount, totalIncome),
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, categories, totalIncome]);

  // Monthly trend data
  const monthlyTrend = useMemo(() => {
    const months: Record<string, { income: number; expenses: number }> = {};

    filteredTransactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!months[monthKey]) {
        months[monthKey] = { income: 0, expenses: 0 };
      }

      if (t.type === 'income') {
        months[monthKey].income += t.amount;
      } else {
        months[monthKey].expenses += t.amount;
      }
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: formatDate(month + '-01', "MMM 'yy"),
        ...data,
        net: data.income - data.expenses,
      }));
  }, [filteredTransactions]);

  // Daily spending trend
  const dailySpending = useMemo(() => {
    const days: Record<string, number> = {};

    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const date = t.date;
        days[date] = (days[date] || 0) + t.amount;
      });

    return Object.entries(days)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([date, amount]) => ({
        date: formatDate(date, 'MMM dd'),
        amount,
      }));
  }, [filteredTransactions]);

  if (transLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Analyze your financial data</p>
        </div>
        <SelectField
          id="timeRange"
          value={timeRange}
          onChange={(v) => setTimeRange(v as TimeRange)}
          hideLabel
          triggerClassName="w-[180px]"
          options={[
            { label: 'Last 7 Days', value: 'week' },
            { label: 'Last Month', value: 'month' },
            { label: 'Last Quarter', value: 'quarter' },
            { label: 'Last Year', value: 'year' },
            { label: 'All Time', value: 'all' },
          ]}
        />
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={totalIncome}
          change={0}
          type="income"
          currency={currency}
        />
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          change={0}
          type="expense"
          currency={currency}
        />
        <StatCard
          title="Net Savings"
          value={Math.abs(netSavings)}
          change={savingsRate}
          type="savings"
          currency={currency}
        />
        <StatCard
          title="Savings Rate"
          value={savingsRate}
          change={0}
          type="balance"
          currency=""
        />
      </div>

      {/* Goals & Budget Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Goals Summary */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Target className="h-4 w-4 text-purple-500" />
              </div>
              <CardTitle className="text-base">Savings Goals</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">
                {formatCurrency(totalSaved, currency)}
              </span>
              <span className="text-sm text-muted-foreground">
                of {formatCurrency(totalTarget, currency)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-purple-500">
                  {goalsProgress}%
                </span>
              </div>
              <Progress value={goalsProgress} className="h-2" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>{activeGoals.length} active goals</span>
              <span>{completedGoals.length} completed</span>
            </div>
          </CardContent>
        </Card>

        {/* Budget Summary */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Wallet className="h-4 w-4 text-blue-500" />
              </div>
              <CardTitle className="text-base">Budget Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">
                {formatCurrency(totalSpent, currency)}
              </span>
              <span className="text-sm text-muted-foreground">
                of {formatCurrency(totalBudget, currency)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spending</span>
                <span
                  className={`font-medium ${
                    spendingProgress >= 100
                      ? 'text-red-500'
                      : spendingProgress >= 80
                      ? 'text-yellow-500'
                      : 'text-blue-500'
                  }`}
                >
                  {spendingProgress}%
                </span>
              </div>
              <Progress
                value={Math.min(spendingProgress, 100)}
                className={`h-2 ${
                  spendingProgress >= 100
                    ? '[&>div]:bg-red-500'
                    : spendingProgress >= 80
                    ? '[&>div]:bg-yellow-500'
                    : ''
                }`}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>{onTrackCount} on track</span>
              <span>{overBudgetCount} over budget</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Income vs Expenses Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Expenses"
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {expensesByCategory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  No expense data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="45%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [
                        formatCurrency(value, currency),
                        'Amount',
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Income Sources */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {incomeByCategory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  No income data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeByCategory} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={80}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [
                        formatCurrency(value, currency),
                        'Amount',
                      ]}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {incomeByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Spending */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Daily Spending (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {dailySpending.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  No spending data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailySpending}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [
                        formatCurrency(value, currency),
                        'Spent',
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ fill: '#EF4444', r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expensesByCategory.slice(0, 5).map((category) => (
              <div key={category.name} className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium truncate">
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatCurrency(category.value, currency)} (
                      {category.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {expensesByCategory.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No expense data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

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
} from '@repo/ui/components/ui';
import { SelectField } from '@repo/ui/forms';
import {
  DollarSign,
  Loader2,
  Percent,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
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
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Reports</h2>
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

      {/* Goals & Budget Summary Cards */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* Goals Summary Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                  <Target className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Savings Goal</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(totalSaved, currency)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-primary">
                  {goalsProgress}%
                </p>
                <p className="text-xs text-muted-foreground">
                  of {formatCurrency(totalTarget, currency)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[#c4e456] transition-all"
                  style={{ width: `${Math.min(goalsProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{activeGoals.length} active</span>
                <span>{completedGoals.length} completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Summary Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Spend</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(totalSpent, currency)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-semibold ${
                    spendingProgress >= 100
                      ? 'text-red-500'
                      : spendingProgress >= 80
                      ? 'text-yellow-500'
                      : 'text-primary'
                  }`}
                >
                  {spendingProgress}%
                </p>
                <p className="text-xs text-muted-foreground">
                  of {formatCurrency(totalBudget, currency)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    spendingProgress >= 100
                      ? 'bg-red-500'
                      : spendingProgress >= 80
                      ? 'bg-yellow-500'
                      : 'bg-[#c4e456]'
                  }`}
                  style={{ width: `${Math.min(spendingProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{onTrackCount} on track</span>
                <span>{overBudgetCount} over budget</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalIncome, currency)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpenses, currency)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Savings</p>
                <p
                  className={`text-2xl font-bold ${
                    netSavings >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(Math.abs(netSavings), currency)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Savings Rate</p>
                <p
                  className={`text-2xl font-bold ${
                    savingsRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {savingsRate}%
                </p>
              </div>
              <Percent className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income vs Expenses Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income vs Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.3}
                    name="Expenses"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {expensesByCategory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No expense data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
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
                      }}
                      formatter={(value: number) => [
                        formatCurrency(value, currency),
                        'Amount',
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Income Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {incomeByCategory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No income data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeByCategory} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis type="number" className="text-muted-foreground" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Spending (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {dailySpending.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No spending data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailySpending}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis dataKey="date" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
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
                      dot={{ fill: '#EF4444', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expensesByCategory.slice(0, 5).map((category) => (
              <div key={category.name} className="flex items-center gap-4">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(category.value, currency)} (
                      {category.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

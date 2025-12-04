'use client';

import {
  useBudgets,
  useCategories,
  useGoals,
  useSettings,
  useTransactions,
} from '@/lib/hooks';
import { calculatePercentage, formatCurrency, formatDate } from '@/lib/utils';
import { StatCard } from '@repo/ui/cards';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui';
import { SelectField } from '@repo/ui/forms';
import { Calendar, Loader2, Target, Wallet } from 'lucide-react';
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

// Modern color palette
const CHART_COLORS = {
  income: '#10b981',
  expense: '#f43f5e',
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#f59e0b',
  categories: [
    '#6366f1',
    '#f43f5e',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#06b6d4',
    '#ec4899',
    '#84cc16',
  ],
};

// Custom Tooltip Component
function CustomTooltip({
  active,
  payload,
  label,
  currency,
  showLabel = true,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  currency: string;
  showLabel?: boolean;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
      {showLabel && label && (
        <p className="text-xs text-muted-foreground mb-2 font-medium">
          {label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">{entry.name}:</span>
            <span className="text-xs font-semibold">
              {formatCurrency(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground text-sm">
            Analyze your financial performance
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
          <Calendar className="h-4 w-4 text-muted-foreground ml-2" />
          <SelectField
            id="timeRange"
            value={timeRange}
            onChange={(v) => setTimeRange(v as TimeRange)}
            hideLabel
            triggerClassName="w-[160px] border-0 bg-transparent shadow-none focus:ring-0"
            options={[
              { label: 'Last 7 Days', value: 'week' },
              { label: 'Last Month', value: 'month' },
              { label: 'Last Quarter', value: 'quarter' },
              { label: 'Last Year', value: 'year' },
              { label: 'All Time', value: 'all' },
            ]}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={totalIncome}
          icon="income"
          currency={currency}
        />
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          icon="expense"
          currency={currency}
        />
        <StatCard
          title="Net Savings"
          value={Math.abs(netSavings)}
          change={savingsRate}
          icon="savings"
          currency={currency}
        />
        <StatCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          icon="balance"
        />
      </div>

      {/* Goals & Budget Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Goals Summary */}
        <Card className="border bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/15">
                  <Target className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    Savings Goals
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeGoals.length} active · {completedGoals.length}{' '}
                    completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-purple-500">
                  {goalsProgress}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative pt-1">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                  style={{ width: `${Math.min(goalsProgress, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Saved: </span>
                <span className="font-semibold">
                  {formatCurrency(totalSaved, currency)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Target: </span>
                <span className="font-semibold">
                  {formatCurrency(totalTarget, currency)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Summary */}
        <Card className="border bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/15">
                  <Wallet className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    Budget Status
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {onTrackCount} on track · {overBudgetCount} over budget
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-2xl font-bold ${
                    spendingProgress >= 100
                      ? 'text-red-500'
                      : spendingProgress >= 80
                      ? 'text-amber-500'
                      : 'text-blue-500'
                  }`}
                >
                  {spendingProgress}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative pt-1">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    spendingProgress >= 100
                      ? 'bg-gradient-to-r from-red-500 to-red-400'
                      : spendingProgress >= 80
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                      : 'bg-gradient-to-r from-blue-500 to-blue-400'
                  }`}
                  style={{ width: `${Math.min(spendingProgress, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Spent: </span>
                <span className="font-semibold">
                  {formatCurrency(totalSpent, currency)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Budget: </span>
                <span className="font-semibold">
                  {formatCurrency(totalBudget, currency)}
                </span>
              </div>
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

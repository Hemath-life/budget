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
import {
  Calendar,
  Loader2,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
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
      <div className="grid gap-4">
        {/* Income vs Expenses Trend */}
        <Card className="border overflow-hidden bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent dark:from-primary/10 dark:via-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base font-semibold">
                  Income vs Expenses
                </CardTitle>
                <div className="px-3 py-1 rounded-full bg-muted/50 dark:bg-muted/30 border text-xs font-medium">
                  {monthlyTrend.length > 0
                    ? `${
                        (monthlyTrend[monthlyTrend.length - 1]?.income ?? 0) -
                          (monthlyTrend[monthlyTrend.length - 1]?.expenses ??
                            0) >=
                        0
                          ? '+'
                          : ''
                      }${(
                        (((monthlyTrend[monthlyTrend.length - 1]?.income ?? 0) -
                          (monthlyTrend[monthlyTrend.length - 1]?.expenses ??
                            0)) /
                          Math.max(
                            monthlyTrend[monthlyTrend.length - 1]?.income ?? 1,
                            1
                          )) *
                        100
                      ).toFixed(0)}% savings`
                    : '0%'}
                </div>
              </div>
              <SelectField
                id="chartPeriod"
                value={timeRange}
                onChange={(v) => setTimeRange(v as TimeRange)}
                hideLabel
                triggerClassName="w-[100px] h-8 text-xs border-0 bg-muted/50 dark:bg-muted/30 shadow-none"
                options={[
                  { label: 'Week', value: 'week' },
                  { label: 'Month', value: 'month' },
                  { label: 'Quarter', value: 'quarter' },
                  { label: 'Year', value: 'year' },
                ]}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyTrend}
                  margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="incomeGradientPurple"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop
                        offset="100%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient
                      id="expenseGradientGray"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6b7280" stopOpacity={0.2} />
                      <stop
                        offset="100%"
                        stopColor="#6b7280"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="2 6"
                    stroke="#6b7280"
                    strokeOpacity={0.15}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: '#9ca3af',
                    }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: '#9ca3af',
                    }}
                    tickFormatter={(value) =>
                      value >= 1000
                        ? `${(value / 1000).toFixed(0)}k`
                        : String(value)
                    }
                    dx={-5}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const income =
                        (payload.find((p) => p.dataKey === 'income')
                          ?.value as number) ?? 0;
                      const expenses =
                        (payload.find((p) => p.dataKey === 'expenses')
                          ?.value as number) ?? 0;
                      return (
                        <div className="bg-popover text-popover-foreground border border-border rounded-xl px-4 py-2 shadow-xl">
                          <p className="text-2xl font-bold">
                            {formatCurrency(income - expenses, currency)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {label} Net
                          </p>
                        </div>
                      );
                    }}
                    cursor={{
                      stroke: '#6b7280',
                      strokeWidth: 1,
                      strokeDasharray: '4 4',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#8b5cf6"
                    fill="url(#incomeGradientPurple)"
                    strokeWidth={2.5}
                    name="Income"
                    dot={{
                      fill: '#8b5cf6',
                      strokeWidth: 2,
                      stroke: '#1f2937',
                      r: 4,
                    }}
                    activeDot={{
                      fill: '#a78bfa',
                      strokeWidth: 3,
                      stroke: '#1f2937',
                      r: 6,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#9ca3af"
                    fill="url(#expenseGradientGray)"
                    strokeWidth={2}
                    name="Expenses"
                    dot={{
                      fill: '#9ca3af',
                      strokeWidth: 2,
                      stroke: '#1f2937',
                      r: 3,
                    }}
                    activeDot={{
                      fill: '#d1d5db',
                      strokeWidth: 3,
                      stroke: '#1f2937',
                      r: 5,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                <span className="text-muted-foreground">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-muted-foreground">Expenses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 - Breakdown Charts */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Expense Breakdown */}
        <Card className="border overflow-hidden bg-gradient-to-br from-rose-500/5 via-transparent to-transparent dark:from-rose-500/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10">
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                </div>
                <CardTitle className="text-base font-semibold">
                  Expense Breakdown
                </CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">
                {expensesByCategory.length} categories
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {expensesByCategory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground">
                  <div className="p-4 rounded-full bg-muted/50 mb-3">
                    <TrendingDown className="h-6 w-6" />
                  </div>
                  <p>No expense data</p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expensesByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {expensesByCategory.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                CHART_COLORS.categories[
                                  index % CHART_COLORS.categories.length
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.[0]) return null;
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
                                <p className="text-xs font-medium mb-1">
                                  {data.name}
                                </p>
                                <p className="text-sm font-semibold">
                                  {formatCurrency(data.value, currency)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {data.percentage}% of total
                                </p>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {expensesByCategory.slice(0, 4).map((category, index) => (
                      <div
                        key={category.name}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              CHART_COLORS.categories[
                                index % CHART_COLORS.categories.length
                              ],
                          }}
                        />
                        <span className="text-xs text-muted-foreground truncate">
                          {category.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Income Sources */}
        <Card className="border overflow-hidden bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent dark:from-emerald-500/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <CardTitle className="text-base font-semibold">
                  Income Sources
                </CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">
                {incomeByCategory.length} sources
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {incomeByCategory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground">
                  <div className="p-4 rounded-full bg-muted/50 mb-3">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <p>No income data</p>
                </div>
              ) : (
                <div className="flex flex-col justify-between h-full py-2">
                  <div className="space-y-4 flex-1">
                    {incomeByCategory.slice(0, 5).map((category, index) => {
                      const maxValue = Math.max(
                        ...incomeByCategory.map((c) => c.value)
                      );
                      const barWidth = (category.value / maxValue) * 100;
                      const colors = [
                        '#8b5cf6',
                        '#f43f5e',
                        '#10b981',
                        '#f59e0b',
                        '#06b6d4',
                      ];
                      const color = colors[index % colors.length];

                      return (
                        <div key={category.name} className="group">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground w-20 text-right truncate flex-shrink-0">
                              {category.name}
                            </span>
                            <div className="flex-1 relative h-7">
                              {/* Background bar */}
                              <div className="absolute inset-0 rounded-lg bg-muted/20" />
                              {/* Colored bar */}
                              <div
                                className="absolute top-0 left-0 h-full rounded-lg transition-all duration-500 group-hover:brightness-110"
                                style={{
                                  width: `${Math.max(barWidth, 3)}%`,
                                  backgroundColor: color,
                                }}
                              />
                              {/* Tooltip on hover */}
                              <div className="absolute left-1/2 -translate-x-1/2 -top-16 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                                  <p className="text-sm font-semibold">
                                    {category.name}
                                  </p>
                                  <p
                                    className="text-base font-bold"
                                    style={{ color }}
                                  >
                                    {formatCurrency(category.value, currency)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {category.percentage}% of total
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* X-axis labels */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-4">
                    <span className="w-20 flex-shrink-0" />
                    <div className="flex-1 flex justify-between text-xs text-muted-foreground">
                      {(() => {
                        const maxVal = Math.max(
                          ...incomeByCategory.map((c) => c.value)
                        );
                        const formatAxis = (val: number) => {
                          if (val >= 1000) {
                            return `${(val / 1000).toFixed(0)}k`;
                          }
                          return val.toString();
                        };
                        return (
                          <>
                            <span>0</span>
                            <span>{formatAxis(maxVal * 0.25)}</span>
                            <span>{formatAxis(maxVal * 0.5)}</span>
                            <span>{formatAxis(maxVal * 0.75)}</span>
                            <span>{formatAxis(maxVal)}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Spending */}
        <Card className="border overflow-hidden bg-gradient-to-br from-amber-500/5 via-transparent to-transparent dark:from-amber-500/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Calendar className="h-4 w-4 text-amber-500" />
                </div>
                <CardTitle className="text-base font-semibold">
                  Daily Spending
                </CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">
                Last 30 days
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {dailySpending.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground">
                  <div className="p-4 rounded-full bg-muted/50 mb-3">
                    <TrendingDown className="h-6 w-6" />
                  </div>
                  <p>No spending data</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailySpending}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="spendingGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#f43f5e"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#f43f5e"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="2 6"
                      stroke="#6b7280"
                      strokeOpacity={0.15}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fill: '#9ca3af',
                      }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: '#9ca3af',
                      }}
                      tickFormatter={(value) =>
                        value >= 1000
                          ? `${(value / 1000).toFixed(0)}k`
                          : String(value)
                      }
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.[0]) return null;
                        return (
                          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
                            <p className="text-xs text-muted-foreground mb-1">
                              {label}
                            </p>
                            <p className="text-sm font-semibold text-rose-500">
                              {formatCurrency(
                                payload[0].value as number,
                                currency
                              )}
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#f43f5e"
                      fill="url(#spendingGradient)"
                      strokeWidth={2.5}
                      dot={{ fill: '#f43f5e', strokeWidth: 0, r: 3 }}
                      activeDot={{
                        fill: '#f43f5e',
                        strokeWidth: 2,
                        stroke: '#1f2937',
                        r: 5,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card className="border overflow-hidden bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent dark:from-indigo-500/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Target className="h-4 w-4 text-indigo-500" />
              </div>
              <CardTitle className="text-base font-semibold">
                Top Expense Categories
              </CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">
              {expensesByCategory.length} categories
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expensesByCategory.slice(0, 5).map((category, index) => (
              <div key={category.name} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold text-white"
                      style={{
                        backgroundColor:
                          CHART_COLORS.categories[
                            index % CHART_COLORS.categories.length
                          ],
                      }}
                    >
                      {category.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {category.percentage}% of total expenses
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(category.value, currency)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor:
                        CHART_COLORS.categories[
                          index % CHART_COLORS.categories.length
                        ],
                    }}
                  />
                </div>
              </div>
            ))}
            {expensesByCategory.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <div className="p-4 rounded-full bg-muted/50 mb-3">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <p className="text-sm">No expense data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

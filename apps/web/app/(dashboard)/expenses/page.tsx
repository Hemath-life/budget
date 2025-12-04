'use client';

import { SummaryCard } from '@/components/dashboard/summary-card';
import { TransactionList } from '@/components/transactions/transaction-list';
import { useCategories, useSettings, useTransactions } from '@/lib/hooks';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function ExpensesPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();

  const currency = settings?.defaultCurrency || 'INR';
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  // Current month expenses
  const now = new Date();
  const currentMonthExpenses = expenseTransactions
    .filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Last month expenses
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthExpenses = expenseTransactions
    .filter((t) => {
      const date = new Date(t.date);
      return date >= lastMonth && date <= lastMonthEnd;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Expenses by category
  const expensesByCategory = expenseTransactions.reduce((acc, t) => {
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

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Expenses"
          value={totalExpenses}
          currency={currency}
          type="expense"
        />
        <SummaryCard
          title="This Month"
          value={currentMonthExpenses}
          previousValue={lastMonthExpenses}
          currency={currency}
          type="expense"
        />
        <SummaryCard
          title="Categories Used"
          value={Object.keys(expensesByCategory).length}
          currency=""
          type="expense"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No expense data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
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
                        `$${value.toFixed(2)}`,
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

        <TransactionList filterType="expense" showFilters={false} />
      </div>
    </div>
  );
}

'use client';

import { useAppSelector } from '@/store/hooks';
import { TransactionList } from '@/components/transactions/transaction-list';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

export default function IncomePage() {
  const transactions = useAppSelector((state) => state.transactions.items);
  const categories = useAppSelector((state) => state.categories.items);
  const settings = useAppSelector((state) => state.settings);

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
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(incomeByCategory).map(([categoryId, amount]) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      name: category?.name || categoryId,
      value: amount,
      color: category?.color || '#10B981',
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Income</h1>
        <p className="text-muted-foreground">Track and analyze your income sources</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Income"
          value={totalIncome}
          currency={settings.defaultCurrency}
          type="income"
        />
        <SummaryCard
          title="This Month"
          value={currentMonthIncome}
          previousValue={lastMonthIncome}
          currency={settings.defaultCurrency}
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
        <Card>
          <CardHeader>
            <CardTitle>Income by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No income data yet
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
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <TransactionList filterType="income" showFilters={false} title="Recent Income" />
      </div>
    </div>
  );
}

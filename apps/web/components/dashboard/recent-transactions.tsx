'use client';

import { useCategories, useSettings, useTransactions } from '@/lib/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
} from '@repo/ui/components/ui';
import { ArrowDownRight, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export function RecentTransactions() {
  const { data: transactions = [], isLoading: transLoading } =
    useTransactions();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Handle both categoryId (string) and category object from API
  // Also handle cases where the data might come as categoryId instead of category
  type TransactionWithCategory = {
    category?: string | { id: string; name?: string; color?: string };
    categoryId?: string;
  };

  const getCategoryData = (transaction: TransactionWithCategory) => {
    // If category is an object with data, use it directly
    if (transaction.category && typeof transaction.category === 'object') {
      return {
        id: transaction.category.id,
        name: transaction.category.name || 'Unknown',
        color: transaction.category.color || '#6B7280',
      };
    }

    // Otherwise, look up by categoryId or category string
    const categoryId =
      transaction.categoryId || (transaction.category as string);
    if (categoryId) {
      const cat = categories.find((c) => c.id === categoryId);
      if (cat) {
        return {
          id: cat.id,
          name: cat.name,
          color: cat.color,
        };
      }
    }

    return {
      id: categoryId || 'unknown',
      name: 'Unknown',
      color: '#6B7280',
    };
  };
  if (transLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link
          href="/transactions"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet
              </p>
            ) : (
              recentTransactions.map((transaction) => {
                const categoryData = getCategoryData(transaction);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: categoryData.color + '20',
                        }}
                      >
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: categoryData.color,
                              color: categoryData.color,
                            }}
                          >
                            {categoryData.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(transaction.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-right font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(
                        transaction.amount,
                        transaction.currency ||
                          settings?.defaultCurrency ||
                          'INR'
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

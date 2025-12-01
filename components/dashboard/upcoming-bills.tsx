'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/store/hooks';
import { formatCurrency, formatDate, getDaysUntil, isOverdue } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export function UpcomingBills() {
  const reminders = useAppSelector((state) => state.reminders.items);
  const settings = useAppSelector((state) => state.settings);

  const upcomingBills = [...reminders]
    .filter((r) => !r.isPaid)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getStatusBadge = (dueDate: string) => {
    const days = getDaysUntil(dueDate);
    if (isOverdue(dueDate)) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Overdue
        </Badge>
      );
    }
    if (days <= 3) {
      return (
        <Badge variant="default" className="gap-1 bg-yellow-500">
          <Clock className="h-3 w-3" />
          {days === 0 ? 'Due today' : `${days} day${days > 1 ? 's' : ''}`}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="h-3 w-3" />
        {days} days
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Bills</CardTitle>
        <Link href="/reminders" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingBills.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-muted-foreground">All bills are paid!</p>
            </div>
          ) : (
            upcomingBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium">{bill.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Due: {formatDate(bill.dueDate)}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold">
                    {formatCurrency(bill.amount, bill.currency || settings.defaultCurrency)}
                  </p>
                  {getStatusBadge(bill.dueDate)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

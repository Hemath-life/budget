'use client';

import { useReminders, useSettings } from '@/lib/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { HeaderNav } from '@repo/ui/nbars';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAuth } from '../providers/auth-provider';

export function Header() {
  const { logout } = useAuth();
  const { data: settings } = useSettings();
  const { data: reminders = [] } = useReminders();

  const currency = settings?.defaultCurrency || 'INR';

  const upcomingReminders = useMemo(() => {
    return reminders.filter((r) => {
      const dueDate = new Date(r.dueDate);
      const today = new Date();
      const daysUntil = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return !r.isPaid && daysUntil <= r.notifyBefore && daysUntil >= 0;
    });
  }, [reminders]);

  const extraActions = (
    <>
      <Badge variant="outline" className="hidden sm:flex">
        {currency}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {upcomingReminders.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {upcomingReminders.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          {upcomingReminders.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No upcoming reminders
            </div>
          ) : (
            upcomingReminders.slice(0, 5).map((reminder) => (
              <DropdownMenuItem key={reminder.id} asChild>
                <Link
                  href="/reminders"
                  className="flex flex-col items-start gap-1 p-3"
                >
                  <span className="font-medium">{reminder.title}</span>
                  <span className="text-xs text-muted-foreground">
                    Due: {formatDate(reminder.dueDate)} -{' '}
                    {formatCurrency(reminder.amount, currency)}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))
          )}
          {upcomingReminders.length > 5 && (
            <DropdownMenuItem asChild>
              <Link
                href="/reminders"
                className="text-center text-sm text-primary"
              >
                View all reminders
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <div className="border-b bg-background">
      <HeaderNav
        variant="search-first"
        logout={logout}
        showNav={false}
        searchPlaceholder="Search pages, actions, transactions..."
        extraActions={extraActions}
      />
    </div>
  );
}

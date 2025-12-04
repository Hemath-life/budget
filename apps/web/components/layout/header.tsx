'use client';

import { useReminders, useSettings } from '@/lib/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import { HeaderNav } from '@repo/ui/nbars';
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

  const reminderDropdown = useMemo(() => {
    const items = upcomingReminders.slice(0, 5).map((reminder) => ({
      id: reminder.id,
      title: reminder.title,
      description: `Due: ${formatDate(reminder.dueDate)} · ${formatCurrency(
        reminder.amount,
        currency
      )}`,
      href: '/reminders',
    }));

    return {
      count: upcomingReminders.length,
      items,
      emptyLabel: 'No upcoming reminders',
      viewAll:
        upcomingReminders.length > 5
          ? { href: '/reminders', label: 'View all reminders' }
          : undefined,
      triggerLabel: 'Reminders',
    };
  }, [currency, upcomingReminders]);

  return (
    <div className="border-b bg-background">
      <HeaderNav
        variant="search-first"
        logout={logout}
        showNav={false}
        searchPlaceholder="Search pages, actions, transactions..."
        badge={{ label: currency, variant: 'outline' }}
        reminderDropdown={reminderDropdown}
      />
    </div>
  );
}

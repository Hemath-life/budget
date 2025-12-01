'use client';

import { ReminderManager } from '@/components/reminders/reminder-manager';

export default function RemindersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bill Reminders</h1>
        <p className="text-muted-foreground">Never miss a payment with bill reminders</p>
      </div>

      <ReminderManager />
    </div>
  );
}

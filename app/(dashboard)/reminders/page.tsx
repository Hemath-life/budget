'use client';

import { useState } from 'react';
import { ReminderManager } from '@/components/reminders/reminder-manager';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function RemindersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bill Reminders</h1>
          <p className="text-muted-foreground">Never miss a payment with bill reminders</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <ReminderManager isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </div>
  );
}

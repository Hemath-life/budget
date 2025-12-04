'use client';

import {
  useCategories,
  useCreateReminder,
  useDeleteReminder,
  useMarkReminderPaid,
  useMarkReminderUnpaid,
  useReminders,
  useSettings,
  useUpdateReminder,
} from '@/lib/hooks';
import type { Category, Reminder } from '@/lib/types';
import {
  formatCurrency,
  formatDate,
  getDaysUntil,
  isOverdue,
} from '@/lib/utils';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui';
import { AlertDialog, EditDialog } from '@repo/ui/dialogs';
import { DateField, FormField, SelectField, SwitchField } from '@repo/ui/forms';
import {
  AlertTriangle,
  Bell,
  Check,
  Clock,
  Loader2,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

type Frequency =
  | 'daily'
  | 'monthly'
  | 'weekly'
  | 'biweekly'
  | 'quarterly'
  | 'yearly';

interface ReminderFormState {
  title: string;
  amount: string;
  category: string;
  dueDate: Date;
  isRecurring: boolean;
  frequency: Frequency;
  notifyBefore: string;
}

const INITIAL_FORM_STATE: ReminderFormState = {
  title: '',
  amount: '',
  category: '',
  dueDate: new Date(),
  isRecurring: false,
  frequency: 'monthly',
  notifyBefore: '3',
};

const FREQUENCY_OPTIONS = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Bi-weekly', value: 'biweekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
] as const;

// Helper functions
const getCategoryId = (category: string | { id: string }): string =>
  typeof category === 'object' ? category.id : category;

const getCategoryName = (
  category: string | { id: string; name?: string },
  categories: Category[]
): string => {
  if (typeof category === 'object' && category.name) return category.name;
  const categoryId = getCategoryId(category);
  return categories.find((c) => c.id === categoryId)?.name || categoryId;
};

// Status Badge Component
const StatusBadge = memo(function StatusBadge({
  reminder,
}: {
  reminder: Reminder;
}) {
  if (reminder.isPaid) {
    return (
      <Badge className="bg-green-500">
        <Check className="h-3 w-3 mr-1" />
        Paid
      </Badge>
    );
  }

  const days = getDaysUntil(reminder.dueDate);

  if (isOverdue(reminder.dueDate)) {
    return (
      <Badge variant="destructive">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Overdue by {Math.abs(days)} days
      </Badge>
    );
  }

  if (days === 0) {
    return (
      <Badge className="bg-yellow-500">
        <Clock className="h-3 w-3 mr-1" />
        Due Today
      </Badge>
    );
  }

  if (days <= reminder.notifyBefore) {
    return (
      <Badge className="bg-orange-500">
        <Clock className="h-3 w-3 mr-1" />
        Due in {days} days
      </Badge>
    );
  }

  return (
    <Badge variant="outline">
      <Clock className="h-3 w-3 mr-1" />
      Due in {days} days
    </Badge>
  );
});

// Reminder Card Component
interface ReminderCardProps {
  reminder: Reminder;
  categoryName: string;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
  onMarkUnpaid: (id: string) => void;
}

const ReminderCard = memo(function ReminderCard({
  reminder,
  categoryName,
  onEdit,
  onDelete,
  onMarkPaid,
  onMarkUnpaid,
}: ReminderCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{reminder.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {categoryName}
              </Badge>
              {reminder.isRecurring && (
                <Badge variant="outline" className="text-xs capitalize">
                  {reminder.frequency}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">
            {formatCurrency(reminder.amount, reminder.currency)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(reminder.dueDate)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <StatusBadge reminder={reminder} />
        <div className="flex gap-1">
          {!reminder.isPaid ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkPaid(reminder.id)}
              className="text-green-600"
            >
              <Check className="h-4 w-4 mr-1" />
              Mark Paid
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkUnpaid(reminder.id)}
              className="text-orange-600"
            >
              <X className="h-4 w-4 mr-1" />
              Unpaid
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onEdit(reminder)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(reminder.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
});

// Empty State Component
const EmptyReminderState = memo(function EmptyReminderState({
  icon: Icon,
  message,
}: {
  icon: typeof Bell | typeof Check;
  message: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12 text-muted-foreground">
          <Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{message}</p>
        </div>
      </CardContent>
    </Card>
  );
});

// Main Component
interface ReminderManagerProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function ReminderManager({
  isDialogOpen,
  setIsDialogOpen,
}: ReminderManagerProps) {
  const { data: reminders = [], isLoading } = useReminders();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();

  const createReminder = useCreateReminder();
  const updateReminderMutation = useUpdateReminder();
  const deleteReminderMutation = useDeleteReminder();
  const markPaid = useMarkReminderPaid();
  const markUnpaid = useMarkReminderUnpaid();

  const [editReminder, setEditReminder] = useState<Reminder | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ReminderFormState>(INITIAL_FORM_STATE);

  // Memoized values
  const { upcomingReminders, paidReminders } = useMemo(() => {
    const upcoming = reminders
      .filter((r) => !r.isPaid)
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    const paid = reminders.filter((r) => r.isPaid);
    return { upcomingReminders: upcoming, paidReminders: paid };
  }, [reminders]);

  const categoryOptions = useMemo(
    () =>
      categories
        .filter((c) => c.type === 'expense')
        .map((c) => ({ label: c.name, value: c.id, color: c.color })),
    [categories]
  );

  // Form handlers
  const updateForm = useCallback(
    <K extends keyof ReminderFormState>(
      key: K,
      value: ReminderFormState[K]
    ) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setEditReminder(null);
  }, []);

  const openEditDialog = useCallback(
    (reminder: Reminder) => {
      setEditReminder(reminder);
      setForm({
        title: reminder.title,
        amount: reminder.amount.toString(),
        category: getCategoryId(reminder.category),
        dueDate: new Date(reminder.dueDate),
        isRecurring: reminder.isRecurring,
        frequency: reminder.frequency || 'monthly',
        notifyBefore: reminder.notifyBefore.toString(),
      });
      setIsDialogOpen(true);
    },
    [setIsDialogOpen]
  );

  const handleSubmit = useCallback(() => {
    if (!form.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!form.category) {
      toast.error('Please select a category');
      return;
    }

    const reminderData = {
      title: form.title.trim(),
      amount: parseFloat(form.amount),
      currency: settings?.defaultCurrency || 'INR',
      dueDate: form.dueDate.toISOString().split('T')[0],
      category: form.category,
      isRecurring: form.isRecurring,
      frequency: form.isRecurring ? form.frequency : undefined,
      isPaid: editReminder?.isPaid || false,
      notifyBefore: parseInt(form.notifyBefore) || 3,
    };

    const mutation = editReminder
      ? () =>
          updateReminderMutation.mutateAsync({
            id: editReminder.id,
            data: reminderData,
          })
      : () => createReminder.mutateAsync(reminderData);

    mutation()
      .then(() => {
        toast.success(editReminder ? 'Reminder updated' : 'Reminder created');
        setIsDialogOpen(false);
        resetForm();
      })
      .catch(() => {
        toast.error('Failed to save reminder');
      });
  }, [
    form,
    editReminder,
    settings,
    createReminder,
    updateReminderMutation,
    setIsDialogOpen,
    resetForm,
  ]);

  const handleDelete = useCallback(() => {
    if (!deleteId) return;
    deleteReminderMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('Reminder deleted');
        setDeleteId(null);
      },
    });
  }, [deleteId, deleteReminderMutation]);

  const handleMarkPaid = useCallback(
    (id: string) => markPaid.mutate(id),
    [markPaid]
  );
  const handleMarkUnpaid = useCallback(
    (id: string) => markUnpaid.mutate(id),
    [markUnpaid]
  );
  const handleSetDeleteId = useCallback((id: string) => setDeleteId(id), []);

  const handleDialogClose = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) resetForm();
    },
    [setIsDialogOpen, resetForm]
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingReminders.length})
          </TabsTrigger>
          <TabsTrigger value="paid">Paid ({paidReminders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingReminders.length === 0 ? (
            <EmptyReminderState icon={Bell} message="No upcoming reminders" />
          ) : (
            <div className="space-y-4">
              {upcomingReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  categoryName={getCategoryName(reminder.category, categories)}
                  onEdit={openEditDialog}
                  onDelete={handleSetDeleteId}
                  onMarkPaid={handleMarkPaid}
                  onMarkUnpaid={handleMarkUnpaid}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="paid">
          {paidReminders.length === 0 ? (
            <EmptyReminderState icon={Check} message="No paid reminders" />
          ) : (
            <div className="space-y-4">
              {paidReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  categoryName={getCategoryName(reminder.category, categories)}
                  onEdit={openEditDialog}
                  onDelete={handleSetDeleteId}
                  onMarkPaid={handleMarkPaid}
                  onMarkUnpaid={handleMarkUnpaid}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reminder Dialog */}
      <EditDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        title={editReminder ? 'Edit Reminder' : 'Create Reminder'}
        onSubmit={handleSubmit}
        submitText={editReminder ? 'Update' : 'Create'}
      >
        <FormField
          id="title"
          label="Title"
          value={form.title}
          onChange={(v) => updateForm('title', v)}
          placeholder="e.g., Rent Payment"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="amount"
            label="Amount"
            type="number"
            value={form.amount}
            onChange={(v) => updateForm('amount', v)}
            placeholder="0.00"
            min={0}
            step={0.01}
            required
          />
          <SelectField
            id="category"
            label="Category"
            value={form.category}
            onChange={(v) => updateForm('category', v)}
            placeholder="Select"
            options={categoryOptions}
          />
        </div>
        <DateField
          id="dueDate"
          label="Due Date"
          value={form.dueDate}
          onChange={(d) => d && updateForm('dueDate', d)}
          required
        />
        <SwitchField
          id="isRecurring"
          label="Recurring"
          description="Repeat this reminder"
          checked={form.isRecurring}
          onChange={(v) => updateForm('isRecurring', v)}
        />
        {form.isRecurring && (
          <SelectField
            id="frequency"
            label="Frequency"
            value={form.frequency}
            onChange={(v) => updateForm('frequency', v as Frequency)}
            options={FREQUENCY_OPTIONS}
          />
        )}
        <FormField
          id="notify"
          label="Notify Before (days)"
          type="number"
          value={form.notifyBefore}
          onChange={(v) => updateForm('notifyBefore', v)}
          min={1}
          max={30}
        />
      </EditDialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Reminder"
        description="Are you sure you want to delete this reminder? This action cannot be undone."
        variant="delete"
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </>
  );
}

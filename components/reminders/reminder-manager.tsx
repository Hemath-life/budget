'use client';

import { useState } from 'react';
import { useReminders, useCategories, useSettings, useCreateReminder, useUpdateReminder, useDeleteReminder, useMarkReminderPaid, useMarkReminderUnpaid } from '@/lib/hooks';
import { Reminder } from '@/lib/types';
import { formatCurrency, getDaysUntil, isOverdue, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Plus,
  Pencil,
  Trash2,
  CalendarIcon,
  Bell,
  Check,
  X,
  AlertTriangle,
  Clock,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ReminderManager() {
  const { data: reminders = [], isLoading } = useReminders();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();
  const createReminder = useCreateReminder();
  const updateReminderMutation = useUpdateReminder();
  const deleteReminderMutation = useDeleteReminder();
  const markPaid = useMarkReminderPaid();
  const markUnpaid = useMarkReminderUnpaid();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editReminder, setEditReminder] = useState<Reminder | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'monthly' | 'weekly' | 'biweekly' | 'quarterly' | 'yearly'>('monthly');
  const [notifyBefore, setNotifyBefore] = useState('3');

  const upcomingReminders = reminders.filter((r) => !r.isPaid);
  const paidReminders = reminders.filter((r) => r.isPaid);

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || categoryId;
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setDueDate(new Date());
    setIsRecurring(false);
    setFrequency('monthly');
    setNotifyBefore('3');
    setEditReminder(null);
  };

  const openEditDialog = (reminder: Reminder) => {
    setEditReminder(reminder);
    setTitle(reminder.title);
    setAmount(reminder.amount.toString());
    setCategory(reminder.category);
    setDueDate(new Date(reminder.dueDate));
    setIsRecurring(reminder.isRecurring);
    setFrequency(reminder.frequency || 'monthly');
    setNotifyBefore(reminder.notifyBefore.toString());
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    const currency = settings?.defaultCurrency || 'USD';
    const reminderData = {
      title: title.trim(),
      amount: parseFloat(amount),
      currency,
      dueDate: dueDate.toISOString().split('T')[0],
      category,
      isRecurring,
      frequency: isRecurring ? frequency : undefined,
      isPaid: editReminder?.isPaid || false,
      notifyBefore: parseInt(notifyBefore) || 3,
    };

    if (editReminder) {
      updateReminderMutation.mutate({ id: editReminder.id, data: reminderData }, {
        onSuccess: () => {
          toast.success('Reminder updated');
          setIsDialogOpen(false);
          resetForm();
        },
      });
    } else {
      createReminder.mutate(reminderData, {
        onSuccess: () => {
          toast.success('Reminder created');
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteReminderMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success('Reminder deleted');
          setDeleteId(null);
        },
      });
    }
  };

  const getStatusBadge = (reminder: Reminder) => {
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
  };

  const ReminderCard = ({ reminder }: { reminder: Reminder }) => (
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
                {getCategoryName(reminder.category)}
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
        {getStatusBadge(reminder)}
        <div className="flex gap-1">
          {!reminder.isPaid ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markPaid.mutate(reminder.id)}
              className="text-green-600"
            >
              <Check className="h-4 w-4 mr-1" />
              Mark Paid
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markUnpaid.mutate(reminder.id)}
              className="text-orange-600"
            >
              <X className="h-4 w-4 mr-1" />
              Unpaid
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(reminder)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(reminder.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bill Reminders</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editReminder ? 'Edit Reminder' : 'Create Reminder'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Rent Payment"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((c) => c.type === 'expense')
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !dueDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? formatDate(dueDate) : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(d) => d && setDueDate(d)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recurring</Label>
                    <p className="text-sm text-muted-foreground">
                      Repeat this reminder
                    </p>
                  </div>
                  <Switch
                    checked={isRecurring}
                    onCheckedChange={setIsRecurring}
                  />
                </div>
                {isRecurring && (
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={frequency} onValueChange={(v) => setFrequency(v as typeof frequency)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="notify">Notify Before (days)</Label>
                  <Input
                    id="notify"
                    type="number"
                    min="1"
                    max="30"
                    value={notifyBefore}
                    onChange={(e) => setNotifyBefore(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editReminder ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingReminders.length})
              </TabsTrigger>
              <TabsTrigger value="paid">
                Paid ({paidReminders.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              {upcomingReminders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming reminders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingReminders
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((reminder) => (
                      <ReminderCard key={reminder.id} reminder={reminder} />
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="paid">
              {paidReminders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Check className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No paid reminders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paidReminders.map((reminder) => (
                    <ReminderCard key={reminder.id} reminder={reminder} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reminder? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

'use client';

import { useState } from 'react';
import { useRecurring, useCategories, useSettings, useCreateRecurring, useUpdateRecurring, useDeleteRecurring, useToggleRecurring } from '@/lib/hooks';
import { RecurringTransaction, TransactionType } from '@/lib/types';
import { formatCurrency, formatDate, getNextRecurringDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { cn } from '@/lib/utils';
import {
  Pencil,
  Trash2,
  CalendarIcon,
  Repeat,
  ArrowUpRight,
  ArrowDownRight,
  Pause,
  Play,
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

interface RecurringManagerProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function RecurringManager({ isDialogOpen, setIsDialogOpen }: RecurringManagerProps) {
  const { data: recurring = [], isLoading } = useRecurring();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();
  const createRecurring = useCreateRecurring();
  const updateRecurringMutation = useUpdateRecurring();
  const deleteRecurringMutation = useDeleteRecurring();
  const toggleActive = useToggleRecurring();

  const [editItem, setEditItem] = useState<RecurringTransaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<RecurringTransaction['frequency']>('monthly');
  const [startDate, setStartDate] = useState<Date>(new Date());

  const incomeItems = recurring.filter((r) => r.type === 'income');
  const expenseItems = recurring.filter((r) => r.type === 'expense');
  const activeItems = recurring.filter((r) => r.isActive);

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.color || '#6B7280';
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategory('');
    setDescription('');
    setFrequency('monthly');
    setStartDate(new Date());
    setEditItem(null);
  };

  const openEditDialog = (item: RecurringTransaction) => {
    setEditItem(item);
    setType(item.type);
    setAmount(item.amount.toString());
    setCategory(item.category);
    setDescription(item.description);
    setFrequency(item.frequency);
    setStartDate(new Date(item.startDate));
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const currency = settings?.defaultCurrency || 'INR';
    const startDateStr = startDate.toISOString().split('T')[0];
    const itemData = {
      type,
      amount: parseFloat(amount),
      currency,
      category,
      description: description.trim(),
      frequency,
      startDate: startDateStr,
      nextDueDate: getNextRecurringDate(startDateStr, frequency),
      isActive: editItem?.isActive ?? true,
    };

    if (editItem) {
      updateRecurringMutation.mutate({ id: editItem.id, data: itemData }, {
        onSuccess: () => {
          toast.success('Recurring transaction updated');
          setIsDialogOpen(false);
          resetForm();
        },
      });
    } else {
      createRecurring.mutate(itemData, {
        onSuccess: () => {
          toast.success('Recurring transaction created');
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteRecurringMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success('Recurring transaction deleted');
          setDeleteId(null);
        },
      });
    }
  };

  const RecurringCard = ({ item }: { item: RecurringTransaction }) => (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
              item.type === 'income'
                ? 'bg-green-100 dark:bg-green-900/20'
                : 'bg-red-100 dark:bg-red-900/20'
            }`}
          >
            {item.type === 'income' ? (
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{item.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge
                variant="outline"
                style={{
                  borderColor: getCategoryColor(item.category),
                  color: getCategoryColor(item.category),
                }}
              >
                {getCategoryName(item.category)}
              </Badge>
              <Badge variant="outline" className="capitalize">
                <Repeat className="h-3 w-3 mr-1" />
                {item.frequency}
              </Badge>
            </div>
          </div>
        </div>
        <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
          <p
            className={`font-semibold text-lg ${
              item.type === 'income'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {item.type === 'income' ? '+' : '-'}
            {formatCurrency(item.amount, item.currency)}
          </p>
          <p className="text-xs text-muted-foreground">
            Next: {formatDate(item.nextDueDate)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        <Badge variant={item.isActive ? 'default' : 'secondary'}>
          {item.isActive ? 'Active' : 'Paused'}
        </Badge>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleActive.mutate(item.id)}
          >
            {item.isActive ? (
              <Pause className="h-4 w-4 text-yellow-600" />
            ) : (
              <Play className="h-4 w-4 text-green-600" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(item)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(item.id)}
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
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({recurring.length})</TabsTrigger>
          <TabsTrigger value="income">Income ({incomeItems.length})</TabsTrigger>
          <TabsTrigger value="expense">Expense ({expenseItems.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {recurring.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <Repeat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recurring transactions</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {recurring.map((item) => (
                <RecurringCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="income">
          {incomeItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <p>No recurring income</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {incomeItems.map((item) => (
                <RecurringCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="expense">
          {expenseItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <p>No recurring expenses</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {expenseItems.map((item) => (
                <RecurringCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Recurring Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editItem ? 'Edit Recurring Transaction' : 'Create Recurring Transaction'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={type === 'income' ? 'default' : 'outline'}
                className={cn(
                  type === 'income' && 'bg-green-600 hover:bg-green-700'
                )}
                onClick={() => {
                  setType('income');
                  setCategory('');
                }}
              >
                Income
              </Button>
              <Button
                type="button"
                variant={type === 'expense' ? 'default' : 'outline'}
                className={cn(
                  type === 'expense' && 'bg-red-600 hover:bg-red-700'
                )}
                onClick={() => {
                  setType('expense');
                  setCategory('');
                }}
              >
                Expense
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Monthly Salary"
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
                    {filteredCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as typeof frequency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? formatDate(startDate) : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(d) => d && setStartDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recurring Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recurring transaction? This will not affect past transactions.
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

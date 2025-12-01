'use client';

import { useState } from 'react';
import { exportToCSV, formatDate } from '@/lib/utils';
import { useTransactions, useCategories, useBudgets, useGoals, useReminders, useRecurring } from '@/lib/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, Download, FileSpreadsheet, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type ExportType = 'transactions' | 'budgets' | 'goals' | 'recurring' | 'reminders' | 'all';

export function ExportData() {
  // Use React Query hooks for data fetching with automatic caching
  const { data: transactions = [], isLoading: loadingTrans } = useTransactions();
  const { data: budgets = [], isLoading: loadingBudgets } = useBudgets();
  const { data: goals = [], isLoading: loadingGoals } = useGoals();
  const { data: recurring = [], isLoading: loadingRecurring } = useRecurring();
  const { data: reminders = [], isLoading: loadingReminders } = useReminders();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  
  const loading = loadingTrans || loadingBudgets || loadingGoals || loadingRecurring || loadingReminders || loadingCategories;

  const [exportType, setExportType] = useState<ExportType>('transactions');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  const handleExport = () => {
    try {
      if (exportType === 'all') {
        // Export all data types
        exportAllData();
      } else {
        exportSingleType(exportType);
      }
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };

  const exportSingleType = (type: ExportType) => {
    switch (type) {
      case 'transactions':
        exportTransactions();
        break;
      case 'budgets':
        exportBudgets();
        break;
      case 'goals':
        exportGoals();
        break;
      case 'recurring':
        exportRecurring();
        break;
      case 'reminders':
        exportReminders();
        break;
    }
  };

  const exportAllData = () => {
    exportTransactions();
    exportBudgets();
    exportGoals();
    exportRecurring();
    exportReminders();
  };

  const exportTransactions = () => {
    let data = transactions;

    // Apply date filters
    if (dateFrom) {
      data = data.filter((t) => new Date(t.date) >= dateFrom);
    }
    if (dateTo) {
      data = data.filter((t) => new Date(t.date) <= dateTo);
    }

    const exportData = data.map((t) => ({
      Date: formatDate(t.date),
      Type: t.type,
      Category: getCategoryName(t.category),
      Description: t.description,
      Amount: t.amount,
      Currency: t.currency,
      IsRecurring: t.isRecurring ? 'Yes' : 'No',
      Tags: t.tags?.join(', ') || '',
    }));

    exportToCSV(exportData, `transactions_${formatDate(new Date(), 'yyyy-MM-dd')}`);
  };

  const exportBudgets = () => {
    const exportData = budgets.map((b) => ({
      Category: getCategoryName(b.category),
      BudgetAmount: b.amount,
      Spent: b.spent,
      Remaining: b.amount - b.spent,
      PercentUsed: Math.round((b.spent / b.amount) * 100),
      Period: b.period,
      Currency: b.currency,
      StartDate: formatDate(b.startDate),
    }));

    exportToCSV(exportData, `budgets_${formatDate(new Date(), 'yyyy-MM-dd')}`);
  };

  const exportGoals = () => {
    const exportData = goals.map((g) => ({
      Name: g.name,
      TargetAmount: g.targetAmount,
      CurrentAmount: g.currentAmount,
      Remaining: g.targetAmount - g.currentAmount,
      PercentComplete: Math.round((g.currentAmount / g.targetAmount) * 100),
      Deadline: formatDate(g.deadline),
      Currency: g.currency,
      IsCompleted: g.isCompleted ? 'Yes' : 'No',
    }));

    exportToCSV(exportData, `goals_${formatDate(new Date(), 'yyyy-MM-dd')}`);
  };

  const exportRecurring = () => {
    const exportData = recurring.map((r) => ({
      Description: r.description,
      Type: r.type,
      Category: getCategoryName(r.category),
      Amount: r.amount,
      Currency: r.currency,
      Frequency: r.frequency,
      StartDate: formatDate(r.startDate),
      NextDueDate: formatDate(r.nextDueDate),
      IsActive: r.isActive ? 'Yes' : 'No',
    }));

    exportToCSV(exportData, `recurring_${formatDate(new Date(), 'yyyy-MM-dd')}`);
  };

  const exportReminders = () => {
    const exportData = reminders.map((r) => ({
      Title: r.title,
      Amount: r.amount,
      Currency: r.currency,
      Category: getCategoryName(r.category),
      DueDate: formatDate(r.dueDate),
      IsRecurring: r.isRecurring ? 'Yes' : 'No',
      Frequency: r.frequency || 'N/A',
      IsPaid: r.isPaid ? 'Yes' : 'No',
      NotifyBefore: `${r.notifyBefore} days`,
    }));

    exportToCSV(exportData, `reminders_${formatDate(new Date(), 'yyyy-MM-dd')}`);
  };

  const exportOptions = [
    { value: 'transactions', label: 'Transactions', count: transactions.length },
    { value: 'budgets', label: 'Budgets', count: budgets.length },
    { value: 'goals', label: 'Goals', count: goals.length },
    { value: 'recurring', label: 'Recurring Transactions', count: recurring.length },
    { value: 'reminders', label: 'Reminders', count: reminders.length },
    { value: 'all', label: 'Export All', count: null },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Export Type Selection */}
          <div className="space-y-2">
            <Label>What would you like to export?</Label>
            <Select value={exportType} onValueChange={(v) => setExportType(v as ExportType)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {option.count !== null && (
                        <span className="text-muted-foreground ml-2">
                          ({option.count} items)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range (only for transactions) */}
          {exportType === 'transactions' && (
            <div className="space-y-2">
              <Label>Date Range (optional)</Label>
              <div className="flex gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateFrom && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? formatDate(dateFrom) : 'From date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateTo && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? formatDate(dateTo) : 'To date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {(dateFrom || dateTo) && (
                <Button
                  variant="link"
                  className="px-0 text-sm"
                  onClick={() => {
                    setDateFrom(undefined);
                    setDateTo(undefined);
                  }}
                >
                  Clear date filter
                </Button>
              )}
            </div>
          )}

          {/* Export Button */}
          <Button onClick={handleExport} className="w-full" size="lg">
            <Download className="h-5 w-5 mr-2" />
            Export to CSV
          </Button>
        </CardContent>
      </Card>

      {/* Export Preview */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Export Preview</h3>
            <p className="text-sm text-muted-foreground">Preview of data that will be exported</p>
          </div>
          <div className="space-y-4">
            {exportType === 'transactions' && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {transactions.length} transactions will be exported
                </p>
                <div className="text-sm">
                  <p>Columns: Date, Type, Category, Description, Amount, Currency, IsRecurring, Tags</p>
                </div>
              </div>
            )}
            {exportType === 'budgets' && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {budgets.length} budgets will be exported
                </p>
                <div className="text-sm">
                  <p>Columns: Category, BudgetAmount, Spent, Remaining, PercentUsed, Period, Currency, StartDate</p>
                </div>
              </div>
            )}
            {exportType === 'goals' && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {goals.length} goals will be exported
                </p>
                <div className="text-sm">
                  <p>Columns: Name, TargetAmount, CurrentAmount, Remaining, PercentComplete, Deadline, Currency, IsCompleted</p>
                </div>
              </div>
            )}
            {exportType === 'recurring' && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {recurring.length} recurring transactions will be exported
                </p>
                <div className="text-sm">
                  <p>Columns: Description, Type, Category, Amount, Currency, Frequency, StartDate, NextDueDate, IsActive</p>
                </div>
              </div>
            )}
            {exportType === 'reminders' && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {reminders.length} reminders will be exported
                </p>
                <div className="text-sm">
                  <p>Columns: Title, Amount, Currency, Category, DueDate, IsRecurring, Frequency, IsPaid, NotifyBefore</p>
                </div>
              </div>
            )}
            {exportType === 'all' && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Multiple CSV files will be downloaded:
                </p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    transactions_{formatDate(new Date(), 'yyyy-MM-dd')}.csv ({transactions.length} items)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    budgets_{formatDate(new Date(), 'yyyy-MM-dd')}.csv ({budgets.length} items)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    goals_{formatDate(new Date(), 'yyyy-MM-dd')}.csv ({goals.length} items)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    recurring_{formatDate(new Date(), 'yyyy-MM-dd')}.csv ({recurring.length} items)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    reminders_{formatDate(new Date(), 'yyyy-MM-dd')}.csv ({reminders.length} items)
                  </li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import {
  useBudgets,
  useCategories,
  useCreateBudget,
  useDeleteBudget,
  useSettings,
  useUpdateBudget,
} from '@/lib/hooks';
import { Budget } from '@/lib/types';
import { calculatePercentage, formatCurrency } from '@/lib/utils';
import { Button, Card, CardContent, Progress } from '@repo/ui/components/ui';
import { AlertDialog, EditDialog } from '@repo/ui/dialogs';
import { FormField, SelectField } from '@repo/ui/forms';
import { AlertTriangle, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BudgetManagerProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function BudgetManager({
  isDialogOpen,
  setIsDialogOpen,
}: BudgetManagerProps) {
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();
  const createBudget = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const deleteBudgetMutation = useDeleteBudget();

  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<
    'weekly' | 'monthly' | 'quarterly' | 'yearly'
  >('monthly');

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const usedCategories = budgets.map((b) =>
    typeof b.category === 'object'
      ? (b.category as { id: string }).id
      : b.category
  );
  const editCategoryId = editBudget?.category
    ? typeof editBudget.category === 'object'
      ? (editBudget.category as { id: string }).id
      : editBudget.category
    : null;
  const availableCategories = expenseCategories.filter(
    (c) => !usedCategories.includes(c.id) || editCategoryId === c.id
  );

  const getCategoryName = (
    category: string | { id: string; name?: string }
  ) => {
    if (typeof category === 'object' && category.name) {
      return category.name;
    }
    const categoryId = typeof category === 'object' ? category.id : category;
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || categoryId;
  };

  const getCategoryColor = (
    category: string | { id: string; color?: string }
  ) => {
    if (typeof category === 'object' && category.color) {
      return category.color;
    }
    const categoryId = typeof category === 'object' ? category.id : category;
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.color || '#6B7280';
  };

  const resetForm = () => {
    setCategory('');
    setAmount('');
    setPeriod('monthly');
    setEditBudget(null);
  };

  const openEditDialog = (budget: Budget) => {
    setEditBudget(budget);
    const categoryId =
      typeof budget.category === 'object'
        ? (budget.category as { id: string }).id
        : budget.category;
    setCategory(categoryId);
    setAmount(budget.amount.toString());
    setPeriod(budget.period);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const budgetData = {
      category,
      amount: parseFloat(amount),
      currency: settings?.defaultCurrency || 'INR',
      period,
      spent: editBudget?.spent || 0,
      startDate: new Date().toISOString().split('T')[0],
    };

    try {
      if (editBudget) {
        await updateBudgetMutation.mutateAsync({
          id: editBudget.id,
          data: budgetData,
        });
        toast.success('Budget updated');
      } else {
        await createBudget.mutateAsync(budgetData as Omit<Budget, 'id'>);
        toast.success('Budget created');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast.error('Failed to save budget');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteBudgetMutation.mutateAsync(deleteId);
        toast.success('Budget deleted');
        setDeleteId(null);
      } catch {
        toast.error('Failed to delete budget');
      }
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (budgetsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {budgets.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <p>No budgets set yet</p>
              <p className="text-sm">
                Create a budget to start tracking your spending
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => {
            const percentage = calculatePercentage(budget.spent, budget.amount);
            const isOverBudget = percentage >= 100;
            const isNearLimit = percentage >= 80;

            return (
              <Card key={budget.id} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          getCategoryColor(budget.category) + '20',
                      }}
                    >
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{
                          backgroundColor: getCategoryColor(budget.category),
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">
                        {getCategoryName(budget.category)}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {budget.period} budget
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(budget)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(budget.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span className="font-medium">
                      {formatCurrency(budget.spent, budget.currency)} /{' '}
                      {formatCurrency(budget.amount, budget.currency)}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={Math.min(percentage, 100)}
                      className="h-3"
                    />
                    <div
                      className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(
                        percentage
                      )}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span
                      className={`flex items-center gap-1 ${
                        isOverBudget
                          ? 'text-red-500'
                          : isNearLimit
                          ? 'text-yellow-500'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {(isOverBudget || isNearLimit) && (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      {percentage}% used
                    </span>
                    <span
                      className={
                        isOverBudget ? 'text-red-500' : 'text-muted-foreground'
                      }
                    >
                      {isOverBudget
                        ? `${formatCurrency(
                            budget.spent - budget.amount,
                            budget.currency
                          )} over`
                        : `${formatCurrency(
                            budget.amount - budget.spent,
                            budget.currency
                          )} remaining`}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Budget Dialog */}
      <EditDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
        title={editBudget ? 'Edit Budget' : 'Create Budget'}
        onSubmit={handleSubmit}
        submitText={editBudget ? 'Update' : 'Create'}
      >
        <SelectField
          id="category"
          label="Category"
          value={category}
          onChange={setCategory}
          placeholder="Select a category"
          required
          options={availableCategories.map((c) => ({
            label: c.name,
            value: c.id,
            color: c.color,
          }))}
        />
        <FormField
          id="amount"
          label="Budget Amount"
          type="number"
          value={amount}
          onChange={setAmount}
          placeholder="0.00"
          min={0}
          step={0.01}
          required
        />
        <SelectField
          id="period"
          label="Period"
          value={period}
          onChange={(v) => setPeriod(v as typeof period)}
          options={[
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Quarterly', value: 'quarterly' },
            { label: 'Yearly', value: 'yearly' },
          ]}
        />
      </EditDialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Budget"
        description="Are you sure you want to delete this budget? This action cannot be undone."
        variant="delete"
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </>
  );
}

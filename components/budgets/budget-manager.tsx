'use client';

import { useState } from 'react';
import { useBudgets, useCategories, useSettings, useCreateBudget, useUpdateBudget, useDeleteBudget } from '@/lib/hooks';
import { Budget } from '@/lib/types';
import { formatCurrency, calculatePercentage } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
import { Plus, Pencil, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
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

export function BudgetManager() {
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();
  const createBudget = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const deleteBudgetMutation = useDeleteBudget();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const usedCategories = budgets.map((b) => b.category);
  const availableCategories = expenseCategories.filter(
    (c) => !usedCategories.includes(c.id) || editBudget?.category === c.id
  );

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
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
    setCategory(budget.category);
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
      currency: settings?.defaultCurrency || 'USD',
      period,
      spent: editBudget?.spent || 0,
      startDate: new Date().toISOString().split('T')[0],
    };

    try {
      if (editBudget) {
        await updateBudgetMutation.mutateAsync({ id: editBudget.id, data: budgetData });
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budget Planning</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button disabled={availableCategories.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editBudget ? 'Edit Budget' : 'Create Budget'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: c.color }}
                            />
                            {c.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Budget Amount</Label>
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
                  <Label>Period</Label>
                  <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editBudget ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No budgets set yet</p>
              <p className="text-sm">Create a budget to start tracking your spending</p>
            </div>
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
                          style={{ backgroundColor: getCategoryColor(budget.category) + '20' }}
                        >
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: getCategoryColor(budget.category) }}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{getCategoryName(budget.category)}</p>
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
                          {formatCurrency(budget.spent, budget.currency)} / {formatCurrency(budget.amount, budget.currency)}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={Math.min(percentage, 100)} className="h-3" />
                        <div
                          className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(percentage)}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={`flex items-center gap-1 ${isOverBudget ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                          {(isOverBudget || isNearLimit) && <AlertTriangle className="h-3 w-3" />}
                          {percentage}% used
                        </span>
                        <span className={isOverBudget ? 'text-red-500' : 'text-muted-foreground'}>
                          {isOverBudget
                            ? `${formatCurrency(budget.spent - budget.amount, budget.currency)} over`
                            : `${formatCurrency(budget.amount - budget.spent, budget.currency)} remaining`}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this budget? This action cannot be undone.
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

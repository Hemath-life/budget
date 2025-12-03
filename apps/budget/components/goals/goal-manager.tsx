'use client';

import { useState } from 'react';
import { useGoals, useSettings, useCreateGoal, useUpdateGoal, useDeleteGoal, useContributeToGoal } from '@/lib/hooks';
import { Goal } from '@/lib/types';
import { formatCurrency, calculatePercentage, getDaysUntil } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, formatDate } from '@/lib/utils';
import { Pencil, Trash2, CalendarIcon, Target, Trophy, PlusCircle, Loader2 } from 'lucide-react';
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

const COLORS = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];

interface GoalManagerProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function GoalManager({ isDialogOpen, setIsDialogOpen }: GoalManagerProps) {
  const { data: goals = [], isLoading: goalsLoading } = useGoals();
  const { data: settings } = useSettings();
  const createGoal = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();
  const contributeToGoal = useContributeToGoal();

  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [contributeId, setContributeId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [color, setColor] = useState('#3B82F6');

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

  const resetForm = () => {
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline(new Date());
    setColor('#3B82F6');
    setEditGoal(null);
  };

  const openEditDialog = (goal: Goal) => {
    setEditGoal(goal);
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setDeadline(new Date(goal.deadline));
    setColor(goal.color);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter a goal name');
      return;
    }
    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      toast.error('Please enter a valid target amount');
      return;
    }

    const goalData = {
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      currency: settings?.defaultCurrency || 'INR',
      deadline: deadline.toISOString().split('T')[0],
      icon: 'Target',
      color,
    };

    try {
      if (editGoal) {
        await updateGoalMutation.mutateAsync({ 
          id: editGoal.id, 
          data: {
            ...goalData,
            isCompleted: goalData.currentAmount >= goalData.targetAmount
          }
        });
        toast.success('Goal updated');
      } else {
        await createGoal.mutateAsync({
          ...goalData,
          isCompleted: goalData.currentAmount >= goalData.targetAmount
        } as Omit<Goal, 'id' | 'createdAt'>);
        toast.success('Goal created');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast.error('Failed to save goal');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteGoalMutation.mutateAsync(deleteId);
        toast.success('Goal deleted');
        setDeleteId(null);
      } catch {
        toast.error('Failed to delete goal');
      }
    }
  };

  const handleContribute = async () => {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (contributeId) {
      try {
        await contributeToGoal.mutateAsync({ id: contributeId, amount: parseFloat(contributeAmount) });
        toast.success('Contribution added');
        setIsContributeOpen(false);
        setContributeId(null);
        setContributeAmount('');
      } catch {
        toast.error('Failed to add contribution');
      }
    }
  };

  if (goalsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
    const daysLeft = getDaysUntil(goal.deadline);

    return (
      <Card className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: goal.color + '20' }}
            >
              {goal.isCompleted ? (
                <Trophy className="h-6 w-6" style={{ color: goal.color }} />
              ) : (
                <Target className="h-6 w-6" style={{ color: goal.color }} />
              )}
            </div>
            <div>
              <p className="font-medium">{goal.name}</p>
              <div className="flex items-center gap-2">
                {goal.isCompleted ? (
                  <Badge className="bg-green-500">Completed</Badge>
                ) : daysLeft < 0 ? (
                  <Badge variant="destructive">Overdue</Badge>
                ) : daysLeft <= 30 ? (
                  <Badge variant="default" className="bg-yellow-500">
                    {daysLeft} days left
                  </Badge>
                ) : (
                  <Badge variant="outline">{daysLeft} days left</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {!goal.isCompleted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setContributeId(goal.id);
                  setIsContributeOpen(true);
                }}
              >
                <PlusCircle className="h-4 w-4 text-green-500" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openEditDialog(goal)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(goal.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium" style={{ color: goal.color }}>
              {percentage}%
            </span>
          </div>
          <Progress value={percentage} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {formatCurrency(goal.currentAmount, goal.currency)}
            </span>
            <span className="text-muted-foreground">
              of {formatCurrency(goal.targetAmount, goal.currency)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Deadline: {formatDate(goal.deadline)}
          </p>
        </div>
      </Card>
    );
  };

  return (
    <>
      {goals.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No goals set yet</p>
              <p className="text-sm">Create a goal to start saving</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeGoals.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
          {completedGoals.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Goal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editGoal ? 'Edit Goal' : 'Create Goal'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Emergency Fund"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target Amount</Label>
                <Input
                  id="target"
                  type="number"
                  step="0.01"
                  min="0"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current">Current Amount</Label>
                <Input
                  id="current"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !deadline && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? formatDate(deadline) : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={(d) => d && setDeadline(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`h-8 w-8 rounded-full transition-transform ${
                      color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editGoal ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contribute Dialog */}
      <Dialog open={isContributeOpen} onOpenChange={setIsContributeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contribution</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contribute">Amount</Label>
              <Input
                id="contribute"
                type="number"
                step="0.01"
                min="0"
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContributeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleContribute}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
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

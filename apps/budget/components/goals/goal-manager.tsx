'use client';

import {
  useContributeToGoal,
  useCreateGoal,
  useDeleteGoal,
  useGoals,
  useSettings,
  useUpdateGoal,
} from '@/lib/hooks';
import { Goal } from '@/lib/types';
import {
  calculatePercentage,
  formatCurrency,
  formatDate,
  getDaysUntil,
} from '@/lib/utils';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Progress,
} from '@repo/ui/components/ui';
import { AlertDialog, ContributeDialog, EditDialog } from '@repo/ui/dialogs';
import { DateField, FormField } from '@repo/ui/forms';
import {
  Loader2,
  Pencil,
  PlusCircle,
  Target,
  Trash2,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const COLORS = [
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#6366F1',
];

interface GoalManagerProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function GoalManager({
  isDialogOpen,
  setIsDialogOpen,
}: GoalManagerProps) {
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
            isCompleted: goalData.currentAmount >= goalData.targetAmount,
          },
        });
        toast.success('Goal updated');
      } else {
        await createGoal.mutateAsync({
          ...goalData,
          isCompleted: goalData.currentAmount >= goalData.targetAmount,
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
        await contributeToGoal.mutateAsync({
          id: contributeId,
          amount: parseFloat(contributeAmount),
        });
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
    const percentage = calculatePercentage(
      goal.currentAmount,
      goal.targetAmount
    );
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
      <EditDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
        title={editGoal ? 'Edit Goal' : 'Create Goal'}
        onSubmit={handleSubmit}
        submitText={editGoal ? 'Update' : 'Create'}
      >
        <FormField
          id="name"
          label="Goal Name"
          value={name}
          onChange={setName}
          placeholder="e.g., Emergency Fund"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="target"
            label="Target Amount"
            type="number"
            value={targetAmount}
            onChange={setTargetAmount}
            placeholder="0.00"
            min={0}
            step={0.01}
            required
          />
          <FormField
            id="current"
            label="Current Amount"
            type="number"
            value={currentAmount}
            onChange={setCurrentAmount}
            placeholder="0.00"
            min={0}
            step={0.01}
          />
        </div>
        <DateField
          id="deadline"
          label="Deadline"
          value={deadline}
          onChange={(d) => d && setDeadline(d)}
          required
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`h-8 w-8 rounded-full transition-transform ${
                  color === c
                    ? 'ring-2 ring-offset-2 ring-primary scale-110'
                    : ''
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
      </EditDialog>

      {/* Contribute Dialog */}
      <ContributeDialog
        open={isContributeOpen}
        onOpenChange={setIsContributeOpen}
        title="Add Contribution"
        onSubmit={handleContribute}
        submitText="Add"
      >
        <FormField
          id="contribute"
          label="Amount"
          type="number"
          value={contributeAmount}
          onChange={setContributeAmount}
          placeholder="0.00"
          min={0}
          step={0.01}
          required
        />
      </ContributeDialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Goal"
        description="Are you sure you want to delete this goal? This action cannot be undone."
        variant="delete"
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </>
  );
}

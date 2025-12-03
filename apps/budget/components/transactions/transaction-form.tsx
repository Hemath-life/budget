'use client';

import { categoriesApi, settingsApi, transactionsApi } from '@/lib/api';
import { Category, Currency, Transaction, TransactionType } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';
import {
  Button,
  Calendar,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@repo/ui/components/ui';
import {
  ArrowLeft,
  CalendarIcon,
  Loader2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TransactionFormProps {
  transaction?: Transaction;
  mode: 'add' | 'edit';
}

export function TransactionForm({ transaction, mode }: TransactionFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [type, setType] = useState<TransactionType>(
    transaction?.type || 'expense'
  );
  const [amount, setAmount] = useState(transaction?.amount?.toString() || '');
  const [currency, setCurrency] = useState(transaction?.currency || '');
  const [category, setCategory] = useState(transaction?.categoryId || '');
  const [description, setDescription] = useState(
    transaction?.description || ''
  );
  const [date, setDate] = useState<Date>(
    transaction?.date ? new Date(transaction.date) : new Date()
  );
  const [isRecurring, setIsRecurring] = useState(
    transaction?.isRecurring || false
  );
  const [tags, setTags] = useState(transaction?.tags || '');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [catData, settingsData] = await Promise.all([
        categoriesApi.getAll(),
        settingsApi.get(),
      ]);

      setCategories(catData);
      setCurrencies(settingsData.currencies || []);
      setDefaultCurrency(settingsData.defaultCurrency || 'INR');
      if (!currency) {
        setCurrency(settingsData.defaultCurrency || 'INR');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);
  const selectedCurrency = currencies.find((c) => c.code === currency);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    setSubmitting(true);

    // Create date at noon UTC to avoid timezone issues
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)
    );

    const tagsValue = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .join(',');

    const transactionData = {
      type,
      amount: parseFloat(amount),
      currency: currency || defaultCurrency,
      categoryId: category,
      description: description.trim(),
      date: utcDate.toISOString(),
      isRecurring,
      ...(tagsValue ? { tags: tagsValue } : {}),
    };

    try {
      if (mode === 'add') {
        await transactionsApi.create(transactionData);
        toast.success('Transaction added successfully');
        router.push('/transactions');
      } else if (transaction) {
        await transactionsApi.update(transaction.id, transactionData);
        toast.success('Transaction updated successfully');
        router.push('/transactions');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save transaction'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/transactions">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">
          {mode === 'add' ? 'New Transaction' : 'Edit Transaction'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selection */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('');
            }}
            className={cn(
              'flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-md transition-all',
              type === 'income'
                ? 'bg-white dark:bg-gray-900 text-green-600 shadow-sm'
                : 'text-gray-500'
            )}
          >
            <TrendingUp className="h-4 w-4" />
            Income
          </button>
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory('');
            }}
            className={cn(
              'flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-md transition-all',
              type === 'expense'
                ? 'bg-white dark:bg-gray-900 text-red-600 shadow-sm'
                : 'text-gray-500'
            )}
          >
            <TrendingDown className="h-4 w-4" />
            Expense
          </button>
        </div>

        {/* Amount & Currency */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {selectedCurrency?.symbol || '₹'}
              </span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 h-10 rounded-lg"
              />
            </div>
          </div>
          <div className="w-24">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Currency
            </Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-10 rounded-lg">
                <SelectValue placeholder="INR" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-10 rounded-lg">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.length === 0 ? (
                <div className="p-2 text-center text-xs text-muted-foreground">
                  No categories for {type}
                </div>
              ) : (
                filteredCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.name}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Description
          </Label>
          <Input
            placeholder="What's this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-10 rounded-lg"
          />
        </div>

        {/* Date */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-10 justify-start font-normal rounded-lg"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {date ? formatDate(date) : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Tags */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Tags <span className="opacity-50">(optional)</span>
          </Label>
          <Input
            placeholder="work, personal..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="h-10 rounded-lg"
          />
        </div>

        {/* Recurring */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Recurring</span>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={setIsRecurring}
            className="data-[state=checked]:bg-green-500"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/transactions')}
            disabled={submitting}
            className="flex-1 h-10 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className={cn(
              'flex-1 h-10 rounded-lg font-medium',
              type === 'income'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            )}
          >
            {submitting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
            {mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}

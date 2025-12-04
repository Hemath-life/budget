'use client';

import { cn } from '@/lib/utils';
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export type DateFilterPeriod = 'week' | 'month' | 'year' | 'custom';

interface DateRange {
  from: Date;
  to: Date;
}

interface DateFilterProps {
  onFilterChange: (range: DateRange) => void;
  className?: string;
}

export function DateFilter({ onFilterChange, className }: DateFilterProps) {
  const [period, setPeriod] = useState<DateFilterPeriod>('month');
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();

  const getDateRange = (selectedPeriod: DateFilterPeriod): DateRange => {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );

    switch (selectedPeriod) {
      case 'week': {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);
        weekStart.setHours(0, 0, 0, 0);
        return { from: weekStart, to: today };
      }
      case 'month': {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { from: monthStart, to: today };
      }
      case 'year': {
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return { from: yearStart, to: today };
      }
      case 'custom': {
        if (customFrom && customTo) {
          return { from: customFrom, to: customTo };
        }
        // Default to current month if custom dates not set
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { from: monthStart, to: today };
      }
    }
  };

  const handlePeriodChange = (newPeriod: DateFilterPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'custom') {
      onFilterChange(getDateRange(newPeriod));
    }
  };

  const handleCustomDateChange = (from?: Date, to?: Date) => {
    setCustomFrom(from);
    setCustomTo(to);
    if (from && to) {
      onFilterChange({ from, to });
    }
  };

  const periods: { value: DateFilterPeriod; label: string }[] = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Period Toggle Buttons */}
      <div className="flex items-center bg-muted rounded-lg p-0.5">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePeriodChange(p.value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
              period === p.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom Date Pickers */}
      {period === 'custom' && (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 text-xs justify-start',
                  !customFrom && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-1.5 h-3 w-3" />
                {customFrom ? format(customFrom, 'MMM d, yyyy') : 'From'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customFrom}
                onSelect={(date) => handleCustomDateChange(date, customTo)}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground text-xs">to</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 text-xs justify-start',
                  !customTo && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-1.5 h-3 w-3" />
                {customTo ? format(customTo, 'MMM d, yyyy') : 'To'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customTo}
                onSelect={(date) => handleCustomDateChange(customFrom, date)}
                disabled={(date) =>
                  date > new Date() || (customFrom ? date < customFrom : false)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}

export function getDefaultDateRange(): DateRange {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );
  return { from: monthStart, to: today };
}

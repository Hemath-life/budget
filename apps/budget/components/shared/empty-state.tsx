'use client';

import { seedApi } from '@/lib/api';
import { Button, Card, CardContent } from '@repo/ui/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Database, Loader2, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showSeedButton?: boolean;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export function EmptyState({
  title = 'No data yet',
  description = 'Get started by adding your first entry or load sample data to explore the app.',
  icon,
  showSeedButton = true,
  actionLabel,
  actionHref,
  onAction,
  children,
}: EmptyStateProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const data = await seedApi.seed();

      setSuccess(true);
      toast.success('Sample data added successfully!', {
        description: `Added ${data.counts.transactions} transactions, ${data.counts.budgets} budgets, ${data.counts.goals} goals, and more.`,
      });

      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();

      // Reset success state after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to add sample data'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          {icon || <Database className="h-8 w-8 text-muted-foreground" />}
        </div>

        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {actionHref && actionLabel && (
            <Link href={actionHref}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {actionLabel}
              </Button>
            </Link>
          )}

          {onAction && actionLabel && !actionHref && (
            <Button onClick={onAction} className="gap-2">
              <Plus className="h-4 w-4" />
              {actionLabel}
            </Button>
          )}

          {children}

          {showSeedButton && (
            <Button
              variant="outline"
              onClick={handleSeedData}
              disabled={loading || success}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding sample data...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Data added!
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Load Sample Data
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

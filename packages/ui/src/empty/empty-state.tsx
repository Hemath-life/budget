'use client';

import { CheckCircle2, Database, Loader2, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button, Card, CardContent } from '#/components/ui';

interface EmptyStateProps {
  /** Title text displayed in the empty state */
  title?: string;
  /** Description text displayed below the title */
  description?: string;
  /** Custom icon to display (defaults to Database icon) */
  icon?: React.ReactNode;
  /** Icon component from lucide-react */
  Icon?: LucideIcon;
  /** Whether to show the seed/sample data button */
  showSeedButton?: boolean;
  /** Label for the seed button */
  seedButtonLabel?: string;
  /** Loading label for the seed button */
  seedButtonLoadingLabel?: string;
  /** Success label for the seed button */
  seedButtonSuccessLabel?: string;
  /** Async function to call when seed button is clicked */
  onSeed?: () => Promise<void>;
  /** Label for the primary action button */
  actionLabel?: string;
  /** Click handler for the primary action button */
  onAction?: () => void;
  /** Href for the primary action (uses Link-style behavior) */
  actionHref?: string;
  /** Additional content to render in the button area */
  children?: React.ReactNode;
  /** Additional CSS classes for the card */
  className?: string;
}

export function EmptyState({
  title = 'No data yet',
  description = 'Get started by adding your first entry.',
  icon,
  Icon,
  showSeedButton = false,
  seedButtonLabel = 'Load Sample Data',
  seedButtonLoadingLabel = 'Adding sample data...',
  seedButtonSuccessLabel = 'Data added!',
  onSeed,
  actionLabel,
  onAction,
  actionHref,
  children,
  className = '',
}: EmptyStateProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSeedData = async () => {
    if (!onSeed) return;

    setLoading(true);
    try {
      await onSeed();
      setSuccess(true);
      // Reset success state after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error; // Re-throw so the consumer can handle it
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = () => {
    if (icon) return icon;
    if (Icon) return <Icon className="h-8 w-8 text-muted-foreground" />;
    return <Database className="h-8 w-8 text-muted-foreground" />;
  };

  const ActionButton = () => {
    if (!actionLabel) return null;

    const button = (
      <Button onClick={onAction} className="gap-2">
        <Plus className="h-4 w-4" />
        {actionLabel}
      </Button>
    );

    if (actionHref) {
      return <a href={actionHref}>{button}</a>;
    }

    return button;
  };

  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          {renderIcon()}
        </div>

        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <ActionButton />

          {children}

          {showSeedButton && onSeed && (
            <Button
              variant="outline"
              onClick={handleSeedData}
              disabled={loading || success}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {seedButtonLoadingLabel}
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {seedButtonSuccessLabel}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {seedButtonLabel}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

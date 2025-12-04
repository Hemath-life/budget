/**
 * Empty State Components
 *
 * @description
 * Components for displaying empty states when no data is available.
 *
 * @example
 * import { EmptyCard, EmptyState } from '@repo/ui/empty';
 *
 * <EmptyCard
 *   icon={<Bell className="h-12 w-12" />}
 *   title="No reminders"
 *   description="Create a reminder to get started"
 *   action={{ label: "Create Reminder", onClick: handleCreate }}
 * />
 *
 * <EmptyState
 *   title="No transactions"
 *   description="Add your first transaction"
 *   actionLabel="Add Transaction"
 *   onAction={() => setOpen(true)}
 * />
 */

export { EmptyCard } from './empty-card';
export { EmptyState } from './empty-state';

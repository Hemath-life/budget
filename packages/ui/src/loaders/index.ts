/**
 * Loading State Components
 *
 * @description
 * Components for displaying loading states and progress indicators.
 *
 * @example
 * import { NavigationProgress, PageLoader, SpinnerLoader } from '@repo/ui/loaders';
 *
 * // Show navigation progress bar during page transitions
 * <NavigationProgress />
 *
 * // Page loading skeleton
 * <PageLoader showHeader cardCount={4} showTable />
 *
 * // Simple spinner
 * <SpinnerLoader message="Loading..." />
 */

export { NavigationProgress } from './navigation-progress';
export { CardLoader, PageLoader, SpinnerLoader } from './page-loader';

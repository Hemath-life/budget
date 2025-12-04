/**
 * @repo/ui Charts Module
 *
 * Reusable chart components built on Recharts.
 *
 * @example
 * ```tsx
 * import { DonutChart, RevenueChart } from '@repo/ui/charts';
 *
 * <DonutChart
 *   data={[{ name: 'Food', value: 500, color: '#EF4444' }]}
 *   total={1000}
 *   currency="USD"
 *   type="expense"
 * />
 *
 * <RevenueChart
 *   data={[{ month: 'Jan', income: 5000, expense: 3000 }]}
 *   currency="USD"
 *   totalRevenue={5000}
 *   change={10}
 * />
 * ```
 *
 * @module @repo/ui/charts
 */

export { DonutChart, type DonutChartProps } from './donut-chart';
export { RevenueChart, type RevenueChartProps } from './revenue-chart';

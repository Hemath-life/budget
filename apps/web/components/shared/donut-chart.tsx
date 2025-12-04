'use client';

import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface DonutChartProps {
  data: ChartDataItem[];
  total: number;
  currency?: string;
  centerLabel?: string;
  type?: 'income' | 'expense';
}

export function DonutChart({
  data,
  total,
  currency = 'INR',
  centerLabel = 'Total',
  type = 'expense',
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeItem = activeIndex !== null ? data[activeIndex] : null;
  const displayLabel = activeItem ? activeItem.name : centerLabel;
  const displayPercent = activeItem
    ? ((activeItem.value / total) * 100).toFixed(0)
    : '100';

  // Sort data by value descending for better visualization
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col h-full">
      {/* Chart Section */}
      <div className="flex items-center justify-center py-2">
        <div className="relative">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              {/* Background track */}
              <Pie
                data={[{ value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={75}
                dataKey="value"
                stroke="none"
                fill="hsl(var(--muted))"
                isAnimationActive={false}
              />
              {/* Main chart */}
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                animationBegin={0}
                animationDuration={600}
                animationEasing="ease-out"
                cornerRadius={4}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      opacity:
                        activeIndex === null || activeIndex === index
                          ? 1
                          : 0.35,
                      transform:
                        activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: 'center center',
                      filter:
                        activeIndex === index
                          ? 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))'
                          : 'none',
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="relative flex items-baseline transition-all duration-300">
              <span
                className={`text-3xl font-bold tabular-nums ${
                  type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {displayPercent}
              </span>
              <span
                className={`text-lg font-semibold ml-0.5 ${
                  type === 'income'
                    ? 'text-emerald-600/70 dark:text-emerald-400/70'
                    : 'text-rose-600/70 dark:text-rose-400/70'
                }`}
              >
                %
              </span>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground/80 mt-0.5 max-w-[80px] text-center truncate uppercase tracking-wide">
              {displayLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Legend Section - Bento Style */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-1.5 px-1">
          {sortedData.map((item) => {
            const percent = ((item.value / total) * 100).toFixed(1);
            const percentNum = (item.value / total) * 100;
            const originalIndex = data.indexOf(item);
            const isActive = activeIndex === originalIndex;

            return (
              <div
                key={item.name}
                className={`group relative flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-muted/80 to-muted/40 shadow-sm'
                    : 'hover:bg-muted/40'
                }`}
                onMouseEnter={() => setActiveIndex(originalIndex)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Color indicator with glow */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-transform duration-300 ${
                      isActive ? 'scale-125' : ''
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                  {isActive && (
                    <div
                      className="absolute inset-0 w-2.5 h-2.5 rounded-full blur-sm opacity-60"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                </div>

                {/* Category info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">
                      {item.name}
                    </span>
                    <span
                      className={`text-xs font-semibold tabular-nums transition-colors duration-200 ${
                        isActive
                          ? type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {percent}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${percentNum}%`,
                        backgroundColor: item.color,
                        opacity: isActive ? 1 : 0.7,
                      }}
                    />
                  </div>

                  {/* Amount - shown on hover/active */}
                  <div
                    className={`flex items-center justify-between transition-all duration-300 ${
                      isActive
                        ? 'opacity-100 max-h-5'
                        : 'opacity-0 max-h-0 overflow-hidden'
                    }`}
                  >
                    <span className="text-[11px] text-muted-foreground">
                      {formatCurrency(item.value, currency)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Summary - Bento Footer */}
      <div className="mt-auto pt-3 border-t border-border/50">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Total {type === 'income' ? 'Income' : 'Expenses'}
          </span>
          <span
            className={`text-sm font-bold tabular-nums ${
              type === 'income'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatCurrency(total, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { formatCurrency } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: ChartDataItem[];
  total: number;
  currency?: string;
  centerLabel?: string;
  type?: 'income' | 'expense';
}

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
          transition: 'all 0.3s ease',
        }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 14}
        fill={fill}
        opacity={0.3}
      />
    </g>
  );
};

export function DonutChart({
  data,
  total,
  currency = 'INR',
  centerLabel = 'Total',
  type = 'expense',
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const activeItem = activeIndex !== null ? data[activeIndex] : null;
  const displayValue = activeItem ? activeItem.value : total;
  const displayLabel = activeItem ? activeItem.name : centerLabel;
  const displayPercent = activeItem
    ? `${((activeItem.value / total) * 100).toFixed(0)}%`
    : '100%';

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 h-full">
      {/* Chart */}
      <div className="relative flex-shrink-0">
        <ResponsiveContainer width={220} height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              activeIndex={activeIndex ?? undefined}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              stroke="none"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity:
                      activeIndex === null || activeIndex === index ? 1 : 0.5,
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className={`text-3xl font-bold transition-all duration-300 ${
              type === 'income'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {displayPercent}
          </span>
          <span className="text-sm text-muted-foreground mt-1 max-w-[100px] text-center truncate">
            {displayLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        {data.map((item, index) => {
          const percent = ((item.value / total) * 100).toFixed(1);
          const isActive = activeIndex === index;

          return (
            <div
              key={item.name}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive ? 'bg-muted/50 scale-[1.02]' : 'hover:bg-muted/30'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(item.value, currency)}
                </p>
              </div>
              <span
                className={`text-sm font-semibold transition-colors ${
                  isActive
                    ? type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
                }`}
              >
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

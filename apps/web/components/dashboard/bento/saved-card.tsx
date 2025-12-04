'use client';

import { formatCurrency } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui';
import { Landmark } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface SavedCardProps {
  totalSaved: number;
  totalBudget: number;
  currency: string;
}

export function SavedCard({
  totalSaved,
  totalBudget,
  currency,
}: SavedCardProps) {
  const remaining = Math.max(totalBudget - totalSaved, 0);

  const data = [
    { name: 'Saved', value: totalSaved, color: '#8B5CF6' },
    { name: 'Remaining', value: remaining, color: '#E5E7EB' },
  ];

  return (
    <Card className="h-full bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Landmark className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">Saved</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-4">
        <div className="relative w-[180px] h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="savedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={-180}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? 'url(#savedGradient)' : entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(totalSaved, currency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

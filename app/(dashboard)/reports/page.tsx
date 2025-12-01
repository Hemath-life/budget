'use client';

import { ReportsView } from '@/components/reports/reports-view';

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Analyze your financial data with detailed reports</p>
      </div>

      <ReportsView />
    </div>
  );
}

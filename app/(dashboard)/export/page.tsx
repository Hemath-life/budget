'use client';

import { ExportData } from '@/components/export/export-data';

export default function ExportPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Export Data</h1>
        <p className="text-muted-foreground">Download your financial data in CSV format</p>
      </div>

      <ExportData />
    </div>
  );
}

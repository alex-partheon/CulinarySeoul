import React from 'react';
import { ReportGeneratorPanel } from '@/components/dashboard/profitability';

export default function ProfitabilityReports() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">손익 분석 보고서</h1>
        <p className="text-muted-foreground mt-2">
          상세한 손익 분석 보고서를 생성하고 다운로드하세요.
        </p>
      </div>

      <div className="grid gap-6">
        <ReportGeneratorPanel />
      </div>
    </div>
  );
}
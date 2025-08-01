import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { ProfitabilityDashboard } from '@/components/dashboard/profitability'

export function CompanyProfitability() {
  return (
    <DashboardLayout 
      title="전사 수익성 분석" 
      subtitle="전체 브랜드 및 매장의 수익성 종합 분석"
    >
      <div className="p-6">
        <ProfitabilityDashboard viewType="company" />
      </div>
    </DashboardLayout>
  )
}
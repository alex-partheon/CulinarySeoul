import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { ProfitabilityDashboard } from '@/components/dashboard/profitability'
import { useParams } from 'react-router'

export function BrandProfitability() {
  const { brandId } = useParams()
  
  return (
    <DashboardLayout 
      title="수익성 분석" 
      subtitle="브랜드별 수익성 현황 및 추세 분석"
    >
      <div className="p-6">
        <ProfitabilityDashboard 
          viewType="brand" 
          brandId={brandId}
        />
      </div>
    </DashboardLayout>
  )
}
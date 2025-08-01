import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { BarChart3 } from 'lucide-react'

export default function BrandAnalyticsFinancial() {
  return (
    <BrandPageTemplate
      title="Financial 분석"
      description="브랜드 {brandId}의 Financial 데이터를 분석하세요"
      icon={BarChart3}
    />
  )
}

import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { AlertTriangle } from 'lucide-react'

export default function BrandInventoryAlerts() {
  return (
    <BrandPageTemplate
      title="재고 부족 알림"
      description="브랜드 {brandId}의 재고 부족을 모니터링하세요"
      icon={AlertTriangle}
    />
  )
}
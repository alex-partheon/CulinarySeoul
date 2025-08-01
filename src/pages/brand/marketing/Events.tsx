import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Calendar } from 'lucide-react'

export default function BrandMarketingEvents() {
  return (
    <BrandPageTemplate
      title="이벤트 관리"
      description="브랜드 {brandId}의 매장 이벤트를 관리하세요"
      icon={Calendar}
    />
  )
}
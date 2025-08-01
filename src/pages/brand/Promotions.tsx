import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Tag } from 'lucide-react'

export default function BrandPromotions() {
  return (
    <BrandPageTemplate
      title="프로모션 관리"
      description="브랜드 {brandId}의 할인 및 쿠폰을 관리하세요"
      icon={Tag}
    />
  )
}
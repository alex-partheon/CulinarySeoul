import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Star } from 'lucide-react'

export default function BrandLoyalty() {
  return (
    <BrandPageTemplate
      title="적립금 관리"
      description="브랜드 {brandId}의 포인트 및 멤버십을 관리하세요"
      icon={Star}
    />
  )
}
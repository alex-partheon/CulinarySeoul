import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { ArrowRightLeft } from 'lucide-react'

export default function BrandInventoryTransfers() {
  return (
    <BrandPageTemplate
      title="재고 이동"
      description="브랜드 {brandId}의 매장 간 재고 이동을 관리하세요"
      icon={ArrowRightLeft}
    />
  )
}
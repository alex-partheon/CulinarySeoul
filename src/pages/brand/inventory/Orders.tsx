import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { ClipboardList } from 'lucide-react'

export default function BrandInventoryOrders() {
  return (
    <BrandPageTemplate
      title="발주 관리"
      description="브랜드 {brandId}의 발주서를 작성하고 승인하세요"
      icon={ClipboardList}
    />
  )
}
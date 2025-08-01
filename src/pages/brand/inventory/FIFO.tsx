import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { RotateCcw } from 'lucide-react'

export default function BrandInventoryFIFO() {
  return (
    <BrandPageTemplate
      title="선입선출 추적"
      description="브랜드 {brandId}의 유통기한을 관리하세요"
      icon={RotateCcw}
    />
  )
}
import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Truck } from 'lucide-react'

export default function BrandInventorySuppliers() {
  return (
    <BrandPageTemplate
      title="거래처 관리"
      description="브랜드 {brandId}의 공급업체를 관리하세요"
      icon={Truck}
    />
  )
}
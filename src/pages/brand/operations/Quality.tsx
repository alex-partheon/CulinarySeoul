import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Settings } from 'lucide-react'

export default function BrandOperationsQuality() {
  return (
    <BrandPageTemplate
      title="Quality 관리"
      description="브랜드 {brandId}의 Quality을 관리하세요"
      icon={Settings}
    />
  )
}

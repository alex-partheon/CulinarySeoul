import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Settings } from 'lucide-react'

export default function BrandOperationsTraining() {
  return (
    <BrandPageTemplate
      title="Training 관리"
      description="브랜드 {brandId}의 Training을 관리하세요"
      icon={Settings}
    />
  )
}

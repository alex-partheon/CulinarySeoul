import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Share2 } from 'lucide-react'

export default function BrandMarketingSocial() {
  return (
    <BrandPageTemplate
      title="SNS 관리"
      description="브랜드 {brandId}의 인스타그램/블로그를 관리하세요"
      icon={Share2}
    />
  )
}
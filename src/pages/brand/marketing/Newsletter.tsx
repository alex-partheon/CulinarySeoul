import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Mail } from 'lucide-react'

export default function BrandMarketingNewsletter() {
  return (
    <BrandPageTemplate
      title="뉴스레터"
      description="브랜드 {brandId}의 이메일 마케팅을 관리하세요"
      icon={Mail}
    />
  )
}
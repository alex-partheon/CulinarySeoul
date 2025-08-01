import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { MessageSquare } from 'lucide-react'

export default function BrandMarketingReviews() {
  return (
    <BrandPageTemplate
      title="리뷰 관리"
      description="브랜드 {brandId}의 네이버/구글 리뷰를 관리하세요"
      icon={MessageSquare}
    />
  )
}
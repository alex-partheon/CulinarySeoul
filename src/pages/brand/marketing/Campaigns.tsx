import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Zap } from 'lucide-react'

export default function BrandMarketingCampaigns() {
  return (
    <BrandPageTemplate
      title="캐페인 관리"
      description="브랜드 {brandId}의 마케팅 캐페인을 관리하세요"
      icon={Zap}
    />
  )
}
import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Cog } from 'lucide-react'

export default function BrandSystemIntegrations() {
  return (
    <BrandPageTemplate
      title="Integrations 관리"
      description="브랜드 {brandId}의 시스템 Integrations을 관리하세요"
      icon={Cog}
    />
  )
}

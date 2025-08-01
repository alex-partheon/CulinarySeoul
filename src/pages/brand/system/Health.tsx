import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Cog } from 'lucide-react'

export default function BrandSystemHealth() {
  return (
    <BrandPageTemplate
      title="Health 관리"
      description="브랜드 {brandId}의 시스템 Health을 관리하세요"
      icon={Cog}
    />
  )
}

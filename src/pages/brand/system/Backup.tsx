import React from 'react'
import { BrandPageTemplate } from '@/components/shared/BrandPageTemplate'
import { Cog } from 'lucide-react'

export default function BrandSystemBackup() {
  return (
    <BrandPageTemplate
      title="Backup 관리"
      description="브랜드 {brandId}의 시스템 Backup을 관리하세요"
      icon={Cog}
    />
  )
}

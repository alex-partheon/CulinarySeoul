import React from 'react'
import { useParams } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Construction } from 'lucide-react'

interface BrandPageTemplateProps {
  title: string
  description: string
  icon?: React.ElementType
}

export function BrandPageTemplate({ title, description, icon: Icon = Construction }: BrandPageTemplateProps) {
  const { brandId } = useParams<{ brandId: string }>()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          {description.replace('{brandId}', brandId || 'dashboard')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon className="h-5 w-5" />
            <span>구현 예정</span>
          </CardTitle>
          <CardDescription>
            이 페이지는 현재 개발 중입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <div className="text-center">
              <Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">곧 출시될 예정입니다</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
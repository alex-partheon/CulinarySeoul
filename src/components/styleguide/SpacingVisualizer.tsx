import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

interface SpacingInfo {
  name: string
  value: string
  pixels: string
  className: string
  usage: string
}

interface ShadowInfo {
  name: string
  value: string
  className: string
  description: string
}

interface RadiusInfo {
  name: string
  value: string
  className: string
  description: string
}

const spacingScale: SpacingInfo[] = [
  { name: '0', value: '0', pixels: '0px', className: 'p-0', usage: '여백 없음' },
  { name: '1', value: '0.25rem', pixels: '4px', className: 'p-1', usage: '최소 여백' },
  { name: '2', value: '0.5rem', pixels: '8px', className: 'p-2', usage: '작은 여백' },
  { name: '3', value: '0.75rem', pixels: '12px', className: 'p-3', usage: '기본 여백' },
  { name: '4', value: '1rem', pixels: '16px', className: 'p-4', usage: '표준 여백' },
  { name: '5', value: '1.25rem', pixels: '20px', className: 'p-5', usage: '중간 여백' },
  { name: '6', value: '1.5rem', pixels: '24px', className: 'p-6', usage: '큰 여백' },
  { name: '8', value: '2rem', pixels: '32px', className: 'p-8', usage: '섹션 여백' },
  { name: '10', value: '2.5rem', pixels: '40px', className: 'p-10', usage: '큰 섹션 여백' },
  { name: '12', value: '3rem', pixels: '48px', className: 'p-12', usage: '페이지 여백' },
  { name: '16', value: '4rem', pixels: '64px', className: 'p-16', usage: '큰 페이지 여백' },
  { name: '20', value: '5rem', pixels: '80px', className: 'p-20', usage: '매우 큰 여백' },
  { name: '24', value: '6rem', pixels: '96px', className: 'p-24', usage: '히어로 섹션' },
  { name: '32', value: '8rem', pixels: '128px', className: 'p-32', usage: '특별한 간격' }
]

const shadowLevels: ShadowInfo[] = [
  {
    name: '2XS',
    value: '0px 0px 0px 0px hsl(0 0% 10.1961% / 0.03)',
    className: 'shadow-2xs',
    description: '거의 보이지 않는 그림자'
  },
  {
    name: 'XS',
    value: '0px 0px 0px 0px hsl(0 0% 10.1961% / 0.03)',
    className: 'shadow-xs',
    description: '매우 작은 그림자'
  },
  {
    name: 'SM',
    value: '0px 0px 0px 0px hsl(0 0% 10.1961% / 0.05), 0px 1px 2px -1px hsl(0 0% 10.1961% / 0.05)',
    className: 'shadow-sm',
    description: '작은 그림자'
  },
  {
    name: 'Default',
    value: '0px 0px 0px 0px hsl(0 0% 10.1961% / 0.05), 0px 1px 2px -1px hsl(0 0% 10.1961% / 0.05)',
    className: 'shadow',
    description: '기본 그림자'
  },
  {
    name: 'MD',
    value: '0px 0px 0px 0px hsl(0 0% 10.1961% / 0.05), 0px 2px 4px -1px hsl(0 0% 10.1961% / 0.05)',
    className: 'shadow-md',
    description: '중간 그림자'
  },
  {
    name: 'LG',
    value: '0px 0px 0px 0px hsl(0 0% 10.1961% / 0.05), 0px 4px 6px -1px hsl(0 0% 10.1961% / 0.05)',
    className: 'shadow-lg',
    description: '큰 그림자'
  },
  {
    name: 'XL',
    value: '0px 0px 0px 0px hsl(0 0% 10.1961% / 0.05), 0px 8px 10px -1px hsl(0 0% 10.1961% / 0.05)',
    className: 'shadow-xl',
    description: '매우 큰 그림자'
  },
  {
    name: '2XL',
    value: '0px 0px 0px 0px hsl(0 0% 10.1961% / 0.13)',
    className: 'shadow-2xl',
    description: '최대 그림자'
  }
]

const borderRadius: RadiusInfo[] = [
  {
    name: 'None',
    value: '0px',
    className: 'rounded-none',
    description: '모서리 둥글기 없음'
  },
  {
    name: 'SM',
    value: 'calc(1rem - 4px)',
    className: 'rounded-sm',
    description: '작은 모서리 둥글기'
  },
  {
    name: 'Default',
    value: 'calc(1rem - 2px)',
    className: 'rounded',
    description: '기본 모서리 둥글기'
  },
  {
    name: 'MD',
    value: 'calc(1rem - 2px)',
    className: 'rounded-md',
    description: '중간 모서리 둥글기'
  },
  {
    name: 'LG',
    value: '1rem',
    className: 'rounded-lg',
    description: '큰 모서리 둥글기'
  },
  {
    name: 'XL',
    value: 'calc(1rem + 4px)',
    className: 'rounded-xl',
    description: '매우 큰 모서리 둥글기'
  },
  {
    name: 'Full',
    value: '9999px',
    className: 'rounded-full',
    description: '완전한 원형'
  }
]

export function SpacingVisualizer() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemName)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">간격 시스템</h2>
        <p className="text-muted-foreground">
          일관된 레이아웃을 위한 간격, 그림자, 모서리 둥글기 시스템입니다.
        </p>
      </div>

      {/* Spacing Scale */}
      <div>
        <h3 className="text-xl font-semibold mb-4">간격 스케일</h3>
        <div className="space-y-3">
          {spacingScale.map((space) => (
            <Card key={space.name} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-mono text-muted-foreground">
                    {space.name}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-mono">{space.value}</div>
                    <div className="text-xs text-muted-foreground">({space.pixels})</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{space.usage}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(space.className, space.name)}
                >
                  {copiedItem === space.name ? '복사됨!' : '복사'}
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-xs text-muted-foreground w-12">시각화:</div>
                <div 
                  className="bg-primary rounded"
                  style={{ width: space.value, height: '1rem', minWidth: '2px' }}
                />
                <div className="text-xs text-muted-foreground font-mono">
                  {space.className}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Common Spacing Patterns */}
      <div>
        <h3 className="text-xl font-semibold mb-4">일반적인 간격 패턴</h3>
        <div className="grid gap-4">
          <Card className="p-6">
            <h4 className="font-medium mb-4">카드 내부 여백 (p-6)</h4>
            <div className="bg-muted p-6 rounded-lg">
              <div className="bg-background p-4 rounded">
                <p className="text-sm">카드 내용</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h4 className="font-medium mb-4">요소 간 간격 (space-y-4)</h4>
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded">첫 번째 요소</div>
              <div className="bg-muted p-3 rounded">두 번째 요소</div>
              <div className="bg-muted p-3 rounded">세 번째 요소</div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-medium mb-4">섹션 간 간격 (my-8)</h4>
            <div className="space-y-8">
              <div className="bg-muted p-4 rounded">
                <p className="text-sm font-medium">섹션 1</p>
              </div>
              <div className="bg-muted p-4 rounded">
                <p className="text-sm font-medium">섹션 2</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Shadows */}
      <div>
        <h3 className="text-xl font-semibold mb-4">그림자 시스템</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {shadowLevels.map((shadow) => (
            <Card key={shadow.name} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{shadow.name}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(shadow.className, shadow.name)}
                >
                  {copiedItem === shadow.name ? '복사됨!' : '복사'}
                </Button>
              </div>
              <div 
                className={`bg-background p-6 rounded-lg ${shadow.className}`}
                style={{ minHeight: '80px' }}
              >
                <p className="text-xs text-center text-muted-foreground">
                  {shadow.description}
                </p>
              </div>
              <p className="text-xs font-mono text-muted-foreground break-all">
                {shadow.className}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <h3 className="text-xl font-semibold mb-4">모서리 둥글기</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {borderRadius.map((radius) => (
            <Card key={radius.name} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{radius.name}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(radius.className, radius.name)}
                >
                  {copiedItem === radius.name ? '복사됨!' : '복사'}
                </Button>
              </div>
              <div 
                className={`bg-primary w-16 h-16 ${radius.className} mx-auto`}
              />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{radius.description}</p>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  {radius.className}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">간격 시스템 사용 가이드</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">간격 원칙</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 8px (space-2) 기반의 일관된 간격 사용</li>
                <li>• 작은 요소: 4px, 8px, 12px (1, 2, 3)</li>
                <li>• 중간 요소: 16px, 24px, 32px (4, 6, 8)</li>
                <li>• 큰 요소: 48px, 64px, 96px (12, 16, 24)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">그림자 사용법</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• sm: 버튼, 작은 카드</li>
                <li>• md: 일반 카드, 모달</li>
                <li>• lg: 드롭다운, 팝오버</li>
                <li>• xl: 다이얼로그, 오버레이</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">모서리 둥글기 가이드</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• sm: 작은 버튼, 배지</li>
              <li>• md: 일반 버튼, 입력 필드</li>
              <li>• lg: 카드, 모달</li>
              <li>• xl: 큰 카드, 이미지</li>
              <li>• full: 아바타, 아이콘 버튼</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

interface TypographyInfo {
  name: string
  className: string
  cssClass: string
  fontSize: string
  lineHeight: string
  description: string
}

interface FontFamilyInfo {
  name: string
  variable: string
  cssClass: string
  description: string
  usage: string
}

interface LetterSpacingInfo {
  name: string
  className: string
  value: string
  description: string
}

const fontSizes: TypographyInfo[] = [
  {
    name: '2XS',
    className: 'text-2xs',
    cssClass: 'text-2xs',
    fontSize: '0.625rem',
    lineHeight: '0.875rem',
    description: '아주 작은 텍스트 (라벨, 캡션)'
  },
  {
    name: 'XS',
    className: 'text-xs',
    cssClass: 'text-xs',
    fontSize: '0.75rem',
    lineHeight: '1rem',
    description: '작은 텍스트 (헬프 텍스트, 메타 정보)'
  },
  {
    name: 'SM',
    className: 'text-sm',
    cssClass: 'text-sm', 
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    description: '작은 본문 텍스트'
  },
  {
    name: 'Base',
    className: 'text-base',
    cssClass: 'text-base',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    description: '기본 본문 텍스트'
  },
  {
    name: 'LG',
    className: 'text-lg',
    cssClass: 'text-lg',
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    description: '큰 본문 텍스트'
  },
  {
    name: 'XL',
    className: 'text-xl',
    cssClass: 'text-xl',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    description: '소제목'
  },
  {
    name: '2XL',
    className: 'text-2xl',
    cssClass: 'text-2xl',
    fontSize: '1.5rem',
    lineHeight: '2rem',
    description: '중간 제목'
  },
  {
    name: '3XL',
    className: 'text-3xl',
    cssClass: 'text-3xl',
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    description: '큰 제목'
  },
  {
    name: '4XL',
    className: 'text-4xl',
    cssClass: 'text-4xl',
    fontSize: '2.25rem',
    lineHeight: '2.5rem',
    description: '매우 큰 제목'
  },
  {
    name: '5XL',
    className: 'text-5xl',
    cssClass: 'text-5xl',
    fontSize: '3rem',
    lineHeight: '1',
    description: '히어로 제목'
  }
]

const fontFamilies: FontFamilyInfo[] = [
  {
    name: 'DM Sans',
    variable: '--font-sans',
    cssClass: 'font-sans',
    description: '기본 Sans-serif 폰트',
    usage: '본문, 제목, UI 텍스트'
  },
  {
    name: 'DM Sans Serif',
    variable: '--font-serif',
    cssClass: 'font-serif',
    description: 'Serif 스타일 폰트',
    usage: '장문 텍스트, 공식 문서'
  },
  {
    name: 'Space Mono',
    variable: '--font-mono',
    cssClass: 'font-mono',
    description: 'Monospace 폰트',
    usage: '코드, 숫자, 데이터'
  }
]

const letterSpacings: LetterSpacingInfo[] = [
  {
    name: 'Tighter',
    className: 'tracking-tighter',
    value: '-0.05em',
    description: '더 좁은 자간 - 큰 제목에 적합'
  },
  {
    name: 'Tight',
    className: 'tracking-tight',
    value: '-0.025em',
    description: '좁은 자간 - 제목에 적합'
  },
  {
    name: 'Normal',
    className: 'tracking-normal',
    value: '0em',
    description: '기본 자간 - 본문 텍스트에 적합'
  },
  {
    name: 'Wide',
    className: 'tracking-wide',
    value: '0.025em',
    description: '넓은 자간 - 강조 텍스트에 적합'
  },
  {
    name: 'Wider',
    className: 'tracking-wider',
    value: '0.05em',
    description: '더 넓은 자간 - 라벨에 적합'
  },
  {
    name: 'Widest',
    className: 'tracking-widest',
    value: '0.1em',
    description: '가장 넓은 자간 - 특별한 강조'
  }
]

export function TypographyShowcase() {
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
        <h2 className="text-3xl font-bold mb-2">타이포그래피</h2>
        <p className="text-muted-foreground">
          일관된 텍스트 스타일링을 위한 폰트 크기, 폰트 패밀리, 자간 시스템입니다.
        </p>
      </div>

      {/* Font Families */}
      <div>
        <h3 className="text-xl font-semibold mb-4">폰트 패밀리</h3>
        <div className="grid gap-4">
          {fontFamilies.map((font) => (
            <Card key={font.variable} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-lg">{font.name}</h4>
                    <p className="text-sm text-muted-foreground">{font.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">사용: {font.usage}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(font.cssClass, font.name)}
                  >
                    {copiedItem === font.name ? '복사됨!' : '복사'}
                  </Button>
                </div>
                <div className={`space-y-2 ${font.cssClass}`}>
                  <p className="text-2xl">안녕하세요, CulinarySeoul입니다.</p>
                  <p className="text-base">Hello, this is CulinarySeoul design system.</p>
                  <p className="text-sm font-mono">CSS: {font.cssClass} | var({font.variable})</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Font Sizes */}
      <div>
        <h3 className="text-xl font-semibold mb-4">폰트 크기</h3>
        <div className="space-y-3">
          {fontSizes.map((size) => (
            <Card key={size.name} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-6 flex-1">
                  <div className="w-16 text-xs text-muted-foreground font-mono">
                    {size.name}
                  </div>
                  <div className={`flex-1 ${size.className}`}>
                    한국의 아름다운 음식 문화를 담은 CulinarySeoul
                  </div>
                  <div className="text-xs text-muted-foreground font-mono hidden sm:block">
                    {size.fontSize} / {size.lineHeight}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(size.cssClass, size.name)}
                  className="ml-4"
                >
                  {copiedItem === size.name ? '복사됨!' : '복사'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-22">
                {size.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Letter Spacing */}
      <div>
        <h3 className="text-xl font-semibold mb-4">자간 (Letter Spacing)</h3>
        <div className="space-y-3">
          {letterSpacings.map((spacing) => (
            <Card key={spacing.name} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-6 flex-1">
                  <div className="w-20 text-xs text-muted-foreground font-mono">
                    {spacing.name}
                  </div>
                  <div className={`flex-1 text-lg ${spacing.className}`}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                  <div className="text-xs text-muted-foreground font-mono hidden sm:block">
                    {spacing.value}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(spacing.className, spacing.name)}
                  className="ml-4"
                >
                  {copiedItem === spacing.name ? '복사됨!' : '복사'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-26">
                {spacing.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Font Weight Examples */}
      <div>
        <h3 className="text-xl font-semibold mb-4">폰트 굵기</h3>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-normal">Normal (400) - 기본 텍스트</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard('font-normal', 'font-normal')}
              >
                {copiedItem === 'font-normal' ? '복사됨!' : '복사'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Medium (500) - 강조 텍스트</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard('font-medium', 'font-medium')}
              >
                {copiedItem === 'font-medium' ? '복사됨!' : '복사'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Bold (700) - 제목</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard('font-bold', 'font-bold')}
              >
                {copiedItem === 'font-bold' ? '복사됨!' : '복사'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Usage Guidelines */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">타이포그래피 사용 가이드</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">제목 계층</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• H1: text-4xl ~ text-5xl (페이지 제목)</li>
                <li>• H2: text-2xl ~ text-3xl (섹션 제목)</li>
                <li>• H3: text-xl (서브섹션 제목)</li>
                <li>• H4: text-lg (카드 제목)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">본문 텍스트</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 기본 본문: text-base</li>
                <li>• 작은 본문: text-sm</li>
                <li>• 메타 정보: text-xs</li>
                <li>• 코드/데이터: font-mono</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">접근성 고려사항</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 최소 폰트 크기: 14px (text-sm)</li>
              <li>• 본문 텍스트 최소 대비율: 4.5:1</li>
              <li>• 제목 텍스트 최소 대비율: 3:1</li>
              <li>• 긴 텍스트에는 적절한 line-height 유지</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
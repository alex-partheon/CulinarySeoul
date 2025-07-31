import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

interface ColorInfo {
  name: string
  variable: string
  cssVariable: string
  description?: string
  group: 'primary' | 'semantic' | 'neutral' | 'chart' | 'sidebar'
}

const colorData: ColorInfo[] = [
  // Primary Colors
  {
    name: 'Primary',
    variable: '--primary',
    cssVariable: 'var(--primary)',
    description: '주요 브랜드 색상',
    group: 'primary'
  },
  {
    name: 'Primary Foreground',
    variable: '--primary-foreground',
    cssVariable: 'var(--primary-foreground)',
    description: 'Primary 색상 위의 텍스트',
    group: 'primary'
  },
  {
    name: 'Secondary',
    variable: '--secondary',
    cssVariable: 'var(--secondary)',
    description: '보조 브랜드 색상',
    group: 'primary'
  },
  {
    name: 'Secondary Foreground',
    variable: '--secondary-foreground',
    cssVariable: 'var(--secondary-foreground)',
    description: 'Secondary 색상 위의 텍스트',
    group: 'primary'
  },
  {
    name: 'Accent',
    variable: '--accent',
    cssVariable: 'var(--accent)',
    description: '강조 색상',
    group: 'primary'
  },
  {
    name: 'Accent Foreground',
    variable: '--accent-foreground',
    cssVariable: 'var(--accent-foreground)',
    description: 'Accent 색상 위의 텍스트',
    group: 'primary'
  },
  
  // Semantic Colors
  {
    name: 'Destructive',
    variable: '--destructive',
    cssVariable: 'var(--destructive)',
    description: '경고 및 삭제 액션',
    group: 'semantic'
  },
  {
    name: 'Destructive Foreground',
    variable: '--destructive-foreground',
    cssVariable: 'var(--destructive-foreground)',
    description: 'Destructive 색상 위의 텍스트',
    group: 'semantic'
  },
  
  // Neutral Colors
  {
    name: 'Background',
    variable: '--background',
    cssVariable: 'var(--background)',
    description: '페이지 배경색',
    group: 'neutral'
  },
  {
    name: 'Foreground',
    variable: '--foreground',
    cssVariable: 'var(--foreground)',
    description: '기본 텍스트 색상',
    group: 'neutral'
  },
  {
    name: 'Card',
    variable: '--card',
    cssVariable: 'var(--card)',
    description: '카드 배경색',
    group: 'neutral'
  },
  {
    name: 'Card Foreground',
    variable: '--card-foreground',
    cssVariable: 'var(--card-foreground)',
    description: '카드 텍스트 색상',
    group: 'neutral'
  },
  {
    name: 'Muted',
    variable: '--muted',
    cssVariable: 'var(--muted)',
    description: '약한 배경색',
    group: 'neutral'
  },
  {
    name: 'Muted Foreground',
    variable: '--muted-foreground',
    cssVariable: 'var(--muted-foreground)',
    description: '약한 텍스트 색상',
    group: 'neutral'
  },
  {
    name: 'Border',
    variable: '--border',
    cssVariable: 'var(--border)',
    description: '테두리 색상',
    group: 'neutral'
  },
  {
    name: 'Input',
    variable: '--input',
    cssVariable: 'var(--input)',
    description: '입력 필드 배경색',
    group: 'neutral'
  },
  {
    name: 'Ring',
    variable: '--ring',
    cssVariable: 'var(--ring)',
    description: '포커스 링 색상',
    group: 'neutral'
  },
  
  // Chart Colors
  {
    name: 'Chart 1',
    variable: '--chart-1',
    cssVariable: 'var(--chart-1)',
    description: '차트 색상 1',
    group: 'chart'
  },
  {
    name: 'Chart 2',
    variable: '--chart-2',
    cssVariable: 'var(--chart-2)',
    description: '차트 색상 2',
    group: 'chart'
  },
  {
    name: 'Chart 3',
    variable: '--chart-3',
    cssVariable: 'var(--chart-3)',
    description: '차트 색상 3',
    group: 'chart'
  },
  {
    name: 'Chart 4',
    variable: '--chart-4',
    cssVariable: 'var(--chart-4)',
    description: '차트 색상 4',
    group: 'chart'
  },
  {
    name: 'Chart 5',
    variable: '--chart-5',
    cssVariable: 'var(--chart-5)',
    description: '차트 색상 5',
    group: 'chart'
  },
]

const groupNames = {
  primary: '주요 색상',
  semantic: '의미 색상',
  neutral: '중성 색상',
  chart: '차트 색상',
  sidebar: '사이드바 색상'
}

export function ColorPalette() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyToClipboard = async (text: string, colorName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedColor(colorName)
      setTimeout(() => setCopiedColor(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const groupedColors = colorData.reduce((acc, color) => {
    if (!acc[color.group]) {
      acc[color.group] = []
    }
    acc[color.group].push(color)
    return acc
  }, {} as Record<string, ColorInfo[]>)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">색상 시스템</h2>
        <p className="text-muted-foreground">
          CulinarySeoul의 디자인 시스템에서 사용하는 모든 색상입니다. 
          각 색상을 클릭하면 CSS 변수명이나 HSL 값을 복사할 수 있습니다.
        </p>
      </div>

      {Object.entries(groupedColors).map(([group, colors]) => (
        <div key={group}>
          <h3 className="text-xl font-semibold mb-4">{groupNames[group as keyof typeof groupNames]}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {colors.map((color) => (
              <Card key={color.variable} className="overflow-hidden hover:shadow-md transition-shadow">
                <div 
                  className="h-20 w-full cursor-pointer relative group"
                  style={{ backgroundColor: color.cssVariable }}
                  onClick={() => copyToClipboard(color.variable, color.name)}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                      {copiedColor === color.name ? '복사됨!' : 'CSS 변수 복사'}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{color.name}</h4>
                    {color.description && (
                      <p className="text-xs text-muted-foreground">{color.description}</p>
                    )}
                    <div className="space-y-1">
                      <button
                        onClick={() => copyToClipboard(color.variable, `${color.name}-var`)}
                        className="block w-full text-left text-xs font-mono text-muted-foreground hover:text-foreground transition-colors p-1 rounded bg-muted/50 hover:bg-muted"
                      >
                        var({color.variable})
                      </button>
                      <button
                        onClick={() => copyToClipboard(color.cssVariable, `${color.name}-css`)}
                        className="block w-full text-left text-xs font-mono text-muted-foreground hover:text-foreground transition-colors p-1 rounded bg-muted/50 hover:bg-muted"
                      >
                        {color.cssVariable}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">색상 사용 가이드</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">CSS 변수 사용법</h4>
              <code className="bg-background p-2 rounded block font-mono">
                color: var(--primary);<br/>
                background-color: var(--background);
              </code>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tailwind 클래스 사용법</h4>
              <code className="bg-background p-2 rounded block font-mono">
                className="bg-primary text-primary-foreground"<br/>
                className="text-muted-foreground"
              </code>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            💡 팁: 색상 카드를 클릭하면 CSS 변수명을, 하단의 값을 클릭하면 HSL 값을 복사할 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
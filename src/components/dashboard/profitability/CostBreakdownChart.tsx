import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart as PieChartIcon, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Sector
} from 'recharts'

interface CostData {
  name: string
  value: number
  percentage: number
  color?: string
  details?: {
    [key: string]: number
  }
}

interface CostBreakdownChartProps {
  data?: CostData[]
  loading?: boolean
  className?: string
  totalCost?: number
}

// 비용 카테고리별 색상
const COLORS = {
  재료비: 'hsl(var(--chart-1))',
  인건비: 'hsl(var(--chart-2))',
  임대료: 'hsl(var(--chart-3))',
  유틸리티: 'hsl(var(--chart-4))',
  마케팅: 'hsl(var(--chart-5))',
  기타: 'hsl(var(--muted-foreground))'
}

export function CostBreakdownChart({ 
  data = [], 
  loading, 
  className,
  totalCost
}: CostBreakdownChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            비용 구조 분석
            <PieChartIcon className="w-5 h-5 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse space-y-2 w-full">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-48 bg-muted rounded-full aspect-square mx-auto mt-4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 샘플 데이터 생성
  const generateSampleData = (): CostData[] => {
    const categories = [
      { name: '재료비', ratio: 0.35, details: { '식재료': 0.7, '포장재': 0.2, '소모품': 0.1 } },
      { name: '인건비', ratio: 0.30, details: { '급여': 0.8, '보험료': 0.15, '복리후생': 0.05 } },
      { name: '임대료', ratio: 0.15, details: { '월세': 0.9, '관리비': 0.1 } },
      { name: '유틸리티', ratio: 0.10, details: { '전기': 0.4, '가스': 0.3, '수도': 0.2, '통신': 0.1 } },
      { name: '마케팅', ratio: 0.06, details: { '온라인': 0.6, '오프라인': 0.3, '이벤트': 0.1 } },
      { name: '기타', ratio: 0.04, details: { '보험': 0.3, '수수료': 0.4, '기타': 0.3 } }
    ]
    
    const total = totalCost || 100000000 // 1억 기준
    
    return categories.map(cat => ({
      name: cat.name,
      value: Math.floor(total * cat.ratio),
      percentage: cat.ratio * 100,
      color: COLORS[cat.name as keyof typeof COLORS],
      details: Object.entries(cat.details).reduce((acc, [key, ratio]) => ({
        ...acc,
        [key]: Math.floor(total * cat.ratio * ratio)
      }), {})
    }))
  }

  const chartData = data.length > 0 ? data : generateSampleData()
  const calculatedTotal = totalCost || chartData.reduce((sum, d) => sum + d.value, 0)

  // 포맷터 함수
  const formatCurrency = (value: number) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억`
    } else if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)}천만`
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`
    }
    return value.toLocaleString()
  }

  // 커스텀 라벨
  const renderCustomLabel = (entry: any) => {
    const RADIAN = Math.PI / 180
    const radius = entry.innerRadius + (entry.outerRadius - entry.innerRadius) * 0.5
    const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN)
    const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > entry.cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {entry.percentage.toFixed(0)}%
      </text>
    )
  }

  // 활성 섹터 렌더링
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="hsl(var(--foreground))" className="text-xs">
          {`₩${formatCurrency(value)}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="hsl(var(--muted-foreground))" className="text-xs">
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    )
  }

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="bg-popover p-3 rounded-lg border shadow-lg">
          <p className="font-semibold text-sm mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-muted-foreground">금액:</span>
              <span className="font-medium">₩{formatCurrency(data.value)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-muted-foreground">비율:</span>
              <span className="font-medium">{data.percentage.toFixed(1)}%</span>
            </div>
          </div>
          {data.details && Object.keys(data.details).length > 0 && (
            <>
              <div className="border-t mt-2 pt-2">
                <p className="text-xs font-medium mb-1">세부 내역</p>
                {Object.entries(data.details).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-muted-foreground">{key}:</span>
                    <span>₩{formatCurrency(value as number)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )
    }
    return null
  }

  // 비용 효율성 계산 (예시)
  const calculateEfficiency = () => {
    const materialCost = chartData.find(d => d.name === '재료비')?.percentage || 0
    const laborCost = chartData.find(d => d.name === '인건비')?.percentage || 0
    const primeCost = materialCost + laborCost // 원가율
    
    if (primeCost <= 60) return { status: '우수', color: 'text-secondary' }
    if (primeCost <= 65) return { status: '양호', color: 'text-primary' }
    if (primeCost <= 70) return { status: '보통', color: 'text-muted-foreground' }
    return { status: '개선필요', color: 'text-destructive' }
  }

  const efficiency = calculateEfficiency()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          비용 구조 분석
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">총 비용:</span>
            <span className="font-semibold">₩{formatCurrency(calculatedTotal)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[entry.name as keyof typeof COLORS] || 'hsl(var(--muted))'} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* 비용 항목 리스트 */}
        <div className="mt-6 space-y-2">
          {chartData.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color || COLORS[item.name as keyof typeof COLORS] }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {item.percentage.toFixed(1)}%
                </span>
                <span className="text-sm font-medium">
                  ₩{formatCurrency(item.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* 비용 효율성 지표 */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">원가율 (재료비 + 인건비)</span>
            </div>
            <div className="text-right">
              <p className={cn("text-lg font-semibold", efficiency.color)}>
                {(
                  (chartData.find(d => d.name === '재료비')?.percentage || 0) +
                  (chartData.find(d => d.name === '인건비')?.percentage || 0)
                ).toFixed(1)}%
              </p>
              <p className={cn("text-xs", efficiency.color)}>
                {efficiency.status}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
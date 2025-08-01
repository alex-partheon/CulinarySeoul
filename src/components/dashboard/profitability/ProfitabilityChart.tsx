import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

interface ProfitabilityData {
  period: string
  revenue: number          // 매출
  costs: number           // 비용
  profit: number          // 순이익
  marginRate: number      // 이익률 (%)
  targetMarginRate?: number // 목표 이익률 (%)
}

interface ProfitabilityChartProps {
  data?: ProfitabilityData[]
  loading?: boolean
  className?: string
  showTarget?: boolean
}

export function ProfitabilityChart({ 
  data = [], 
  loading, 
  className,
  showTarget = true 
}: ProfitabilityChartProps) {
  
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            수익성 분석
            <Target className="w-5 h-5 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse space-y-2 w-full">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-48 bg-muted rounded mt-4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 샘플 데이터 생성
  const chartData = data.length > 0 ? data : Array.from({ length: 6 }, (_, i) => {
    const revenue = Math.floor(Math.random() * 50000000) + 100000000 // 1억-1.5억
    const costs = Math.floor(revenue * (0.6 + Math.random() * 0.2)) // 60-80% 비용
    const profit = revenue - costs
    const marginRate = (profit / revenue) * 100
    
    return {
      period: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', { 
        year: 'numeric',
        month: 'short'
      }),
      revenue,
      costs,
      profit,
      marginRate: Math.round(marginRate * 10) / 10,
      targetMarginRate: 25 // 25% 목표
    }
  })

  // 평균 계산
  const avgMarginRate = chartData.reduce((sum, d) => sum + d.marginRate, 0) / chartData.length
  const latestMargin = chartData[chartData.length - 1]?.marginRate || 0
  const targetMargin = chartData[0]?.targetMarginRate || 25

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

  const formatPercent = (value: number) => `${value}%`

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-3 rounded-lg border shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">
                {entry.dataKey === 'marginRate' || entry.dataKey === 'targetMarginRate' 
                  ? `${entry.value}%` 
                  : `₩${formatCurrency(entry.value)}`}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          수익성 분석
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">평균 이익률:</span>
              <span className={cn(
                "font-semibold",
                avgMarginRate >= targetMargin ? "text-secondary" : "text-destructive"
              )}>
                {avgMarginRate.toFixed(1)}%
              </span>
            </div>
            {latestMargin > avgMarginRate ? (
              <TrendingUp className="w-4 h-4 text-secondary" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={formatCurrency}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={formatPercent}
                domain={[0, 40]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="rect"
              />
              
              {/* 목표 이익률 기준선 */}
              {showTarget && (
                <ReferenceLine 
                  yAxisId="right"
                  y={targetMargin} 
                  stroke="hsl(var(--accent))"
                  strokeDasharray="5 5"
                  label={{ value: "목표", position: "right", fontSize: 12 }}
                />
              )}
              
              {/* 막대 차트 - 매출과 비용 */}
              <Bar 
                yAxisId="left"
                dataKey="revenue" 
                name="매출"
                fill="hsl(var(--chart-1))"
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                yAxisId="left"
                dataKey="costs" 
                name="비용"
                fill="hsl(var(--chart-4))"
                radius={[8, 8, 0, 0]}
              />
              
              {/* 라인 차트 - 이익률 */}
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="marginRate" 
                name="이익률"
                stroke="hsl(var(--chart-2))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                activeDot={{ r: 6 }}
              />
              
              {/* 목표 이익률 라인 (선택적) */}
              {showTarget && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="targetMarginRate" 
                  name="목표 이익률"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* 요약 정보 */}
        <div className="mt-6 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">최근 매출</p>
            <p className="text-lg font-semibold">
              ₩{formatCurrency(chartData[chartData.length - 1]?.revenue || 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">최근 순이익</p>
            <p className="text-lg font-semibold">
              ₩{formatCurrency(chartData[chartData.length - 1]?.profit || 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">이익률 추세</p>
            <p className={cn(
              "text-lg font-semibold flex items-center gap-1",
              latestMargin > avgMarginRate ? "text-secondary" : "text-destructive"
            )}>
              {latestMargin > avgMarginRate ? (
                <>
                  <TrendingUp className="w-4 h-4" />
                  상승
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4" />
                  하락
                </>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">목표 달성률</p>
            <p className={cn(
              "text-lg font-semibold",
              latestMargin >= targetMargin ? "text-secondary" : "text-muted-foreground"
            )}>
              {((latestMargin / targetMargin) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
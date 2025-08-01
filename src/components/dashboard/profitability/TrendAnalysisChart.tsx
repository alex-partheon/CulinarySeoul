import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

type PeriodType = 'daily' | 'weekly' | 'monthly'

interface TrendData {
  period: string
  currentRevenue: number    // 현재 기간 매출
  previousRevenue?: number  // 전년 동기 매출
  currentProfit: number     // 현재 기간 순이익
  previousProfit?: number   // 전년 동기 순이익
  currentMargin: number     // 현재 기간 이익률
  previousMargin?: number   // 전년 동기 이익률
}

interface TrendAnalysisChartProps {
  data?: TrendData[]
  loading?: boolean
  className?: string
  defaultPeriod?: PeriodType
}

export function TrendAnalysisChart({ 
  data = [], 
  loading, 
  className,
  defaultPeriod = 'monthly'
}: TrendAnalysisChartProps) {
  const [periodType, setPeriodType] = useState<PeriodType>(defaultPeriod)
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'profit' | 'margin'>('revenue')
  
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            수익성 추세 분석
            <CalendarDays className="w-5 h-5 text-primary" />
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

  // 기간별 샘플 데이터 생성
  const generateSampleData = (type: PeriodType): TrendData[] => {
    const count = type === 'daily' ? 30 : type === 'weekly' ? 12 : 12
    const baseRevenue = 100000000 // 1억 기준
    
    return Array.from({ length: count }, (_, i) => {
      const currentRevenue = baseRevenue + Math.random() * 50000000
      const previousRevenue = baseRevenue + Math.random() * 45000000
      const currentProfit = currentRevenue * (0.2 + Math.random() * 0.1)
      const previousProfit = previousRevenue * (0.18 + Math.random() * 0.1)
      
      let period = ''
      if (type === 'daily') {
        period = new Date(Date.now() - (count - 1 - i) * 24 * 60 * 60 * 1000)
          .toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
      } else if (type === 'weekly') {
        period = `${i + 1}주차`
      } else {
        period = new Date(Date.now() - (count - 1 - i) * 30 * 24 * 60 * 60 * 1000)
          .toLocaleDateString('ko-KR', { year: '2-digit', month: 'short' })
      }
      
      return {
        period,
        currentRevenue,
        previousRevenue,
        currentProfit,
        previousProfit,
        currentMargin: Math.round((currentProfit / currentRevenue) * 1000) / 10,
        previousMargin: Math.round((previousProfit / previousRevenue) * 1000) / 10
      }
    })
  }

  const chartData = data.length > 0 ? data : generateSampleData(periodType)

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

  // 메트릭별 데이터 키 설정
  const getDataKeys = () => {
    switch (selectedMetric) {
      case 'revenue':
        return {
          current: 'currentRevenue',
          previous: 'previousRevenue',
          formatter: formatCurrency,
          unit: '₩'
        }
      case 'profit':
        return {
          current: 'currentProfit',
          previous: 'previousProfit',
          formatter: formatCurrency,
          unit: '₩'
        }
      case 'margin':
        return {
          current: 'currentMargin',
          previous: 'previousMargin',
          formatter: (v: number) => `${v}%`,
          unit: '%'
        }
    }
  }

  const dataKeys = getDataKeys()

  // YoY 성장률 계산
  const calculateGrowth = () => {
    const lastIndex = chartData.length - 1
    const current = chartData[lastIndex]?.[dataKeys.current as keyof TrendData] as number || 0
    const previous = chartData[lastIndex]?.[dataKeys.previous as keyof TrendData] as number || 0
    
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const growthRate = calculateGrowth()

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
                {dataKeys.unit}{dataKeys.formatter(entry.value)}
              </span>
            </div>
          ))}
          {payload.length === 2 && (
            <div className="mt-2 pt-2 border-t text-xs">
              <span className="text-muted-foreground">YoY: </span>
              <span className={cn(
                "font-medium",
                payload[0].value > payload[1].value ? "text-secondary" : "text-destructive"
              )}>
                {payload[0].value > payload[1].value ? '+' : ''}{
                  ((payload[0].value - payload[1].value) / payload[1].value * 100).toFixed(1)
                }%
              </span>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>수익성 추세 분석</span>
          <div className="flex items-center gap-2">
            <Select value={selectedMetric} onValueChange={(v: any) => setSelectedMetric(v)}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">매출</SelectItem>
                <SelectItem value="profit">순이익</SelectItem>
                <SelectItem value="margin">이익률</SelectItem>
              </SelectContent>
            </Select>
            <Select value={periodType} onValueChange={(v: PeriodType) => setPeriodType(v)}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">일별</SelectItem>
                <SelectItem value="weekly">주별</SelectItem>
                <SelectItem value="monthly">월별</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                angle={periodType === 'daily' ? -45 : 0}
                textAnchor={periodType === 'daily' ? "end" : "middle"}
                height={periodType === 'daily' ? 60 : 40}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                tickFormatter={dataKeys.formatter}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                verticalAlign="top"
                height={36}
              />
              
              {/* 전년 동기 데이터 */}
              <Area
                type="monotone"
                dataKey={dataKeys.previous}
                name="전년 동기"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorPrevious)"
                strokeWidth={2}
              />
              
              {/* 현재 기간 데이터 */}
              <Area
                type="monotone"
                dataKey={dataKeys.current}
                name="현재"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorCurrent)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* YoY 성장률 요약 */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">전년 동기 대비 성장률</p>
              <p className={cn(
                "text-2xl font-bold flex items-center gap-2 mt-1",
                growthRate >= 0 ? "text-secondary" : "text-destructive"
              )}>
                {growthRate >= 0 ? (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    +{growthRate.toFixed(1)}%
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5" />
                    {growthRate.toFixed(1)}%
                  </>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                기간: {chartData[0]?.period} - {chartData[chartData.length - 1]?.period}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedMetric === 'revenue' && '매출 기준'}
                {selectedMetric === 'profit' && '순이익 기준'}
                {selectedMetric === 'margin' && '이익률 기준'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
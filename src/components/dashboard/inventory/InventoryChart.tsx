import React from 'react'
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
import { cn } from '@/lib/utils'

interface InventoryChartProps {
  data: Array<{
    date: string
    stockLevel?: number
    usage?: number
    projected?: number
    [key: string]: any
  }>
  title?: string
  description?: string
  height?: number
  series?: Array<{
    dataKey: string
    name: string
    color: string
    type?: 'monotone' | 'linear' | 'basis' | 'natural'
  }>
  className?: string
}

const defaultSeries = [
  { dataKey: 'stockLevel', name: '재고 수준', color: 'hsl(243 76% 59%)' },
  { dataKey: 'usage', name: '사용량', color: 'hsl(173 80% 40%)' },
  { dataKey: 'projected', name: '예상 재고', color: 'hsl(38 92% 50%)' }
]

export function InventoryChart({
  data,
  title,
  description,
  height = 300,
  series = defaultSeries,
  className
}: InventoryChartProps) {
  // Format number for Korean locale
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value)
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-popover p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-medium">{formatNumber(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            {series.map((s, index) => (
              <linearGradient
                key={s.dataKey}
                id={`gradient-${s.dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.3}
          />
          
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatNumber}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{
              paddingBottom: '20px',
              fontSize: '14px'
            }}
          />
          
          {series.map((s) => (
            <Area
              key={s.dataKey}
              type={s.type || 'monotone'}
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#gradient-${s.dataKey})`}
              fillOpacity={1}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
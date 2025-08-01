import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush
} from 'recharts';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Maximize2,
  Info
} from 'lucide-react';

interface DataPoint {
  period: string;
  [key: string]: any;
}

interface TrendAnalysisProps {
  title: string;
  data: DataPoint[];
  metrics: {
    key: string;
    name: string;
    color: string;
    type?: 'line' | 'bar' | 'area';
    yAxisId?: 'left' | 'right';
  }[];
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onPeriodChange?: (period: string) => void;
  showBrush?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  height?: number;
  referenceLines?: {
    y: number;
    label: string;
    color?: string;
  }[];
  insights?: {
    type: 'positive' | 'negative' | 'neutral';
    text: string;
  }[];
  onExport?: () => void;
  onExpand?: () => void;
}

export function TrendAnalysis({
  title,
  data,
  metrics,
  period = 'monthly',
  onPeriodChange,
  showBrush = false,
  showGrid = true,
  showLegend = true,
  height = 400,
  referenceLines = [],
  insights = [],
  onExport,
  onExpand
}: TrendAnalysisProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    metrics.map(m => m.key)
  );
  const [comparisonMode, setComparisonMode] = useState<'none' | 'previous' | 'target'>('none');

  const handlePeriodChange = (newPeriod: string) => {
    setSelectedPeriod(newPeriod as any);
    onPeriodChange?.(newPeriod);
  };

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey)
        ? prev.filter(k => k !== metricKey)
        : [...prev, metricKey]
    );
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString('ko-KR');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600">{entry.name}</span>
              </div>
              <span className="font-medium">{formatValue(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const hasMultipleTypes = new Set(metrics.map(m => m.type)).size > 1;
    const visibleMetrics = metrics.filter(m => selectedMetrics.includes(m.key));

    if (hasMultipleTypes) {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />}
            <XAxis 
              dataKey="period" 
              className="text-xs"
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              yAxisId="left"
              className="text-xs"
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={formatValue}
            />
            {visibleMetrics.some(m => m.yAxisId === 'right') && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                className="text-xs"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={formatValue}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
            
            {visibleMetrics.map((metric) => {
              if (metric.type === 'bar') {
                return (
                  <Bar
                    key={metric.key}
                    dataKey={metric.key}
                    name={metric.name}
                    fill={metric.color}
                    yAxisId={metric.yAxisId || 'left'}
                  />
                );
              } else if (metric.type === 'area') {
                return (
                  <Area
                    key={metric.key}
                    type="monotone"
                    dataKey={metric.key}
                    name={metric.name}
                    stroke={metric.color}
                    fill={metric.color}
                    fillOpacity={0.1}
                    yAxisId={metric.yAxisId || 'left'}
                  />
                );
              } else {
                return (
                  <Line
                    key={metric.key}
                    type="monotone"
                    dataKey={metric.key}
                    name={metric.name}
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    yAxisId={metric.yAxisId || 'left'}
                  />
                );
              }
            })}
            
            {referenceLines.map((line, index) => (
              <ReferenceLine
                key={index}
                y={line.y}
                yAxisId="left"
                stroke={line.color || '#EF4444'}
                strokeDasharray="5 5"
                label={{ value: line.label, position: 'right', fill: '#6B7280', fontSize: 12 }}
              />
            ))}
            
            {showBrush && <Brush dataKey="period" height={30} stroke="#8884d8" />}
          </ComposedChart>
        </ResponsiveContainer>
      );
    }

    // Single type chart
    const chartType = visibleMetrics[0]?.type || 'line';
    const ChartComponent = chartType === 'bar' ? BarChart : chartType === 'area' ? AreaChart : LineChart;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />}
          <XAxis 
            dataKey="period" 
            className="text-xs"
            tick={{ fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
          
          {visibleMetrics.map((metric) => {
            if (chartType === 'bar') {
              return (
                <Bar
                  key={metric.key}
                  dataKey={metric.key}
                  name={metric.name}
                  fill={metric.color}
                />
              );
            } else if (chartType === 'area') {
              return (
                <Area
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.name}
                  stroke={metric.color}
                  fill={metric.color}
                  fillOpacity={0.1}
                />
              );
            } else {
              return (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.name}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              );
            }
          })}
          
          {referenceLines.map((line, index) => (
            <ReferenceLine
              key={index}
              y={line.y}
              stroke={line.color || '#EF4444'}
              strokeDasharray="5 5"
              label={{ value: line.label, position: 'right', fill: '#6B7280', fontSize: 12 }}
            />
          ))}
          
          {showBrush && <Brush dataKey="period" height={30} stroke="#8884d8" />}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {onPeriodChange && (
              <Tabs value={selectedPeriod} onValueChange={handlePeriodChange}>
                <TabsList className="h-8">
                  <TabsTrigger value="daily" className="text-xs">일별</TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs">주별</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs">월별</TabsTrigger>
                  <TabsTrigger value="yearly" className="text-xs">연별</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            <Select value={comparisonMode} onValueChange={(v) => setComparisonMode(v as any)}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">비교 없음</SelectItem>
                <SelectItem value="previous">전기 대비</SelectItem>
                <SelectItem value="target">목표 대비</SelectItem>
              </SelectContent>
            </Select>
            {onExpand && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExpand}
                className="h-8 px-2"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
            {onExport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExport}
                className="h-8 px-2"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Metric Toggles */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {metrics.map((metric) => (
            <Badge
              key={metric.key}
              variant={selectedMetrics.includes(metric.key) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleMetric(metric.key)}
              style={{
                backgroundColor: selectedMetrics.includes(metric.key) ? metric.color : undefined,
                borderColor: metric.color,
                color: selectedMetrics.includes(metric.key) ? 'white' : metric.color
              }}
            >
              {metric.name}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {renderChart()}
        
        {/* Insights */}
        {insights.length > 0 && (
          <div className="mt-4 space-y-2 border-t pt-4">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Info className="h-4 w-4" />
              주요 인사이트
            </h4>
            {insights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2 text-xs p-2 rounded-lg",
                  insight.type === 'positive' && "bg-green-50 text-green-700",
                  insight.type === 'negative' && "bg-red-50 text-red-700",
                  insight.type === 'neutral' && "bg-gray-50 text-gray-700"
                )}
              >
                {insight.type === 'positive' && <TrendingUp className="h-3 w-3 mt-0.5" />}
                {insight.type === 'negative' && <TrendingDown className="h-3 w-3 mt-0.5" />}
                <span>{insight.text}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface SummaryChartProps {
  title: string;
  data: ChartData[];
  type?: 'area' | 'bar' | 'line' | 'pie';
  dataKeys?: string[];
  colors?: string[];
  period?: 'day' | 'week' | 'month' | 'year';
  onPeriodChange?: (period: string) => void;
  showLegend?: boolean;
  showGrid?: boolean;
  height?: number;
  className?: string;
  summary?: {
    total: number | string;
    change: number;
    changeType: 'increase' | 'decrease';
  };
  onExport?: () => void;
}

export function SummaryChart({
  title,
  data,
  type = 'area',
  dataKeys = ['value'],
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  period = 'week',
  onPeriodChange,
  showLegend = true,
  showGrid = true,
  height = 300,
  className,
  summary,
  onExport
}: SummaryChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const handlePeriodChange = (newPeriod: string) => {
    setSelectedPeriod(newPeriod as any);
    onPeriodChange?.(newPeriod);
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const formatTooltipValue = (value: number) => {
    return value.toLocaleString('ko-KR');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <span 
                className="text-xs text-gray-600 flex items-center gap-1"
                style={{ color: entry.color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </span>
              <span className="text-xs font-medium text-gray-900">
                {formatTooltipValue(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />}
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
              {dataKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />}
              <XAxis 
                dataKey="name"
                className="text-xs"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />}
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {summary && (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">
                  {typeof summary.total === 'number' 
                    ? summary.total.toLocaleString('ko-KR') 
                    : summary.total}
                </span>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "flex items-center gap-1",
                    summary.changeType === 'increase' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  )}
                >
                  {summary.changeType === 'increase' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {summary.change > 0 ? '+' : ''}{summary.change}%
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onPeriodChange && (
              <Tabs value={selectedPeriod} onValueChange={handlePeriodChange}>
                <TabsList className="h-8">
                  <TabsTrigger value="day" className="text-xs px-3 py-1">일</TabsTrigger>
                  <TabsTrigger value="week" className="text-xs px-3 py-1">주</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs px-3 py-1">월</TabsTrigger>
                  <TabsTrigger value="year" className="text-xs px-3 py-1">년</TabsTrigger>
                </TabsList>
              </Tabs>
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
      </CardHeader>
      <CardContent className="pt-0">
        {renderChart()}
      </CardContent>
    </Card>
  );
}
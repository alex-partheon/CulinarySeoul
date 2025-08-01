// TASK-014: 구글 애널리틱스 위젯 컴포넌트

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BrandAnalyticsManager } from '../../domains/analytics/brand-analytics-manager';
import { BrandAnalytics, DateRange } from '../../types/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, Clock } from 'lucide-react';

interface GoogleAnalyticsWidgetProps {
  brandId: string;
  className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const GoogleAnalyticsWidget: React.FC<GoogleAnalyticsWidgetProps> = ({
  brandId,
  className = ''
}) => {
  const [analytics, setAnalytics] = useState<BrandAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일 전
    endDate: new Date()
  });
  const [analyticsManager] = useState(() => new BrandAnalyticsManager());

  useEffect(() => {
    loadAnalyticsData();
  }, [brandId, dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await analyticsManager.getBrandAnalytics(brandId, dateRange);
      setAnalytics(data);
    } catch (err) {
      console.error('구글 애널리틱스 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadAnalyticsData();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getTrendColor = (trend: number): string => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded" />
            구글 애널리틱스
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded" />
            구글 애널리틱스
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={refreshData} variant="outline">
              다시 시도
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded" />
            구글 애널리틱스
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">구글 애널리틱스가 설정되지 않았습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded" />
            구글 애널리틱스
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
            </Badge>
            <Button onClick={refreshData} variant="outline" size="sm">
              새로고침
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="pages">페이지</TabsTrigger>
            <TabsTrigger value="traffic">트래픽</TabsTrigger>
            <TabsTrigger value="devices">디바이스</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* 주요 지표 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">방문자</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(analytics.website.totalUsers)}</div>
                {analytics.website.usersTrend !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(analytics.website.usersTrend)}`}>
                    {getTrendIcon(analytics.website.usersTrend)}
                    {formatPercentage(Math.abs(analytics.website.usersTrend))}
                  </div>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">페이지뷰</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(analytics.website.totalPageViews)}</div>
                {analytics.website.pageViewsTrend !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(analytics.website.pageViewsTrend)}`}>
                    {getTrendIcon(analytics.website.pageViewsTrend)}
                    {formatPercentage(Math.abs(analytics.website.pageViewsTrend))}
                  </div>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointer className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">세션</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(analytics.website.totalSessions)}</div>
                {analytics.website.sessionsTrend !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(analytics.website.sessionsTrend)}`}>
                    {getTrendIcon(analytics.website.sessionsTrend)}
                    {formatPercentage(Math.abs(analytics.website.sessionsTrend))}
                  </div>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">이탈률</span>
                </div>
                <div className="text-2xl font-bold">{formatPercentage(analytics.website.bounceRate)}</div>
                {analytics.website.bounceRateTrend !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(-analytics.website.bounceRateTrend)}`}>
                    {getTrendIcon(-analytics.website.bounceRateTrend)}
                    {formatPercentage(Math.abs(analytics.website.bounceRateTrend))}
                  </div>
                )}
              </div>
            </div>

            {/* 일별 트렌드 차트 */}
            {analytics.website.dailyData && analytics.website.dailyData.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">일별 방문자 추이</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.website.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <h4 className="text-lg font-semibold">인기 페이지</h4>
            {analytics.website.topPages && analytics.website.topPages.length > 0 ? (
              <div className="space-y-2">
                {analytics.website.topPages.slice(0, 10).map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium truncate">{page.page}</div>
                      <div className="text-sm text-gray-500">{formatNumber(page.pageViews)} 페이지뷰</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatNumber(page.uniquePageViews)}</div>
                      <div className="text-sm text-gray-500">순 방문</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">페이지 데이터가 없습니다.</p>
            )}
          </TabsContent>

          <TabsContent value="traffic" className="space-y-4">
            <h4 className="text-lg font-semibold">트래픽 소스</h4>
            {analytics.website.trafficSources && analytics.website.trafficSources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.website.trafficSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="sessions"
                      >
                        {analytics.website.trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {analytics.website.trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatNumber(source.sessions)}</div>
                        <div className="text-sm text-gray-500">세션</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">트래픽 소스 데이터가 없습니다.</p>
            )}
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <h4 className="text-lg font-semibold">디바이스 분석</h4>
            {analytics.website.deviceBreakdown && analytics.website.deviceBreakdown.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.website.deviceBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="deviceCategory" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {analytics.website.deviceBreakdown.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{device.deviceCategory}</span>
                      <div className="text-right">
                        <div className="font-medium">{formatNumber(device.sessions)}</div>
                        <div className="text-sm text-gray-500">
                          {formatPercentage((device.sessions / analytics.website.totalSessions) * 100)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">디바이스 데이터가 없습니다.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
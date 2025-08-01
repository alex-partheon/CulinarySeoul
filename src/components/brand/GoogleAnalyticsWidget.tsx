// TASK-014: Google Analytics 위젯 컴포넌트

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { WebsiteAnalytics } from '../../types/brand-analytics';

interface GoogleAnalyticsWidgetProps {
  brandId: string;
  analytics?: WebsiteAnalytics;
}

export const GoogleAnalyticsWidget: React.FC<GoogleAnalyticsWidgetProps> = ({
  brandId,
  analytics
}) => {
  const [data, setData] = useState<WebsiteAnalytics | null>(analytics || null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/brand/${brandId}/analytics?type=website`);
      if (!response.ok) {
        throw new Error('Failed to fetch website analytics');
      }
      const result = await response.json();
      setData(result.data);
    } catch (error: any) {
      console.error('Error fetching website analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!analytics) {
      fetchAnalytics();
    }
  }, [brandId, analytics]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>웹사이트 분석</CardTitle>
            <CardDescription>Google Analytics 데이터를 불러오는 중...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>웹사이트 분석</CardTitle>
            <CardDescription>Google Analytics 설정이 필요합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                웹사이트 트래픽 분석을 위해 Google Analytics를 연동하세요
              </p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Google Analytics 설정하기
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">웹사이트 분석</h2>
          <p className="text-muted-foreground">Google Analytics 데이터</p>
        </div>
        <Badge variant="outline">연결됨</Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 방문자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalVisitors?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              {data.visitorsGrowth ? `${data.visitorsGrowth > 0 ? '+' : ''}${(data.visitorsGrowth * 100).toFixed(1)}% from last month` : 'No growth data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">페이지 뷰</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pageViews?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              {data.averageSessionDuration || '0s'} avg session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이탈률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bounceRate ? (data.bounceRate * 100).toFixed(1) : '0'}%</div>
            <p className="text-xs text-muted-foreground">세션 기준</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전환율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.conversionRate ? (data.conversionRate * 100).toFixed(1) : '0'}%</div>
            <p className="text-xs text-muted-foreground">목표 달성률</p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>트래픽 소스</CardTitle>
            <CardDescription>방문자 유입 경로</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.trafficSources?.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{source.visitors.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((source.visitors / data.totalVisitors) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center text-muted-foreground">
                  트래픽 소스 데이터가 없습니다
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>디바이스 분석</CardTitle>
            <CardDescription>사용자 디바이스 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.deviceBreakdown?.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium capitalize">{device.deviceType}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{device.sessions.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {device.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center text-muted-foreground">
                  디바이스 분석 데이터가 없습니다
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>인기 페이지</CardTitle>
          <CardDescription>가장 많이 방문한 페이지</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topPages?.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium">{page.path}</div>
                  <div className="text-xs text-muted-foreground">{page.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{page.pageViews.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {page.averageTimeOnPage}
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center text-muted-foreground">
                페이지 분석 데이터가 없습니다
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>성과 트렌드</CardTitle>
          <CardDescription>지난 30일간 웹사이트 성과</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.performanceTrend?.map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{trend.date}</span>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    방문자: <span className="font-medium">{trend.visitors}</span>
                  </div>
                  <div className="text-sm">
                    페이지뷰: <span className="font-medium">{trend.pageViews}</span>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center text-muted-foreground">
                트렌드 데이터가 없습니다
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAnalyticsWidget;
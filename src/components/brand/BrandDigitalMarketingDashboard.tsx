// TASK-014: 브랜드 디지털 마케팅 통합 대시보드 컴포넌트

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { GoogleAnalyticsWidget } from './GoogleAnalyticsWidget';
import { InstagramAnalyticsWidget } from './InstagramAnalyticsWidget';
import type { 
  CombinedAnalytics, 
  WebsiteAnalytics, 
  InstagramAnalytics,
  BrandInstagramAccount 
} from '../../types/brand-analytics';

interface BrandDigitalMarketingDashboardProps {
  brandId: string;
  analytics?: CombinedAnalytics;
  onRefresh?: () => void;
}

export const BrandDigitalMarketingDashboard: React.FC<BrandDigitalMarketingDashboardProps> = ({
  brandId,
  analytics,
  onRefresh
}) => {
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleInstagramAccountAdd = async (accountData: any) => {
    try {
      const response = await fetch(`/api/brand/${brandId}/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      });

      if (!response.ok) {
        throw new Error('Failed to add Instagram account');
      }

      // Refresh analytics data
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      console.error('Error adding Instagram account:', error);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const response = await fetch(`/api/brand/${brandId}/analytics/sync`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to sync data');
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      console.error('Error syncing data:', error);
    } finally {
      setSyncing(false);
    }
  };

  const renderOverview = () => {
    if (!analytics) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 방문자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">데이터 없음</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">인스타그램 팔로워</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">데이터 없음</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 참여율</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">데이터 없음</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전환율</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">데이터 없음</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    const websiteVisitors = analytics.website?.totalVisitors || 0;
    const instagramFollowers = analytics.instagram?.followersCount || 0;
    const avgEngagementRate = analytics.instagram?.averageEngagementRate || 0;
    const conversionRate = analytics.website?.conversionRate || 0;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 방문자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{websiteVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">지난 30일</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">인스타그램 팔로워</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instagramFollowers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">현재</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 참여율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgEngagementRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">인스타그램</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전환율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(conversionRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">웹사이트</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">디지털 마케팅 분석</h1>
          <p className="text-muted-foreground">
            웹사이트와 소셜미디어 성과를 한눈에 확인하세요
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {analytics ? '연결됨' : '설정 필요'}
          </Badge>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {syncing ? '동기화 중...' : '데이터 동기화'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="website">웹사이트 분석</TabsTrigger>
          <TabsTrigger value="instagram">인스타그램 분석</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {renderOverview()}
          
          {/* Quick Insights */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>주요 인사이트</CardTitle>
                <CardDescription>최근 성과 요약</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">웹사이트 트래픽</span>
                    <span className="text-sm font-medium">
                      {analytics?.website ? '정상' : '설정 필요'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">인스타그램 연동</span>
                    <span className="text-sm font-medium">
                      {analytics?.instagram ? '연결됨' : '설정 필요'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">데이터 동기화</span>
                    <span className="text-sm font-medium">
                      {analytics ? '최신' : '필요'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>권장 사항</CardTitle>
                <CardDescription>성과 개선을 위한 제안</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {!analytics?.website && (
                    <div className="p-2 bg-yellow-50 text-yellow-800 rounded">
                      Google Analytics 연동을 설정하세요
                    </div>
                  )}
                  {!analytics?.instagram && (
                    <div className="p-2 bg-blue-50 text-blue-800 rounded">
                      인스타그램 계정을 연결하세요
                    </div>
                  )}
                  {analytics && (
                    <div className="p-2 bg-green-50 text-green-800 rounded">
                      모든 분석 도구가 정상 작동 중입니다
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="website" className="space-y-4">
          <GoogleAnalyticsWidget 
            brandId={brandId}
            analytics={analytics?.website}
          />
        </TabsContent>

        <TabsContent value="instagram" className="space-y-4">
          <InstagramAnalyticsWidget 
            brandId={brandId}
            analytics={analytics?.instagram}
            onAccountAdd={handleInstagramAccountAdd}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>분석 설정</CardTitle>
              <CardDescription>
                Google Analytics 및 인스타그램 연동 설정을 관리합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Google Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    웹사이트 트래픽 분석을 위해 Google Analytics를 연동하세요
                  </p>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                    GA 설정하기
                  </button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">인스타그램 연동</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    인스타그램 비즈니스 계정을 연결하여 성과를 분석하세요
                  </p>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                    인스타그램 연결하기
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandDigitalMarketingDashboard;
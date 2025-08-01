// TASK-014: 브랜드 디지털 마케팅 대시보드 컴포넌트

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { GoogleAnalyticsWidget } from './GoogleAnalyticsWidget';
import { InstagramAnalyticsWidget } from './InstagramAnalyticsWidget';
import { BrandAnalyticsManager } from '../../domains/analytics/brand-analytics-manager';
import { InstagramAccountManager } from '../../domains/analytics/instagram-account-manager';
import { DateRange } from '../../types/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Settings, 
  RefreshCw,
  Calendar,
  BarChart3,
  Instagram,
  Globe
} from 'lucide-react';

interface BrandDigitalMarketingDashboardProps {
  brandId: string;
  className?: string;
}

interface OverviewMetrics {
  websiteUsers: number;
  websitePageViews: number;
  instagramFollowers: number;
  instagramEngagement: number;
  totalReach: number;
  conversionRate: number;
}

interface CombinedAnalytics {
  overview: OverviewMetrics;
  trends: {
    date: string;
    websiteUsers: number;
    instagramEngagement: number;
  }[];
  topPerformingContent: {
    type: 'website' | 'instagram';
    title: string;
    metric: number;
    metricType: string;
  }[];
}

export const BrandDigitalMarketingDashboard: React.FC<BrandDigitalMarketingDashboardProps> = ({
  brandId,
  className = ''
}) => {
  const [combinedAnalytics, setCombinedAnalytics] = useState<CombinedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일 전
    endDate: new Date()
  });
  const [analyticsManager] = useState(() => new BrandAnalyticsManager());
  const [accountManager] = useState(() => new InstagramAccountManager());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCombinedAnalytics();
  }, [brandId, dateRange]);

  const loadCombinedAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 웹사이트 및 인스타그램 데이터 병렬 로드
      const [websiteData, instagramData] = await Promise.allSettled([
        analyticsManager.getBrandAnalytics(brandId, dateRange),
        analyticsManager.getInstagramAnalytics(brandId, dateRange)
      ]);

      const website = websiteData.status === 'fulfilled' ? websiteData.value : null;
      const instagram = instagramData.status === 'fulfilled' ? instagramData.value : null;

      // 통합 분석 데이터 생성
      const combined: CombinedAnalytics = {
        overview: {
          websiteUsers: website?.website.totalUsers || 0,
          websitePageViews: website?.website.totalPageViews || 0,
          instagramFollowers: instagram?.followersCount || 0,
          instagramEngagement: instagram?.totalLikes + instagram?.totalComments || 0,
          totalReach: (website?.website.totalUsers || 0) + (instagram?.followersCount || 0),
          conversionRate: website?.website.conversionRate || 0
        },
        trends: generateCombinedTrends(website, instagram),
        topPerformingContent: generateTopContent(website, instagram)
      };

      setCombinedAnalytics(combined);
    } catch (err) {
      console.error('통합 분석 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const refreshAllData = async () => {
    try {
      setRefreshing(true);
      
      // 인스타그램 데이터 동기화
      try {
        await accountManager.syncInstagramData(brandId);
      } catch (err) {
        console.warn('인스타그램 동기화 실패:', err);
      }
      
      // 분석 데이터 새로고침
      await loadCombinedAnalytics();
    } catch (err) {
      console.error('데이터 새로고침 실패:', err);
      setError(err instanceof Error ? err.message : '새로고침에 실패했습니다.');
    } finally {
      setRefreshing(false);
    }
  };

  const generateCombinedTrends = (website: any, instagram: any) => {
    const trends = [];
    const days = 7; // 최근 7일
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      // 웹사이트 일별 데이터 찾기
      const websiteDay = website?.website.dailyData?.find((d: any) => 
        d.date === dateStr
      );
      
      // 인스타그램 일별 데이터 찾기
      const instagramDay = instagram?.dailyEngagement?.find((d: any) => 
        d.date === dateStr
      );
      
      trends.push({
        date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        websiteUsers: websiteDay?.users || 0,
        instagramEngagement: instagramDay?.engagement || 0
      });
    }
    
    return trends;
  };

  const generateTopContent = (website: any, instagram: any) => {
    const content = [];
    
    // 웹사이트 인기 페이지
    if (website?.website.topPages) {
      website.website.topPages.slice(0, 3).forEach((page: any) => {
        content.push({
          type: 'website' as const,
          title: page.page,
          metric: page.pageViews,
          metricType: '페이지뷰'
        });
      });
    }
    
    // 인스타그램 인기 포스트
    if (instagram?.topPosts) {
      instagram.topPosts.slice(0, 3).forEach((post: any) => {
        content.push({
          type: 'instagram' as const,
          title: post.caption ? post.caption.substring(0, 50) + '...' : '포스트',
          metric: post.likesCount + post.commentsCount,
          metricType: '총 참여'
        });
      });
    }
    
    return content.sort((a, b) => b.metric - a.metric).slice(0, 6);
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

  if (loading) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              디지털 마케팅 대시보드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              디지털 마케팅 대시보드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadCombinedAnalytics} variant="outline">
                다시 시도
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-500" />
                디지털 마케팅 대시보드
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                웹사이트 및 인스타그램 통합 분석
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
              </Badge>
              <Button 
                onClick={refreshAllData} 
                variant="outline" 
                size="sm"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? '새로고침 중...' : '새로고침'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 통합 개요 */}
      {combinedAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>통합 개요</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">웹사이트 방문자</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(combinedAnalytics.overview.websiteUsers)}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">페이지뷰</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(combinedAnalytics.overview.websitePageViews)}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <span className="text-sm font-medium">인스타 팔로워</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(combinedAnalytics.overview.instagramFollowers)}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">인스타 참여</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(combinedAnalytics.overview.instagramEngagement)}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">총 도달</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(combinedAnalytics.overview.totalReach)}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">전환율</span>
                </div>
                <div className="text-2xl font-bold">{formatPercentage(combinedAnalytics.overview.conversionRate)}</div>
              </div>
            </div>
            
            {/* 통합 트렌드 차트 */}
            {combinedAnalytics.trends.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">통합 성과 추이</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={combinedAnalytics.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="websiteUsers" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="웹사이트 방문자"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="instagramEngagement" 
                      stroke="#E1306C" 
                      strokeWidth={2}
                      name="인스타그램 참여"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* 인기 콘텐츠 */}
            {combinedAnalytics.topPerformingContent.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">인기 콘텐츠</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {combinedAnalytics.topPerformingContent.map((content, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {content.type === 'website' ? (
                          <Globe className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Instagram className="h-4 w-4 text-pink-500" />
                        )}
                        <Badge variant="outline">
                          {content.type === 'website' ? '웹사이트' : '인스타그램'}
                        </Badge>
                      </div>
                      <div className="font-medium text-sm mb-1 line-clamp-2">
                        {content.title}
                      </div>
                      <div className="text-lg font-bold">
                        {formatNumber(content.metric)} {content.metricType}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 상세 분석 탭 */}
      <Tabs defaultValue="combined" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="combined">통합 분석</TabsTrigger>
          <TabsTrigger value="website">웹사이트</TabsTrigger>
          <TabsTrigger value="instagram">인스타그램</TabsTrigger>
        </TabsList>

        <TabsContent value="combined" className="space-y-4">
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">통합 분석 기능은 위의 개요 섹션에서 확인하실 수 있습니다.</p>
          </div>
        </TabsContent>

        <TabsContent value="website" className="space-y-4">
          <GoogleAnalyticsWidget brandId={brandId} />
        </TabsContent>

        <TabsContent value="instagram" className="space-y-4">
          <InstagramAnalyticsWidget brandId={brandId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
// TASK-014: 인스타그램 애널리틱스 위젯 컴포넌트

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BrandAnalyticsManager } from '../../domains/analytics/brand-analytics-manager';
import { InstagramAccountManager } from '../../domains/analytics/instagram-account-manager';
import { InstagramAnalytics, DateRange } from '../../types/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Instagram, Heart, MessageCircle, Share, Users, TrendingUp, TrendingDown, Settings, RefreshCw } from 'lucide-react';

interface InstagramAnalyticsWidgetProps {
  brandId: string;
  className?: string;
}

const COLORS = ['#E1306C', '#F56040', '#FCAF45', '#405DE6', '#833AB4'];

export const InstagramAnalyticsWidget: React.FC<InstagramAnalyticsWidgetProps> = ({
  brandId,
  className = ''
}) => {
  const [analytics, setAnalytics] = useState<InstagramAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<{
    isConnected: boolean;
    isTokenValid: boolean;
    lastSync?: string;
    username?: string;
  }>({ isConnected: false, isTokenValid: false });
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일 전
    endDate: new Date()
  });
  const [analyticsManager] = useState(() => new BrandAnalyticsManager());
  const [accountManager] = useState(() => new InstagramAccountManager());

  useEffect(() => {
    checkAccountStatus();
  }, [brandId]);

  useEffect(() => {
    if (accountStatus.isConnected && accountStatus.isTokenValid) {
      loadAnalyticsData();
    }
  }, [brandId, dateRange, accountStatus.isConnected, accountStatus.isTokenValid]);

  const checkAccountStatus = async () => {
    try {
      const status = await accountManager.checkAccountStatus(brandId);
      setAccountStatus(status);
    } catch (err) {
      console.error('인스타그램 계정 상태 확인 실패:', err);
      setAccountStatus({ isConnected: false, isTokenValid: false });
    }
  };

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await analyticsManager.getInstagramAnalytics(brandId, dateRange);
      setAnalytics(data);
    } catch (err) {
      console.error('인스타그램 애널리틱스 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const syncInstagramData = async () => {
    try {
      setLoading(true);
      await accountManager.syncInstagramData(brandId);
      await loadAnalyticsData();
      await checkAccountStatus();
    } catch (err) {
      console.error('인스타그램 데이터 동기화 실패:', err);
      setError(err instanceof Error ? err.message : '동기화에 실패했습니다.');
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (!accountStatus.isConnected) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-6 w-6 text-pink-500" />
            인스타그램 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Instagram className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">인스타그램 계정이 연결되지 않았습니다.</p>
            <Button onClick={() => {/* 계정 연결 모달 열기 */}} className="bg-pink-500 hover:bg-pink-600">
              <Instagram className="h-4 w-4 mr-2" />
              인스타그램 연결
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!accountStatus.isTokenValid) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-6 w-6 text-pink-500" />
            인스타그램 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-yellow-500 mb-4">
              <Settings className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500 mb-4">인스타그램 액세스 토큰이 만료되었습니다.</p>
            <Button onClick={() => {/* 토큰 갱신 */}} variant="outline">
              토큰 갱신
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-6 w-6 text-pink-500" />
            인스타그램 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
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
            <Instagram className="h-6 w-6 text-pink-500" />
            인스타그램 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={loadAnalyticsData} variant="outline">
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
            <Instagram className="h-6 w-6 text-pink-500" />
            인스타그램 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">인스타그램 데이터가 없습니다.</p>
            <Button onClick={syncInstagramData} className="mt-4" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              데이터 동기화
            </Button>
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
            <Instagram className="h-6 w-6 text-pink-500" />
            인스타그램 분석
            {accountStatus.username && (
              <Badge variant="outline" className="text-pink-600">
                @{accountStatus.username}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {accountStatus.lastSync && (
              <Badge variant="secondary" className="text-xs">
                마지막 동기화: {formatDate(accountStatus.lastSync)}
              </Badge>
            )}
            <Button onClick={syncInstagramData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              동기화
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="posts">포스트</TabsTrigger>
            <TabsTrigger value="engagement">참여도</TabsTrigger>
            <TabsTrigger value="growth">성장</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* 주요 지표 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-pink-500" />
                  <span className="text-sm font-medium">팔로워</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(analytics.followersCount)}</div>
                {analytics.followersTrend !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(analytics.followersTrend)}`}>
                    {getTrendIcon(analytics.followersTrend)}
                    {formatPercentage(Math.abs(analytics.followersTrend))}
                  </div>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">총 좋아요</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(analytics.totalLikes)}</div>
                {analytics.likesTrend !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(analytics.likesTrend)}`}>
                    {getTrendIcon(analytics.likesTrend)}
                    {formatPercentage(Math.abs(analytics.likesTrend))}
                  </div>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">총 댓글</span>
                </div>
                <div className="text-2xl font-bold">{formatNumber(analytics.totalComments)}</div>
                {analytics.commentsTrend !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(analytics.commentsTrend)}`}>
                    {getTrendIcon(analytics.commentsTrend)}
                    {formatPercentage(Math.abs(analytics.commentsTrend))}
                  </div>
                )}
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Share className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">참여율</span>
                </div>
                <div className="text-2xl font-bold">{formatPercentage(analytics.engagementRate)}</div>
                {analytics.engagementTrend !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(analytics.engagementTrend)}`}>
                    {getTrendIcon(analytics.engagementTrend)}
                    {formatPercentage(Math.abs(analytics.engagementTrend))}
                  </div>
                )}
              </div>
            </div>

            {/* 일별 참여도 차트 */}
            {analytics.dailyEngagement && analytics.dailyEngagement.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">일별 참여도 추이</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.dailyEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="#E1306C" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            <h4 className="text-lg font-semibold">인기 포스트</h4>
            {analytics.topPosts && analytics.topPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.topPosts.slice(0, 9).map((post, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    {post.thumbnailUrl && (
                      <img 
                        src={post.thumbnailUrl} 
                        alt="Post thumbnail" 
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{post.mediaType}</Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(post.timestamp)}
                        </span>
                      </div>
                      {post.caption && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {post.caption.length > 100 ? `${post.caption.substring(0, 100)}...` : post.caption}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          {formatNumber(post.likesCount)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                          {formatNumber(post.commentsCount)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Share className="h-4 w-4 text-green-500" />
                          {formatPercentage(post.engagementRate)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">포스트 데이터가 없습니다.</p>
            )}
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <h4 className="text-lg font-semibold">참여도 분석</h4>
            {analytics.engagementByType && analytics.engagementByType.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3">미디어 타입별 참여도</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.engagementByType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mediaType" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgEngagement" fill="#E1306C" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h5 className="font-medium mb-3">참여도 분포</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.engagementByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ mediaType, percent }) => `${mediaType} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="avgEngagement"
                      >
                        {analytics.engagementByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">참여도 데이터가 없습니다.</p>
            )}
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <h4 className="text-lg font-semibold">성장 분석</h4>
            {analytics.growthMetrics ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">주간 성장률</div>
                  <div className="text-2xl font-bold">{formatPercentage(analytics.growthMetrics.weeklyGrowth)}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">월간 성장률</div>
                  <div className="text-2xl font-bold">{formatPercentage(analytics.growthMetrics.monthlyGrowth)}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">평균 포스트 성과</div>
                  <div className="text-2xl font-bold">{formatNumber(analytics.growthMetrics.avgPostPerformance)}</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">성장 데이터가 없습니다.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
// TASK-014: Instagram 분석 위젯 컴포넌트

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { InstagramAnalytics, BrandInstagramAccount } from '../../types/brand-analytics';

interface InstagramAnalyticsWidgetProps {
  brandId: string;
  analytics?: InstagramAnalytics;
  onAccountAdd?: (accountData: any) => void;
}

export const InstagramAnalyticsWidget: React.FC<InstagramAnalyticsWidgetProps> = ({
  brandId,
  analytics,
  onAccountAdd
}) => {
  const [data, setData] = useState<InstagramAnalytics | null>(analytics || null);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<BrandInstagramAccount[]>([]);
  const [showAddAccount, setShowAddAccount] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/brand/${brandId}/analytics?type=instagram`);
      if (!response.ok) {
        throw new Error('Failed to fetch Instagram analytics');
      }
      const result = await response.json();
      setData(result.data);
    } catch (error: any) {
      console.error('Error fetching Instagram analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`/api/brand/${brandId}/instagram`);
      if (!response.ok) {
        throw new Error('Failed to fetch Instagram accounts');
      }
      const result = await response.json();
      setAccounts(result.data || []);
    } catch (error: any) {
      console.error('Error fetching Instagram accounts:', error);
    }
  };

  useEffect(() => {
    if (!analytics) {
      fetchAnalytics();
    }
    fetchAccounts();
  }, [brandId, analytics]);

  const handleAddAccount = async (accountData: any) => {
    if (onAccountAdd) {
      await onAccountAdd(accountData);
      await fetchAccounts();
      await fetchAnalytics();
      setShowAddAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>인스타그램 분석</CardTitle>
            <CardDescription>Instagram 데이터를 불러오는 중...</CardDescription>
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

  if (!data && accounts.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>인스타그램 분석</CardTitle>
            <CardDescription>인스타그램 계정 연결이 필요합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                인스타그램 비즈니스 계정을 연결하여 성과를 분석하세요
              </p>
              <button 
                onClick={() => setShowAddAccount(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                인스타그램 계정 연결하기
              </button>
            </div>
          </CardContent>
        </Card>

        {showAddAccount && (
          <Card>
            <CardHeader>
              <CardTitle>인스타그램 계정 추가</CardTitle>
              <CardDescription>비즈니스 계정 정보를 입력하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddAccount({
                  username: formData.get('username'),
                  accessToken: formData.get('accessToken'),
                  refreshToken: formData.get('refreshToken')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">사용자명</label>
                    <input 
                      name="username"
                      type="text" 
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="@username"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">액세스 토큰</label>
                    <input 
                      name="accessToken"
                      type="text" 
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="Instagram Access Token"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">리프레시 토큰 (선택사항)</label>
                    <input 
                      name="refreshToken"
                      type="text" 
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      placeholder="Instagram Refresh Token"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      계정 추가
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowAddAccount(false)}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">인스타그램 분석</h2>
          <p className="text-muted-foreground">Instagram Business API 데이터</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {accounts.length}개 계정 연결됨
          </Badge>
          <button 
            onClick={() => setShowAddAccount(true)}
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            계정 추가
          </button>
        </div>
      </div>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>연결된 계정</CardTitle>
          <CardDescription>관리 중인 인스타그램 계정</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {account.username.charAt(1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{account.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.accountType} • {account.isActive ? '활성' : '비활성'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={account.isActive ? 'default' : 'secondary'}>
                    {account.isActive ? '연결됨' : '연결 해제됨'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">팔로워</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.followersCount?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  {data.followersGrowth ? `${data.followersGrowth > 0 ? '+' : ''}${data.followersGrowth.toLocaleString()} 이번 달` : 'No growth data'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 좋아요</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalLikes?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">전체 게시물</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 댓글</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalComments?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">전체 게시물</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">평균 참여율</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.averageEngagementRate ? (data.averageEngagementRate * 100).toFixed(1) : '0'}%
                </div>
                <p className="text-xs text-muted-foreground">지난 30일</p>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Trend */}
          <Card>
            <CardHeader>
              <CardTitle>참여율 트렌드</CardTitle>
              <CardDescription>일별 참여율 변화</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.engagementTrend?.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{trend.date}</span>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        참여율: <span className="font-medium">{(trend.engagementRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="text-sm">
                        게시물: <span className="font-medium">{trend.postsCount}</span>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-muted-foreground">
                    참여율 트렌드 데이터가 없습니다
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Posts */}
          <Card>
            <CardHeader>
              <CardTitle>인기 게시물</CardTitle>
              <CardDescription>가장 높은 참여율을 기록한 게시물</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPosts?.map((post, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{post.caption?.substring(0, 100) || 'No caption'}...</div>
                      <div className="text-xs text-muted-foreground">{post.timestamp}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{post.likesCount} 좋아요</div>
                      <div className="text-xs text-muted-foreground">
                        {post.commentsCount} 댓글
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-muted-foreground">
                    인기 게시물 데이터가 없습니다
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <Card>
          <CardHeader>
            <CardTitle>인스타그램 계정 추가</CardTitle>
            <CardDescription>새로운 비즈니스 계정을 연결하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddAccount({
                username: formData.get('username'),
                accessToken: formData.get('accessToken'),
                refreshToken: formData.get('refreshToken')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">사용자명</label>
                  <input 
                    name="username"
                    type="text" 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="@username"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">액세스 토큰</label>
                  <input 
                    name="accessToken"
                    type="text" 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="Instagram Access Token"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">리프레시 토큰 (선택사항)</label>
                  <input 
                    name="refreshToken"
                    type="text" 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="Instagram Refresh Token"
                  />
                </div>
                <div className="flex space-x-2">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    계정 추가
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddAccount(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    취소
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstagramAnalyticsWidget;
import { supabase } from '../supabase';
import { InstagramAPIClient } from './instagram-api-client';
import type { 
  InstagramAccountData, 
  BrandInstagramAccount,
  InstagramAnalytics 
} from '../../types/brand-analytics';

export class InstagramAccountManager {
  private instagramAPI: InstagramAPIClient;

  constructor() {
    this.instagramAPI = new InstagramAPIClient();
  }

  async getAccountsByBrand(brandId: string): Promise<BrandInstagramAccount[]> {
    const { data, error } = await supabase
      .from('brand_instagram_accounts')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching Instagram accounts:', error);
      throw error;
    }

    return data || [];
  }

  async addAccount(brandId: string, accountData: InstagramAccountData): Promise<BrandInstagramAccount> {
    // 1. 인스타그램 계정 유효성 검증
    const isValid = await this.validateInstagramAccount(accountData.accessToken);
    if (!isValid) {
      throw new Error('유효하지 않은 인스타그램 계정입니다.');
    }

    // 2. 계정 정보 조회
    const accountInfo = await this.instagramAPI.getAccountInfo(accountData.accessToken);

    // 3. 계정 정보 저장
    const { data, error } = await supabase
      .from('brand_instagram_accounts')
      .insert({
        brand_id: brandId,
        username: accountData.username,
        instagram_user_id: accountInfo.id,
        access_token: accountData.accessToken,
        refresh_token: accountData.refreshToken,
        account_type: accountInfo.account_type || 'personal',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding Instagram account:', error);
      throw error;
    }

    // 4. 초기 데이터 동기화
    await this.syncAccountData(brandId);

    return data;
  }

  async updateAccount(accountId: string, updates: Partial<InstagramAccountData>): Promise<BrandInstagramAccount> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.username) updateData.username = updates.username;
    if (updates.accessToken) updateData.access_token = updates.accessToken;
    if (updates.refreshToken) updateData.refresh_token = updates.refreshToken;

    const { data, error } = await supabase
      .from('brand_instagram_accounts')
      .update(updateData)
      .eq('id', accountId)
      .select()
      .single();

    if (error) {
      console.error('Error updating Instagram account:', error);
      throw error;
    }

    return data;
  }

  async removeAccount(accountId: string): Promise<void> {
    // 계정을 완전히 삭제하지 않고 비활성화
    const { error } = await supabase
      .from('brand_instagram_accounts')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', accountId);

    if (error) {
      console.error('Error removing Instagram account:', error);
      throw error;
    }
  }

  async syncAccountData(brandId: string): Promise<void> {
    const accounts = await this.getAccountsByBrand(brandId);
    
    for (const account of accounts) {
      try {
        // 최근 미디어 데이터 동기화
        const recentMedia = await this.instagramAPI.getRecentMedia(account.access_token, 50);
        
        // 컨텐츠 추적 테이블에 저장
        for (const media of recentMedia) {
          await supabase
            .from('instagram_content_tracking')
            .upsert({
              brand_id: brandId,
              instagram_media_id: media.id,
              media_type: media.media_type,
              caption: media.caption,
              permalink: media.permalink,
              thumbnail_url: media.thumbnail_url,
              timestamp: media.timestamp,
              like_count: media.like_count || 0,
              comments_count: media.comments_count || 0,
              engagement_rate: this.calculateEngagementRate(media),
              tracked_at: new Date().toISOString()
            });
        }

        // 마지막 동기화 시간 업데이트
        await supabase
          .from('brand_instagram_accounts')
          .update({
            last_sync_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', account.id);

      } catch (error: any) {
        console.error(`Error syncing account ${account.username}:`, error);
        
        // 에러 정보 저장
        await supabase
          .from('brand_instagram_accounts')
          .update({
            error: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', account.id);
      }
    }
  }

  async validateInstagramAccount(accessToken: string): Promise<boolean> {
    try {
      const accountInfo = await this.instagramAPI.getAccountInfo(accessToken);
      return !!accountInfo && !!accountInfo.id;
    } catch (error) {
      console.error('Error validating Instagram account:', error);
      return false;
    }
  }

  async refreshAccessToken(accountId: string): Promise<void> {
    const { data: account, error } = await supabase
      .from('brand_instagram_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error || !account) {
      throw new Error('Instagram account not found');
    }

    try {
      const newTokens = await this.instagramAPI.refreshAccessToken(account.refresh_token);
      
      await supabase
        .from('brand_instagram_accounts')
        .update({
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token,
          token_expires_at: newTokens.expires_at,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId);
    } catch (error: any) {
      console.error('Error refreshing access token:', error);
      
      // 토큰 갱신 실패 시 에러 정보 저장
      await supabase
        .from('brand_instagram_accounts')
        .update({
          error: `Token refresh failed: ${error.message}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId);
      
      throw error;
    }
  }

  async getAccountStatus(accountId: string): Promise<{ isValid: boolean; error?: string; lastSync?: string }> {
    const { data: account, error } = await supabase
      .from('brand_instagram_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error || !account) {
      return { isValid: false, error: 'Account not found' };
    }

    // 토큰 만료 확인
    if (account.token_expires_at) {
      const expiresAt = new Date(account.token_expires_at);
      if (expiresAt < new Date()) {
        return { 
          isValid: false, 
          error: 'Access token expired',
          lastSync: account.last_sync_at 
        };
      }
    }

    // 계정 유효성 확인
    const isValid = await this.validateInstagramAccount(account.access_token);
    
    return {
      isValid,
      error: account.error || (!isValid ? 'Invalid access token' : undefined),
      lastSync: account.last_sync_at
    };
  }

  async getAccountAnalytics(brandId: string): Promise<InstagramAnalytics | null> {
    const accounts = await this.getAccountsByBrand(brandId);
    if (accounts.length === 0) {
      return null;
    }

    const account = accounts[0]; // 첫 번째 활성 계정 사용
    
    try {
      const accountInfo = await this.instagramAPI.getAccountInfo(account.access_token);
      const recentMedia = await this.instagramAPI.getRecentMedia(account.access_token, 20);
      
      const postsAnalytics = recentMedia.map(media => ({
        mediaId: media.id,
        mediaType: media.media_type,
        caption: media.caption,
        permalink: media.permalink,
        thumbnailUrl: media.thumbnail_url,
        timestamp: media.timestamp,
        likeCount: media.like_count || 0,
        commentsCount: media.comments_count || 0,
        engagementRate: this.calculateEngagementRate(media)
      }));

      const totalLikes = postsAnalytics.reduce((sum, post) => sum + post.likeCount, 0);
      const totalComments = postsAnalytics.reduce((sum, post) => sum + post.commentsCount, 0);
      const avgEngagement = postsAnalytics.length > 0 
        ? (totalLikes + totalComments) / postsAnalytics.length 
        : 0;
      
      const engagementRate = accountInfo.followers_count > 0 
        ? (avgEngagement / accountInfo.followers_count) * 100 
        : 0;

      return {
        brandId,
        accountInfo: {
          username: accountInfo.username,
          followersCount: accountInfo.followers_count,
          followingCount: accountInfo.follows_count,
          mediaCount: accountInfo.media_count
        },
        postsAnalytics,
        engagementRate: Number(engagementRate.toFixed(2)),
        topPerformingPosts: this.getTopPerformingPosts(postsAnalytics, 5),
        followersCount: accountInfo.followers_count,
        totalLikes,
        totalComments,
        engagementTrend: this.generateEngagementTrend(postsAnalytics),
        dailyEngagement: this.generateDailyEngagement(postsAnalytics),
        topPosts: this.getTopPerformingPosts(postsAnalytics, 10),
        engagementByType: this.getEngagementByType(postsAnalytics),
        growthMetrics: {
          followersGrowth: 5.2, // 예시 데이터
          engagementGrowth: 3.8,
          postsGrowth: 12.5
        }
      };
    } catch (error) {
      console.error('Error fetching Instagram analytics:', error);
      throw error;
    }
  }

  private calculateEngagementRate(media: any): number {
    const engagement = (media.like_count || 0) + (media.comments_count || 0);
    // 팔로워 수 대비 참여율 계산 (실제로는 계정 정보에서 가져와야 함)
    const assumedFollowers = 1000; // 임시값
    return Number(((engagement / assumedFollowers) * 100).toFixed(2));
  }

  private getTopPerformingPosts(posts: any[], limit: number): any[] {
    return posts
      .sort((a, b) => (b.likeCount + b.commentsCount) - (a.likeCount + a.commentsCount))
      .slice(0, limit);
  }

  private generateEngagementTrend(posts: any[]): { date: string; engagement: number }[] {
    const trend = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayPosts = posts.filter(post => {
        const postDate = new Date(post.timestamp);
        return postDate.toDateString() === date.toDateString();
      });
      const engagement = dayPosts.reduce((sum, post) => sum + post.likeCount + post.commentsCount, 0);
      trend.push({
        date: date.toISOString().split('T')[0],
        engagement
      });
    }
    return trend;
  }

  private generateDailyEngagement(posts: any[]): { date: string; likes: number; comments: number }[] {
    const daily = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayPosts = posts.filter(post => {
        const postDate = new Date(post.timestamp);
        return postDate.toDateString() === date.toDateString();
      });
      daily.push({
        date: date.toISOString().split('T')[0],
        likes: dayPosts.reduce((sum, post) => sum + post.likeCount, 0),
        comments: dayPosts.reduce((sum, post) => sum + post.commentsCount, 0)
      });
    }
    return daily;
  }

  private getEngagementByType(posts: any[]): { type: string; count: number }[] {
    const typeCount = posts.reduce((acc, post) => {
      const type = post.mediaType || 'IMAGE';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCount).map(([type, count]) => ({ type, count }));
  }

  async registerInstagramAccount(brandId: string, accountData: InstagramAccountData): Promise<void> {
    await this.addAccount(brandId, accountData);
  }

  async syncInitialData(brandId: string): Promise<void> {
    await this.syncAccountData(brandId);
  }
}
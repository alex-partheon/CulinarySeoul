// TASK-014: 인스타그램 API 클라이언트

import { InstagramAPIResponse } from '../../types/analytics';

export class InstagramAPIClient {
  private baseUrl = 'https://graph.instagram.com';
  private graphUrl = 'https://graph.facebook.com/v18.0';

  /**
   * 인스타그램 계정 정보 조회
   */
  async getAccountInfo(accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Instagram 계정 정보 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 인스타그램 비즈니스 계정 정보 조회 (팔로워 수 포함)
   */
  async getBusinessAccountInfo(accessToken: string, instagramBusinessAccountId: string): Promise<any> {
    try {
      const fields = 'id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url';
      const response = await fetch(
        `${this.graphUrl}/${instagramBusinessAccountId}?fields=${fields}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram Business API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Instagram 비즈니스 계정 정보 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 최근 미디어 조회
   */
  async getRecentMedia(accessToken: string, limit: number = 25): Promise<InstagramAPIResponse> {
    try {
      const fields = 'id,media_type,media_url,permalink,thumbnail_url,caption,timestamp,like_count,comments_count';
      const response = await fetch(
        `${this.baseUrl}/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram Media API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Instagram 미디어 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 비즈니스 계정 미디어 조회 (인사이트 포함)
   */
  async getBusinessMedia(accessToken: string, instagramBusinessAccountId: string, limit: number = 25): Promise<any> {
    try {
      const fields = 'id,media_type,media_url,permalink,thumbnail_url,caption,timestamp';
      const response = await fetch(
        `${this.graphUrl}/${instagramBusinessAccountId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram Business Media API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Instagram 비즈니스 미디어 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 미디어 인사이트 조회 (비즈니스 계정만)
   */
  async getMediaInsights(accessToken: string, mediaId: string): Promise<any> {
    try {
      const metrics = 'impressions,reach,engagement,likes,comments,saves,shares';
      const response = await fetch(
        `${this.graphUrl}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram Insights API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Instagram 미디어 인사이트 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 계정 인사이트 조회 (비즈니스 계정만)
   */
  async getAccountInsights(accessToken: string, instagramBusinessAccountId: string, period: 'day' | 'week' | 'days_28' = 'week'): Promise<any> {
    try {
      const metrics = 'impressions,reach,profile_views,website_clicks';
      const response = await fetch(
        `${this.graphUrl}/${instagramBusinessAccountId}/insights?metric=${metrics}&period=${period}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram Account Insights API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Instagram 계정 인사이트 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 액세스 토큰 갱신
   */
  async refreshAccessToken(accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.graphUrl}/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram Token Refresh error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Instagram 토큰 갱신 실패:', error);
      throw error;
    }
  }

  /**
   * 액세스 토큰 유효성 검증
   */
  async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me?access_token=${accessToken}`
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 해시태그 검색 (비즈니스 계정만)
   */
  async searchHashtags(accessToken: string, instagramBusinessAccountId: string, hashtag: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.graphUrl}/ig_hashtag_search?user_id=${instagramBusinessAccountId}&q=${encodeURIComponent(hashtag)}&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram Hashtag Search error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Instagram 해시태그 검색 실패:', error);
      throw error;
    }
  }

  /**
   * 참여율 계산
   */
  calculateEngagementRate(likes: number, comments: number, followers: number): number {
    if (followers === 0) return 0;
    return ((likes + comments) / followers) * 100;
  }

  /**
   * 미디어 타입별 성과 분석
   */
  analyzeMediaPerformance(mediaList: any[]): any {
    const analysis = {
      totalPosts: mediaList.length,
      averageLikes: 0,
      averageComments: 0,
      bestPerformingType: '',
      typeBreakdown: {} as Record<string, number>
    };

    if (mediaList.length === 0) return analysis;

    let totalLikes = 0;
    let totalComments = 0;

    mediaList.forEach(media => {
      totalLikes += media.like_count || 0;
      totalComments += media.comments_count || 0;
      
      const type = media.media_type;
      analysis.typeBreakdown[type] = (analysis.typeBreakdown[type] || 0) + 1;
    });

    analysis.averageLikes = Math.round(totalLikes / mediaList.length);
    analysis.averageComments = Math.round(totalComments / mediaList.length);
    
    // 가장 많이 사용된 미디어 타입 찾기
    analysis.bestPerformingType = Object.keys(analysis.typeBreakdown)
      .reduce((a, b) => analysis.typeBreakdown[a] > analysis.typeBreakdown[b] ? a : b);

    return analysis;
  }
}
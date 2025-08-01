// TASK-014: 브랜드 분석 관리자

import { supabase } from '../../lib/supabase';
import { GoogleAnalyticsClient } from './google-analytics-client';
import { InstagramAPIClient } from './instagram-api-client';
import {
  DateRange,
  BrandAnalytics,
  BrandAnalyticsConfig,
  PageAnalytics,
  TrafficSource,
  DeviceBreakdown,
  InstagramAnalytics,
  InstagramPostAnalytics
} from '../../types/analytics';

export class BrandAnalyticsManager {
  private googleAnalytics: GoogleAnalyticsClient;
  private instagramAPI: InstagramAPIClient;

  constructor(googleAnalyticsApiKey: string) {
    this.googleAnalytics = new GoogleAnalyticsClient(googleAnalyticsApiKey);
    this.instagramAPI = new InstagramAPIClient();
  }

  /**
   * 브랜드 웹사이트 분석 데이터 조회
   */
  async getBrandWebsiteAnalytics(brandId: string, dateRange: DateRange): Promise<BrandAnalytics> {
    try {
      // 1. 브랜드 구글 애널리틱스 설정 조회
      const brandConfig = await this.getBrandAnalyticsConfig(brandId);
      if (!brandConfig) {
        throw new Error('브랜드 구글 애널리틱스 설정이 없습니다.');
      }

      // 2. 구글 애널리틱스 데이터 조회
      const analyticsData = await this.googleAnalytics.getReports({
        propertyId: brandConfig.gaPropertyId,
        dateRanges: [dateRange],
        dimensions: ['pagePath', 'pageTitle', 'country', 'deviceCategory'],
        metrics: ['sessions', 'pageviews', 'bounceRate', 'averageSessionDuration']
      });

      // 3. 페이지별 성과 분석
      const pageAnalytics = await this.analyzePagePerformance(analyticsData);
      
      // 4. 트래픽 소스 분석
      const trafficSources = await this.getTrafficSources(brandConfig.gaPropertyId, dateRange);
      
      // 5. 디바이스 분석
      const deviceBreakdown = await this.getDeviceBreakdown(brandConfig.gaPropertyId, dateRange);

      return {
        brandId,
        period: dateRange,
        overview: {
          totalSessions: analyticsData.totals.sessions,
          totalPageviews: analyticsData.totals.pageviews,
          averageBounceRate: analyticsData.totals.bounceRate,
          averageSessionDuration: analyticsData.totals.sessionDuration
        },
        pageAnalytics,
        trafficSources,
        deviceBreakdown
      };
    } catch (error) {
      console.error('브랜드 웹사이트 분석 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 브랜드 인스타그램 분석 데이터 조회
   */
  async getInstagramAnalytics(brandId: string): Promise<InstagramAnalytics> {
    try {
      // 1. 브랜드 인스타그램 계정 정보 조회
      const instagramAccount = await this.getBrandInstagramAccount(brandId);
      if (!instagramAccount) {
        throw new Error('브랜드 인스타그램 계정이 등록되지 않았습니다.');
      }

      // 2. 인스타그램 기본 정보 조회
      const accountInfo = await this.instagramAPI.getAccountInfo(instagramAccount.accessToken);
      
      // 비즈니스 계정인 경우 팔로워 정보 조회
      let businessInfo = null;
      if (instagramAccount.accountType === 'business') {
        try {
          businessInfo = await this.instagramAPI.getBusinessAccountInfo(
            instagramAccount.accessToken,
            instagramAccount.instagramUserId
          );
        } catch (error) {
          console.warn('비즈니스 계정 정보 조회 실패:', error);
        }
      }

      // 3. 최근 컨텐츠 성과 분석
      const recentPosts = await this.instagramAPI.getRecentMedia(instagramAccount.accessToken, 20);
      const postsAnalytics = await this.analyzePostsPerformance(recentPosts.data);

      // 4. 참여율 계산
      const engagementRate = this.calculateEngagementRate(postsAnalytics);
      
      // 5. 상위 성과 포스트 선별
      const topPerformingPosts = this.getTopPerformingPosts(postsAnalytics, 5);

      return {
        brandId,
        accountInfo: {
          username: accountInfo.username,
          followersCount: businessInfo?.followers_count || 0,
          followingCount: businessInfo?.follows_count || 0,
          mediaCount: accountInfo.media_count || 0
        },
        postsAnalytics,
        engagementRate,
        topPerformingPosts
      };
    } catch (error) {
      console.error('브랜드 인스타그램 분석 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 브랜드 구글 애널리틱스 설정 조회
   */
  private async getBrandAnalyticsConfig(brandId: string): Promise<BrandAnalyticsConfig | null> {
    const { data, error } = await supabase
      .from('brand_analytics_config')
      .select('*')
      .eq('brand_id', brandId)
      .eq('tracking_enabled', true)
      .single();

    if (error) {
      console.error('브랜드 애널리틱스 설정 조회 실패:', error);
      return null;
    }

    return data ? {
      id: data.id,
      brandId: data.brand_id,
      gaPropertyId: data.ga_property_id,
      gaMeasurementId: data.ga_measurement_id,
      domain: data.domain,
      trackingEnabled: data.tracking_enabled,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } : null;
  }

  /**
   * 브랜드 인스타그램 계정 조회
   */
  private async getBrandInstagramAccount(brandId: string): Promise<any> {
    const { data, error } = await supabase
      .from('brand_instagram_accounts')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('브랜드 인스타그램 계정 조회 실패:', error);
      return null;
    }

    return data;
  }

  /**
   * 페이지별 성과 분석
   */
  private async analyzePagePerformance(analyticsData: any): Promise<PageAnalytics[]> {
    const pageAnalytics: PageAnalytics[] = [];

    if (analyticsData.rows) {
      analyticsData.rows.forEach((row: any) => {
        const dimensions = row.dimensionValues;
        const metrics = row.metricValues;

        if (dimensions.length >= 2 && metrics.length >= 4) {
          pageAnalytics.push({
            pagePath: dimensions[0].value,
            pageTitle: dimensions[1].value,
            sessions: parseInt(metrics[0].value || '0'),
            pageviews: parseInt(metrics[1].value || '0'),
            bounceRate: parseFloat(metrics[2].value || '0'),
            avgTimeOnPage: parseFloat(metrics[3].value || '0')
          });
        }
      });
    }

    return pageAnalytics.sort((a, b) => b.sessions - a.sessions);
  }

  /**
   * 트래픽 소스 분석
   */
  private async getTrafficSources(propertyId: string, dateRange: DateRange): Promise<TrafficSource[]> {
    try {
      const data = await this.googleAnalytics.getTrafficSources(propertyId, dateRange);
      const trafficSources: TrafficSource[] = [];
      let totalSessions = 0;

      // 총 세션 수 계산
      if (data.rows) {
        totalSessions = data.rows.reduce((sum: number, row: any) => {
          return sum + parseInt(row.metricValues[0].value || '0');
        }, 0);
      }

      // 트래픽 소스별 데이터 처리
      if (data.rows) {
        data.rows.forEach((row: any) => {
          const sessions = parseInt(row.metricValues[0].value || '0');
          trafficSources.push({
            source: row.dimensionValues[0].value,
            medium: row.dimensionValues[1].value,
            sessions,
            percentage: totalSessions > 0 ? (sessions / totalSessions) * 100 : 0
          });
        });
      }

      return trafficSources.sort((a, b) => b.sessions - a.sessions);
    } catch (error) {
      console.error('트래픽 소스 분석 실패:', error);
      return [];
    }
  }

  /**
   * 디바이스 분석
   */
  private async getDeviceBreakdown(propertyId: string, dateRange: DateRange): Promise<DeviceBreakdown[]> {
    try {
      const data = await this.googleAnalytics.getDeviceBreakdown(propertyId, dateRange);
      const deviceBreakdown: DeviceBreakdown[] = [];
      let totalSessions = 0;

      // 총 세션 수 계산
      if (data.rows) {
        totalSessions = data.rows.reduce((sum: number, row: any) => {
          return sum + parseInt(row.metricValues[0].value || '0');
        }, 0);
      }

      // 디바이스별 데이터 처리
      if (data.rows) {
        data.rows.forEach((row: any) => {
          const sessions = parseInt(row.metricValues[0].value || '0');
          deviceBreakdown.push({
            deviceCategory: row.dimensionValues[0].value,
            sessions,
            percentage: totalSessions > 0 ? (sessions / totalSessions) * 100 : 0
          });
        });
      }

      return deviceBreakdown.sort((a, b) => b.sessions - a.sessions);
    } catch (error) {
      console.error('디바이스 분석 실패:', error);
      return [];
    }
  }

  /**
   * 인스타그램 포스트 성과 분석
   */
  private async analyzePostsPerformance(posts: any[]): Promise<InstagramPostAnalytics[]> {
    return posts.map(post => ({
      id: post.id,
      mediaId: post.id,
      mediaType: post.media_type,
      caption: post.caption,
      permalink: post.permalink,
      thumbnailUrl: post.thumbnail_url,
      timestamp: post.timestamp,
      likeCount: post.like_count || 0,
      commentsCount: post.comments_count || 0,
      engagementRate: this.calculatePostEngagementRate(post.like_count || 0, post.comments_count || 0)
    }));
  }

  /**
   * 전체 참여율 계산
   */
  private calculateEngagementRate(postsAnalytics: InstagramPostAnalytics[]): number {
    if (postsAnalytics.length === 0) return 0;
    
    const totalEngagement = postsAnalytics.reduce((sum, post) => sum + post.engagementRate, 0);
    return totalEngagement / postsAnalytics.length;
  }

  /**
   * 개별 포스트 참여율 계산
   */
  private calculatePostEngagementRate(likes: number, comments: number): number {
    // 임시로 간단한 계산 (실제로는 팔로워 수가 필요)
    return likes + comments;
  }

  /**
   * 상위 성과 포스트 선별
   */
  private getTopPerformingPosts(postsAnalytics: InstagramPostAnalytics[], count: number): InstagramPostAnalytics[] {
    return postsAnalytics
      .sort((a, b) => b.engagementRate - a.engagementRate)
      .slice(0, count);
  }

  /**
   * 분석 데이터 캐시 저장
   */
  async saveAnalyticsCache(brandId: string, data: any, type: 'website' | 'instagram'): Promise<void> {
    try {
      const { error } = await supabase
        .from('brand_analytics_cache')
        .upsert({
          brand_id: brandId,
          data_type: type,
          data: data,
          cached_at: new Date().toISOString()
        });

      if (error) {
        console.error('분석 데이터 캐시 저장 실패:', error);
      }
    } catch (error) {
      console.error('분석 데이터 캐시 저장 중 오류:', error);
    }
  }
}
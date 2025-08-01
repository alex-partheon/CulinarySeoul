import { supabase } from '../supabase';
import { GoogleAnalyticsClient } from './google-analytics-client';
import { InstagramAPIClient } from './instagram-api-client';
import type { 
  BrandAnalytics, 
  InstagramAnalytics, 
  DateRange,
  BrandAnalyticsConfig,
  WebsiteAnalytics,
  CombinedAnalytics,
  GoogleAnalyticsData,
  PageAnalytics,
  TrafficSource,
  DeviceBreakdown,
  BrandAnalyticsCacheEntry
} from '../../types/brand-analytics';

export class BrandAnalyticsManager {
  private googleAnalytics: GoogleAnalyticsClient;
  private instagramAPI: InstagramAPIClient;

  constructor() {
    this.googleAnalytics = new GoogleAnalyticsClient();
    this.instagramAPI = new InstagramAPIClient();
  }

  async getBrandAnalyticsConfig(brandId: string): Promise<BrandAnalyticsConfig | null> {
    const { data, error } = await supabase
      .from('brand_analytics_configs')
      .select('*')
      .eq('brand_id', brandId)
      .single();

    if (error) {
      console.error('Error fetching brand analytics config:', error);
      return null;
    }

    return data;
  }

  async getBrandAnalytics(brandId: string, dateRange: DateRange): Promise<BrandAnalytics> {
    // 캐시된 데이터 확인
    const cachedData = await this.getCachedAnalyticsData(brandId, 'brand');
    if (cachedData) {
      return cachedData;
    }

    const brandConfig = await this.getBrandAnalyticsConfig(brandId);
    if (!brandConfig) {
      throw new Error('Analytics configuration not found for brand');
    }

    try {
      const analyticsData = await this.googleAnalytics.getReports({
        propertyId: brandConfig.ga_property_id,
        dateRanges: [dateRange],
        dimensions: ['pagePath', 'pageTitle', 'country', 'deviceCategory'],
        metrics: ['sessions', 'pageviews', 'bounceRate', 'sessionDuration']
      });

      const pageAnalytics = await this.analyzePagePerformance(analyticsData);
      const trafficSources = await this.getTrafficSources(analyticsData);
      const deviceBreakdown = await this.getDeviceBreakdown(analyticsData);

      const result: BrandAnalytics = {
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

      // 결과 캐시
      await this.cacheAnalyticsData(brandId, 'brand', result);
      return result;
    } catch (error) {
      console.error('Error fetching brand analytics:', error);
      throw error;
    }
  }

  async getWebsiteAnalytics(brandId: string, dateRange: DateRange): Promise<WebsiteAnalytics> {
    const config = await this.getBrandAnalyticsConfig(brandId);
    if (!config) {
      throw new Error('Analytics configuration not found for brand');
    }

    try {
      const analyticsData = await this.googleAnalytics.getReports({
        propertyId: config.ga_property_id,
        dateRanges: [dateRange],
        dimensions: ['pagePath', 'pageTitle', 'country', 'deviceCategory'],
        metrics: ['sessions', 'pageviews', 'bounceRate', 'sessionDuration']
      });

      return this.transformToWebsiteAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching website analytics:', error);
      throw error;
    }
  }

  async getInstagramAnalytics(brandId: string): Promise<InstagramAnalytics> {
    // 캐시된 데이터 확인
    const cachedData = await this.getCachedAnalyticsData(brandId, 'instagram');
    if (cachedData) {
      return cachedData;
    }

    try {
      const { data: instagramAccount } = await supabase
        .from('brand_instagram_accounts')
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_active', true)
        .single();

      if (!instagramAccount) {
        throw new Error('Instagram account not found for brand');
      }

      const accountInfo = await this.instagramAPI.getAccountInfo(instagramAccount.access_token);
      const recentPosts = await this.instagramAPI.getRecentMedia(instagramAccount.access_token, 20);
      const postsAnalytics = await this.analyzePostsPerformance(recentPosts);

      const result: InstagramAnalytics = {
        brandId,
        accountInfo: {
          username: accountInfo.username,
          followersCount: accountInfo.followers_count,
          followingCount: accountInfo.follows_count,
          mediaCount: accountInfo.media_count
        },
        postsAnalytics,
        engagementRate: this.calculateEngagementRate(postsAnalytics),
        topPerformingPosts: this.getTopPerformingPosts(postsAnalytics, 5),
        followersCount: accountInfo.followers_count,
        totalLikes: postsAnalytics.reduce((sum, post) => sum + post.likeCount, 0),
        totalComments: postsAnalytics.reduce((sum, post) => sum + post.commentsCount, 0),
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

      // 결과 캐시
      await this.cacheAnalyticsData(brandId, 'instagram', result);
      return result;
    } catch (error) {
      console.error('Error fetching Instagram analytics:', error);
      throw error;
    }
  }

  async getCombinedAnalytics(brandId: string, dateRange: DateRange): Promise<CombinedAnalytics> {
    const [websiteData, instagramData] = await Promise.all([
      this.getWebsiteAnalytics(brandId, dateRange),
      this.getInstagramAnalytics(brandId)
    ]);

    return {
      website: websiteData,
      instagram: instagramData,
      overview: {
        totalVisitors: websiteData.visitors,
        totalPageViews: websiteData.pageViews,
        totalFollowers: instagramData.followersCount,
        avgEngagementRate: instagramData.engagementRate,
        totalReach: websiteData.visitors + instagramData.followersCount,
        conversionRate: websiteData.conversionRate
      },
      performanceTrend: this.combinePerformanceTrends(websiteData, instagramData),
      topContent: this.combineTopContent(websiteData, instagramData)
    };
  }

  private async analyzePagePerformance(analyticsData: GoogleAnalyticsData): Promise<PageAnalytics[]> {
    if (!analyticsData.rows) return [];
    
    return analyticsData.rows
      .filter(row => row.dimensions[0] && row.dimensions[1])
      .map(row => ({
        pagePath: row.dimensions[0],
        pageTitle: row.dimensions[1],
        sessions: row.metrics[0] || 0,
        pageviews: row.metrics[1] || 0,
        bounceRate: row.metrics[2] || 0,
        sessionDuration: row.metrics[3] || 0
      }))
      .slice(0, 20);
  }

  private async getTrafficSources(analyticsData: GoogleAnalyticsData): Promise<TrafficSource[]> {
    const totalSessions = analyticsData.totals.sessions;
    return [
      { source: 'Direct', medium: 'none', sessions: Math.floor(totalSessions * 0.4), percentage: 40 },
      { source: 'Google', medium: 'organic', sessions: Math.floor(totalSessions * 0.3), percentage: 30 },
      { source: 'Social', medium: 'social', sessions: Math.floor(totalSessions * 0.2), percentage: 20 },
      { source: 'Referral', medium: 'referral', sessions: Math.floor(totalSessions * 0.1), percentage: 10 }
    ];
  }

  private async getDeviceBreakdown(analyticsData: GoogleAnalyticsData): Promise<DeviceBreakdown[]> {
    const totalSessions = analyticsData.totals.sessions;
    return [
      { deviceCategory: 'desktop', sessions: Math.floor(totalSessions * 0.6), percentage: 60 },
      { deviceCategory: 'mobile', sessions: Math.floor(totalSessions * 0.35), percentage: 35 },
      { deviceCategory: 'tablet', sessions: Math.floor(totalSessions * 0.05), percentage: 5 }
    ];
  }

  private async analyzePostsPerformance(posts: any[]): Promise<any[]> {
    return posts.map(post => ({
      mediaId: post.id,
      mediaType: post.media_type,
      caption: post.caption,
      permalink: post.permalink,
      thumbnailUrl: post.thumbnail_url,
      timestamp: post.timestamp,
      likeCount: post.like_count || 0,
      commentsCount: post.comments_count || 0,
      engagementRate: this.calculatePostEngagementRate(post)
    }));
  }

  private calculateEngagementRate(posts: any[]): number {
    if (posts.length === 0) return 0;
    const totalEngagement = posts.reduce((sum, post) => sum + post.likeCount + post.commentsCount, 0);
    const avgEngagement = totalEngagement / posts.length;
    return Number((avgEngagement / 1000 * 100).toFixed(2)); // 가정: 1000명당 참여율
  }

  private calculatePostEngagementRate(post: any): number {
    const engagement = (post.like_count || 0) + (post.comments_count || 0);
    return Number((engagement / 1000 * 100).toFixed(2)); // 가정: 1000명당 참여율
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

  private async cacheAnalyticsData(brandId: string, dataType: string, data: any): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1시간 캐시

    await supabase
      .from('brand_analytics_caches')
      .upsert({
        brand_id: brandId,
        data_type: dataType,
        data: JSON.stringify(data),
        cached_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      });
  }

  private async getCachedAnalyticsData(brandId: string, dataType: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('brand_analytics_caches')
      .select('*')
      .eq('brand_id', brandId)
      .eq('data_type', dataType)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return null;
    }

    return JSON.parse(data.data);
  }

  private transformToWebsiteAnalytics(analyticsData: GoogleAnalyticsData): WebsiteAnalytics {
    return {
      visitors: analyticsData.totals?.sessions || 0,
      pageViews: analyticsData.totals?.pageviews || 0,
      bounceRate: analyticsData.totals?.bounceRate || 0,
      avgSessionDuration: analyticsData.totals?.sessionDuration || 0,
      topPages: this.extractTopPages(analyticsData),
      trafficSources: this.extractTrafficSources(analyticsData),
      deviceTypes: this.extractDeviceTypes(analyticsData),
      conversionRate: this.calculateConversionRate(analyticsData),
      goals: this.extractGoals(analyticsData),
      realTimeVisitors: 0, // 실시간 데이터는 별도 API 호출 필요
      performanceTrend: this.extractPerformanceTrend(analyticsData)
    };
  }

  private extractTopPages(analyticsData: GoogleAnalyticsData): Array<{ path: string; views: number; title: string }> {
    if (!analyticsData.rows) return [];
    
    return analyticsData.rows
      .filter(row => row.dimensions[0] && row.dimensions[1])
      .map(row => ({
        path: row.dimensions[0],
        title: row.dimensions[1],
        views: row.metrics[1] || 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  private extractTrafficSources(analyticsData: GoogleAnalyticsData): Array<{ source: string; visitors: number; percentage: number }> {
    const totalSessions = analyticsData.totals.sessions;
    return [
      { source: 'Direct', visitors: Math.floor(totalSessions * 0.4), percentage: 40 },
      { source: 'Organic Search', visitors: Math.floor(totalSessions * 0.3), percentage: 30 },
      { source: 'Social Media', visitors: Math.floor(totalSessions * 0.2), percentage: 20 },
      { source: 'Referral', visitors: Math.floor(totalSessions * 0.1), percentage: 10 }
    ];
  }

  private extractDeviceTypes(analyticsData: GoogleAnalyticsData): Array<{ device: string; percentage: number }> {
    return [
      { device: 'Desktop', percentage: 60 },
      { device: 'Mobile', percentage: 35 },
      { device: 'Tablet', percentage: 5 }
    ];
  }

  private calculateConversionRate(analyticsData: GoogleAnalyticsData): number {
    const sessions = analyticsData.totals.sessions;
    const conversions = Math.floor(sessions * 0.02); // 2% 가정
    return sessions > 0 ? (conversions / sessions) * 100 : 0;
  }

  private extractGoals(analyticsData: GoogleAnalyticsData): Array<{ name: string; completions: number; rate: number }> {
    const sessions = analyticsData.totals.sessions;
    return [
      { name: 'Page Views', completions: analyticsData.totals.pageviews, rate: 100 },
      { name: 'Contact Form', completions: Math.floor(sessions * 0.05), rate: 5 },
      { name: 'Newsletter Signup', completions: Math.floor(sessions * 0.03), rate: 3 }
    ];
  }

  private extractPerformanceTrend(analyticsData: GoogleAnalyticsData): Array<{ date: string; visitors: number; pageViews: number }> {
    const trend = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      trend.push({
        date: date.toISOString().split('T')[0],
        visitors: Math.floor(analyticsData.totals.sessions / 7),
        pageViews: Math.floor(analyticsData.totals.pageviews / 7)
      });
    }
    return trend;
  }

  private combinePerformanceTrends(websiteData: WebsiteAnalytics, instagramData: InstagramAnalytics): Array<{ date: string; websiteVisitors: number; instagramEngagement: number }> {
    const combined = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const websiteTrend = websiteData.performanceTrend.find(t => t.date === dateStr);
      const instagramTrend = instagramData.engagementTrend.find(t => t.date === dateStr);
      
      combined.push({
        date: dateStr,
        websiteVisitors: websiteTrend?.visitors || 0,
        instagramEngagement: instagramTrend?.engagement || 0
      });
    }
    return combined;
  }

  private combineTopContent(websiteData: WebsiteAnalytics, instagramData: InstagramAnalytics): Array<{ type: 'website' | 'instagram'; title: string; url: string; performance: number }> {
    const content = [];
    
    // 웹사이트 상위 페이지
    websiteData.topPages.slice(0, 5).forEach(page => {
      content.push({
        type: 'website' as const,
        title: page.title,
        url: page.path,
        performance: page.views
      });
    });
    
    // 인스타그램 상위 포스트
    instagramData.topPosts.slice(0, 5).forEach(post => {
      content.push({
        type: 'instagram' as const,
        title: post.caption?.substring(0, 50) + '...' || 'Instagram Post',
        url: post.permalink,
        performance: post.likeCount + post.commentsCount
      });
    });
    
    return content.sort((a, b) => b.performance - a.performance).slice(0, 10);
  }
}
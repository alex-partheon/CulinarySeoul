// TASK-014: 브랜드 디지털 마케팅 분석 및 SNS 관리 시스템 타입 정의

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface BrandAnalyticsConfig {
  id: string;
  brandId: string;
  gaPropertyId: string;
  gaMeasurementId?: string;
  domain: string;
  trackingEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandAnalytics {
  brandId: string;
  period: DateRange;
  overview: {
    totalSessions: number;
    totalPageviews: number;
    averageBounceRate: number;
    averageSessionDuration: number;
  };
  pageAnalytics: PageAnalytics[];
  trafficSources: TrafficSource[];
  deviceBreakdown: DeviceBreakdown[];
}

export interface PageAnalytics {
  pagePath: string;
  pageTitle: string;
  sessions: number;
  pageviews: number;
  bounceRate: number;
  avgTimeOnPage: number;
}

export interface TrafficSource {
  source: string;
  medium: string;
  sessions: number;
  percentage: number;
}

export interface DeviceBreakdown {
  deviceCategory: string;
  sessions: number;
  percentage: number;
}

export interface InstagramAccount {
  id: string;
  brandId: string;
  username: string;
  instagramUserId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  accountType: 'personal' | 'business';
  isActive: boolean;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstagramAccountData {
  username: string;
  accessToken: string;
  refreshToken?: string;
  accountType?: 'personal' | 'business';
}

export interface InstagramAnalytics {
  brandId: string;
  accountInfo: {
    username: string;
    followersCount: number;
    followingCount: number;
    mediaCount: number;
  };
  postsAnalytics: InstagramPostAnalytics[];
  engagementRate: number;
  topPerformingPosts: InstagramPostAnalytics[];
}

export interface InstagramPostAnalytics {
  id: string;
  mediaId: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  caption?: string;
  permalink: string;
  thumbnailUrl?: string;
  timestamp: string;
  likeCount: number;
  commentsCount: number;
  engagementRate: number;
}

export interface InstagramContentTracking {
  id: string;
  brandId: string;
  instagramMediaId: string;
  mediaType: string;
  caption?: string;
  permalink: string;
  thumbnailUrl?: string;
  timestamp: string;
  likeCount: number;
  commentsCount: number;
  engagementRate: number;
  trackedAt: string;
}

export interface GoogleAnalyticsResponse {
  dimensionHeaders: Array<{ name: string }>;
  metricHeaders: Array<{ name: string; type: string }>;
  rows: Array<{
    dimensionValues: Array<{ value: string }>;
    metricValues: Array<{ value: string }>;
  }>;
  totals: {
    sessions: number;
    pageviews: number;
    bounceRate: number;
    sessionDuration: number;
  };
}

export interface InstagramAPIResponse {
  data: Array<{
    id: string;
    media_type: string;
    caption?: string;
    permalink: string;
    thumbnail_url?: string;
    timestamp: string;
    like_count?: number;
    comments_count?: number;
  }>;
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export interface MarketingDashboardData {
  websiteAnalytics?: BrandAnalytics;
  instagramAnalytics?: InstagramAnalytics;
  isLoading: boolean;
  error?: string;
}

export interface AnalyticsFilters {
  dateRange: DateRange;
  metrics: string[];
  dimensions: string[];
}

export interface MarketingPerformanceReport {
  brandId: string;
  period: DateRange;
  websiteMetrics: {
    totalSessions: number;
    totalPageviews: number;
    conversionRate: number;
    topPages: PageAnalytics[];
  };
  socialMetrics: {
    totalFollowers: number;
    totalEngagement: number;
    avgEngagementRate: number;
    topPosts: InstagramPostAnalytics[];
  };
  insights: string[];
  recommendations: string[];
}
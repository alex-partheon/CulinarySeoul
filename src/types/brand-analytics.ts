// 브랜드 디지털 마케팅 분석 관련 타입 정의

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface BrandAnalyticsConfig {
  id: string;
  brand_id: string;
  ga_property_id: string;
  ga_measurement_id?: string;
  domain: string;
  tracking_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandAnalyticsOverview {
  totalSessions: number;
  totalPageviews: number;
  averageBounceRate: number;
  averageSessionDuration: number;
}

export interface PageAnalytics {
  pagePath: string;
  pageTitle: string;
  sessions: number;
  pageviews: number;
  bounceRate: number;
  sessionDuration: number;
}

export interface TrafficSource {
  source: string;
  medium?: string;
  sessions?: number;
  visitors: number;
  percentage: number;
}

export interface DeviceBreakdown {
  deviceCategory?: string;
  device: string;
  sessions?: number;
  visitors?: number;
  percentage: number;
}

export interface BrandAnalytics {
  brandId: string;
  period: DateRange;
  overview: BrandAnalyticsOverview;
  pageAnalytics: PageAnalytics[];
  trafficSources: TrafficSource[];
  deviceBreakdown: DeviceBreakdown[];
}

export interface InstagramAccountInfo {
  username: string;
  followersCount: number;
  followingCount: number;
  mediaCount: number;
}

export interface InstagramPostAnalytics {
  id?: string;
  mediaId?: string;
  mediaType: string;
  caption?: string;
  permalink: string;
  thumbnailUrl?: string;
  timestamp: string;
  likeCount: number;
  likesCount: number;
  commentCount?: number;
  commentsCount: number;
  engagementRate: number;
}

export interface EngagementTrend {
  date: string;
  engagement: number;
  engagementRate: number;
  postsCount: number;
}

export interface TopPage {
  path: string;
  views: number;
  pageViews: number;
  title: string;
  averageTimeOnPage: number;
}

export interface PerformanceTrend {
  date: string;
  pageViews: number;
  visitors: number;
}

export interface InstagramAnalytics {
  brandId?: string;
  accountInfo?: InstagramAccountInfo;
  postsAnalytics?: InstagramPostAnalytics[];
  engagementRate: number;
  averageEngagementRate: number;
  topPerformingPosts?: InstagramPostAnalytics[];
  followersCount: number;
  followersGrowth: number;
  totalLikes: number;
  totalComments: number;
  engagementTrend: EngagementTrend[];
  dailyEngagement?: { date: string; likes: number; comments: number }[];
  topPosts: InstagramPostAnalytics[];
  engagementByType?: { type: string; count: number }[];
  growthMetrics?: {
    followersGrowth: number;
    engagementGrowth: number;
    postsGrowth: number;
  };
  lastSyncAt?: string;
}

export interface InstagramAccountData {
  username: string;
  accessToken: string;
  refreshToken?: string;
}

export interface BrandInstagramAccount {
  id: string;
  brand_id: string;
  username: string;
  instagram_user_id: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  account_type: 'BUSINESS' | 'CREATOR';
  accountType: 'BUSINESS' | 'CREATOR';
  is_active: boolean;
  isActive: boolean;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
  lastSyncAt?: string;
  error?: string;
}

export interface InstagramContentTracking {
  id: string;
  brand_id: string;
  instagram_media_id: string;
  media_type: string;
  caption?: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  engagement_rate: number;
  tracked_at: string;
}

export interface GoogleAnalyticsData {
  totals: {
    sessions: number;
    pageviews: number;
    bounceRate: number;
    sessionDuration: number;
  };
  rows: Array<{
    dimensions: string[];
    metrics: number[];
  }>;
}

export interface WebsiteAnalytics {
  visitors: number;
  uniqueVisitors: number;
  totalVisitors: number;
  visitorsGrowth: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  averageSessionDuration: number;
  conversionRate: number;
  topPages: TopPage[];
  trafficSources: TrafficSource[];
  deviceBreakdown: DeviceBreakdown[];
  deviceTypes?: Array<{
    device: string;
    percentage: number;
  }>;
  goals?: Array<{
    name: string;
    completions: number;
    rate: number;
  }>;
  realTimeVisitors?: number;
  performanceTrend: PerformanceTrend[];
  lastSyncAt?: string;
}

export interface CombinedAnalytics {
  website: WebsiteAnalytics;
  instagram: InstagramAnalytics;
  overview: {
    totalVisitors: number;
    totalPageViews: number;
    totalFollowers: number;
    avgEngagementRate: number;
    totalReach: number;
    conversionRate: number;
  };
  performanceTrend: Array<{
    date: string;
    websiteVisitors: number;
    instagramEngagement: number;
  }>;
  topContent: Array<{
    type: 'website' | 'instagram';
    title: string;
    url: string;
    performance: number;
  }>;
}

export interface BrandAnalyticsCacheEntry {
  id: string;
  brand_id: string;
  data_type: 'website' | 'instagram' | 'combined';
  data: any;
  cached_at: string;
  expires_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Error Types
export interface AnalyticsError {
  code: string;
  message: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Settings Types
export interface AnalyticsSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  retentionDays: number;
  enableRealTime: boolean;
}

// Report Types
export interface MarketingReport {
  id: string;
  brandId: string;
  title: string;
  period: DateRange;
  sections: ReportSection[];
  generatedAt: string;
  format: 'pdf' | 'excel' | 'json';
}

export interface ReportSection {
  title: string;
  type: 'chart' | 'table' | 'summary';
  data: any;
  insights?: string[];
}

// Chart Types
export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

export interface TimeSeriesData {
  date: string;
  [key: string]: number | string;
}

// Filter Types
export interface AnalyticsFilter {
  dateRange: DateRange;
  metrics: string[];
  dimensions: string[];
  segments?: string[];
}

// Alert Types
export interface AnalyticsAlert {
  id: string;
  brandId: string;
  type: 'threshold' | 'anomaly' | 'goal';
  metric: string;
  condition: string;
  value: number;
  isActive: boolean;
  lastTriggered?: string;
}

// Dashboard Types
export interface DashboardConfig {
  brandId: string;
  layout: DashboardWidget[];
  refreshInterval: number;
  timezone: string;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'map';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: any;
}

// Export Types
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  dateRange: DateRange;
  metrics: string[];
  includeCharts: boolean;
}

export interface ExportResult {
  url: string;
  filename: string;
  size: number;
  expiresAt: string;
}

// Brand Info Type
export interface BrandInfo {
  id: string;
  name: string;
  description?: string;
  domain: string;
  code: string;
  company_id?: string;
  is_active?: boolean;
  brand_settings?: any;
  separation_readiness?: any;
  created_at?: string;
  updated_at?: string;
  property_id?: string;
}
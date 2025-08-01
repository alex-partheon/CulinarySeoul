// TASK-014: 구글 애널리틱스 API 클라이언트

import { DateRange, GoogleAnalyticsResponse, AnalyticsFilters } from '../../types/analytics';

export class GoogleAnalyticsClient {
  private apiKey: string;
  private baseUrl = 'https://analyticsdata.googleapis.com/v1beta';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * 구글 애널리틱스 리포트 조회
   */
  async getReports(params: {
    propertyId: string;
    dateRanges: DateRange[];
    dimensions: string[];
    metrics: string[];
  }): Promise<GoogleAnalyticsResponse> {
    try {
      const requestBody = {
        dateRanges: params.dateRanges.map(range => ({
          startDate: range.startDate,
          endDate: range.endDate
        })),
        dimensions: params.dimensions.map(dim => ({ name: dim })),
        metrics: params.metrics.map(metric => ({ name: metric }))
      };

      const response = await fetch(
        `${this.baseUrl}/properties/${params.propertyId}:runReport`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error(`Google Analytics API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformResponse(data);
    } catch (error) {
      console.error('Google Analytics API 호출 실패:', error);
      throw error;
    }
  }

  /**
   * 실시간 데이터 조회
   */
  async getRealtimeReport(propertyId: string, metrics: string[]): Promise<any> {
    try {
      const requestBody = {
        metrics: metrics.map(metric => ({ name: metric }))
      };

      const response = await fetch(
        `${this.baseUrl}/properties/${propertyId}:runRealtimeReport`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error(`Google Analytics Realtime API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Google Analytics 실시간 API 호출 실패:', error);
      throw error;
    }
  }

  /**
   * 페이지별 성과 분석
   */
  async getPageAnalytics(propertyId: string, dateRange: DateRange): Promise<any> {
    return this.getReports({
      propertyId,
      dateRanges: [dateRange],
      dimensions: ['pagePath', 'pageTitle'],
      metrics: ['sessions', 'pageviews', 'bounceRate', 'averageSessionDuration']
    });
  }

  /**
   * 트래픽 소스 분석
   */
  async getTrafficSources(propertyId: string, dateRange: DateRange): Promise<any> {
    return this.getReports({
      propertyId,
      dateRanges: [dateRange],
      dimensions: ['sessionSource', 'sessionMedium'],
      metrics: ['sessions', 'newUsers']
    });
  }

  /**
   * 디바이스 분석
   */
  async getDeviceBreakdown(propertyId: string, dateRange: DateRange): Promise<any> {
    return this.getReports({
      propertyId,
      dateRanges: [dateRange],
      dimensions: ['deviceCategory'],
      metrics: ['sessions', 'screenPageViews']
    });
  }

  /**
   * API 응답 데이터 변환
   */
  private transformResponse(data: any): GoogleAnalyticsResponse {
    const totals = {
      sessions: 0,
      pageviews: 0,
      bounceRate: 0,
      sessionDuration: 0
    };

    // 총계 계산
    if (data.totals && data.totals.length > 0) {
      const totalRow = data.totals[0];
      if (totalRow.metricValues) {
        totals.sessions = parseInt(totalRow.metricValues[0]?.value || '0');
        totals.pageviews = parseInt(totalRow.metricValues[1]?.value || '0');
        totals.bounceRate = parseFloat(totalRow.metricValues[2]?.value || '0');
        totals.sessionDuration = parseFloat(totalRow.metricValues[3]?.value || '0');
      }
    }

    return {
      dimensionHeaders: data.dimensionHeaders || [],
      metricHeaders: data.metricHeaders || [],
      rows: data.rows || [],
      totals
    };
  }

  /**
   * 날짜 범위 유효성 검증
   */
  private validateDateRange(dateRange: DateRange): boolean {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    const now = new Date();

    return start <= end && end <= now;
  }

  /**
   * API 키 유효성 검증
   */
  async validateApiKey(): Promise<boolean> {
    try {
      // 간단한 API 호출로 키 유효성 확인
      const response = await fetch(
        `${this.baseUrl}/metadata/properties`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}
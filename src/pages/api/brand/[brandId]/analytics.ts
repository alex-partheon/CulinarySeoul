// TASK-014: 브랜드 디지털 마케팅 분석 API 라우트

import type { NextApiRequest, NextApiResponse } from 'next';
import { BrandAnalyticsManager } from '../../../../lib/analytics/brand-analytics-manager';
import { InstagramAccountManager } from '../../../../lib/analytics/instagram-account-manager';
import { supabase } from '../../../../lib/supabase';
import { DateRange } from '../../../../types/analytics';
import type { WebsiteAnalytics, InstagramAnalytics, CombinedAnalytics } from '../../../../types/brand-analytics';

interface AnalyticsQuery {
  brandId: string;
  startDate?: string;
  endDate?: string;
  metrics?: string; // 'website' | 'instagram' | 'all'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { brandId } = req.query as { brandId: string };
  
  if (!brandId) {
    return res.status(400).json({ error: '브랜드 ID가 필요합니다.' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetAnalytics(req, res, brandId);
      case 'POST':
        return await handleSyncAnalytics(req, res, brandId);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: '허용되지 않는 메서드입니다.' });
    }
  } catch (error: any) {
    console.error('Analytics API 오류:', error);
    return res.status(500).json({ 
      error: '분석 데이터 처리 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
}

async function handleGetAnalytics(
  req: NextApiRequest,
  res: NextApiResponse,
  brandId: string
) {
  const { 
    startDate, 
    endDate, 
    metrics = 'all' 
  } = req.query as AnalyticsQuery;

  // 날짜 범위 설정 (기본값: 최근 30일)
  const dateRange: DateRange = {
    startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: endDate || new Date().toISOString().split('T')[0]
  };

  const analyticsManager = new BrandAnalyticsManager();
  const result: any = {};

  try {
    // 브랜드 존재 확인
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id, name')
      .eq('id', brandId)
      .single();

    if (brandError || !brand) {
      return res.status(404).json({ error: '브랜드를 찾을 수 없습니다.' });
    }

    // 웹사이트 분석 데이터
    if (metrics === 'website' || metrics === 'all') {
      try {
        const websiteAnalytics = await analyticsManager.getWebsiteAnalytics(brandId, dateRange);
        result.website = websiteAnalytics;
      } catch (error: any) {
        console.warn('웹사이트 분석 데이터 조회 실패:', error);
        result.website = null;
        result.websiteError = error instanceof Error ? error.message : '웹사이트 분석 데이터를 가져올 수 없습니다.';
      }
    }

    // 인스타그램 분석 데이터
    if (metrics === 'instagram' || metrics === 'all') {
      try {
        const instagramAnalytics = await analyticsManager.getInstagramAnalytics(brandId, dateRange);
        result.instagram = instagramAnalytics;
      } catch (error: any) {
        console.warn('인스타그램 분석 데이터 조회 실패:', error);
        result.instagram = null;
        result.instagramError = error instanceof Error ? error.message : '인스타그램 분석 데이터를 가져올 수 없습니다.';
      }
    }

    // 통합 분석 데이터
    if (metrics === 'all' && result.website && result.instagram) {
      try {
        const combinedAnalytics = await analyticsManager.getCombinedAnalytics(brandId, dateRange);
        result.combined = combinedAnalytics;
      } catch (error: any) {
        console.warn('통합 분석 데이터 생성 실패:', error);
        result.combinedError = error instanceof Error ? error.message : '통합 분석 데이터를 생성할 수 없습니다.';
      }
    }

    return res.status(200).json({
      success: true,
      data: result,
      metadata: {
        brandId,
        brandName: brand.name,
        dateRange,
        requestedMetrics: metrics,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('분석 데이터 조회 오류:', error);
    return res.status(500).json({
      error: '분석 데이터를 조회하는 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
}

async function handleSyncAnalytics(
  req: NextApiRequest,
  res: NextApiResponse,
  brandId: string
) {
  const { forceSync = false } = req.body;

  const instagramManager = new InstagramAccountManager();
  const analyticsManager = new BrandAnalyticsManager();
  const result: any = {};

  try {
    // 브랜드 존재 확인
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id, name')
      .eq('id', brandId)
      .single();

    if (brandError || !brand) {
      return res.status(404).json({ error: '브랜드를 찾을 수 없습니다.' });
    }

    // 인스타그램 데이터 동기화
    try {
      const instagramSyncResult = await instagramManager.syncAccountData(brandId, forceSync);
      result.instagram = {
        success: true,
        syncedAt: instagramSyncResult.lastSyncAt,
        contentCount: instagramSyncResult.contentCount,
        message: '인스타그램 데이터 동기화 완료'
      };
    } catch (error: any) {
      console.warn('인스타그램 동기화 실패:', error);
      result.instagram = {
        success: false,
        error: error instanceof Error ? error.message : '인스타그램 동기화 실패'
      };
    }

    // 웹사이트 분석 데이터 캐시 갱신
    try {
      const dateRange: DateRange = {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      };
      
      await analyticsManager.getWebsiteAnalytics(brandId, dateRange);
      result.website = {
        success: true,
        message: '웹사이트 분석 데이터 캐시 갱신 완료'
      };
    } catch (error: any) {
      console.warn('웹사이트 분석 캐시 갱신 실패:', error);
      result.website = {
        success: false,
        error: error instanceof Error ? error.message : '웹사이트 분석 캐시 갱신 실패'
      };
    }

    return res.status(200).json({
      success: true,
      message: '분석 데이터 동기화가 완료되었습니다.',
      data: result,
      metadata: {
        brandId,
        brandName: brand.name,
        syncedAt: new Date().toISOString(),
        forceSync
      }
    });

  } catch (error: any) {
    console.error('분석 데이터 동기화 오류:', error);
    return res.status(500).json({
      error: '분석 데이터 동기화 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
}
// TASK-014: 브랜드 디지털 마케팅 분석 페이지

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { BrandDigitalMarketingDashboard } from '../../components/dashboard/BrandDigitalMarketingDashboard';
import { InstagramAccountManager } from '../../domains/analytics/instagram-account-manager';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  Settings, 
  Instagram, 
  Globe, 
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface BrandInfo {
  id: string;
  name: string;
  description?: string;
  website?: string;
  instagram_handle?: string;
}

interface AnalyticsConfig {
  hasGoogleAnalytics: boolean;
  hasInstagram: boolean;
  googleAnalyticsPropertyId?: string;
  instagramUsername?: string;
}

export const BrandMarketingAnalyticsPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<BrandInfo | null>(null);
  const [analyticsConfig, setAnalyticsConfig] = useState<AnalyticsConfig>({
    hasGoogleAnalytics: false,
    hasInstagram: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountManager] = useState(() => new InstagramAccountManager());

  useEffect(() => {
    if (brandId) {
      loadBrandInfo();
      checkAnalyticsConfig();
    }
  }, [brandId]);

  const loadBrandInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name, description, website, instagram_handle')
        .eq('id', brandId)
        .single();

      if (error) {
        throw error;
      }

      setBrand(data);
    } catch (err: any) {
      console.error('브랜드 정보 로드 실패:', err);
      setError('브랜드 정보를 불러오는데 실패했습니다.');
    }
  };

  const checkAnalyticsConfig = async () => {
    try {
      setLoading(true);
      
      // 구글 애널리틱스 설정 확인
      const { data: gaConfig } = await supabase
        .from('brand_analytics_config')
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_active', true)
        .single();

      // 인스타그램 계정 상태 확인
      const instagramStatus = await accountManager.checkAccountStatus(brandId!);

      setAnalyticsConfig({
        hasGoogleAnalytics: !!gaConfig,
        hasInstagram: instagramStatus.isConnected,
        googleAnalyticsPropertyId: gaConfig?.property_id,
        instagramUsername: instagramStatus.username
      });
    } catch (err: any) {
      console.error('분석 설정 확인 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/brand/${brandId}`);
  };

  const handleSetupAnalytics = () => {
    navigate(`/brand/${brandId}/settings/analytics`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500 mb-4">{error || '브랜드를 찾을 수 없습니다.'}</p>
              <Button onClick={handleGoBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                돌아가기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const hasAnyAnalytics = analyticsConfig.hasGoogleAnalytics || analyticsConfig.hasInstagram;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={handleGoBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              돌아가기
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {brand.name} - 디지털 마케팅 분석
              </h1>
              <p className="text-gray-600 mt-1">
                웹사이트 및 소셜미디어 통합 성과 분석
              </p>
            </div>
          </div>
          <Button onClick={handleSetupAnalytics} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            분석 설정
          </Button>
        </div>

        {/* 브랜드 정보 및 연결 상태 */}
        <Card>
          <CardHeader>
            <CardTitle>연결 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 브랜드 기본 정보 */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <span className="font-medium">브랜드</span>
                </div>
                <div className="text-sm text-gray-600">{brand.name}</div>
                {brand.description && (
                  <div className="text-xs text-gray-500 mt-1">{brand.description}</div>
                )}
              </div>

              {/* 웹사이트 */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">웹사이트</span>
                </div>
                {brand.website ? (
                  <div className="flex items-center gap-2">
                    <a 
                      href={brand.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {brand.website.replace(/^https?:\/\//, '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">설정되지 않음</div>
                )}
              </div>

              {/* 구글 애널리틱스 */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-orange-500 rounded" />
                  <span className="font-medium">구글 애널리틱스</span>
                </div>
                <div className="flex items-center gap-2">
                  {analyticsConfig.hasGoogleAnalytics ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Badge variant="outline" className="text-green-600">
                        연결됨
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <Badge variant="outline" className="text-yellow-600">
                        미연결
                      </Badge>
                    </>
                  )}
                </div>
                {analyticsConfig.googleAnalyticsPropertyId && (
                  <div className="text-xs text-gray-500 mt-1">
                    ID: {analyticsConfig.googleAnalyticsPropertyId}
                  </div>
                )}
              </div>

              {/* 인스타그램 */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <span className="font-medium">인스타그램</span>
                </div>
                <div className="flex items-center gap-2">
                  {analyticsConfig.hasInstagram ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Badge variant="outline" className="text-green-600">
                        연결됨
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <Badge variant="outline" className="text-yellow-600">
                        미연결
                      </Badge>
                    </>
                  )}
                </div>
                {analyticsConfig.instagramUsername && (
                  <div className="text-xs text-gray-500 mt-1">
                    @{analyticsConfig.instagramUsername}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 분석 대시보드 또는 설정 안내 */}
        {hasAnyAnalytics ? (
          <BrandDigitalMarketingDashboard brandId={brandId!} />
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="max-w-md mx-auto">
                <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">
                  분석 도구를 설정해주세요
                </h3>
                <p className="text-gray-600 mb-6">
                  디지털 마케팅 성과를 분석하려면 구글 애널리틱스 또는 인스타그램 계정을 연결해야 합니다.
                </p>
                <div className="space-y-3">
                  <Button onClick={handleSetupAnalytics} className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    분석 도구 설정하기
                  </Button>
                  <div className="text-sm text-gray-500">
                    설정 후 데이터 수집까지 최대 24시간이 소요될 수 있습니다.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 부분 설정 안내 */}
        {hasAnyAnalytics && (!analyticsConfig.hasGoogleAnalytics || !analyticsConfig.hasInstagram) && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm text-yellow-800">
                    {!analyticsConfig.hasGoogleAnalytics && !analyticsConfig.hasInstagram
                      ? '구글 애널리틱스와 인스타그램을 모두 연결하면 더 완전한 분석이 가능합니다.'
                      : !analyticsConfig.hasGoogleAnalytics
                      ? '구글 애널리틱스를 연결하면 웹사이트 성과도 함께 분석할 수 있습니다.'
                      : '인스타그램을 연결하면 소셜미디어 성과도 함께 분석할 수 있습니다.'}
                  </p>
                </div>
                <Button onClick={handleSetupAnalytics} variant="outline" size="sm">
                  설정하기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
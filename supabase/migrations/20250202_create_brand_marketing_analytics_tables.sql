-- TASK-014: 브랜드 디지털 마케팅 분석 및 SNS 관리 시스템
-- 브랜드별 구글 애널리틱스 및 인스타그램 분석을 위한 테이블 생성

-- 브랜드 구글 애널리틱스 설정
CREATE TABLE brand_analytics_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE UNIQUE,
  ga_property_id VARCHAR(50) NOT NULL,
  ga_measurement_id VARCHAR(50),
  domain VARCHAR(200) NOT NULL,
  tracking_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 브랜드 인스타그램 계정
CREATE TABLE brand_instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE UNIQUE,
  username VARCHAR(100) NOT NULL,
  instagram_user_id VARCHAR(50) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  account_type VARCHAR(20) DEFAULT 'personal',
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인스타그램 컨텐츠 추적
CREATE TABLE instagram_content_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  instagram_media_id VARCHAR(50) NOT NULL,
  media_type VARCHAR(20) NOT NULL,
  caption TEXT,
  permalink VARCHAR(500),
  thumbnail_url VARCHAR(500),
  timestamp TIMESTAMP,
  like_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  tracked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(brand_id, instagram_media_id)
);

-- 브랜드 웹사이트 분석 데이터 (일별 집계)
CREATE TABLE brand_website_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sessions INTEGER DEFAULT 0,
  pageviews INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  returning_users INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(brand_id, date)
);

-- 인덱스 생성
CREATE INDEX idx_brand_analytics_config_brand_id ON brand_analytics_config(brand_id);
CREATE INDEX idx_brand_instagram_accounts_brand_id ON brand_instagram_accounts(brand_id);
CREATE INDEX idx_instagram_content_tracking_brand_id ON instagram_content_tracking(brand_id);
CREATE INDEX idx_instagram_content_tracking_media_id ON instagram_content_tracking(instagram_media_id);
CREATE INDEX idx_brand_website_analytics_brand_date ON brand_website_analytics(brand_id, date);

-- RLS 정책 설정
ALTER TABLE brand_analytics_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_content_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_website_analytics ENABLE ROW LEVEL SECURITY;

-- 브랜드 구글 애널리틱스 설정 RLS 정책
CREATE POLICY "Users can view analytics config for their brands" ON brand_analytics_config
  FOR SELECT USING (
    brand_id IN (
      SELECT b.id FROM brands b
      JOIN brand_users bu ON b.id = bu.brand_id
      WHERE bu.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage analytics config for their brands" ON brand_analytics_config
  FOR ALL USING (
    brand_id IN (
      SELECT b.id FROM brands b
      JOIN brand_users bu ON b.id = bu.brand_id
      WHERE bu.user_id = auth.uid()
      AND bu.role IN ('owner', 'admin')
    )
  );

-- 브랜드 인스타그램 계정 RLS 정책
CREATE POLICY "Users can view instagram accounts for their brands" ON brand_instagram_accounts
  FOR SELECT USING (
    brand_id IN (
      SELECT b.id FROM brands b
      JOIN brand_users bu ON b.id = bu.brand_id
      WHERE bu.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage instagram accounts for their brands" ON brand_instagram_accounts
  FOR ALL USING (
    brand_id IN (
      SELECT b.id FROM brands b
      JOIN brand_users bu ON b.id = bu.brand_id
      WHERE bu.user_id = auth.uid()
      AND bu.role IN ('owner', 'admin')
    )
  );

-- 인스타그램 컨텐츠 추적 RLS 정책
CREATE POLICY "Users can view instagram content for their brands" ON instagram_content_tracking
  FOR SELECT USING (
    brand_id IN (
      SELECT b.id FROM brands b
      JOIN brand_users bu ON b.id = bu.brand_id
      WHERE bu.user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage instagram content tracking" ON instagram_content_tracking
  FOR ALL USING (true);

-- 브랜드 웹사이트 분석 데이터 RLS 정책
CREATE POLICY "Users can view website analytics for their brands" ON brand_website_analytics
  FOR SELECT USING (
    brand_id IN (
      SELECT b.id FROM brands b
      JOIN brand_users bu ON b.id = bu.brand_id
      WHERE bu.user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage website analytics" ON brand_website_analytics
  FOR ALL USING (true);
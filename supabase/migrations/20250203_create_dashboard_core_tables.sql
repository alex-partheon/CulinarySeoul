-- CulinarySeoul 대시보드 핵심 테이블 생성
-- Dashboard Core Tables for CulinarySeoul ERP System

-- 1. 회사 테이블 (Companies)
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    business_registration_number VARCHAR(50),
    address JSONB,
    contact_info JSONB,
    settings JSONB DEFAULT '{
        "timezone": "Asia/Seoul",
        "currency": "KRW",
        "language": "ko",
        "fiscal_year_start": "01-01",
        "business_hours": {
            "start": "09:00",
            "end": "18:00",
            "days": ["mon", "tue", "wed", "thu", "fri"]
        }
    }'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 브랜드 테이블 (Brands)
CREATE TABLE IF NOT EXISTS brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100), -- 음식점, 카페, 베이커리 등
    description TEXT,
    brand_settings JSONB DEFAULT '{
        "theme": {
            "primary_color": "#2563eb",
            "secondary_color": "#64748b",
            "logo_url": null
        },
        "business_model": "franchise",
        "target_market": "general",
        "operating_model": "hybrid"
    }'::jsonb,
    separation_readiness JSONB DEFAULT '{
        "financial_independence": 0,
        "operational_independence": 0,
        "system_independence": 0,
        "legal_independence": 0,
        "overall_score": 0,
        "last_assessment": null
    }'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, code)
);

-- 3. 매장 테이블 (Stores)
CREATE TABLE IF NOT EXISTS stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    store_type store_type_enum DEFAULT 'direct',
    address JSONB,
    contact_info JSONB,
    operating_hours JSONB DEFAULT '{
        "monday": {"open": "09:00", "close": "22:00", "closed": false},
        "tuesday": {"open": "09:00", "close": "22:00", "closed": false},
        "wednesday": {"open": "09:00", "close": "22:00", "closed": false},
        "thursday": {"open": "09:00", "close": "22:00", "closed": false},
        "friday": {"open": "09:00", "close": "22:00", "closed": false},
        "saturday": {"open": "10:00", "close": "21:00", "closed": false},
        "sunday": {"open": "10:00", "close": "21:00", "closed": false}
    }'::jsonb,
    manager_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(brand_id, code)
);

-- 4. 메뉴 카테고리 테이블 (Menu Categories)
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 메뉴 아이템 테이블 (Menu Items)
CREATE TABLE IF NOT EXISTS items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) DEFAULT 0,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    image_url TEXT,
    nutritional_info JSONB,
    allergen_info JSONB,
    preparation_time INTEGER, -- 분 단위
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 고객 테이블 (Customers)
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255),
    phone VARCHAR(20),
    name VARCHAR(255),
    birth_date DATE,
    gender VARCHAR(10),
    address JSONB,
    preferences JSONB DEFAULT '{
        "dietary_restrictions": [],
        "favorite_items": [],
        "communication_preferences": {
            "email": true,
            "sms": false,
            "push": true
        }
    }'::jsonb,
    loyalty_points INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    last_order_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 공급업체 테이블 (Suppliers)
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    business_registration_number VARCHAR(50),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address JSONB,
    payment_terms JSONB DEFAULT '{
        "payment_method": "bank_transfer",
        "payment_days": 30,
        "discount_terms": null
    }'::jsonb,
    rating DECIMAL(3,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_companies_code ON companies(code);
CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_brands_company_id ON brands(company_id);
CREATE INDEX idx_brands_code ON brands(code);
CREATE INDEX idx_stores_brand_id ON stores(brand_id);
CREATE INDEX idx_stores_code ON stores(code);
CREATE INDEX idx_menu_categories_brand_id ON menu_categories(brand_id);
CREATE INDEX idx_items_brand_id ON items(brand_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_suppliers_code ON suppliers(code);

-- RLS 정책 설정
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Companies RLS 정책
CREATE POLICY "Users can view companies they belong to" ON companies
    FOR SELECT USING (
        id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Brands RLS 정책
CREATE POLICY "Users can view brands they have access to" ON brands
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
        OR
        id IN (
            SELECT unnest(allowed_brand_ids::uuid[]) 
            FROM user_permissions 
            WHERE user_id = auth.uid()
        )
    );

-- Stores RLS 정책
CREATE POLICY "Users can view stores they have access to" ON stores
    FOR SELECT USING (
        brand_id IN (
            SELECT id FROM brands WHERE company_id IN (
                SELECT company_id FROM users WHERE id = auth.uid()
            )
        )
    );

-- Menu Categories RLS 정책
CREATE POLICY "Users can view menu categories for accessible brands" ON menu_categories
    FOR SELECT USING (
        brand_id IN (
            SELECT id FROM brands WHERE company_id IN (
                SELECT company_id FROM users WHERE id = auth.uid()
            )
        )
    );

-- Items RLS 정책
CREATE POLICY "Users can view items for accessible brands" ON items
    FOR SELECT USING (
        brand_id IN (
            SELECT id FROM brands WHERE company_id IN (
                SELECT company_id FROM users WHERE id = auth.uid()
            )
        )
    );

-- Customers RLS 정책
CREATE POLICY "Users can view customers" ON customers
    FOR SELECT USING (true); -- 모든 인증된 사용자가 고객 정보 조회 가능

-- Suppliers RLS 정책
CREATE POLICY "Users can view suppliers" ON suppliers
    FOR SELECT USING (true); -- 모든 인증된 사용자가 공급업체 정보 조회 가능

-- 업데이트 트리거 추가
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
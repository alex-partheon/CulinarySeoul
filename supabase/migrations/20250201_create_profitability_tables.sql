-- 수익성 분석 시스템 테이블 생성
-- Profitability Analysis System Tables Creation

-- 1. 주문 테이블 (Sales Orders)
-- 판매 주문을 추적하고 관리합니다
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL, -- 주문번호
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('dine_in', 'takeout', 'delivery', 'wholesale')), -- 주문 유형
    customer_id UUID REFERENCES users(id), -- 고객 ID (B2C의 경우)
    customer_name VARCHAR(100), -- 고객명 (B2B 또는 비회원)
    store_id UUID NOT NULL REFERENCES stores(id), -- 매장 ID
    brand_id UUID NOT NULL REFERENCES brands(id), -- 브랜드 ID
    order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- 주문 일시
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 총 금액
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 세금
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 할인 금액
    net_amount DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 순 금액
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'completed', 'cancelled')), -- 주문 상태
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded')), -- 결제 상태
    notes TEXT, -- 비고
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- 2. 주문 상세 항목 테이블 (Order Line Items with FIFO Cost)
-- FIFO 원가 추적을 포함한 주문 라인 항목
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id),
    quantity DECIMAL(10, 3) NOT NULL CHECK (quantity > 0), -- 수량
    unit_price DECIMAL(12, 2) NOT NULL CHECK (unit_price >= 0), -- 단가
    unit_cost DECIMAL(12, 2) NOT NULL CHECK (unit_cost >= 0), -- 단위 원가 (FIFO 기준)
    total_amount DECIMAL(12, 2) NOT NULL GENERATED ALWAYS AS (quantity * unit_price) STORED, -- 총 금액
    total_cost DECIMAL(12, 2) NOT NULL GENERATED ALWAYS AS (quantity * unit_cost) STORED, -- 총 원가
    gross_margin DECIMAL(12, 2) GENERATED ALWAYS AS ((quantity * unit_price) - (quantity * unit_cost)) STORED, -- 매출 총이익
    margin_rate DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN quantity * unit_price > 0 THEN ((quantity * unit_price - quantity * unit_cost) / (quantity * unit_price) * 100)
            ELSE 0
        END
    ) STORED, -- 이익률 (%)
    lot_details JSONB, -- FIFO 로트 상세 정보 [{lot_id, quantity, unit_cost}]
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 원가 구조 테이블 (Overhead and Labor Cost Allocation)
-- 간접비 및 인건비 배분
CREATE TABLE IF NOT EXISTS cost_structures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES stores(id),
    brand_id UUID NOT NULL REFERENCES brands(id),
    period_start DATE NOT NULL, -- 기간 시작
    period_end DATE NOT NULL, -- 기간 종료
    labor_cost DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 인건비
    overhead_cost DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 간접비
    rent_cost DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 임대료
    utility_cost DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 공과금
    marketing_cost DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 마케팅비
    other_cost DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 기타 비용
    total_cost DECIMAL(12, 2) GENERATED ALWAYS AS (
        labor_cost + overhead_cost + rent_cost + utility_cost + marketing_cost + other_cost
    ) STORED, -- 총 비용
    allocation_method VARCHAR(20) NOT NULL DEFAULT 'revenue' CHECK (allocation_method IN ('revenue', 'quantity', 'custom')), -- 배분 방법
    allocation_details JSONB, -- 배분 상세 정보
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    CONSTRAINT unique_cost_period UNIQUE (store_id, period_start, period_end)
);

-- 4. 마진 목표 테이블 (Target Margins by Item/Category)
-- 품목/카테고리별 목표 마진
CREATE TABLE IF NOT EXISTS margin_targets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES items(id), -- 특정 품목 (NULL이면 카테고리 적용)
    category VARCHAR(50), -- 카테고리 (item_id가 NULL일 때 사용)
    brand_id UUID REFERENCES brands(id),
    store_id UUID REFERENCES stores(id), -- 특정 매장 (NULL이면 브랜드 전체)
    target_margin_rate DECIMAL(5, 2) NOT NULL CHECK (target_margin_rate >= 0 AND target_margin_rate <= 100), -- 목표 마진율 (%)
    min_margin_rate DECIMAL(5, 2) CHECK (min_margin_rate >= 0 AND min_margin_rate <= 100), -- 최소 마진율 (%)
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE, -- 적용 시작일
    expiry_date DATE, -- 적용 종료일
    priority INTEGER NOT NULL DEFAULT 0, -- 우선순위 (높을수록 우선 적용)
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    CONSTRAINT check_margin_target_scope CHECK (
        (item_id IS NOT NULL AND category IS NULL) OR 
        (item_id IS NULL AND category IS NOT NULL)
    )
);

-- 5. 수익성 캐시 테이블 (Cached Profitability Reports)
-- 성능 향상을 위한 수익성 보고서 캐시
CREATE TABLE IF NOT EXISTS profitability_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cache_key VARCHAR(255) UNIQUE NOT NULL, -- 캐시 키
    report_type VARCHAR(50) NOT NULL, -- 보고서 유형 (daily, weekly, monthly, item, category)
    store_id UUID REFERENCES stores(id),
    brand_id UUID REFERENCES brands(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    revenue DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 매출
    cost_of_goods DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 매출원가
    gross_profit DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 매출총이익
    gross_margin_rate DECIMAL(5, 2) NOT NULL DEFAULT 0, -- 매출총이익률
    labor_cost DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 인건비
    overhead_cost DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 간접비
    operating_profit DECIMAL(12, 2) NOT NULL DEFAULT 0, -- 영업이익
    operating_margin_rate DECIMAL(5, 2) NOT NULL DEFAULT 0, -- 영업이익률
    item_count INTEGER NOT NULL DEFAULT 0, -- 품목 수
    order_count INTEGER NOT NULL DEFAULT 0, -- 주문 수
    report_data JSONB NOT NULL, -- 상세 보고서 데이터
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- 생성 시각
    expires_at TIMESTAMPTZ NOT NULL, -- 만료 시각
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (Performance Indexes)
CREATE INDEX idx_orders_store_date ON orders(store_id, order_date DESC);
CREATE INDEX idx_orders_brand_date ON orders(brand_id, order_date DESC);
CREATE INDEX idx_orders_status ON orders(status) WHERE status != 'completed';
CREATE INDEX idx_orders_customer ON orders(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_item ON order_items(item_id);
CREATE INDEX idx_order_items_margin ON order_items(margin_rate) WHERE margin_rate < 30; -- 저마진 품목 모니터링

CREATE INDEX idx_cost_structures_store_period ON cost_structures(store_id, period_start, period_end);
CREATE INDEX idx_cost_structures_brand_period ON cost_structures(brand_id, period_start, period_end);

CREATE INDEX idx_margin_targets_item ON margin_targets(item_id) WHERE item_id IS NOT NULL;
CREATE INDEX idx_margin_targets_category ON margin_targets(category) WHERE category IS NOT NULL;
CREATE INDEX idx_margin_targets_effective ON margin_targets(effective_date, expiry_date);

CREATE INDEX idx_profitability_cache_key ON profitability_cache(cache_key);
CREATE INDEX idx_profitability_cache_expires ON profitability_cache(expires_at);
CREATE INDEX idx_profitability_cache_type_period ON profitability_cache(report_type, period_start, period_end);

-- updated_at 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_structures_updated_at BEFORE UPDATE ON cost_structures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_margin_targets_updated_at BEFORE UPDATE ON margin_targets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profitability_cache_updated_at BEFORE UPDATE ON profitability_cache
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE margin_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE profitability_cache ENABLE ROW LEVEL SECURITY;

-- Orders RLS Policies
CREATE POLICY "Users can view orders from their authorized stores"
    ON orders FOR SELECT
    USING (
        store_id IN (
            SELECT store_id FROM user_store_roles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create orders for their authorized stores"
    ON orders FOR INSERT
    WITH CHECK (
        store_id IN (
            SELECT store_id FROM user_store_roles 
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'manager', 'staff')
        )
    );

CREATE POLICY "Users can update orders from their authorized stores"
    ON orders FOR UPDATE
    USING (
        store_id IN (
            SELECT store_id FROM user_store_roles 
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'manager')
        )
    );

-- Order Items RLS Policies
CREATE POLICY "Users can view order items from their authorized stores"
    ON order_items FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM orders 
            WHERE store_id IN (
                SELECT store_id FROM user_store_roles 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create order items for their authorized stores"
    ON order_items FOR INSERT
    WITH CHECK (
        order_id IN (
            SELECT id FROM orders 
            WHERE store_id IN (
                SELECT store_id FROM user_store_roles 
                WHERE user_id = auth.uid()
                AND role IN ('owner', 'manager', 'staff')
            )
        )
    );

-- Cost Structures RLS Policies
CREATE POLICY "Users can view cost structures for their authorized stores"
    ON cost_structures FOR SELECT
    USING (
        store_id IN (
            SELECT store_id FROM user_store_roles 
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'manager')
        )
    );

CREATE POLICY "Only owners can manage cost structures"
    ON cost_structures FOR ALL
    USING (
        store_id IN (
            SELECT store_id FROM user_store_roles 
            WHERE user_id = auth.uid()
            AND role = 'owner'
        )
    );

-- Margin Targets RLS Policies
CREATE POLICY "Users can view margin targets for their authorized stores"
    ON margin_targets FOR SELECT
    USING (
        (store_id IS NULL AND brand_id IN (
            SELECT brand_id FROM user_brand_roles 
            WHERE user_id = auth.uid()
        )) OR
        (store_id IN (
            SELECT store_id FROM user_store_roles 
            WHERE user_id = auth.uid()
        ))
    );

CREATE POLICY "Only owners and managers can manage margin targets"
    ON margin_targets FOR ALL
    USING (
        (store_id IS NULL AND brand_id IN (
            SELECT brand_id FROM user_brand_roles 
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'manager')
        )) OR
        (store_id IN (
            SELECT store_id FROM user_store_roles 
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'manager')
        ))
    );

-- Profitability Cache RLS Policies
CREATE POLICY "Users can view cached reports for their authorized stores"
    ON profitability_cache FOR SELECT
    USING (
        (store_id IS NULL AND brand_id IN (
            SELECT brand_id FROM user_brand_roles 
            WHERE user_id = auth.uid()
        )) OR
        (store_id IN (
            SELECT store_id FROM user_store_roles 
            WHERE user_id = auth.uid()
        ))
    );

-- 샘플 데이터 삽입 (Sample Data for Testing)
-- 주문 샘플 데이터
INSERT INTO orders (id, order_number, order_type, customer_name, store_id, brand_id, order_date, total_amount, tax_amount, net_amount, status, payment_status)
VALUES 
    ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'ORD-2025-0001', 'dine_in', '김철수', 
     (SELECT id FROM stores WHERE name = '밀랍떡볶이 성수점'), 
     (SELECT id FROM brands WHERE name = '밀랍떡볶이'), 
     '2025-01-15 12:30:00+09', 45000, 4500, 40500, 'completed', 'paid'),
    ('550e8400-e29b-41d4-a716-446655440000', 'ORD-2025-0002', 'delivery', '이영희', 
     (SELECT id FROM stores WHERE name = '밀랍떡볶이 성수점'), 
     (SELECT id FROM brands WHERE name = '밀랍떡볶이'), 
     '2025-01-15 18:45:00+09', 38000, 3800, 34200, 'completed', 'paid'),
    ('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'ORD-2025-0003', 'takeout', '박민수', 
     (SELECT id FROM stores WHERE name = '밀랍떡볶이 강남점'), 
     (SELECT id FROM brands WHERE name = '밀랍떡볶이'), 
     '2025-01-16 13:15:00+09', 25000, 2500, 22500, 'completed', 'paid');

-- 주문 상세 샘플 데이터 (떡볶이 메뉴 기준)
INSERT INTO order_items (order_id, item_id, quantity, unit_price, unit_cost, lot_details)
VALUES 
    ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 
     (SELECT id FROM items WHERE name = '밀떡' LIMIT 1), 
     2, 15000, 6000, 
     '[{"lot_id": "LOT-2025-001", "quantity": 2, "unit_cost": 6000}]'::jsonb),
    ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 
     (SELECT id FROM items WHERE name = '모짜렐라치즈' LIMIT 1), 
     1, 3000, 1500, 
     '[{"lot_id": "LOT-2025-002", "quantity": 1, "unit_cost": 1500}]'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440000', 
     (SELECT id FROM items WHERE name = '밀떡' LIMIT 1), 
     1, 15000, 6000, 
     '[{"lot_id": "LOT-2025-001", "quantity": 1, "unit_cost": 6000}]'::jsonb),
    ('550e8400-e29b-41d4-a716-446655440000', 
     (SELECT id FROM items WHERE name = '어묵' LIMIT 1), 
     3, 2000, 800, 
     '[{"lot_id": "LOT-2025-003", "quantity": 3, "unit_cost": 800}]'::jsonb);

-- 원가 구조 샘플 데이터
INSERT INTO cost_structures (store_id, brand_id, period_start, period_end, labor_cost, overhead_cost, rent_cost, utility_cost, marketing_cost, allocation_method)
VALUES 
    ((SELECT id FROM stores WHERE name = '밀랍떡볶이 성수점'), 
     (SELECT id FROM brands WHERE name = '밀랍떡볶이'), 
     '2025-01-01', '2025-01-31', 8500000, 2000000, 3500000, 800000, 500000, 'revenue'),
    ((SELECT id FROM stores WHERE name = '밀랍떡볶이 강남점'), 
     (SELECT id FROM brands WHERE name = '밀랍떡볶이'), 
     '2025-01-01', '2025-01-31', 9000000, 2500000, 4500000, 1000000, 700000, 'revenue');

-- 마진 목표 샘플 데이터
INSERT INTO margin_targets (item_id, brand_id, target_margin_rate, min_margin_rate, effective_date, priority)
VALUES 
    ((SELECT id FROM items WHERE name = '밀떡' LIMIT 1), 
     (SELECT id FROM brands WHERE name = '밀랍떡볶이'), 
     65.0, 55.0, '2025-01-01', 10),
    (NULL, (SELECT id FROM brands WHERE name = '밀랍떡볶이'), 
     60.0, 50.0, '2025-01-01', 5); -- 카테고리 기본값

-- 마진 목표 카테고리 데이터
INSERT INTO margin_targets (category, brand_id, target_margin_rate, min_margin_rate, effective_date, priority)
VALUES 
    ('메인메뉴', (SELECT id FROM brands WHERE name = '밀랍떡볶이'), 65.0, 55.0, '2025-01-01', 8),
    ('사이드메뉴', (SELECT id FROM brands WHERE name = '밀랍떡볶이'), 70.0, 60.0, '2025-01-01', 7),
    ('음료', (SELECT id FROM brands WHERE name = '밀랍떡볶이'), 75.0, 65.0, '2025-01-01', 6);

-- 수익성 캐시 샘플 데이터
INSERT INTO profitability_cache (
    cache_key, report_type, store_id, brand_id, period_start, period_end,
    revenue, cost_of_goods, gross_profit, gross_margin_rate,
    labor_cost, overhead_cost, operating_profit, operating_margin_rate,
    item_count, order_count, report_data, expires_at
)
VALUES 
    ('daily_seongsu_20250115', 'daily', 
     (SELECT id FROM stores WHERE name = '밀랍떡볶이 성수점'),
     (SELECT id FROM brands WHERE name = '밀랍떡볶이'),
     '2025-01-15', '2025-01-15',
     1250000, 437500, 812500, 65.0,
     280000, 120000, 412500, 33.0,
     25, 87,
     '{"top_items": ["밀떡", "모짜렐라치즈", "어묵"], "peak_hours": ["12-13", "18-20"]}'::jsonb,
     NOW() + INTERVAL '1 day');

-- 주문 총액 업데이트 함수
CREATE OR REPLACE FUNCTION update_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE orders
        SET total_amount = (
            SELECT COALESCE(SUM(total_amount), 0)
            FROM order_items
            WHERE order_id = NEW.order_id
        )
        WHERE id = NEW.order_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE orders
        SET total_amount = (
            SELECT COALESCE(SUM(total_amount), 0)
            FROM order_items
            WHERE order_id = OLD.order_id
        )
        WHERE id = OLD.order_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 주문 총액 업데이트 트리거
CREATE TRIGGER update_order_totals_trigger
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW EXECUTE FUNCTION update_order_totals();

-- 캐시 만료 정리 함수
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM profitability_cache
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 권한 부여 (Grant Permissions)
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;
GRANT ALL ON cost_structures TO authenticated;
GRANT ALL ON margin_targets TO authenticated;
GRANT ALL ON profitability_cache TO authenticated;

-- 코멘트 추가 (Add Comments)
COMMENT ON TABLE orders IS '판매 주문 관리 테이블';
COMMENT ON TABLE order_items IS 'FIFO 원가 추적을 포함한 주문 상세 항목';
COMMENT ON TABLE cost_structures IS '매장별 간접비 및 인건비 관리';
COMMENT ON TABLE margin_targets IS '품목/카테고리별 목표 마진율 설정';
COMMENT ON TABLE profitability_cache IS '수익성 보고서 캐시 (성능 최적화)';

COMMENT ON COLUMN orders.order_type IS '주문 유형: 매장(dine_in), 포장(takeout), 배달(delivery), 도매(wholesale)';
COMMENT ON COLUMN order_items.lot_details IS 'FIFO 로트 추적 정보 [{lot_id, quantity, unit_cost}]';
COMMENT ON COLUMN cost_structures.allocation_method IS '원가 배분 방법: 매출비례(revenue), 수량비례(quantity), 사용자정의(custom)';
COMMENT ON COLUMN margin_targets.priority IS '우선순위 - 높을수록 우선 적용 (품목 > 카테고리 > 기본값)';
COMMENT ON COLUMN profitability_cache.cache_key IS '캐시 식별 키 - 보고서유형_매장_기간 형식';
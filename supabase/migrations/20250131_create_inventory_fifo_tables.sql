-- TASK-006: FIFO 기반 원재료 관리 시스템 데이터베이스 스키마
-- 원재료, 재고 로트, 재고 이동 기록 테이블 생성

-- 원재료 마스터 테이블
CREATE TABLE IF NOT EXISTS raw_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL, -- kg, L, ea, box 등
    minimum_stock_level DECIMAL(10,3) DEFAULT 0,
    maximum_stock_level DECIMAL(10,3),
    reorder_point DECIMAL(10,3) DEFAULT 0,
    standard_cost JSONB, -- {"amount": 1000, "currency": "KRW"}
    nutritional_info JSONB, -- 영양 정보
    storage_conditions JSONB, -- 보관 조건
    quality_specifications JSONB, -- 품질 규격
    supplier_info JSONB, -- 기본 공급업체 정보
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 재고 로트 테이블 (FIFO 핵심 테이블)
CREATE TABLE IF NOT EXISTS inventory_lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES raw_materials(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    lot_number VARCHAR(100) NOT NULL,
    received_date DATE NOT NULL,
    expiry_date DATE,
    received_quantity DECIMAL(10,3) NOT NULL,
    available_quantity DECIMAL(10,3) NOT NULL,
    unit_cost JSONB NOT NULL, -- {"amount": 1000, "currency": "KRW"}
    supplier_info JSONB, -- 공급업체 정보
    quality_check_result JSONB, -- 품질 검사 결과
    storage_location VARCHAR(100), -- 보관 위치
    status VARCHAR(50) DEFAULT 'active', -- active, depleted, expired, quarantine
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 복합 인덱스로 FIFO 조회 성능 최적화
    CONSTRAINT unique_lot_per_store UNIQUE(store_id, lot_number)
);

-- 재고 이동 기록 테이블
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES raw_materials(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL, -- purchase, usage, adjustment, transfer, waste
    quantity DECIMAL(10,3) NOT NULL,
    unit_cost JSONB, -- {"amount": 1000, "currency": "KRW"}
    total_cost JSONB, -- {"amount": 10000, "currency": "KRW"}
    transaction_id VARCHAR(100), -- 트랜잭션 그룹핑용
    reference_id VARCHAR(100), -- 참조 문서 ID (주문서, 레시피 등)
    lot_details JSONB, -- 사용된 로트 상세 정보
    notes TEXT,
    movement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 재고 조정 기록 테이블
CREATE TABLE IF NOT EXISTS inventory_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES raw_materials(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    lot_id UUID REFERENCES inventory_lots(id) ON DELETE CASCADE,
    old_quantity DECIMAL(10,3) NOT NULL,
    new_quantity DECIMAL(10,3) NOT NULL,
    adjustment_quantity DECIMAL(10,3) NOT NULL,
    reason VARCHAR(100) NOT NULL, -- count_discrepancy, damage, expiry, theft, etc.
    notes TEXT,
    adjusted_by UUID REFERENCES auth.users(id),
    adjusted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 폐기 기록 테이블
CREATE TABLE IF NOT EXISTS waste_disposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES raw_materials(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    lot_id UUID REFERENCES inventory_lots(id) ON DELETE CASCADE,
    quantity DECIMAL(10,3) NOT NULL,
    waste_reason VARCHAR(100) NOT NULL, -- expired, damaged, contaminated, overstock
    disposal_method VARCHAR(100), -- trash, compost, recycle, return_supplier
    cost_impact JSONB, -- {"amount": 5000, "currency": "KRW"}
    environmental_impact JSONB, -- 환경 영향 데이터
    disposed_by UUID REFERENCES auth.users(id),
    disposal_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 재고 알림 테이블
CREATE TABLE IF NOT EXISTS inventory_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    material_id UUID REFERENCES raw_materials(id) ON DELETE CASCADE,
    lot_id UUID REFERENCES inventory_lots(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- low_stock, expiry_warning, overstock, quality_issue
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_required BOOLEAN DEFAULT false,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_inventory_lots_fifo ON inventory_lots(material_id, store_id, received_date, created_at) WHERE status = 'active' AND available_quantity > 0;
CREATE INDEX IF NOT EXISTS idx_inventory_lots_expiry ON inventory_lots(store_id, expiry_date) WHERE status = 'active' AND available_quantity > 0 AND expiry_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inventory_movements_date ON inventory_movements(store_id, movement_date);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_transaction ON inventory_movements(transaction_id);
CREATE INDEX IF NOT EXISTS idx_raw_materials_category ON raw_materials(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_unresolved ON inventory_alerts(store_id, alert_type, created_at) WHERE is_resolved = false;

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_raw_materials_updated_at BEFORE UPDATE ON raw_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_lots_updated_at BEFORE UPDATE ON inventory_lots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 트리거 함수: 재고 부족 알림 자동 생성
CREATE OR REPLACE FUNCTION check_low_stock_alert()
RETURNS TRIGGER AS $$
DECLARE
    material_record raw_materials%ROWTYPE;
    current_total_stock DECIMAL(10,3);
BEGIN
    -- 원재료 정보 조회
    SELECT * INTO material_record FROM raw_materials WHERE id = NEW.material_id;
    
    -- 해당 매장의 총 재고량 계산
    SELECT COALESCE(SUM(available_quantity), 0) INTO current_total_stock
    FROM inventory_lots 
    WHERE material_id = NEW.material_id 
      AND store_id = NEW.store_id 
      AND status = 'active' 
      AND available_quantity > 0;
    
    -- 재고 부족 체크
    IF current_total_stock <= material_record.reorder_point THEN
        INSERT INTO inventory_alerts (
            store_id, material_id, alert_type, severity, title, message, action_required
        ) VALUES (
            NEW.store_id,
            NEW.material_id,
            'low_stock',
            CASE 
                WHEN current_total_stock <= material_record.minimum_stock_level THEN 'critical'
                ELSE 'high'
            END,
            format('%s 재고 부족', material_record.name),
            format('%s의 현재 재고량(%s %s)이 재주문점(%s %s) 이하입니다. 즉시 발주가 필요합니다.',
                material_record.name, current_total_stock, material_record.unit,
                material_record.reorder_point, material_record.unit),
            true
        )
        ON CONFLICT DO NOTHING; -- 중복 알림 방지
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 재고 변동 시 알림 체크 트리거
CREATE TRIGGER trigger_check_low_stock 
    AFTER UPDATE OF available_quantity ON inventory_lots 
    FOR EACH ROW 
    WHEN (OLD.available_quantity IS DISTINCT FROM NEW.available_quantity)
    EXECUTE FUNCTION check_low_stock_alert();

-- 트리거 함수: 유통기한 임박 알림 자동 생성
CREATE OR REPLACE FUNCTION check_expiry_alert()
RETURNS TRIGGER AS $$
DECLARE
    days_until_expiry INTEGER;
    material_name VARCHAR(255);
BEGIN
    -- 유통기한이 있는 경우만 체크
    IF NEW.expiry_date IS NOT NULL AND NEW.available_quantity > 0 AND NEW.status = 'active' THEN
        days_until_expiry := NEW.expiry_date - CURRENT_DATE;
        
        SELECT name INTO material_name FROM raw_materials WHERE id = NEW.material_id;
        
        -- 유통기한 임박 알림 (7일 이내)
        IF days_until_expiry <= 7 AND days_until_expiry >= 0 THEN
            INSERT INTO inventory_alerts (
                store_id, material_id, lot_id, alert_type, severity, title, message, action_required
            ) VALUES (
                NEW.store_id,
                NEW.material_id,
                NEW.id,
                'expiry_warning',
                CASE 
                    WHEN days_until_expiry <= 1 THEN 'critical'
                    WHEN days_until_expiry <= 3 THEN 'high'
                    ELSE 'medium'
                END,
                format('%s 유통기한 임박', material_name),
                format('로트 %s (%s %s)의 유통기한이 %s일 남았습니다. (만료일: %s)',
                    NEW.lot_number, NEW.available_quantity, 
                    (SELECT unit FROM raw_materials WHERE id = NEW.material_id),
                    days_until_expiry, NEW.expiry_date),
                true
            )
            ON CONFLICT DO NOTHING;
        
        -- 유통기한 만료 알림
        ELSIF days_until_expiry < 0 THEN
            INSERT INTO inventory_alerts (
                store_id, material_id, lot_id, alert_type, severity, title, message, action_required
            ) VALUES (
                NEW.store_id,
                NEW.material_id,
                NEW.id,
                'expired',
                'critical',
                format('%s 유통기한 만료', material_name),
                format('로트 %s (%s %s)가 유통기한을 %s일 초과했습니다. 즉시 폐기 처리가 필요합니다. (만료일: %s)',
                    NEW.lot_number, NEW.available_quantity,
                    (SELECT unit FROM raw_materials WHERE id = NEW.material_id),
                    ABS(days_until_expiry), NEW.expiry_date),
                true
            )
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 유통기한 체크 트리거
CREATE TRIGGER trigger_check_expiry 
    AFTER INSERT OR UPDATE ON inventory_lots 
    FOR EACH ROW 
    EXECUTE FUNCTION check_expiry_alert();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_disposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

-- 원재료 마스터 접근 정책 (모든 인증된 사용자 읽기 가능)
CREATE POLICY "raw_materials_select_policy" ON raw_materials
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "raw_materials_insert_policy" ON raw_materials
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_roles ur 
            JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() 
            AND r.name IN ('admin', 'manager')
        )
    );

CREATE POLICY "raw_materials_update_policy" ON raw_materials
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_roles ur 
            JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = auth.uid() 
            AND r.name IN ('admin', 'manager')
        )
    );

-- 재고 로트 접근 정책 (매장별 접근 제어)
CREATE POLICY "inventory_lots_select_policy" ON inventory_lots
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_store_access usa 
            WHERE usa.user_id = auth.uid() 
            AND usa.store_id = inventory_lots.store_id
        )
    );

CREATE POLICY "inventory_lots_insert_policy" ON inventory_lots
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_store_access usa 
            WHERE usa.user_id = auth.uid() 
            AND usa.store_id = inventory_lots.store_id
            AND usa.can_manage_inventory = true
        )
    );

CREATE POLICY "inventory_lots_update_policy" ON inventory_lots
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_store_access usa 
            WHERE usa.user_id = auth.uid() 
            AND usa.store_id = inventory_lots.store_id
            AND usa.can_manage_inventory = true
        )
    );

-- 재고 이동 기록 접근 정책
CREATE POLICY "inventory_movements_select_policy" ON inventory_movements
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_store_access usa 
            WHERE usa.user_id = auth.uid() 
            AND usa.store_id = inventory_movements.store_id
        )
    );

CREATE POLICY "inventory_movements_insert_policy" ON inventory_movements
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_store_access usa 
            WHERE usa.user_id = auth.uid() 
            AND usa.store_id = inventory_movements.store_id
            AND usa.can_manage_inventory = true
        )
    );

-- 재고 조정 기록 접근 정책
CREATE POLICY "inventory_adjustments_select_policy" ON inventory_adjustments
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_store_access usa 
            WHERE usa.user_id = auth.uid() 
            AND usa.store_id = inventory_adjustments.store_id
        )
    );

CREATE POLICY "inventory_adjustments_insert_policy" ON inventory_adjustments
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_store_access usa 
            WHERE usa.user_id = auth.uid() 
            AND usa.store_id = inventory_adjustments.store_id
            AND usa.can_manage_inventory = true
        )
    );

-- 폐기 기록 접근 정책
CREATE POLICY "waste_disposals_select_policy" ON waste_disposals
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_store_access usa 
            WHERE usa.user_id = auth.uid() 
            AND usa.store_id = waste_disposals.store_id
        )
    );

CREATE POLICY "waste_disposals_insert_policy" ON waste_disposals
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_store_access usa 
            WHERE usa.user_id = auth.uid() 
            AND usa.store_id = waste_disposals.store_id
            AND usa.can_manage_inventory = true
        )
    );

-- 재고 알림 접근 정책
CREATE POLICY "inventory_alerts_select_policy" ON inventory_alerts
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_store_access usa 
            WHERE usa.user_id = auth.uid() 
            AND usa.store_id = inventory_alerts.store_id
        )
    );

CREATE POLICY "inventory_alerts_update_policy" ON inventory_alerts
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_store_access usa 
            WHERE usa.user_id = auth.uid() 
            AND usa.store_id = inventory_alerts.store_id
        )
    );

-- 샘플 데이터 삽입 (개발/테스트용)
INSERT INTO raw_materials (name, description, category, unit, minimum_stock_level, maximum_stock_level, reorder_point, standard_cost, nutritional_info, storage_conditions) VALUES
('한우 등심', '1++ 등급 한우 등심', 'meat', 'kg', 5.0, 50.0, 10.0, '{"amount": 45000, "currency": "KRW"}', '{"protein": 26.1, "fat": 18.6, "calories": 268}', '{"temperature": {"min": -2, "max": 2}, "humidity": {"min": 80, "max": 85}}'),
('연어 필렛', '노르웨이산 연어 필렛', 'seafood', 'kg', 3.0, 30.0, 8.0, '{"amount": 28000, "currency": "KRW"}', '{"protein": 25.4, "fat": 13.4, "calories": 208}', '{"temperature": {"min": -1, "max": 1}, "humidity": {"min": 85, "max": 90}}'),
('올리브오일', '엑스트라 버진 올리브오일', 'oil', 'L', 2.0, 20.0, 5.0, '{"amount": 15000, "currency": "KRW"}', '{"fat": 100, "calories": 884}', '{"temperature": {"min": 15, "max": 25}, "humidity": {"min": 50, "max": 70}}'),
('양파', '국산 양파', 'vegetable', 'kg', 10.0, 100.0, 20.0, '{"amount": 2000, "currency": "KRW"}', '{"carbohydrate": 9.3, "fiber": 1.7, "calories": 40}', '{"temperature": {"min": 0, "max": 4}, "humidity": {"min": 85, "max": 95}}'),
('소금', '천일염', 'seasoning', 'kg', 5.0, 50.0, 10.0, '{"amount": 3000, "currency": "KRW"}', '{"sodium": 38758}', '{"temperature": {"min": 10, "max": 30}, "humidity": {"min": 40, "max": 60}}');

-- 코멘트 추가
COMMENT ON TABLE raw_materials IS 'FIFO 시스템의 원재료 마스터 테이블';
COMMENT ON TABLE inventory_lots IS 'FIFO 재고 관리의 핵심 테이블 - 로트별 재고 추적';
COMMENT ON TABLE inventory_movements IS '모든 재고 이동 기록 (입고, 출고, 조정, 이동, 폐기)';
COMMENT ON TABLE inventory_adjustments IS '재고 조정 기록 (실사, 손실, 손상 등)';
COMMENT ON TABLE waste_disposals IS '폐기 처리 기록 및 환경 영향 추적';
COMMENT ON TABLE inventory_alerts IS '재고 관련 알림 (부족, 유통기한, 과재고 등)';
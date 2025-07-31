# CulinarySeoul ERP 시스템 개발 태스크 v1.0

**프로젝트 개요**: React Router 7 기반 이중 대시보드 ERP + 브랜드 분리 지원 시스템
- **culinaryseoul.com/dashboard**: 회사 통합 대시보드 (전체 브랜드 관리)
- **cafe-millab.com/dashboard**: 브랜드 독립 대시보드 (브랜드별 운영)
- **핵심 혁신**: 하이브리드 권한 시스템 + FIFO 재고 추적 + 완전한 브랜드 분리 지원

**개발 기간**: 40주 (완전 서비스 구현 + 브랜드 분리 시스템)
**팀 구성**: 7명 (PM, Senior Lead Dev, Frontend Dev, Backend Dev, UI/UX Designer, QA Engineer, DevOps)

---

## 📋 Phase 1: 기반 구조 및 이중 대시보드 구축 (Week 1-10)

### TASK-001: 새로운 Supabase 프로젝트 및 기본 아키텍처 구축
**우선순위**: P0 🔴 **크기**: XL (2주) **담당자**: Senior Lead Developer  
**개발방법론**: Architecture-First Design + DDD

**설명**: 기존 시스템과 완전 분리된 새로운 Supabase 프로젝트 생성 및 이중 대시보드 지원 아키텍처 구축

**완료 기준**:
- [ ] 새로운 Supabase 프로젝트 생성 (CulinarySeoul-ERP-Pro)
- [ ] React Router 7 Framework Mode 프로젝트 초기화
- [ ] 이중 대시보드 라우팅 시스템 구현
- [ ] 회사-브랜드-매장 계층 구조 데이터 모델 설계
- [ ] 기본 인증 시스템 (Supabase Auth) 통합
- [ ] 개발 환경 및 빌드 시스템 구성
- [ ] Git 브랜치 전략 및 협업 워크플로우 설정

**기술 구현**:
```typescript
// lib/router/dashboard-router.ts
export const DASHBOARD_ROUTES = {
  company: {
    domain: 'culinaryseoul.com',
    basePath: '/dashboard',
    layout: 'CompanyLayout'
  },
  brand: {
    domain: 'cafe-millab.com', 
    basePath: '/dashboard',
    layout: 'BrandLayout'
  }
};

// lib/auth/dashboard-context.ts
export type DashboardContext = {
  type: 'company' | 'brand';
  currentBrand?: string;
  permissions: Permission[];
  hybridAccess: boolean;
};
```

---

### TASK-002: 하이브리드 권한 시스템 및 사용자 관리 구현
**우선순위**: P0 🔴 **크기**: XL (2주) **담당자**: Senior Lead Developer + Backend Developer  
**개발방법론**: Security-First Design + TDD

**설명**: 회사와 브랜드 권한을 동시에 가질 수 있는 하이브리드 권한 시스템 및 교차 플랫폼 접근 제어 구현

**완료 기준**:
- [ ] 복합 권한 데이터베이스 스키마 설계
- [ ] 하이브리드 권한 사용자 인증 로직
- [ ] 대시보드별 접근 권한 검증 미들웨어
- [ ] 브랜드 컨텍스트 전환 시스템
- [ ] 권한별 UI 컴포넌트 분기 처리
- [ ] 세션 관리 및 보안 정책 구현
- [ ] 권한 변경 이력 추적 시스템
- [ ] 보안 테스트 (90% 커버리지)

**핵심 스키마**:
```sql
-- 하이브리드 권한 관리 테이블
CREATE TABLE dashboard_access_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  can_access_company_dashboard BOOLEAN DEFAULT false,
  can_access_brand_dashboard BOOLEAN DEFAULT false,
  hybrid_permissions JSONB DEFAULT '{}',
  company_dashboard_permissions JSONB DEFAULT '{}',
  brand_dashboard_permissions JSONB DEFAULT '{}',
  cross_platform_access JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 대시보드 세션 관리
CREATE TABLE dashboard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dashboard_type dashboard_type_enum NOT NULL,
  brand_context UUID REFERENCES brands(id),
  session_token VARCHAR(500) UNIQUE NOT NULL,
  brand_switches JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

---

### TASK-003: 회사-브랜드-매장 핵심 데이터 모델 구현
**우선순위**: P0 🔴 **크기**: L (1주) **담당자**: Senior Lead Developer + Backend Developer  
**개발방법론**: DDD + Schema-First Design

**설명**: CulinarySeoul > 밀랍 > 성수점 계층 구조를 지원하는 핵심 데이터 모델 및 RLS 정책 구현

**완료 기준**:
- [ ] 회사(CulinarySeoul) 기본 정보 테이블
- [ ] 브랜드(밀랍) 관리 테이블 
- [ ] 매장(성수점) 관리 테이블
- [ ] 계층별 데이터 격리 RLS 정책
- [ ] 브랜드별 설정 및 테마 관리
- [ ] 매장별 운영 정보 관리
- [ ] 데이터 무결성 제약 조건
- [ ] 기본 CRUD API 엔드포인트

**계층 구조**:
```sql
-- 회사 테이블
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'CulinarySeoul',
  domain TEXT NOT NULL DEFAULT 'culinaryseoul.com',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 브랜드 테이블
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '밀랍',
  code TEXT NOT NULL DEFAULT 'millab',
  domain TEXT NOT NULL DEFAULT 'cafe-millab.com',
  brand_settings JSONB DEFAULT '{}',
  separation_readiness JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, code)
);

-- 매장 테이블
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '성수점',
  code TEXT NOT NULL DEFAULT 'SeongSu', 
  store_type store_type_enum DEFAULT 'direct',
  address JSONB DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  operating_hours JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### TASK-004: 회사 통합 대시보드 기본 구조 구현
**우선순위**: P0 🔴 **크기**: XL (1.5주) **담당자**: Senior Frontend Developer + UI/UX Designer  
**개발방법론**: Component-Driven Development + Design System

**설명**: culinaryseoul.com/dashboard 회사 통합 대시보드의 기본 레이아웃 및 네비게이션 시스템 구현

**완료 기준**:
- [ ] 통합 대시보드 메인 레이아웃 구현
- [ ] 사이드바 네비게이션 (브랜드 관리, 재고, 매출, 시스템 관리)
- [ ] 브랜드 빠른 전환 컴포넌트
- [ ] 사용자 프로필 및 알림 센터
- [ ] 실시간 브랜드 현황 카드
- [ ] 통합 검색 기능
- [ ] 반응형 모바일 지원
- [ ] 접근성 WCAG 2.1 AA 준수

**핵심 컴포넌트**:
```typescript
// components/dashboard/CompanyDashboardLayout.tsx
interface CompanyDashboardLayout {
  header: {
    companyLogo: string;
    userProfile: UserProfile;
    notifications: NotificationCenter;
    brandSwitcher: BrandSwitcher;
  };
  sidebar: {
    companyOverview: MenuItem;
    brandManagement: MenuItem[];
    inventoryManagement: MenuItem[];
    salesManagement: MenuItem[];
    systemManagement: MenuItem;
  };
  mainContent: {
    dashboardType: 'company_overview' | 'brand_detail';
    activeFilters: BrandFilter[];
    realTimeData: boolean;
  };
}

// components/BrandSwitcher.tsx
export function BrandSwitcher() {
  return (
    <Select onValueChange={handleBrandSwitch}>
      <SelectTrigger>
        <SelectValue placeholder="브랜드 선택" />
      </SelectTrigger>
      <SelectContent>
        {brands.map(brand => (
          <SelectItem key={brand.id} value={brand.id}>
            {brand.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

---

### TASK-005: 브랜드 독립 대시보드 기본 구조 구현
**우선순위**: P0 🔴 **크기**: XL (1.5주) **담당자**: Senior Frontend Developer + UI/UX Designer  
**개발방법론**: Component-Driven Development + Brand-First Design

**설명**: cafe-millab.com/dashboard 브랜드 독립 대시보드의 기본 레이아웃 및 브랜드 전용 기능 구현

**완료 기준**:
- [ ] 브랜드 독립 대시보드 메인 레이아웃
- [ ] 브랜드 전용 사이드바 네비게이션
- [ ] 매장 관리 인터페이스
- [ ] 본사 연결 상태 표시
- [ ] 브랜드별 테마 시스템
- [ ] 독립 운영 준비 상태 표시
- [ ] 브랜드 웹사이트 관리 링크
- [ ] 분리 준비도 진행률 표시

**브랜드 대시보드 구조**:
```typescript
// components/dashboard/BrandDashboardLayout.tsx
interface BrandDashboardLayout {
  header: {
    brandLogo: string;
    brandName: string;
    userProfile: UserProfile;
    companyConnectionStatus: ConnectionStatus;
  };
  sidebar: {
    brandOverview: MenuItem;
    storeManagement: MenuItem[];
    inventoryManagement: MenuItem[];
    salesAnalysis: MenuItem;
    websiteManagement: MenuItem[];
    marketingTools: MenuItem;
  };
  mainContent: {
    brandFocusedView: boolean;
    independentOperation: boolean;
    separationReadiness: SeparationStatus;
  };
}

// 독립 운영 준비 상태
interface SeparationStatus {
  dataCompleteness: number;        // 데이터 완성도 (%)
  systemReadiness: number;         // 시스템 준비도 (%)
  independentCapability: number;   // 독립 운영 능력 (%)
  estimatedSeparationTime: string; // 예상 분리 소요 시간
}
```

---

## 📋 Phase 2: FIFO 재고 관리 및 핵심 기능 개발 (Week 11-24)

### TASK-006: FIFO 기반 원재료 관리 시스템 구현
**우선순위**: P0 🔴 **크기**: XL (2주) **담당자**: Senior Lead Developer + Backend Developer  
**개발방법론**: TDD + Domain-Driven Design

**설명**: 선입선출(FIFO) 방식의 정확한 원재료 원가 추적 및 재고 관리 시스템 구현

**완료 기준**:
- [ ] 원재료 마스터 데이터 관리
- [ ] FIFO 기반 입고/출고 처리 엔진
- [ ] 실시간 재고 수량 및 원가 추적
- [ ] 로트별 유통기한 관리
- [ ] 안전재고 알림 시스템
- [ ] 재고 조정 및 폐기 처리
- [ ] 재고 회전율 분석
- [ ] 단위 테스트 95% 커버리지

**FIFO 엔진 구현**:
```typescript
// lib/inventory/fifo-engine.ts
export class FIFOInventoryEngine {
  async processOutbound(materialId: string, quantity: number): Promise<OutboundResult> {
    // 1. FIFO 순서로 재고 조회 (입고일 순)
    const stockLots = await this.getStockLotsByFIFO(materialId);
    
    // 2. 순차적으로 출고 처리
    const usedLots: UsedLot[] = [];
    let remainingQuantity = quantity;
    
    for (const lot of stockLots) {
      if (remainingQuantity <= 0) break;
      
      const usedFromLot = Math.min(lot.availableQuantity, remainingQuantity);
      usedLots.push({
        lotId: lot.id,
        quantity: usedFromLot,
        unitCost: lot.unitCost,
        totalCost: usedFromLot * lot.unitCost
      });
      
      remainingQuantity -= usedFromLot;
      
      // 재고 차감
      await this.updateStockLot(lot.id, lot.availableQuantity - usedFromLot);
    }
    
    // 3. 가중평균 원가 계산
    const totalCost = usedLots.reduce((sum, lot) => sum + lot.totalCost, 0);
    const averageUnitCost = totalCost / quantity;
    
    return {
      success: remainingQuantity === 0,
      usedLots,
      totalCost,
      averageUnitCost,
      shortageQuantity: remainingQuantity
    };
  }
}

// 재고 로트 테이블
CREATE TABLE inventory_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES raw_materials(id),
  store_id UUID REFERENCES stores(id),
  lot_number TEXT NOT NULL,
  received_date DATE NOT NULL,
  expiry_date DATE,
  received_quantity DECIMAL(10,3) NOT NULL,
  available_quantity DECIMAL(10,3) NOT NULL,
  unit_cost DECIMAL(10,2) NOT NULL,
  supplier_info JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### TASK-007: 매출 아이템별 레시피 및 자동 투입량 차감 시스템
**우선순위**: P0 🔴 **크기**: XL (2주) **담당자**: Senior Lead Developer + Backend Developer  
**개발방법론**: Event-Driven Architecture + TDD

**설명**: 매출 발생 시 설정된 레시피 기반으로 원재료를 자동 차감하는 시스템 구현

**완료 기준**:
- [ ] 매출 아이템별 레시피 관리 시스템
- [ ] 대시보드별 레시피 수정 권한 관리
- [ ] 매출 발생 시 자동 투입량 차감 이벤트
- [ ] 실시간 원가 계산 및 마진 분석
- [ ] 재고 부족 시 알림 및 처리
- [ ] 투입량 변경 이력 추적
- [ ] 레시피 버전 관리
- [ ] 통합 테스트 90% 커버리지

**레시피 시스템 구현**:
```typescript
// lib/recipe/recipe-engine.ts
export class RecipeEngine {
  async processSaleAutoDeduction(saleItem: SaleItem, quantity: number): Promise<DeductionResult> {
    // 1. 레시피 조회
    const recipe = await this.getActiveRecipe(saleItem.id);
    if (!recipe) {
      throw new Error(`레시피가 설정되지 않음: ${saleItem.name}`);
    }
    
    // 2. 필요한 원재료 계산
    const requiredMaterials = recipe.ingredients.map(ingredient => ({
      materialId: ingredient.rawMaterialId,
      requiredQuantity: ingredient.requiredQuantity * quantity,
      unit: ingredient.unit
    }));
    
    // 3. FIFO 기반 차감 처리
    const deductionResults = [];
    for (const material of requiredMaterials) {
      const result = await this.fifoEngine.processOutbound(
        material.materialId, 
        material.requiredQuantity
      );
      
      if (!result.success) {
        // 재고 부족 알림
        await this.notifyStockShortage(material.materialId, result.shortageQuantity);
      }
      
      deductionResults.push(result);
    }
    
    // 4. 실제 원가 계산
    const actualCost = deductionResults.reduce((sum, result) => sum + result.totalCost, 0);
    const profitMargin = (saleItem.price * quantity) - actualCost;
    
    // 5. 투입 내역 기록
    await this.recordIngredientUsage({
      saleItemId: saleItem.id,
      quantity,
      actualCost,
      profitMargin,
      deductionResults,
      processedAt: new Date()
    });
    
    return {
      success: deductionResults.every(r => r.success),
      actualCost,
      profitMargin,
      marginRate: (profitMargin / (saleItem.price * quantity)) * 100
    };
  }
}

// 레시피 테이블
CREATE TABLE sales_item_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_item_id UUID NOT NULL,
  sales_item_name TEXT NOT NULL,
  brand_id UUID REFERENCES brands(id),
  ingredients JSONB NOT NULL, -- 원재료 목록 및 투입량
  labor_cost_per_unit DECIMAL(8,2) DEFAULT 0,
  overhead_cost_per_unit DECIMAL(8,2) DEFAULT 0,
  target_margin_rate DECIMAL(5,2) DEFAULT 30.00,
  managed_from_company_dashboard BOOLEAN DEFAULT false,
  managed_from_brand_dashboard BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  updated_from dashboard_type_enum
);
```

---

### TASK-008: 토스페이먼츠 연동 및 매출 데이터 자동 수집
**우선순위**: P0 🔴 **크기**: L (1주) **담당자**: Senior Lead Developer  
**개발방법론**: API-First Design + Security-First

**설명**: 토스페이먼츠 API 연동으로 매출 데이터 자동 수집 및 실시간 재고 차감 트리거 시스템 구현

**완료 기준**:
- [ ] 토스페이먼츠 SDK 통합
- [ ] 매일 자정~오전 6시 매출 데이터 수집 스케줄러
- [ ] 매출 데이터 검증 및 중복 방지
- [ ] 매출 발생 시 자동 재고 차감 트리거
- [ ] 실시간 대시보드 업데이트
- [ ] 결제 실패 및 환불 처리
- [ ] 웹훅 보안 검증 (HMAC)
- [ ] 결제 테스트 자동화

**토스페이먼츠 연동**:
```typescript
// lib/payments/toss-integration.ts
export class TossPaymentsIntegration {
  private scheduler: SalesDataScheduler;
  
  constructor() {
    this.scheduler = new SalesDataScheduler({
      cronExpression: '0 0-6 * * *', // 매일 자정~6시
      retryAttempts: 3,
      retryInterval: 300000 // 5분
    });
  }
  
  async collectDailySalesData(date: Date): Promise<SalesCollection> {
    try {
      // 1. 토스페이먼츠에서 해당 날짜 매출 조회
      const payments = await this.tossAPI.getPaymentsByDate(date);
      
      // 2. 중복 체크 및 검증
      const newPayments = await this.filterNewPayments(payments);
      
      // 3. 매출 데이터 저장
      const salesRecords = await this.saveSalesRecords(newPayments);
      
      // 4. 자동 재고 차감 트리거
      for (const record of salesRecords) {
        await this.triggerAutoDeduction(record);
      }
      
      // 5. 실시간 대시보드 업데이트
      await this.updateDashboards(salesRecords);
      
      return {
        totalAmount: salesRecords.reduce((sum, r) => sum + r.amount, 0),
        recordCount: salesRecords.length,
        processedAt: new Date()
      };
    } catch (error) {
      await this.handleCollectionError(error, date);
      throw error;
    }
  }
  
  private async triggerAutoDeduction(salesRecord: SalesRecord): Promise<void> {
    // 이벤트 발행으로 레시피 엔진 트리거
    await this.eventBus.publish('sale_recorded', {
      saleId: salesRecord.id,
      items: salesRecord.items,
      storeId: salesRecord.storeId,
      timestamp: salesRecord.createdAt
    });
  }
}

// 매출 데이터 수집 스케줄러
CREATE TABLE sales_collection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_date DATE NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  records_collected INTEGER DEFAULT 0,
  total_amount DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, success, failed, retry
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### TASK-009: 실시간 재고 현황 대시보드 구현
**우선순위**: P0 🔴 **크기**: L (1주) **담당자**: Senior Frontend Developer  
**개발방법론**: Real-time First + Component-Driven Development

**설명**: 양쪽 대시보드에서 실시간 재고 현황을 파악할 수 있는 시각화 및 알림 시스템 구현

**완료 기준**:
- [ ] 실시간 재고 현황 카드 컴포넌트
- [ ] 재고 부족 알림 시스템
- [ ] 재고 회전율 차트 (Recharts)
- [ ] 유통기한 임박 알림
- [ ] 대시보드별 재고 뷰 차별화
- [ ] 재고 조정 인터페이스
- [ ] 재고 이동 처리 (매장 간)
- [ ] 모바일 반응형 지원

**실시간 재고 대시보드**:
```typescript
// components/inventory/InventoryDashboard.tsx
export function InventoryDashboard({ dashboardType }: { dashboardType: 'company' | 'brand' }) {
  const [inventory, setInventory] = useState<InventoryData[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  
  // Supabase Realtime 구독
  useEffect(() => {
    const subscription = supabase
      .channel('inventory_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'inventory_lots'
      }, (payload) => {
        updateInventoryData(payload);
      })
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <div className="grid gap-4">
      {/* 재고 현황 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InventoryCard
          title="총 재고 가치"
          value={inventory.reduce((sum, item) => sum + item.totalValue, 0)}
          format="currency"
        />
        <InventoryCard
          title="부족 재고"
          value={alerts.filter(a => a.type === 'low_stock').length}
          status="warning"
        />
        <InventoryCard
          title="유통기한 임박"
          value={alerts.filter(a => a.type === 'expiry_warning').length}
          status="danger"
        />
        <InventoryCard
          title="재고 회전율"
          value={calculateTurnoverRate(inventory)}
          suffix="회/월"
        />
      </div>
      
      {/* 재고 상세 테이블 */}
      <InventoryTable
        data={inventory}
        onAdjust={handleInventoryAdjustment}
        onTransfer={handleInventoryTransfer}
        viewMode={dashboardType}
      />
      
      {/* 재고 트렌드 차트 */}
      <InventoryTrendChart data={inventory} />
    </div>
  );
}

// 재고 알림 시스템
interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'expiry_warning' | 'out_of_stock';
  materialId: string;
  materialName: string;
  currentQuantity: number;
  threshold: number;
  expiryDate?: Date;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}
```

---

### TASK-010: 수익성 분석 및 원가 관리 시스템
**우선순위**: P1 🟠 **크기**: L (1주) **담당자**: Senior Lead Developer + Frontend Developer  
**개발방법론**: Analytics-First + TDD

**설명**: FIFO 기반 정확한 원가로 실시간 수익성 분석 및 아이템별 마진 관리 시스템 구현

**완료 기준**:
- [ ] 실시간 손익 계산 시스템
- [ ] 아이템별 수익성 분석
- [ ] 원가 구조 분석 (재료비, 인건비, 간접비)
- [ ] 목표 마진 대비 실제 마진 추적
- [ ] 수익성 트렌드 분석
- [ ] 대시보드별 수익성 뷰
- [ ] 원가 최적화 제안 시스템
- [ ] 손익 리포트 자동 생성

**수익성 분석 시스템**:
```typescript
// lib/analytics/profitability-engine.ts
export class ProfitabilityEngine {
  async calculateRealTimeProfitability(period: DateRange): Promise<ProfitabilityReport> {
    // 1. 해당 기간 매출 데이터 조회
    const salesData = await this.getSalesData(period);
    
    // 2. FIFO 기반 실제 원가 조회
    const actualCosts = await this.getActualCosts(salesData);
    
    // 3. 아이템별 수익성 계산
    const itemProfitability = salesData.map(sale => {
      const cost = actualCosts.find(c => c.saleId === sale.id);
      const revenue = sale.totalAmount;
      const actualCost = cost?.totalCost || 0;
      const grossProfit = revenue - actualCost;
      const marginRate = (grossProfit / revenue) * 100;
      
      return {
        itemId: sale.itemId,
        itemName: sale.itemName,
        quantity: sale.quantity,
        revenue,
        actualCost,
        grossProfit,
        marginRate,
        targetMarginRate: sale.targetMarginRate,
        marginVariance: marginRate - sale.targetMarginRate
      };
    });
    
    // 4. 전체 수익성 요약
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalCost = actualCosts.reduce((sum, cost) => sum + cost.totalCost, 0);
    const totalProfit = totalRevenue - totalCost;
    const overallMarginRate = (totalProfit / totalRevenue) * 100;
    
    return {
      period,
      totalRevenue,
      totalCost,
      totalProfit,
      overallMarginRate,
      itemProfitability,
      topPerformingItems: itemProfitability
        .sort((a, b) => b.marginRate - a.marginRate)
        .slice(0, 10),
      underPerformingItems: itemProfitability
        .filter(item => item.marginVariance < -5)
        .sort((a, b) => a.marginVariance - b.marginVariance)
    };
  }
}

// 수익성 분석 차트 컴포넌트
export function ProfitabilityChart({ data, viewType }: ProfitabilityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="itemName" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="매출" />
        <Bar yAxisId="left" dataKey="actualCost" fill="#ef4444" name="실제 원가" />
        <Line yAxisId="right" type="monotone" dataKey="marginRate" stroke="#10b981" name="마진율 (%)" />
        <Line yAxisId="right" type="monotone" dataKey="targetMarginRate" stroke="#f59e0b" strokeDasharray="5 5" name="목표 마진율 (%)" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
```

---

## 📋 Phase 3: 브랜드 분리 시스템 및 고급 기능 (Week 25-34)

### TASK-011: 브랜드 분리 준비도 평가 시스템 구현
**우선순위**: P1 🟠 **크기**: XL (2주) **담당자**: Senior Lead Developer + Backend Developer  
**개발방법론**: Assessment-Driven Design + TDD

**설명**: 브랜드의 독립 운영 가능성을 실시간으로 평가하고 분리 준비 상태를 추적하는 시스템 구현

**완료 기준**:
- [ ] 분리 준비도 평가 알고리즘
- [ ] 데이터 완성도 체크 시스템
- [ ] 시스템 독립성 평가
- [ ] 운영 준비도 평가
- [ ] 하이브리드 권한 영향 분석
- [ ] 분리 준비도 대시보드
- [ ] 분리 계획 및 체크리스트
- [ ] 분리 시뮬레이션 기능

**분리 준비도 평가 시스템**:
```typescript
// lib/separation/readiness-assessment.ts
export class BrandSeparationReadinessAssessment {
  async evaluateSeparationReadiness(brandId: string): Promise<SeparationReadinessReport> {
    const assessment = {
      // 🆕 대시보드 독립성 체크
      dashboardIndependence: await this.assessDashboardIndependence(brandId),
      
      // 🆕 하이브리드 권한 해제 영향 평가
      hybridPermissionImpact: await this.assessHybridPermissionImpact(brandId),
      
      // 데이터 완성도
      dataCompleteness: await this.assessDataCompleteness(brandId),
      
      // 시스템 독립성
      systemIndependence: await this.assessSystemIndependence(brandId),
      
      // 운영 준비도
      operationalReadiness: await this.assessOperationalReadiness(brandId)
    };
    
    const overallScore = this.calculateReadinessScore(assessment);
    
    return {
      brandId,
      overallReadinessScore: overallScore,
      assessmentDetails: assessment,
      recommendations: this.generateRecommendations(assessment),
      estimatedSeparationTime: this.calculateSeparationTime(assessment),
      criticalBlockers: this.identifyCriticalBlockers(assessment)
    };
  }
  
  // 🆕 대시보드 독립성 평가
  private async assessDashboardIndependence(brandId: string) {
    return {
      brandDashboardCompleteness: await this.checkBrandDashboardFeatures(brandId),
      companyDashboardDependencies: await this.identifyCompanyDashboardDependencies(brandId),
      hybridUserCount: await this.countHybridPermissionUsers(brandId),
      crossPlatformDataDependencies: await this.identifyCrossPlatformDependencies(brandId),
      
      readinessScore: 0, // 계산됨
      blockers: [], // 식별됨
      recommendations: [] // 생성됨
    };
  }
}

// 브랜드 분리 준비 상태 테이블
CREATE TABLE brand_separation_readiness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE UNIQUE,
  separation_status separation_status_enum DEFAULT 'not_ready',
  readiness_score DECIMAL(5,2) DEFAULT 0.00,
  data_completeness JSONB DEFAULT '{}',
  critical_missing_data TEXT[] DEFAULT '{}',
  system_independence JSONB DEFAULT '{}',
  dependency_issues TEXT[] DEFAULT '{}',
  operational_readiness JSONB DEFAULT '{}',
  staff_capability_assessment JSONB DEFAULT '{}',
  estimated_separation_date DATE,
  separation_complexity separation_complexity_enum,
  expected_downtime_hours INTEGER DEFAULT 0,
  separation_checklist JSONB DEFAULT '{}',
  completed_checklist_items TEXT[] DEFAULT '{}',
  last_assessment_date TIMESTAMP,
  assessed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### TASK-012: 자동 브랜드 분리 프로세스 구현
**우선순위**: P1 🟠 **크기**: XL (2주) **담당자**: Senior Lead Developer + DevOps Engineer  
**개발방법론**: Process-Automation + Infrastructure as Code

**설명**: 브랜드 분리 시 새로운 독립 시스템을 자동으로 구축하고 데이터를 완전 이관하는 시스템 구현

**완료 기준**:
- [ ] 새로운 Supabase 프로젝트 자동 생성
- [ ] 브랜드 데이터 완전 마이그레이션
- [ ] 독립 대시보드 시스템 구성
- [ ] 회사 대시보드 접근 차단
- [ ] 하이브리드 권한 사용자 처리
- [ ] 데이터 무결성 검증
- [ ] 분리 과정 모니터링
- [ ] 롤백 시스템 구현

**브랜드 분리 자동화 시스템**:
```typescript
// lib/separation/brand-separation-engine.ts
export class BrandSeparationEngine {
  async executeBrandSeparation(brandId: string): Promise<SeparationResult> {
    const separationId = generateSeparationId();
    
    try {
      // Phase 0: 분리 준비도 최종 검증
      const readiness = await this.finalReadinessCheck(brandId);
      if (readiness.overallScore < 85) {
        throw new Error('분리 준비도 부족: 85% 이상 필요');
      }
      
      // Phase 1: 하이브리드 권한 사용자 처리
      await this.handleHybridUsersSeparation(brandId);
      
      // Phase 2: 새로운 독립 시스템 구성
      const independentSystem = await this.createIndependentSystem(brandId);
      
      // Phase 3: 데이터 마이그레이션
      const migrationResult = await this.migrateAllBrandData(brandId, independentSystem);
      
      // Phase 4: 독립성 검증
      const verificationResult = await this.verifyCompleteSeparation(brandId, independentSystem);
      
      // Phase 5: 원본 시스템에서 브랜드 데이터 정리
      await this.cleanupOriginalSystem(brandId);
      
      return {
        separationId,
        success: true,
        independentSystem,
        migrationResult,
        verificationResult,
        completedAt: new Date()
      };
      
    } catch (error) {
      // 분리 실패 시 롤백
      await this.rollbackSeparation(separationId, brandId);
      throw error;
    }
  }
  
  private async createIndependentSystem(brandId: string): Promise<IndependentSystem> {
    // 1. 새로운 Supabase 프로젝트 생성
    const newProject = await this.createSupabaseProject({
      name: `${brandData.name}-erp`,
      region: 'ap-northeast-1',
      tier: 'pro'
    });
    
    // 2. 독립 대시보드 설정
    const dashboardConfig = await this.setupIndependentDashboard(newProject, brandId);
    
    // 3. 회사 대시보드 연결 완전 차단
    await this.blockCompanyDashboardAccess(brandId);
    
    return {
      supabaseProject: newProject,
      dashboardConfig,
      independentDomain: `${brandData.domain}/dashboard`
    };
  }
}

// 브랜드 분리 이력 추적
CREATE TABLE brand_separation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  separation_started_at TIMESTAMP,
  separation_completed_at TIMESTAMP,
  separation_initiated_by UUID REFERENCES users(id),
  new_supabase_project_id VARCHAR(200),
  new_domain VARCHAR(200),
  new_system_credentials JSONB,
  migrated_data_summary JSONB,
  migration_verification_results JSONB,
  separation_success BOOLEAN,
  issues_encountered TEXT[],
  rollback_performed BOOLEAN DEFAULT false,
  post_separation_support_until DATE,
  support_contact_info JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### TASK-013: Google Gemini AI 기반 재고 최적화 시스템
**우선순위**: P2 🟡 **크기**: L (1주) **담당자**: Senior Lead Developer  
**개발방법론**: AI-First Design + ML-Ops

**설명**: Google Gemini AI를 활용한 재고 수요 예측, 발주 최적화, 폐기 최소화 시스템 구현

**완료 기준**:
- [ ] Google Gemini API 연동
- [ ] 재고 데이터 벡터화 및 분석
- [ ] 수요 예측 모델 구현
- [ ] 최적 발주량 계산
- [ ] 폐기 위험 예측
- [ ] AI 추천 대시보드
- [ ] 예측 정확도 측정
- [ ] 학습 데이터 누적

**AI 재고 최적화 엔진**:
```typescript
// lib/ai/inventory-optimizer.ts
export class AIInventoryOptimizer {
  private gemini: GoogleGeminiClient;
  
  async generateInventoryRecommendations(storeId: string): Promise<InventoryRecommendations> {
    // 1. 과거 데이터 수집 (3개월)
    const historicalData = await this.getHistoricalInventoryData(storeId, 90);
    
    // 2. Google Gemini로 패턴 분석
    const analysis = await this.gemini.analyze({
      prompt: `재고 관리 최적화 분석:
        매장: ${storeId}
        과거 3개월 데이터: ${JSON.stringify(historicalData)}
        
        다음을 분석해주세요:
        1. 각 원재료별 수요 패턴
        2. 계절성 및 트렌드
        3. 폐기 위험이 높은 품목
        4. 최적 발주 타이밍
        5. 안전재고 수준 추천`,
      temperature: 0.2,
      maxTokens: 2000
    });
    
    // 3. AI 분석 결과를 구조화된 추천으로 변환
    const recommendations = this.parseAIRecommendations(analysis.response);
    
    // 4. 비즈니스 룰 적용
    const finalRecommendations = await this.applyBusinessRules(recommendations);
    
    return {
      storeId,
      generatedAt: new Date(),
      recommendations: finalRecommendations,
      confidenceScore: analysis.confidence,
      expectedSavings: this.calculateExpectedSavings(finalRecommendations)
    };
  }
  
  async predictDemand(materialId: string, days: number): Promise<DemandPrediction> {
    const prediction = await this.gemini.predict({
      model: 'gemini-pro',
      input: {
        materialId,
        historicalUsage: await this.getUsageHistory(materialId),
        seasonalFactors: await this.getSeasonalFactors(materialId),
        marketTrends: await this.getMarketTrends(materialId)
      },
      predictionDays: days
    });
    
    return {
      materialId,
      predictedDemand: prediction.values,
      confidenceInterval: prediction.confidence,
      predictionAccuracy: await this.calculateAccuracy(materialId)
    };
  }
}

// AI 추천 대시보드
export function AIRecommendationsDashboard() {
  const [recommendations, setRecommendations] = useState<InventoryRecommendations>();
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI 재고 최적화 추천</h2>
        <Button onClick={generateRecommendations} disabled={loading}>
          {loading ? '분석 중...' : '추천 생성'}
        </Button>
      </div>
      
      {recommendations && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RecommendationCard
              title="예상 절약 금액"
              value={recommendations.expectedSavings}
              format="currency"
              trend="up"
            />
            <RecommendationCard
              title="추천 정확도"
              value={recommendations.confidenceScore}
              format="percentage"
            />
            <RecommendationCard
              title="폐기 위험 감소"
              value={calculateWasteReduction(recommendations)}
              format="percentage"
              trend="down"
            />
          </div>
          
          <RecommendationsList recommendations={recommendations.recommendations} />
        </>
      )}
    </div>
  );
}
```

---

### TASK-014: 브랜드 웹사이트 통합 관리 시스템
**우선순위**: P2 🟡 **크기**: L (1주) **담당자**: Senior Frontend Developer  
**개발방법론**: Headless CMS + JAMstack

**설명**: 브랜드 공개 웹사이트와 CMS 블로그를 통합 관리할 수 있는 시스템 구현

**완료 기준**:
- [ ] 브랜드 공개 페이지 관리
- [ ] CMS 블로그 시스템
- [ ] SEO 최적화 도구
- [ ] 콘텐츠 편집기 (WYSIWYG)
- [ ] 미디어 관리 시스템
- [ ] 소셜 미디어 연동
- [ ] 성과 분석 (조회수, 참여도)
- [ ] 모바일 최적화

**브랜드 웹사이트 관리 시스템**:
```typescript
// lib/website/brand-website-manager.ts
export class BrandWebsiteManager {
  async updateBrandWebsite(brandId: string, updates: WebsiteUpdates): Promise<void> {
    // 1. 브랜드 테마 적용
    const brandTheme = await this.getBrandTheme(brandId);
    
    // 2. 콘텐츠 업데이트
    await this.updateContent({
      ...updates,
      theme: brandTheme,
      lastUpdated: new Date()
    });
    
    // 3. SEO 메타데이터 자동 생성
    const seoMetadata = await this.generateSEOMetadata(updates);
    await this.updateSEOSettings(brandId, seoMetadata);
    
    // 4. 사이트맵 업데이트
    await this.updateSitemap(brandId);
    
    // 5. CDN 캐시 무효화
    await this.invalidateCache(brandId);
  }
  
  async manageBlog(brandId: string, action: BlogAction): Promise<BlogPost> {
    switch (action.type) {
      case 'create':
        return this.createBlogPost(brandId, action.data);
      case 'update':
        return this.updateBlogPost(brandId, action.id, action.data);
      case 'publish':
        return this.publishBlogPost(brandId, action.id);
      case 'schedule':
        return this.scheduleBlogPost(brandId, action.id, action.publishDate);
    }
  }
}

// 브랜드 웹사이트 컴포넌트
export function BrandWebsiteManager({ brandId }: { brandId: string }) {
  const [pages, setPages] = useState<WebsitePage[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [analytics, setAnalytics] = useState<WebsiteAnalytics>();
  
  return (
    <Tabs defaultValue="pages" className="w-full">
      <TabsList>
        <TabsTrigger value="pages">페이지 관리</TabsTrigger>
        <TabsTrigger value="blog">블로그</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="analytics">분석</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pages">
        <PageManager pages={pages} onUpdate={handlePageUpdate} />
      </TabsContent>
      
      <TabsContent value="blog">
        <BlogManager posts={blogPosts} onUpdate={handleBlogUpdate} />
      </TabsContent>
      
      <TabsContent value="seo">
        <SEOManager brandId={brandId} />
      </TabsContent>
      
      <TabsContent value="analytics">
        <WebsiteAnalytics data={analytics} />
      </TabsContent>
    </Tabs>
  );
}
```

---

## 📋 Phase 4: 테스트, 최적화 및 배포 (Week 35-40)

### TASK-015: 종합 테스트 및 품질 보증
**우선순위**: P0 🔴 **크기**: XL (2주) **담당자**: Senior QA Engineer + All Developers  
**개발방법론**: Test-Driven Quality Assurance + Comprehensive Testing

**설명**: 이중 대시보드 시스템의 모든 기능에 대한 종합적인 테스트 및 품질 검증

**완료 기준**:
- [ ] 단위 테스트 95% 커버리지
- [ ] 통합 테스트 (API 간 연동)
- [ ] E2E 테스트 (Playwright)
- [ ] 하이브리드 권한 시스템 테스트
- [ ] FIFO 재고 계산 정확성 테스트
- [ ] 브랜드 분리 시나리오 테스트
- [ ] 성능 테스트 (부하 테스트)
- [ ] 보안 테스트 (OWASP ZAP)
- [ ] 접근성 테스트 (WCAG 2.1 AA)
- [ ] 브라우저 호환성 테스트

**종합 테스트 시나리오**:
```typescript
// tests/e2e/hybrid-permission-scenarios.spec.ts
describe('하이브리드 권한 시스템 E2E 테스트', () => {
  test('회사 계정으로 브랜드 대시보드 접근', async ({ page }) => {
    // 1. 회사 계정으로 로그인
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'company-admin@culinaryseoul.com');
    await page.fill('[data-testid=password]', 'test-password');
    await page.click('[data-testid=login-button]');
    
    // 2. 회사 대시보드에서 브랜드 전환
    await page.click('[data-testid=brand-switcher]');
    await page.click('[data-testid=brand-millab]');
    
    // 3. 브랜드 상세 관리 모드 진입
    await page.click('[data-testid=detailed-management]');
    
    // 4. 브랜드 재고 관리 권한 확인
    await expect(page.locator('[data-testid=inventory-adjust-button]')).toBeVisible();
    
    // 5. 브랜드 대시보드 직접 접근
    await page.goto('https://cafe-millab.com/dashboard');
    await expect(page.locator('[data-testid=brand-dashboard]')).toBeVisible();
  });
  
  test('브랜드 분리 시뮬레이션', async ({ page }) => {
    // 1. 브랜드 분리 준비도 확인
    await page.goto('/dashboard/brands/millab/separation');
    const readinessScore = await page.textContent('[data-testid=readiness-score]');
    expect(parseInt(readinessScore)).toBeGreaterThan(85);
    
    // 2. 분리 시뮬레이션 실행
    await page.click('[data-testid=simulate-separation]');
    await page.waitForSelector('[data-testid=simulation-complete]');
    
    // 3. 시뮬레이션 결과 확인
    const simulationResult = await page.textContent('[data-testid=simulation-result]');
    expect(simulationResult).toContain('성공');
  });
});

// tests/unit/fifo-engine.test.ts
describe('FIFO 재고 엔진 단위 테스트', () => {
  test('FIFO 순서 정확성 검증', async () => {
    const engine = new FIFOInventoryEngine();
    
    // 테스트 데이터 준비
    const lots = [
      { id: '1', receivedDate: '2024-01-01', quantity: 100, unitCost: 1000 },
      { id: '2', receivedDate: '2024-01-15', quantity: 200, unitCost: 1100 },
      { id: '3', receivedDate: '2024-02-01', quantity: 150, unitCost: 1200 }
    ];
    
    // 250개 출고 시 FIFO 순서 확인
    const result = await engine.processOutbound('material-1', 250);
    
    expect(result.usedLots).toHaveLength(2);
    expect(result.usedLots[0].lotId).toBe('1'); // 가장 오래된 로트
    expect(result.usedLots[0].quantity).toBe(100);
    expect(result.usedLots[1].lotId).toBe('2');
    expect(result.usedLots[1].quantity).toBe(150);
    
    // 가중평균 원가 계산 확인
    const expectedAvgCost = (100 * 1000 + 150 * 1100) / 250;
    expect(result.averageUnitCost).toBe(expectedAvgCost);
  });
});
```

---

### TASK-016: 성능 최적화 및 모니터링 시스템
**우선순위**: P0 🔴 **크기**: L (1주) **담당자**: Senior Lead Developer + DevOps Engineer  
**개발방법론**: Performance-First + Observability-Driven

**설명**: 프로덕션 환경에서의 최적 성능과 안정성을 위한 최적화 및 모니터링 시스템 구현

**완료 기준**:
- [ ] Lighthouse 성능 점수 90점 이상
- [ ] 코드 스플리팅 및 lazy loading
- [ ] 이미지 최적화 (WebP, 적응형 이미지)
- [ ] Redis 캐싱 시스템
- [ ] 데이터베이스 쿼리 최적화
- [ ] 실시간 성능 모니터링
- [ ] 에러 추적 시스템 (Sentry)
- [ ] 로깅 및 알람 시스템

**성능 최적화 구현**:
```typescript
// lib/optimization/performance-optimizer.ts
export class PerformanceOptimizer {
  // 코드 스플리팅
  static setupCodeSplitting() {
    return {
      // 대시보드별 청크 분리
      'company-dashboard': () => import('../components/dashboard/CompanyDashboard'),
      'brand-dashboard': () => import('../components/dashboard/BrandDashboard'),
      'inventory-management': () => import('../components/inventory/InventoryManagement'),
      'analytics': () => import('../components/analytics/Analytics')
    };
  }
  
  // Redis 캐싱 전략
  static setupCaching() {
    return {
      // 재고 데이터 캐싱 (1분)
      inventoryData: { ttl: 60, key: 'inventory:{{storeId}}' },
      
      // 매출 데이터 캐싱 (5분)
      salesData: { ttl: 300, key: 'sales:{{date}}:{{storeId}}' },
      
      // 사용자 권한 캐싱 (30분)
      userPermissions: { ttl: 1800, key: 'permissions:{{userId}}' },
      
      // 브랜드 설정 캐싱 (1시간)
      brandSettings: { ttl: 3600, key: 'brand:{{brandId}}:settings' }
    };
  }
}

// 실시간 모니터링 대시보드
export function SystemMonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentMetrics = await fetchSystemMetrics();
      setMetrics(currentMetrics);
      
      // 임계값 체크
      const newAlerts = checkThresholds(currentMetrics);
      if (newAlerts.length > 0) {
        setAlerts(prev => [...prev, ...newAlerts]);
        // 알람 발송
        await sendAlerts(newAlerts);
      }
    }, 10000); // 10초마다 체크
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
        title="응답 시간"
        value={metrics?.averageResponseTime}
        threshold={500}
        unit="ms"
      />
      <MetricCard
        title="활성 사용자"
        value={metrics?.activeUsers}
        trend="up"
      />
      <MetricCard
        title="데이터베이스 연결"
        value={metrics?.dbConnections}
        max={100}
        unit="connections"
      />
      <MetricCard
        title="메모리 사용률"
        value={metrics?.memoryUsage}
        threshold={80}
        unit="%"
      />
    </div>
  );
}
```

---

### TASK-017: 프로덕션 배포 및 운영 준비
**우선순위**: P0 🔴 **크기**: L (1주) **담당자**: DevOps Engineer + Senior Lead Developer  
**개발방법론**: DevOps + Infrastructure as Code

**설명**: 안정적인 프로덕션 서비스를 위한 배포 시스템 및 운영 인프라 구축

**완료 기준**:
- [ ] CI/CD 파이프라인 구축 (GitHub Actions)
- [ ] 이중 도메인 배포 설정
- [ ] SSL 인증서 자동 갱신
- [ ] 데이터베이스 마이그레이션 자동화
- [ ] 백업 및 복구 시스템
- [ ] 모니터링 및 알람 설정
- [ ] 장애 대응 플레이북
- [ ] 사용자 교육 자료 준비

**배포 시스템 구성**:
```yaml
# .github/workflows/deploy.yml
name: CulinarySeoul ERP Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: |
          npm run test:unit
          npm run test:integration
          npm run test:e2e
      
      - name: Test coverage
        run: npm run test:coverage
        
      - name: Security audit
        run: npm audit --audit-level high

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to staging
        run: |
          # 스테이징 환경 배포
          vercel deploy --env staging
      
      - name: Run smoke tests
        run: npm run test:smoke

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # 프로덕션 배포
          vercel deploy --prod
          
          # 데이터베이스 마이그레이션
          npm run db:migrate:prod
      
      - name: Health check
        run: |
          # 서비스 상태 확인
          curl -f https://culinaryseoul.com/health
          curl -f https://cafe-millab.com/health
      
      - name: Notify deployment
        run: |
          # 배포 완료 알림
          npm run notify:deployment:success
```

---

### TASK-018: 사용자 교육 및 시스템 안정화
**우선순위**: P0 🔴 **크기**: M (1주) **담당자**: PM + All Team Members  
**개발방법론**: User-Centric Training + Continuous Improvement

**설명**: 실제 사용자를 위한 교육 프로그램 및 시스템 안정화 작업

**완료 기준**:
- [ ] 사용자 매뉴얼 작성 (한국어)
- [ ] 화면별 도움말 시스템
- [ ] 비디오 튜토리얼 제작
- [ ] 하이브리드 권한 시스템 가이드
- [ ] 브랜드 분리 프로세스 가이드
- [ ] FAQ 및 문제해결 가이드
- [ ] 실사용자 테스트 및 피드백 수집
- [ ] 안정화 패치 배포

**사용자 교육 시스템**:
```typescript
// components/help/HelpSystem.tsx
export function HelpSystem() {
  const [currentPage, setCurrentPage] = useState<string>();
  const [showTutorial, setShowTutorial] = useState(false);
  
  return (
    <>
      {/* 페이지별 도움말 */}
      <HelpButton onClick={() => setShowTutorial(true)} />
      
      {/* 인터랙티브 튜토리얼 */}
      {showTutorial && (
        <TutorialOverlay
          steps={getTutorialSteps(currentPage)}
          onComplete={() => setShowTutorial(false)}
        />
      )}
      
      {/* 도움말 패널 */}
      <HelpPanel>
        <HelpTabs>
          <HelpTab title="빠른 시작">
            <QuickStartGuide />
          </HelpTab>
          <HelpTab title="기능 설명">
            <FeatureGuide />
          </HelpTab>
          <HelpTab title="문제해결">
            <TroubleshootingGuide />
          </HelpTab>
          <HelpTab title="FAQ">
            <FAQSection />
          </HelpTab>
        </HelpTabs>
      </HelpPanel>
    </>
  );
}

// 하이브리드 권한 가이드
export function HybridPermissionGuide() {
  return (
    <div className="space-y-6">
      <h2>하이브리드 권한 시스템 사용법</h2>
      
      <section>
        <h3>1. 회사 대시보드에서 브랜드 관리</h3>
        <p>회사 권한을 가진 사용자는 회사 대시보드에서 직접 브랜드를 관리할 수 있습니다.</p>
        <video controls>
          <source src="/tutorials/hybrid-permission-company-dashboard.mp4" type="video/mp4" />
        </video>
      </section>
      
      <section>
        <h3>2. 브랜드 대시보드 접근</h3>
        <p>브랜드 대표 권한이 있는 경우 브랜드 대시보드에 직접 접근할 수 있습니다.</p>
        <video controls>
          <source src="/tutorials/brand-dashboard-access.mp4" type="video/mp4" />
        </video>
      </section>
      
      <section>
        <h3>3. 브랜드 컨텍스트 전환</h3>
        <p>브랜드 간 빠른 전환으로 효율적인 관리가 가능합니다.</p>
        <InteractiveDemo component="BrandSwitcher" />
      </section>
    </div>
  );
}
```

---

## 📊 개발 일정 및 마일스톤

### Week 1-10: 기반 구조 완성 (Phase 1)
- **마일스톤 1-1**: 새 Supabase 프로젝트 + 기본 아키텍처 (Week 2)
- **마일스톤 1-2**: 하이브리드 권한 시스템 완성 (Week 4)
- **마일스톤 1-3**: 이중 대시보드 기본 구조 완성 (Week 7)
- **마일스톤 1-4**: 핵심 데이터 모델 완성 (Week 10)

### Week 11-24: 핵심 기능 완성 (Phase 2)
- **마일스톤 2-1**: FIFO 재고 관리 시스템 완성 (Week 13)
- **마일스톤 2-2**: 자동 투입량 차감 시스템 완성 (Week 15)
- **마일스톤 2-3**: 토스페이먼츠 연동 완성 (Week 16)
- **마일스톤 2-4**: 실시간 대시보드 시스템 완성 (Week 19)
- **마일스톤 2-5**: 수익성 분석 시스템 완성 (Week 24)

### Week 25-34: 브랜드 분리 시스템 (Phase 3)
- **마일스톤 3-1**: 분리 준비도 평가 시스템 완성 (Week 27)
- **마일스톤 3-2**: 자동 브랜드 분리 프로세스 완성 (Week 29)
- **마일스톤 3-3**: AI 최적화 시스템 완성 (Week 31)
- **마일스톤 3-4**: 브랜드 웹사이트 관리 완성 (Week 34)

### Week 35-40: 테스트 및 배포 (Phase 4)
- **마일스톤 4-1**: 종합 테스트 완료 (Week 37)
- **마일스톤 4-2**: 성능 최적화 완료 (Week 38)
- **마일스톤 4-3**: 프로덕션 배포 완료 (Week 39)
- **마일스톤 4-4**: 사용자 교육 및 안정화 완료 (Week 40)

---

## 🎯 성공 지표 (KPI)

### 기술적 지표
- **테스트 커버리지**: 95% 이상 (단위 테스트)
- **성능 점수**: Lighthouse 90점 이상
- **응답 시간**: 모든 API 500ms 이하
- **FIFO 계산 정확도**: 99.99% 이상
- **데이터 무결성**: 100% 검증 통과

### 비즈니스 지표
- **재고 정확도**: FIFO 기반 95% 이상
- **원가 추적 정확도**: 실제 vs 예상 원가 오차 5% 이내
- **브랜드 분리 성공률**: 100% (데이터 손실 없음)
- **시스템 가용성**: 99.9% 이상
- **사용자 만족도**: NPS 8.0 이상

### 사용자 경험 지표
- **대시보드 로딩 시간**: 2초 이내
- **브랜드 컨텍스트 전환**: 1초 이내
- **모바일 반응성**: 100% 지원
- **접근성**: WCAG 2.1 AA 준수
- **사용자 교육 완료율**: 90% 이상

---

## 🔧 기술 스택

### 프론트엔드
- **React 19** + **TypeScript**
- **React Router 7** (Framework Mode)
- **Tailwind CSS v4** + **Shadcn/ui**
- **Zustand** (상태 관리)
- **React Hook Form** (폼 관리)
- **Recharts** (데이터 시각화)

### 백엔드
- **Supabase** (PostgreSQL + Auth + Realtime + Edge Functions)
- **Redis** (캐싱 및 세션 관리)
- **Google Gemini** (AI 최적화)

### 외부 연동
- **토스페이먼츠** (결제 시스템)
- **Resend** (이메일 발송)

### 배포 및 운영
- **Vercel** (호스팅 및 배포)
- **GitHub Actions** (CI/CD)
- **Sentry** (에러 추적)
- **Vercel Analytics** (성능 모니터링)

### 개발 도구
- **Vite** (빌드 도구)
- **Vitest** + **Playwright** (테스트)
- **Storybook** (컴포넌트 문서화)
- **ESLint** + **Prettier** (코드 품질)

---

## 💰 예산 및 리소스

### 기술 인프라 비용 (월간)
- **Supabase Pro**: $35/월
- **Vercel Pro**: $25/월  
- **Redis Premium**: $30/월
- **도메인 및 SSL**: $5/월
- **모니터링 도구**: $20/월
- **총 운영비**: $115/월

### 개발 리소스 (40주)
- **Senior Lead Developer**: 1명 (풀타임)
- **Senior Frontend Developer**: 1명 (풀타임)
- **Backend Developer**: 1명 (풀타임)
- **UI/UX Designer**: 1명 (30주)
- **Senior QA Engineer**: 1명 (20주)
- **DevOps Engineer**: 1명 (10주)
- **Project Manager**: 1명 (풀타임)

---

## ⚠️ 리스크 및 완화 방안

### 기술적 리스크
1. **하이브리드 권한 시스템 복잡성**
   - 완화: 단계별 개발 및 지속적 테스트
   - 백업 계획: 단순화된 권한 모델 준비

2. **FIFO 계산 정확성**
   - 완화: 광범위한 단위 테스트 및 검증
   - 백업 계획: 수동 검증 프로세스

3. **브랜드 분리 시스템 안정성**
   - 완화: 철저한 시뮬레이션 및 롤백 계획
   - 백업 계획: 단계적 분리 프로세스

### 비즈니스 리스크
1. **사용자 채택률**
   - 완화: 포괄적인 사용자 교육 및 지원
   - 백업 계획: 단순화된 UI 옵션 제공

2. **데이터 마이그레이션**
   - 완화: 철저한 테스트 및 백업
   - 백업 계획: 단계별 마이그레이션

---

이 태스크 계획을 통해 **40주 내에 완전한 CulinarySeoul ERP 시스템**을 구축하여 효율적인 멀티 브랜드 관리와 미래의 브랜드 분리를 완벽하게 지원할 수 있습니다.

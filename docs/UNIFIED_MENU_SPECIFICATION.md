# 통합 메뉴 구조 설계서 (Unified Menu Structure Specification)

## 개요

CulinarySeoul ERP 시스템의 회사(Company), 브랜드(Brand), 매장(Store) 대시보드에서 공통으로 사용할 통합 메뉴 구조를 정의한다. 이 메뉴는 계층적 데이터 접근 제어와 권한 기반 표시를 지원하며, 한국 외식업계의 실제 운영 요구사항을 반영한다.

## 핵심 설계 원칙

1. **계층적 데이터 접근**: 회사 → 브랜드 → 매장 순서로 데이터 범위가 축소됨
2. **권한 기반 표시**: 사용자 권한에 따라 메뉴 항목이 동적으로 표시/숨김
3. **한국 외식업 특화**: 실제 레스토랑/카페 운영에 필요한 기능들을 포함
4. **확장 가능성**: 새로운 브랜드나 기능 추가 시 쉽게 확장 가능
5. **일관된 UX**: 모든 대시보드에서 동일한 메뉴 구조와 UX 제공

## 메뉴 구조 (Menu Structure)

### 1. 개요 & 모니터링 (Overview & Monitoring)
**섹션명**: `운영 현황` / `브랜드 현황` / `매장 현황`

| 메뉴 항목 | 한국어명 | URL 패턴 | 아이콘 | 뱃지 | 권한 레벨 | 데이터 범위 |
|----------|---------|----------|-------|------|----------|-------------|
| Dashboard | 대시보드 | `/{context}` | `Home` | - | `read` | 전체/브랜드/매장 |
| Realtime Monitor | 실시간 현황 | `/{context}/realtime` | `Activity` | `Live` | `read` | 실시간 KPI |
| Performance Analytics | 성과 분석 | `/{context}/performance` | `TrendingUp` | - | `read` | 매출/성과 지표 |
| Alert Center | 알림 센터 | `/{context}/alerts` | `Bell` | `숫자` | `read` | 시스템 알림 |

**데이터 접근 패턴**:
- **Company**: 모든 브랜드와 매장의 통합 데이터
- **Brand**: 해당 브랜드 산하 모든 매장 데이터
- **Store**: 해당 매장만의 데이터

### 2. 조직 관리 (Organization Management)
**섹션명**: `조직 관리`

| 메뉴 항목 | 한국어명 | URL 패턴 | 아이콘 | 뱃지 | 권한 레벨 | 표시 조건 |
|----------|---------|----------|-------|------|----------|-----------|
| Brand Management | 브랜드 관리 | `/{context}/brands` | `Building2` | - | `admin` | Company Only |
| Store Management | 매장 관리 | `/{context}/stores` | `Store` | - | `manager` | Company/Brand |
| Staff Management | 직원 관리 | `/{context}/staff` | `Users` | - | `manager` | All Levels |
| Department Management | 부서 관리 | `/{context}/departments` | `Network` | - | `admin` | Company Only |

**권한별 표시 로직**:
```typescript
// 브랜드 관리는 회사 레벨에서만 표시
const showBrandManagement = context === 'company' && hasPermission('admin');

// 매장 관리는 회사/브랜드 레벨에서 표시
const showStoreManagement = (context === 'company' || context === 'brand') && hasPermission('manager');
```

### 3. 재고 관리 (Inventory Management)
**섹션명**: `재고 관리`

| 메뉴 항목 | 한국어명 | URL 패턴 | 아이콘 | 뱃지 | 권한 레벨 | 기능 설명 |
|----------|---------|----------|-------|------|-----------|----------|
| Inventory Overview | 재고 현황 | `/{context}/inventory` | `Package` | - | `read` | 실시간 재고 현황 |
| Stock Management | 재고 관리 | `/{context}/inventory/stock` | `Boxes` | - | `write` | 입출고 관리 |
| Purchase Orders | 발주 관리 | `/{context}/inventory/orders` | `ClipboardList` | - | `write` | 발주서 작성/승인 |
| Supplier Management | 거래처 관리 | `/{context}/inventory/suppliers` | `Truck` | - | `manager` | 공급업체 관리 |
| Stock Transfer | 재고 이동 | `/{context}/inventory/transfers` | `ArrowRightLeft` | - | `write` | 매장 간 이동 |
| Low Stock Alerts | 재고 부족 알림 | `/{context}/inventory/alerts` | `AlertTriangle` | `긴급` | `read` | 재고 부족 모니터링 |
| FIFO Tracking | 선입선출 추적 | `/{context}/inventory/fifo` | `RotateCcw` | `New` | `read` | 유통기한 관리 |

**FIFO 시스템 특화 기능**:
- 유통기한 기반 자동 재고 회전
- 폐기 예정 상품 알림
- 재고 연령 분석 리포트

### 4. 매출 & 주문 관리 (Sales & Order Management)
**섹션명**: `매출 관리`

| 메뉴 항목 | 한국어명 | URL 패턴 | 아이콘 | 뱃지 | 권한 레벨 | 기능 설명 |
|----------|---------|----------|-------|------|-----------|----------|
| Sales Dashboard | 매출 현황 | `/{context}/sales` | `DollarSign` | - | `read` | 일/월/년 매출 현황 |
| Order Management | 주문 관리 | `/{context}/orders` | `ShoppingBag` | - | `write` | 온/오프라인 주문 |
| POS Integration | POS 연동 | `/{context}/pos` | `CreditCard` | - | `write` | POS 시스템 연동 |
| Menu Management | 메뉴 관리 | `/{context}/menu` | `MenuBook` | - | `manager` | 메뉴/가격 관리 |
| Promotion Management | 프로모션 관리 | `/{context}/promotions` | `Tag` | - | `manager` | 할인/쿠폰 관리 |
| Customer Management | 고객 관리 | `/{context}/customers` | `UserCheck` | - | `write` | 고객 정보/이력 |
| Loyalty Program | 적립금 관리 | `/{context}/loyalty` | `Star` | - | `write` | 포인트/멤버십 |

**한국 외식업 특화 기능**:
- 테이블 주문 시스템
- 카카오페이/네이버페이 결제 연동
- 배달앱 주문 통합 관리
- 멤버십/적립금 시스템

### 5. 마케팅 & 고객 관리 (Marketing & Customer)
**섹션명**: `마케팅`

| 메뉴 항목 | 한국어명 | URL 패턴 | 아이콘 | 뱃지 | 권한 레벨 | 기능 설명 |
|----------|---------|----------|-------|------|-----------|----------|
| Marketing Dashboard | 마케팅 현황 | `/{context}/marketing` | `Megaphone` | - | `read` | 마케팅 성과 대시보드 |
| Campaign Management | 캠페인 관리 | `/{context}/marketing/campaigns` | `Zap` | - | `manager` | 마케팅 캠페인 |
| Social Media | SNS 관리 | `/{context}/marketing/social` | `Share2` | - | `write` | 인스타그램/블로그 |
| Review Management | 리뷰 관리 | `/{context}/marketing/reviews` | `MessageSquare` | - | `write` | 네이버/구글 리뷰 |
| Event Management | 이벤트 관리 | `/{context}/marketing/events` | `Calendar` | - | `manager` | 매장 이벤트 |
| Newsletter | 뉴스레터 | `/{context}/marketing/newsletter` | `Mail` | - | `write` | 이메일 마케팅 |

### 6. 분석 & 리포트 (Analytics & Reports)
**섹션명**: `분석 & 리포트`

| 메뉴 항목 | 한국어명 | URL 패턴 | 아이콘 | 뱃지 | 권한 레벨 | 기능 설명 |
|----------|---------|----------|-------|------|-----------|----------|
| Business Analytics | 경영 분석 | `/{context}/analytics` | `BarChart3` | - | `read` | 종합 경영 지표 |
| Sales Reports | 매출 리포트 | `/{context}/analytics/sales` | `LineChart` | - | `read` | 매출 분석 리포트 |
| Customer Analytics | 고객 분석 | `/{context}/analytics/customers` | `Users2` | - | `manager` | 고객 행동 분석 |
| Inventory Reports | 재고 리포트 | `/{context}/analytics/inventory` | `Package2` | - | `read` | 재고 현황 분석 |
| Staff Performance | 직원 성과 | `/{context}/analytics/staff` | `UserCog2` | - | `manager` | 직원 성과 분석 |
| Financial Reports | 재무 리포트 | `/{context}/analytics/financial` | `Receipt` | - | `admin` | 손익/현금흐름 |
| Custom Reports | 맞춤 리포트 | `/{context}/analytics/custom` | `FileBarChart` | - | `manager` | 사용자 정의 리포트 |

### 7. 운영 관리 (Operations Management)
**섹션명**: `운영 관리`

| 메뉴 항목 | 한국어명 | URL 패턴 | 아이콘 | 뱃지 | 권한 레벨 | 기능 설명 |
|----------|---------|----------|-------|------|-----------|----------|
| Schedule Management | 근무 스케줄 | `/{context}/operations/schedule` | `CalendarDays` | - | `manager` | 직원 근무표 |
| Task Management | 업무 관리 | `/{context}/operations/tasks` | `CheckSquare` | - | `write` | 업무 배정/진행 |
| Quality Control | 품질 관리 | `/{context}/operations/quality` | `Shield` | - | `manager` | 위생/품질 점검 |
| Maintenance | 시설 관리 | `/{context}/operations/maintenance` | `Wrench` | - | `write` | 장비/시설 관리 |
| Training | 교육 관리 | `/{context}/operations/training` | `BookOpen` | - | `manager` | 직원 교육 프로그램 |
| Compliance | 컴플라이언스 | `/{context}/operations/compliance` | `FileCheck` | - | `admin` | 규정 준수 관리 |

### 8. 시스템 관리 (System Management)
**섹션명**: `시스템 관리`

| 메뉴 항목 | 한국어명 | URL 패턴 | 아이콘 | 뱃지 | 권한 레벨 | 표시 조건 |
|----------|---------|----------|-------|------|-----------|-----------|
| User Management | 사용자 관리 | `/{context}/system/users` | `UserCog` | - | `admin` | All Levels |
| Permission Settings | 권한 설정 | `/{context}/system/permissions` | `Shield` | - | `super_admin` | All Levels |
| System Settings | 시스템 설정 | `/{context}/system/settings` | `Settings` | - | `admin` | All Levels |
| Integration | 연동 관리 | `/{context}/system/integrations` | `Plug` | - | `admin` | API/서비스 연동 |
| Audit Logs | 감사 로그 | `/{context}/system/audit-logs` | `ScrollText` | - | `admin` | 시스템 로그 |
| Backup & Recovery | 백업 관리 | `/{context}/system/backup` | `Database` | - | `super_admin` | 데이터 백업 |
| System Health | 시스템 상태 | `/{context}/system/health` | `Heart` | `상태` | `admin` | 시스템 모니터링 |

## 권한 매트릭스 (Permission Matrix)

### 권한 레벨 정의
- **`read`**: 조회 전용 (직원, 파트타이머)
- **`write`**: 데이터 입력/수정 (정직원, 팀장)
- **`manager`**: 관리 기능 (매장 관리자, 브랜드 매니저)
- **`admin`**: 시스템 관리 (지역 관리자, 본사 관리자)
- **`super_admin`**: 최고 관리자 (CEO, CTO)

### 계층별 접근 권한

```typescript
interface MenuPermissionMatrix {
  company: {
    // 회사 레벨에서는 모든 브랜드/매장 데이터에 접근 가능
    dataScope: ['all_brands', 'all_stores'];
    restrictedMenus: []; // 제한 없음
  };
  brand: {
    // 브랜드 레벨에서는 해당 브랜드 산하 매장만 접근
    dataScope: ['brand_stores'];
    restrictedMenus: ['brands']; // 브랜드 관리 메뉴 숨김
  };
  store: {
    // 매장 레벨에서는 해당 매장 데이터만 접근
    dataScope: ['current_store'];
    restrictedMenus: ['brands', 'departments']; // 일부 관리 메뉴 숨김
  };
}
```

## URL 패턴 (URL Patterns)

### 회사 대시보드 (Company Dashboard)
- 기본: `https://culinaryseoul.com/company/dashboard`
- 브랜드 관리: `https://culinaryseoul.com/company/brands`
- 통합 재고: `https://culinaryseoul.com/company/inventory`
- 전체 매출: `https://culinaryseoul.com/company/sales`

### 브랜드 대시보드 (Brand Dashboard)
- 기본: `https://cafe-millab.com/brand/dashboard`
- 매장 관리: `https://cafe-millab.com/brand/stores`
- 브랜드 재고: `https://cafe-millab.com/brand/inventory`
- 브랜드 매출: `https://cafe-millab.com/brand/sales`

### 매장 대시보드 (Store Dashboard)
- 기본: `https://cafe-millab.com/store/seongsu/dashboard`
- 재고 관리: `https://cafe-millab.com/store/seongsu/inventory`
- 매장 매출: `https://cafe-millab.com/store/seongsu/sales`

## 아이콘 및 디자인 시스템

### 사용 아이콘 라이브러리
- **Lucide React**: 일관된 아이콘 스타일
- **크기**: 20px (사이드바), 16px (드롭다운)
- **컬러**: CSS 변수 기반 테마 시스템

### 뱃지 시스템
- **Live**: 실시간 데이터 표시 (녹색)
- **New**: 신규 기능 (파란색)
- **숫자**: 알림 개수 (빨간색)
- **긴급**: 즉시 확인 필요 (주황색)
- **상태**: 시스템 상태 (색상 변경)

### 메뉴 상태 관리
```typescript
interface MenuState {
  isCollapsed: boolean;
  activeSection: string;
  expandedSections: string[];
  userPermissions: Permission[];
  currentContext: 'company' | 'brand' | 'store';
}
```

## 구현 예시 (Implementation Example)

```typescript
// components/navigation/UnifiedMenu.tsx
export const UnifiedMenu: React.FC<UnifiedMenuProps> = ({
  context,
  userPermissions,
  currentBrandId,
  currentStoreId
}) => {
  const menuSections = generateUnifiedMenuSections(context, {
    brandId: currentBrandId,
    storeId: currentStoreId,
    permissions: userPermissions
  });

  return (
    <nav className="unified-menu">
      {menuSections.map(section => (
        <MenuSection
          key={section.title}
          title={section.title}
          items={section.items}
          context={context}
          permissions={userPermissions}
        />
      ))}
    </nav>
  );
};

// 권한 기반 메뉴 필터링
function filterMenusByPermissions(
  sections: MenuSection[],
  permissions: Permission[],
  context: DashboardContext
): MenuSection[] {
  return sections
    .map(section => ({
      ...section,
      items: section.items.filter(item => 
        hasMenuPermission(item, permissions, context)
      )
    }))
    .filter(section => section.items.length > 0);
}
```

## 확장성 고려사항

1. **새 브랜드 추가**: 메뉴 구조 변경 없이 브랜드별 컨텍스트만 추가
2. **기능 확장**: 새로운 메뉴 항목을 권한 시스템에 맞춰 쉽게 추가
3. **다국어 지원**: 메뉴명 다국어 지원 구조 준비
4. **모바일 반응형**: 모바일에서는 축약된 메뉴 구조 표시
5. **커스터마이징**: 브랜드별 메뉴 커스터마이징 지원

## 성능 최적화

1. **메뉴 캐싱**: 권한별 메뉴 구조 캐싱
2. **지연 로딩**: 대용량 메뉴 섹션 지연 로딩
3. **권한 검사 최적화**: 권한 검사 결과 메모이제이션
4. **상태 관리**: Redux Toolkit을 통한 효율적인 상태 관리

이 통합 메뉴 구조는 CulinarySeoul ERP 시스템의 모든 대시보드에서 일관된 사용자 경험을 제공하면서도, 각 조직 레벨의 특성과 권한을 정확히 반영합니다.
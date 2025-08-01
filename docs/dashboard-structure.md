# CulinarySeoul 대시보드 구조 문서

## 개요

CulinarySeoul 플랫폼은 **컴퍼니 대시보드**와 **브랜드 대시보드** 두 가지 주요 대시보드를 제공합니다. 두 대시보드는 기본적으로 동일한 구조와 디자인을 공유하며, 각 페이지의 역할과 기능에 따른 메뉴 및 버튼 요소의 차이만 존재합니다.

## 공통 구조

### 레이아웃 구성

```
┌─────────────────────────────────────────────────────────────┐
│                    Header (상단 네비게이션)                    │
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│   Sidebar   │              Main Content Area                │
│  (사이드바)   │               (메인 콘텐츠)                     │
│             │                                               │
│             │                                               │
└─────────────┴───────────────────────────────────────────────┘
```

### 공통 컴포넌트

1. **사이드바 (Sidebar)**
   - 접기/펼치기 기능 (70px ↔ 256px)
   - 브랜드 로고 및 이름
   - 네비게이션 메뉴
   - 상태 표시기

2. **상단 헤더 (Header)**
   - 모바일 메뉴 토글
   - 브랜드 스위처 (BrandSwitcher)
   - 글로벌 검색 (GlobalSearch)
   - 알림 센터 (NotificationCenter)
   - 사용자 프로필 메뉴 (UserProfileMenu)

3. **메인 콘텐츠 영역**
   - 동적 콘텐츠 렌더링
   - 반응형 레이아웃

## 컴퍼니 대시보드

### 파일 구조
- **메인 레이아웃**: `src/components/dashboard/company/CompanyDashboardLayout.tsx`
- **공통 레이아웃**: `src/components/layouts/DashboardLayout.tsx`

### 네비게이션 구조

#### 1. 회사 개요
- **홈**: `/company` - 전체 현황 대시보드
- **실시간 현황**: `/company/realtime` - 실시간 데이터 모니터링

#### 2. 브랜드 관리
- **브랜드 목록**: `/company/brands` - 소속 브랜드 관리
- **매장 관리**: `/company/stores` - 전체 매장 현황
- **성과 분석**: `/company/brands/performance` - 브랜드별 성과 분석

#### 3. 재고 관리
- **통합 재고 현황**: `/company/inventory` - 전체 재고 통합 관리
- **발주 관리**: `/company/inventory/orders` - 발주 및 입고 관리
- **재고 이동**: `/company/inventory/transfers` - 브랜드/매장 간 재고 이동

#### 4. 매출 관리
- **매출 현황**: `/company/sales` - 전체 매출 현황 (구현중)
- **주문 관리**: `/company/orders` - 통합 주문 관리
- **분석 & 리포트**: `/company/analytics` - 매출 분석 및 리포트

#### 5. 시스템 관리
- **사용자 관리**: `/company/system/users` - 전체 사용자 관리
- **권한 설정**: `/company/system/permissions` - 권한 및 역할 관리
- **시스템 설정**: `/company/system/settings` - 시스템 전반 설정
- **감사 로그**: `/company/system/audit-logs` - 시스템 활동 로그

### 특별 기능

#### 실시간 상태 표시기
```typescript
// 활성 사용자 수 및 마지막 동기화 시간 표시
const [activeUsers, setActiveUsers] = useState(12)
const [lastSync, setLastSync] = useState(new Date())

// 30초마다 업데이트
useEffect(() => {
  const interval = setInterval(() => {
    setActiveUsers(Math.floor(Math.random() * 5) + 10)
    setLastSync(new Date())
  }, 30000)
  return () => clearInterval(interval)
}, [])
```

#### 브레드크럼 네비게이션
- 자동 경로 생성
- 한국어 경로명 매핑
- 계층적 네비게이션 지원

## 브랜드 대시보드

### 파일 구조
- **메인 레이아웃**: `src/components/dashboard/brand/BrandDashboardLayout.tsx`
- **공통 레이아웃**: `src/components/layouts/DashboardLayout.tsx`

### 네비게이션 구조

#### 1. 브랜드 개요
- **홈**: `/brand/{brandId}` - 브랜드 전용 대시보드
- **브랜드 개요**: 브랜드별 핵심 지표

#### 2. 매장 관리
- **매장 관리**: `/brand/stores` - 브랜드 소속 매장 관리
- **매장 현황**: 개별 매장 운영 상태

#### 3. 재고 관리
- **재고 현황**: `/brand/inventory` - 브랜드별 재고 현황
- **메뉴 관리**: `/brand/menu` - 메뉴 및 상품 관리

#### 4. 매출 분석
- **매출 분석**: `/brand/analytics` - 브랜드별 매출 분석
- **매출관리**: `/brand/sales` - 매출 관리 (준비중)

#### 5. 웹사이트 관리
- **웹사이트 관리**: 브랜드 웹사이트 관리
- **콘텐츠 관리**: 브랜드 콘텐츠 관리

#### 6. 마케팅 도구
- **마케팅**: `/brand/marketing` - 마케팅 캠페인 관리
- **고객 관리**: `/brand/customers` - 고객 관계 관리

#### 7. 브랜드 설정
- **브랜드 설정**: 브랜드별 개별 설정
- **주문 현황**: `/brand/orders` - 브랜드별 주문 관리

### 브랜드별 특화 기능

#### 브랜드 테마 적용
```typescript
// 브랜드별 동적 스타일 적용
const brandStyles = useMemo(() => ({
  '--brand-primary': mockBrandData.primaryColor,
  '--brand-secondary': mockBrandData.secondaryColor,
} as React.CSSProperties), [])
```

#### 브랜드 건강도 지표
```typescript
// 브랜드 건강도 점수 (0-100)
healthScore: 92

// 분리 준비도 (독립 운영 가능성)
separationReadiness: 85
```

#### 브랜드 컨텍스트 표시기
- **브랜드 건강도**: 브랜드 운영 상태 점수
- **분리 준비도**: 독립 운영 가능성 퍼센티지
- **독립 모드 토글**: 회사 연결 상태 관리

## 주요 차이점

### 1. 권한 및 접근 범위

| 구분 | 컴퍼니 대시보드 | 브랜드 대시보드 |
|------|----------------|----------------|
| **접근 범위** | 전체 회사 데이터 | 특정 브랜드 데이터 |
| **사용자 관리** | 전체 사용자 | 브랜드 소속 사용자 |
| **재고 관리** | 통합 재고 현황 | 브랜드별 재고 |
| **매출 분석** | 전체 브랜드 통합 | 개별 브랜드 |
| **시스템 설정** | 전사 시스템 설정 | 브랜드별 설정 |

### 2. UI/UX 차이점

#### 컴퍼니 대시보드
- 통합 관리 중심의 인터페이스
- 다중 브랜드 비교 및 분석 기능
- 시스템 관리자 도구
- 실시간 모니터링 대시보드

#### 브랜드 대시보드
- 브랜드별 맞춤형 테마
- 브랜드 중심의 운영 도구
- 독립 운영 준비 지표
- 브랜드별 성과 집중 분석

### 3. 네비게이션 구조 차이

#### 컴퍼니 대시보드 메뉴 구조
```
회사 개요
├── 홈
└── 실시간 현황

브랜드 관리
├── 브랜드 목록
├── 매장 관리
└── 성과 분석

재고 관리
├── 통합 재고 현황
├── 발주 관리
└── 재고 이동

매출 관리
├── 매출 현황
├── 주문 관리
└── 분석 & 리포트

시스템 관리
├── 사용자 관리
├── 권한 설정
├── 시스템 설정
└── 감사 로그
```

#### 브랜드 대시보드 메뉴 구조
```
브랜드 개요
└── 홈

운영 관리
├── 매장 관리
├── 재고 현황
├── 메뉴 관리
└── 주문 현황

분석 & 마케팅
├── 매출 분석
├── 고객 관리
└── 마케팅

브랜드 설정
└── 브랜드 설정
```

## 기술적 구현

### 공통 컴포넌트

1. **DashboardLayout.tsx**: 기본 레이아웃 구조
2. **CompanyDashboardLayout.tsx**: 컴퍼니 전용 레이아웃
3. **BrandDashboardLayout.tsx**: 브랜드 전용 레이아웃

### 상태 관리

```typescript
// 사이드바 상태
const [sidebarOpen, setSidebarOpen] = useState(false)
const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

// 섹션 확장 상태 (컴퍼니 대시보드)
const [expandedSections, setExpandedSections] = useState<string[]>(['회사 개요'])
```

### 반응형 디자인

```css
/* 데스크톱 */
.sidebar {
  width: 256px; /* 펼쳐진 상태 */
  width: 70px;  /* 접힌 상태 */
}

/* 모바일 */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}
```

## 확장성 고려사항

### 1. 다중 브랜드 지원
- 브랜드별 독립적인 테마 시스템
- 동적 네비게이션 구성
- 권한 기반 메뉴 표시

### 2. 모듈화된 구조
- 재사용 가능한 컴포넌트
- 플러그인 방식의 기능 확장
- 설정 기반 메뉴 구성

### 3. 성능 최적화
- 지연 로딩 (Lazy Loading)
- 메모이제이션 (Memoization)
- 가상화 (Virtualization)

## 결론

컴퍼니 대시보드와 브랜드 대시보드는 동일한 기술적 기반을 공유하면서도, 각각의 사용 목적에 맞는 특화된 기능과 인터페이스를 제공합니다. 이러한 구조는 코드 재사용성을 높이고 유지보수를 용이하게 하면서도, 각 사용자 그룹의 요구사항을 효과적으로 충족시킵니다.
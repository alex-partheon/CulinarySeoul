# 통합 메뉴 구현 가이드 (Navigation Implementation Guide)

## 개요

CulinarySeoul ERP 시스템의 통합 메뉴 구조가 업데이트되어 다음과 같은 개선사항이 적용되었습니다:

- **확장된 메뉴 구조**: 8개 주요 섹션, 40+ 메뉴 항목
- **권한 기반 필터링**: 5단계 권한 레벨 지원
- **계층적 컨텍스트**: Company, Brand, Store 지원
- **향상된 UX**: 뱃지, 설명, 아이콘 체계화

## 새로운 API

### 1. 통합 메뉴 생성

```typescript
import { generateUnifiedNavigationSections } from '@/components/dashboard/shared/NavigationConfig';

// 기본 사용법
const sections = generateUnifiedNavigationSections('company');

// 옵션을 포함한 사용법
const sections = generateUnifiedNavigationSections('brand', {
  brandId: 'millab',
  storeId: 'seongsu',
  userPermissions: ['read', 'write'],
  userRole: 'manager'
});
```

### 2. 권한 필터링

```typescript
import { filterNavigationByPermissions } from '@/components/dashboard/shared/NavigationConfig';

const filteredSections = filterNavigationByPermissions(
  sections,
  'manager', // 사용자 역할
  (href) => canAccess(href) // 추가 접근 검사 함수
);
```

### 3. 컨텍스트별 메뉴

```typescript
// 회사 레벨 - 모든 기능에 접근
const companySections = generateUnifiedNavigationSections('company');

// 브랜드 레벨 - 브랜드 관리 제외
const brandSections = generateUnifiedNavigationSections('brand', {
  brandId: 'millab'
});

// 매장 레벨 - 매장 전용 기능만
const storeSections = generateUnifiedNavigationSections('store', {
  storeId: 'seongsu'
});
```

## 권한 시스템

### 권한 레벨 계층

```typescript
const permissionHierarchy = {
  'read': 0,        // 조회 전용 (직원, 파트타이머)
  'write': 1,       // 데이터 입력/수정 (정직원, 팀장)
  'manager': 2,     // 관리 기능 (매장 관리자, 브랜드 매니저)
  'admin': 3,       // 시스템 관리 (지역 관리자, 본사 관리자)
  'super_admin': 4  // 최고 관리자 (CEO, CTO)
};
```

### 권한 검사 예시

```typescript
// 사용자가 '매장 관리' 메뉴에 접근할 수 있는지 확인
const canAccessStoreManagement = hasPermissionLevel('manager', 'manager'); // true
const canAccessUserManagement = hasPermissionLevel('write', 'admin'); // false
```

## 메뉴 구조

### 1. 회사 현황 (Company Dashboard)
- 대시보드, 실시간 현황, 성과 분석, 알림 센터
- **권한**: read 이상
- **컨텍스트**: 모든 레벨

### 2. 조직 관리 (Organization Management)
- 브랜드 관리, 매장 관리, 직원 관리, 부서 관리
- **권한**: manager 이상 (브랜드 관리는 admin 이상)
- **컨텍스트**: Company/Brand (Store 제외)

### 3. 재고 관리 (Inventory Management)
- 재고 현황, 재고 관리, 발주 관리, 거래처 관리, 재고 이동, 재고 부족 알림, 선입선출 추적
- **권한**: read 이상 (관리 기능은 write 이상)
- **컨텍스트**: 모든 레벨

### 4. 매출 관리 (Sales & Order Management)
- 매출 현황, 주문 관리, POS 연동, 메뉴 관리, 프로모션 관리, 고객 관리, 적립금 관리
- **권한**: read 이상 (관리 기능은 write/manager)
- **컨텍스트**: 모든 레벨

### 5. 마케팅 (Marketing & Customer)
- 마케팅 현황, 캠페인 관리, SNS 관리, 리뷰 관리, 이벤트 관리, 뉴스레터
- **권한**: write 이상 (캠페인은 manager)
- **컨텍스트**: 모든 레벨

### 6. 분석 & 리포트 (Analytics & Reports)
- 경영 분석, 매출 리포트, 고객 분석, 재고 리포트, 직원 성과, 재무 리포트, 맞춤 리포트
- **권한**: read 이상 (고급 기능은 manager/admin)
- **컨텍스트**: 모든 레벨

### 7. 운영 관리 (Operations Management)
- 근무 스케줄, 업무 관리, 품질 관리, 시설 관리, 교육 관리, 컴플라이언스
- **권한**: write 이상 (관리 기능은 manager/admin)
- **컨텍스트**: 모든 레벨

### 8. 시스템 관리 (System Management)
- 사용자 관리, 권한 설정, 시스템 설정, 연동 관리, 감사 로그, 백업 관리, 시스템 상태
- **권한**: admin 이상 (권한 설정은 super_admin)
- **컨텍스트**: 모든 레벨

## 실제 구현 예시

### React 컴포넌트에서 사용

```typescript
import React from 'react';
import { generateUnifiedNavigationSections, filterNavigationByPermissions } from '@/components/dashboard/shared/NavigationConfig';
import { useAuth } from '@/contexts/AuthContext';

export const NavigationSidebar: React.FC = () => {
  const { user, permissions } = useAuth();
  
  // 통합 메뉴 생성
  const sections = generateUnifiedNavigationSections('company', {
    userRole: user?.role,
    userPermissions: permissions
  });
  
  // 권한 필터링 적용
  const filteredSections = filterNavigationByPermissions(
    sections,
    user?.role || 'read',
    (href) => permissions.canAccess(href)
  );
  
  return (
    <nav className="navigation-sidebar">
      {filteredSections.map(section => (
        <MenuSection key={section.title} section={section} />
      ))}
    </nav>
  );
};
```

### 메뉴 아이템 컴포넌트

```typescript
import React from 'react';
import { Link } from 'react-router';
import { NavigationItem } from '@/components/dashboard/shared/NavigationConfig';

interface MenuItemProps {
  item: NavigationItem;
  isActive?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, isActive }) => {
  const Icon = item.icon;
  
  return (
    <Link
      to={item.href}
      className={`menu-item ${isActive ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
      title={item.description}
    >
      <Icon className="menu-icon" size={20} />
      <span className="menu-text">{item.name}</span>
      {item.badge && (
        <span className={`menu-badge badge-${item.badge.toLowerCase()}`}>
          {item.badge}
        </span>
      )}
    </Link>
  );
};
```

## 마이그레이션 가이드

### 기존 코드 호환성

기존 `generateNavigationSections` 함수는 계속 작동하지만, 새로운 `generateUnifiedNavigationSections`로 마이그레이션을 권장합니다:

```typescript
// 기존 코드 (여전히 작동함)
const sections = generateNavigationSections('company');

// 새로운 코드 (권장)
const sections = generateUnifiedNavigationSections('company');
```

### 점진적 마이그레이션

1. **1단계**: 기존 코드는 그대로 두고 새로운 기능만 새 API 사용
2. **2단계**: 메뉴 커스터마이징이 필요한 부분부터 새 API로 변경
3. **3단계**: 모든 코드를 새 API로 마이그레이션

## 성능 최적화

### 메뉴 캐싱

```typescript
import { useMemo } from 'react';

const NavigationComponent = () => {
  const sections = useMemo(() => {
    const generated = generateUnifiedNavigationSections('company');
    return filterNavigationByPermissions(generated, userRole);
  }, [userRole]); // userRole이 변경될 때만 재계산
  
  return (
    // 렌더링 로직
  );
};
```

### 지연 로딩

```typescript
// 큰 메뉴 섹션을 지연 로딩
const LazyMenuSection = React.lazy(() => import('./LargeMenuSection'));

const Navigation = () => (
  <Suspense fallback={<MenuSkeleton />}>
    <LazyMenuSection />
  </Suspense>
);
```

## CSS 스타일링

### 기본 스타일 구조

```css
.navigation-sidebar {
  --menu-primary: #1f2937;
  --menu-secondary: #374151;
  --menu-text: #f9fafb;
  --menu-active: #3b82f6;
  --menu-hover: #4b5563;
}

.menu-section {
  margin-bottom: 1rem;
}

.menu-section-title {
  font-weight: 600;
  color: var(--menu-secondary);
  padding: 0.5rem 1rem;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--menu-text);
  text-decoration: none;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: var(--menu-hover);
}

.menu-item.active {
  background-color: var(--menu-active);
}

.menu-badge {
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-live { background-color: #10b981; }
.badge-new { background-color: #3b82f6; }
.badge-긴급 { background-color: #f59e0b; }
.badge-구현중 { background-color: #6b7280; }
```

## 확장 가능성

### 새로운 메뉴 항목 추가

`generateUnifiedNavigationSections` 함수에서 해당 섹션에 새 아이템 추가:

```typescript
{
  name: '새로운 기능',
  href: `${baseUrl}/new-feature`,
  icon: NewFeatureIcon,
  permission: 'write',
  description: '새로운 기능 설명',
  badge: 'Beta'
}
```

### 새로운 권한 레벨 추가

`hasPermissionLevel` 함수의 `permissionHierarchy` 객체에 추가:

```typescript
const permissionHierarchy = {
  'read': 0,
  'write': 1,
  'supervisor': 1.5, // 새로운 레벨
  'manager': 2,
  'admin': 3,
  'super_admin': 4
};
```

## 문제 해결

### 자주 발생하는 문제

1. **메뉴가 표시되지 않음**: 권한 레벨 확인
2. **아이콘이 보이지 않음**: Lucide React 아이콘 import 확인
3. **링크가 작동하지 않음**: React Router 설정 확인
4. **성능 저하**: 메뉴 캐싱 적용

### 디버깅

```typescript
// 메뉴 생성 과정 디버깅
const debugSections = generateUnifiedNavigationSections('company', {
  userRole: 'debug' // 모든 메뉴 표시
});

console.log('Generated sections:', debugSections);
console.log('User permissions:', userPermissions);
```

## 테스트

### 단위 테스트 예시

```typescript
import { generateUnifiedNavigationSections, filterNavigationByPermissions } from './NavigationConfig';

describe('NavigationConfig', () => {
  test('should generate company menu correctly', () => {
    const sections = generateUnifiedNavigationSections('company');
    expect(sections).toHaveLength(8);
    expect(sections[0].title).toBe('회사 현황');
  });
  
  test('should filter by permissions', () => {
    const sections = generateUnifiedNavigationSections('company');
    const filtered = filterNavigationByPermissions(sections, 'read');
    
    // read 권한으로는 시스템 관리 섹션이 제외되어야 함
    expect(filtered.find(s => s.title === '시스템 관리')).toBeUndefined();
  });
});
```

이 통합 메뉴 시스템을 통해 CulinarySeoul ERP는 확장 가능하고 사용자 친화적인 네비게이션을 제공할 수 있습니다.
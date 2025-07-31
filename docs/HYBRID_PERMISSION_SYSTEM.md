# 하이브리드 권한 시스템 (Hybrid Permission System)

## 개요

Culinary Seoul의 하이브리드 권한 시스템은 회사(Company)와 브랜드(Brand) 대시보드 간의 유연한 권한 관리를 제공합니다. 사용자는 단일 계정으로 여러 대시보드에 접근할 수 있으며, 각 대시보드별로 세분화된 권한을 가질 수 있습니다.

## 핵심 기능

### 1. 이중 대시보드 시스템
- **회사 대시보드**: 전체 회사 운영 관리
- **브랜드 대시보드**: 개별 브랜드별 운영 관리
- 사용자는 권한에 따라 하나 또는 두 대시보드 모두에 접근 가능

### 2. 세션 기반 컨텍스트 관리
- 각 대시보드 접근 시 별도의 세션 생성
- 브랜드 컨텍스트 전환 지원
- 세션별 권한 및 접근 이력 추적

### 3. 실시간 권한 동기화
- Supabase Realtime을 통한 권한 변경 실시간 반영
- 권한 캐시 자동 무효화 및 갱신
- 다중 세션 간 권한 상태 동기화

### 4. 감사 로그 시스템
- 모든 권한 변경 이력 기록
- 대시보드별 접근 로그 추적
- 권한 변경 사유 및 변경자 정보 저장

## 아키텍처

### 데이터베이스 스키마

#### 핵심 테이블

1. **companies**: 회사 정보
2. **brands**: 브랜드 정보 (회사와 연결)
3. **stores**: 매장 정보 (브랜드와 연결)
4. **dashboard_access_permissions**: 사용자별 대시보드 접근 권한
5. **dashboard_sessions**: 대시보드 세션 관리
6. **permission_audit_logs**: 권한 변경 감사 로그

#### 권한 구조

```typescript
interface DashboardPermissions {
  modules: {
    [moduleName: string]: {
      read: boolean;
      write: boolean;
      delete: boolean;
      admin: boolean;
    };
  };
  actions: {
    [actionName: string]: boolean;
  };
}

interface HybridPermissions {
  canSwitchBetweenDashboards: boolean;
  crossPlatformDataAccess: boolean;
  brandContextSwitching: boolean;
  globalAdminAccess: boolean;
}
```

### 시스템 컴포넌트

#### 1. 권한 서비스 (`PermissionService`)
- 사용자 권한 조회 및 검증
- 대시보드 세션 생성 및 관리
- 권한 변경 이력 기록
- 캐시 관리

#### 2. React Hooks
- `usePermissions`: 권한 관리 및 검증
- `usePermissionGuard`: 컴포넌트 레벨 권한 보호
- `useDashboardAccess`: 대시보드별 접근 제어

#### 3. 컴포넌트
- `PermissionGuard`: 라우트 레벨 권한 보호
- `DashboardSwitcher`: 대시보드 전환 UI
- `PermissionManagement`: 권한 관리 페이지

## 사용법

### 1. 권한 확인

```typescript
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { hasPermission, hasModuleAccess } = usePermissions();
  
  // 특정 액션 권한 확인
  const canCreateStore = hasPermission('stores', 'create');
  
  // 모듈 접근 권한 확인
  const canAccessInventory = hasModuleAccess('inventory', 'read');
  
  return (
    <div>
      {canCreateStore && <CreateStoreButton />}
      {canAccessInventory && <InventoryModule />}
    </div>
  );
}
```

### 2. 라우트 보호

```typescript
import { PermissionGuard } from '@/components/auth/PermissionGuard';

function ProtectedRoute() {
  return (
    <PermissionGuard
      requiredDashboard="brand"
      requiredRole="manager"
      requiredPermissions={[{ module: 'stores', action: 'read' }]}
      fallback={<AccessDenied />}
    >
      <StoreManagementPage />
    </PermissionGuard>
  );
}
```

### 3. 대시보드 전환

```typescript
import { useAuth } from '@/contexts/AuthContext';

function DashboardSwitcher() {
  const { switchToDashboard, canAccessDashboard } = useAuth();
  
  const handleSwitchToBrand = async (brandId: string) => {
    if (await canAccessDashboard('brand')) {
      await switchToDashboard('brand', brandId);
    }
  };
  
  return (
    <div>
      <button onClick={() => switchToDashboard('company')}>
        회사 대시보드
      </button>
      <button onClick={() => handleSwitchToBrand('brand-id')}>
        브랜드 대시보드
      </button>
    </div>
  );
}
```

## 보안 고려사항

### 1. 권한 검증
- 클라이언트와 서버 양쪽에서 권한 검증
- JWT 토큰 기반 인증
- 세션 만료 및 자동 갱신

### 2. 데이터 격리
- 브랜드별 데이터 접근 제한
- RLS (Row Level Security) 정책 적용
- 크로스 플랫폼 접근 제어

### 3. 감사 추적
- 모든 권한 변경 로깅
- 접근 시도 기록
- 의심스러운 활동 모니터링

## 성능 최적화

### 1. 권한 캐싱
- 메모리 기반 권한 캐시
- TTL 기반 캐시 무효화
- 실시간 업데이트 시 선택적 캐시 갱신

### 2. 배치 권한 조회
- 여러 권한을 한 번에 조회
- 불필요한 데이터베이스 호출 최소화
- 권한 프리로딩

### 3. 실시간 최적화
- 필요한 권한 변경만 구독
- 사용자별 채널 분리
- 연결 풀링 및 재사용

## 모니터링 및 디버깅

### 1. 로깅
- 권한 확인 로그
- 세션 생성/종료 로그
- 에러 및 예외 상황 로그

### 2. 메트릭
- 권한 확인 응답 시간
- 캐시 히트율
- 실시간 연결 상태

### 3. 알림
- 권한 오류 알림
- 비정상적인 접근 패턴 감지
- 시스템 성능 임계값 초과 알림

## 확장성

### 1. 새로운 권한 타입 추가
- 모듈식 권한 구조로 쉬운 확장
- 동적 권한 정의 지원
- 커스텀 권한 검증 로직

### 2. 다중 테넌트 지원
- 회사별 권한 격리
- 브랜드별 커스텀 권한
- 계층적 권한 상속

### 3. 외부 시스템 연동
- SSO (Single Sign-On) 지원
- 외부 권한 시스템 연동
- API 기반 권한 동기화

## 문제 해결

### 일반적인 문제

1. **권한이 즉시 반영되지 않음**
   - 캐시 무효화 확인
   - 실시간 연결 상태 확인
   - 브라우저 새로고침

2. **대시보드 전환 실패**
   - 네트워크 연결 확인
   - 세션 유효성 검증
   - 권한 재확인

3. **성능 저하**
   - 캐시 히트율 확인
   - 불필요한 권한 조회 최적화
   - 데이터베이스 쿼리 성능 분석

### 디버깅 도구

```typescript
// 개발 환경에서 권한 상태 확인
if (process.env.NODE_ENV === 'development') {
  console.log('Current permissions:', permissionService.getDebugInfo());
}
```

## 마이그레이션 가이드

기존 시스템에서 하이브리드 권한 시스템으로 마이그레이션하는 경우:

1. 기존 권한 데이터 백업
2. 새로운 스키마 적용
3. 권한 데이터 변환 스크립트 실행
4. 점진적 기능 활성화
5. 기존 시스템과 병행 운영 후 완전 전환

## 라이센스

이 시스템은 Culinary Seoul 프로젝트의 일부로 개발되었습니다.
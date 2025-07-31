# 브랜드 및 매장 관리 대시보드 구현

## 개요

이 문서는 CulinarySeoul 프로젝트에서 브랜드 및 매장 관리 기능을 확장한 대시보드 구현에 대해 설명합니다.

## 구현된 기능

### 1. 업종 카테고리 시스템

#### 브랜드 타입 확장
- `BusinessCategory` enum 추가 (10개 카테고리)
- `Brand` 인터페이스에 `business_category` 및 `description` 필드 추가
- 브랜드 생성/수정 시 카테고리 선택 가능

#### 데이터베이스 스키마 업데이트
- 브랜드 테이블에 `business_category` 및 `description` 컬럼 추가
- `business_category_enum` 타입 생성
- 인덱스 및 제약조건 추가

### 2. 대시보드 컴포넌트

#### 회사 대시보드 (`CompanyDashboard`)
- **권한**: 슈퍼 관리자, 회사 관리자
- **기능**:
  - 회사 정보 표시
  - 브랜드 목록 조회 및 관리
  - 매장 목록 조회 및 관리
  - 새 브랜드 추가
  - 새 매장 추가
  - 업종 카테고리 관리
  - 매출관리(구현중) - 향후 토스페이먼츠 연동 예정

#### 브랜드 대시보드 (`BrandDashboard`)
- **권한**: 브랜드 관리자
- **기능**:
  - 브랜드 정보 표시
  - 해당 브랜드의 매장 목록 조회
  - 새 매장 추가
  - 매장 상태 관리
  - 매출관리(구현중) - 향후 토스페이먼츠 연동 예정
  - 매출 분석 - 브랜드별 매출 데이터 분석

#### 카테고리 관리 (`CategoryManagement`)
- **권한**: 회사 관리자
- **기능**:
  - 업종별 브랜드 그룹화 표시
  - 브랜드 카테고리 수정
  - 브랜드 설명 편집

### 3. UI 컴포넌트 라이브러리

다음 재사용 가능한 UI 컴포넌트들을 구현했습니다:
- `Button` - 다양한 스타일 변형 지원
- `Card` - 정보 표시용 카드 컴포넌트
- `Input` - 텍스트 입력 필드
- `Label` - 폼 라벨
- `Select` - 드롭다운 선택
- `Textarea` - 다중 라인 텍스트 입력
- `Dialog` - 모달 다이얼로그
- `Tabs` - 탭 네비게이션
- `Badge` - 상태 표시 배지

### 4. 서비스 레이어 확장

#### BrandService 업데이트
- `getBrandsByCompany()` - 회사별 브랜드 조회
- 브랜드 생성/수정 시 `business_category` 및 `description` 처리

#### StoreService 업데이트
- `getStoresByCompany()` - 회사별 매장 조회 (모든 브랜드 포함)
- `getStoresByBrand()` - 브랜드별 매장 조회

## 파일 구조

```
src/
├── components/
│   ├── dashboard/
│   │   ├── CompanyDashboard.tsx      # 회사 관리 대시보드
│   │   ├── BrandDashboard.tsx        # 브랜드 관리 대시보드
│   │   ├── CategoryManagement.tsx    # 카테고리 관리
│   │   └── index.ts                  # 대시보드 컴포넌트 내보내기
│   └── ui/                           # 재사용 가능한 UI 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── textarea.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       ├── badge.tsx
│       └── index.ts
├── domains/
│   ├── brand/
│   │   ├── types.ts                  # BusinessCategory enum 추가
│   │   └── brandService.ts           # 카테고리 필드 처리 추가
│   └── store/
│       └── storeService.ts           # 회사별 조회 메서드 추가
├── pages/
│   ├── Dashboard.tsx                 # 메인 대시보드 페이지
│   └── DashboardDemo.tsx             # 데모용 대시보드
supabase/
└── migrations/
    ├── 20241201000002_add_brand_category_and_description.sql
    └── 20241201000003_update_existing_brand_data.sql
```

## 업종 카테고리

다음 10개의 업종 카테고리를 지원합니다:

1. **CAFE** - 카페
2. **RESTAURANT** - 레스토랑
3. **BAKERY** - 베이커리
4. **FAST_FOOD** - 패스트푸드
5. **FINE_DINING** - 파인다이닝
6. **BAR** - 바/주점
7. **DESSERT** - 디저트
8. **FOOD_TRUCK** - 푸드트럭
9. **CATERING** - 케이터링
10. **OTHER** - 기타

## 권한 체계

### 슈퍼 관리자 (super_admin)
- 모든 회사의 데이터 접근 가능
- 브랜드 및 매장 생성/수정/삭제
- 카테고리 관리

### 회사 관리자 (company_admin)
- 자신의 회사 데이터만 접근 가능
- 브랜드 및 매장 생성/수정/삭제
- 카테고리 관리

### 브랜드 관리자 (brand_admin)
- 자신의 브랜드 데이터만 접근 가능
- 해당 브랜드의 매장 생성/수정
- 매장 상태 관리

### 매장 관리자 (store_admin)
- 자신의 매장 데이터만 접근 가능
- 매장 정보 수정 (제한적)

## 사용 방법

### 1. 대시보드 접근

```tsx
import Dashboard from './pages/Dashboard';

// 사용자 역할에 따른 대시보드 렌더링
<Dashboard
  userRole="company_admin"
  userId="user-123"
  companyId="company-456"
/>
```

### 2. 브랜드 생성 (회사 대시보드)

1. "브랜드 관리" 탭 선택
2. "새 브랜드 추가" 버튼 클릭
3. 브랜드 정보 입력:
   - 브랜드명
   - 브랜드 코드
   - 업종 카테고리 선택
   - 브랜드 설명
4. "브랜드 생성" 버튼 클릭

### 3. 매장 생성

#### 회사 대시보드에서:
1. "매장 관리" 탭 선택
2. "새 매장 추가" 버튼 클릭
3. 브랜드 선택 및 매장 정보 입력

#### 브랜드 대시보드에서:
1. "새 매장 추가" 버튼 클릭
2. 매장 정보 입력 (브랜드는 자동 선택됨)

### 4. 카테고리 관리

1. 회사 대시보드에서 "카테고리 관리" 탭 선택
2. 업종별로 그룹화된 브랜드 목록 확인
3. 브랜드 카드의 "수정" 버튼 클릭
4. 카테고리 및 설명 수정

## 데이터베이스 마이그레이션

새로운 기능을 사용하기 위해 다음 마이그레이션을 실행해야 합니다:

```sql
-- 1. 브랜드 테이블에 카테고리 및 설명 필드 추가
psql -f supabase/migrations/20241201000002_add_brand_category_and_description.sql

-- 2. 기존 브랜드 데이터 업데이트
psql -f supabase/migrations/20241201000003_update_existing_brand_data.sql
```

## 향후 개선 사항

1. **매출관리 시스템 완성**: 토스페이먼츠 API 연동을 통한 자동 매출 수집
2. **실시간 업데이트**: Supabase 실시간 구독을 통한 데이터 동기화
3. **권한 세분화**: 더 세밀한 권한 제어 시스템
4. **대시보드 커스터마이징**: 사용자별 대시보드 레이아웃 설정
5. **분석 기능**: 브랜드/매장별 성과 분석 대시보드
6. **알림 시스템**: 중요한 이벤트에 대한 실시간 알림
7. **모바일 최적화**: 반응형 디자인 개선
8. **매출 데이터 자동화**: 결제 시스템과 연동한 실시간 매출 추적

## 기술 스택

- **Frontend**: React 18, TypeScript
- **UI Library**: Radix UI, Tailwind CSS
- **State Management**: React Hooks
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS, class-variance-authority

## 주의사항

1. **데이터베이스 연결**: 실제 사용 전 Supabase 프로젝트 설정 필요
2. **인증 시스템**: 현재는 데모용이므로 실제 인증 시스템 연동 필요
3. **에러 처리**: 프로덕션 환경에서는 더 강화된 에러 처리 필요
4. **성능 최적화**: 대용량 데이터 처리 시 페이지네이션 구현 권장

이 구현을 통해 CulinarySeoul의 브랜드 및 매장 관리가 체계적이고 확장 가능한 형태로 발전할 수 있습니다.
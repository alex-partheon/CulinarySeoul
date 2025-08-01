# React Router Framework Mode 마이그레이션 계획

## 개요

현재 CulinarySeoul 프로젝트는 React Router v7을 사용하는 전통적인 SPA 구조로 되어 있습니다. 이 문서는 React Router Framework Mode로 전환하기 위한 단계별 계획과 전략을 제시합니다.

## 현재 상태 분석

### 현재 프로젝트 구조
- **라우팅**: 수동 라우터 설정 (`src/router.tsx`)
- **디렉토리**: `src/` 기반 구조
- **렌더링**: 클라이언트 사이드 렌더링 (CSR)
- **코드 분할**: 수동 lazy loading
- **의존성**: `react-router` v7.7.1

### Framework Mode의 장점
- 파일 기반 라우팅으로 직관적인 구조
- 서버 사이드 렌더링 (SSR) 지원
- 자동 코드 분할 및 최적화
- 타입 안전한 라우트 정의
- 향상된 개발자 경험
- 성능 최적화 (프리페칭, 번들 최적화)

## 마이그레이션 전략

### Phase 1: 준비 단계 (1-2일)

#### 1.1 의존성 업데이트
```bash
# Framework Mode 필수 패키지 설치
npm install -D @react-router/dev
npm install @react-router/node
```

#### 1.2 Vite 설정 업데이트
```typescript
// vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    reactRouter({
      appDirectory: "app",
      buildDirectory: "build",
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
});
```

#### 1.3 React Router 설정 파일 생성
```typescript
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "app",
  buildDirectory: "build",
  ssr: true,
  serverBuildFile: "index.js",
  publicPath: "/assets/",
  dev: {
    port: 5177,
  },
} satisfies Config;
```

### Phase 2: 디렉토리 구조 변경 (2-3일)

#### 2.1 새로운 디렉토리 구조 생성
```
app/
├── routes/
│   ├── _index.tsx                    # / (홈페이지)
│   ├── login.tsx                     # /login
│   ├── company/
│   │   ├── _layout.tsx               # 회사 레이아웃
│   │   ├── _index.tsx                # /company
│   │   ├── realtime.tsx              # /company/realtime
│   │   ├── performance.tsx           # /company/performance
│   │   └── ...
│   ├── brand/
│   │   ├── $brandId/
│   │   │   ├── _layout.tsx           # 브랜드 레이아웃
│   │   │   ├── _index.tsx            # /brand/:brandId
│   │   │   ├── realtime.tsx          # /brand/:brandId/realtime
│   │   │   └── ...
│   └── store/
│       └── $storeId/
│           ├── _layout.tsx           # 매장 레이아웃
│           ├── _index.tsx            # /store/:storeId
│           └── ...
├── components/                       # 기존 컴포넌트 이동
├── contexts/                         # 기존 컨텍스트 이동
├── lib/                             # 기존 라이브러리 이동
└── root.tsx                         # 루트 레이아웃
```

#### 2.2 파일 이동 및 변환 계획
- `src/pages/` → `app/routes/`로 이동
- `src/components/` → `app/components/`로 이동
- `src/contexts/` → `app/contexts/`로 이동
- `src/lib/` → `app/lib/`로 이동

### Phase 3: 라우트 파일 변환 (3-4일)

#### 3.1 루트 레이아웃 생성
```typescript
// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@react-router/react";
import type { LinksFunction } from "@react-router/node";

import "./index.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
```

#### 3.2 라우트 파일 변환 예시
```typescript
// app/routes/company/_layout.tsx
import { Outlet } from "@react-router/react";
import type { Route } from "./+types/_layout";
import { CompanyDashboardLayout } from "~/components/dashboard/company/CompanyDashboardLayout";
import { ProtectedRoute } from "~/components/auth/ProtectedRoute";
import { DataScopeProvider } from "~/contexts/DataScopeContext";

export default function CompanyLayout() {
  return (
    <ProtectedRoute>
      <DataScopeProvider defaultScope="company">
        <CompanyDashboardLayout>
          <Outlet />
        </CompanyDashboardLayout>
      </DataScopeProvider>
    </ProtectedRoute>
  );
}
```

### Phase 4: 데이터 로딩 최적화 (2-3일)

#### 4.1 Loader 함수 구현
```typescript
// app/routes/company/_index.tsx
import type { Route } from "./+types/_index";
import { CompanyDashboard } from "~/components/dashboard/company/CompanyDashboard";

export async function loader({ request }: Route.LoaderArgs) {
  // 서버에서 데이터 미리 로딩
  const companies = await getCompanies();
  const analytics = await getCompanyAnalytics();
  
  return {
    companies,
    analytics,
  };
}

export default function CompanyDashboardPage({ loaderData }: Route.ComponentProps) {
  return <CompanyDashboard data={loaderData} />;
}
```

#### 4.2 Action 함수 구현
```typescript
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  
  switch (intent) {
    case "create-company":
      return await createCompany(formData);
    case "update-company":
      return await updateCompany(formData);
    default:
      throw new Response("Invalid intent", { status: 400 });
  }
}
```

### Phase 5: 타입 안전성 강화 (1-2일)

#### 5.1 타입 정의 파일 생성
```typescript
// app/routes/company/+types/_index.ts
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@react-router/node";

export interface LoaderData {
  companies: Company[];
  analytics: CompanyAnalytics;
}

export interface ActionData {
  success: boolean;
  error?: string;
}

export type LoaderArgs = LoaderFunctionArgs;
export type ActionArgs = ActionFunctionArgs;
export type ComponentProps = {
  loaderData: LoaderData;
  actionData?: ActionData;
};
```

### Phase 6: 테스트 및 최적화 (2-3일)

#### 6.1 성능 테스트
- 번들 크기 비교
- 로딩 시간 측정
- 메모리 사용량 확인

#### 6.2 SEO 최적화
- 메타 태그 설정
- 구조화된 데이터 추가
- 사이트맵 생성

## 체크리스트

### 준비 단계
- [ ] 현재 프로젝트 백업 생성
- [ ] 새 브랜치 생성 (`feature/framework-mode-migration`)
- [ ] Framework Mode 의존성 설치
- [ ] Vite 설정 업데이트
- [ ] React Router 설정 파일 생성

### 구조 변경
- [ ] `app/` 디렉토리 생성
- [ ] `app/routes/` 디렉토리 구조 설계
- [ ] 기존 파일 이동 계획 수립
- [ ] 임포트 경로 매핑 계획

### 라우트 변환
- [ ] 루트 레이아웃 (`app/root.tsx`) 생성
- [ ] 회사 라우트 변환
  - [ ] `app/routes/company/_layout.tsx`
  - [ ] `app/routes/company/_index.tsx`
  - [ ] 하위 라우트들 변환
- [ ] 브랜드 라우트 변환
  - [ ] `app/routes/brand/$brandId/_layout.tsx`
  - [ ] `app/routes/brand/$brandId/_index.tsx`
  - [ ] 하위 라우트들 변환
- [ ] 매장 라우트 변환
  - [ ] `app/routes/store/$storeId/_layout.tsx`
  - [ ] `app/routes/store/$storeId/_index.tsx`
  - [ ] 하위 라우트들 변환
- [ ] 인증 라우트 변환
  - [ ] `app/routes/login.tsx`
  - [ ] `app/routes/_index.tsx`

### 데이터 로딩
- [ ] Loader 함수 구현
  - [ ] 회사 데이터 로더
  - [ ] 브랜드 데이터 로더
  - [ ] 매장 데이터 로더
- [ ] Action 함수 구현
  - [ ] CRUD 작업 액션들
- [ ] 에러 핸들링 구현

### 컴포넌트 업데이트
- [ ] 기존 컴포넌트 Framework Mode 호환성 확인
- [ ] 라우터 훅 업데이트 (`useNavigate`, `useParams` 등)
- [ ] 폼 컴포넌트 Framework Mode 방식으로 변경

### 타입 안전성
- [ ] 라우트별 타입 정의 파일 생성
- [ ] Loader/Action 타입 정의
- [ ] 컴포넌트 Props 타입 업데이트

### 테스트
- [ ] 기존 테스트 케이스 Framework Mode 호환성 확인
- [ ] 새로운 테스트 케이스 작성
- [ ] E2E 테스트 실행
- [ ] 성능 테스트 실행

### 배포 준비
- [ ] 빌드 설정 확인
- [ ] 서버 설정 업데이트
- [ ] 환경 변수 설정
- [ ] CI/CD 파이프라인 업데이트

## 위험 요소 및 대응 방안

### 주요 위험 요소
1. **기존 기능 손실**: 복잡한 라우팅 로직이 Framework Mode에서 동작하지 않을 수 있음
2. **성능 저하**: 초기 설정 미스로 인한 성능 문제
3. **타입 에러**: 기존 타입 정의와 Framework Mode 타입 간 충돌
4. **의존성 충돌**: 기존 라이브러리와 Framework Mode 간 호환성 문제

### 대응 방안
1. **점진적 마이그레이션**: 한 번에 모든 라우트를 변경하지 않고 단계적으로 진행
2. **철저한 테스트**: 각 단계마다 기능 테스트 및 성능 테스트 실행
3. **백업 및 롤백 계획**: 문제 발생 시 즉시 이전 상태로 복구 가능한 계획 수립
4. **문서화**: 변경 사항을 상세히 문서화하여 팀원들이 이해할 수 있도록 함

## 예상 일정

| Phase | 작업 내용 | 예상 기간 | 담당자 |
|-------|-----------|-----------|--------|
| 1 | 준비 단계 | 1-2일 | 개발팀 |
| 2 | 디렉토리 구조 변경 | 2-3일 | 개발팀 |
| 3 | 라우트 파일 변환 | 3-4일 | 개발팀 |
| 4 | 데이터 로딩 최적화 | 2-3일 | 개발팀 |
| 5 | 타입 안전성 강화 | 1-2일 | 개발팀 |
| 6 | 테스트 및 최적화 | 2-3일 | QA팀 + 개발팀 |
| **총 기간** | | **11-17일** | |

## 성공 지표

1. **성능 향상**
   - 초기 로딩 시간 20% 단축
   - 번들 크기 15% 감소
   - 페이지 전환 속도 30% 향상

2. **개발자 경험 개선**
   - 타입 안전성 100% 달성
   - 빌드 시간 단축
   - 핫 리로드 성능 향상

3. **SEO 개선**
   - 서버 사이드 렌더링으로 검색 엔진 최적화
   - 메타 태그 자동 생성
   - 구조화된 데이터 지원

## 결론

React Router Framework Mode로의 전환은 단기적으로는 개발 시간이 소요되지만, 장기적으로는 성능, 개발자 경험, SEO 측면에서 큰 이익을 가져다 줄 것입니다. 체계적인 계획과 단계적 접근을 통해 안전하고 효율적인 마이그레이션을 진행할 수 있습니다.

---

**문서 작성일**: 2025년 8월 1일  
**작성자**: Senior Lead Developer  
**버전**: 1.0  
**다음 검토일**: 마이그레이션 시작 전
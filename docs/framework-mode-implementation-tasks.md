# React Router Framework Mode 구현 태스크

## 태스크 개요

이 문서는 React Router Framework Mode 마이그레이션을 위한 구체적인 실행 태스크들을 정의합니다. 각 태스크는 독립적으로 실행 가능하며, 명확한 완료 기준을 가지고 있습니다.

## 태스크 분류

### 🔧 SETUP - 환경 설정 태스크
### 📁 STRUCTURE - 구조 변경 태스크  
### 🛣️ ROUTES - 라우트 변환 태스크
### 📊 DATA - 데이터 로딩 태스크
### 🔒 TYPES - 타입 안전성 태스크
### 🧪 TEST - 테스트 태스크
### 🚀 DEPLOY - 배포 준비 태스크

---

## SETUP 태스크

### SETUP-001: 프로젝트 백업 및 브랜치 생성
**우선순위**: 🔴 Critical  
**예상 시간**: 30분  
**담당자**: Lead Developer

**작업 내용**:
```bash
# 1. 현재 상태 백업
git add .
git commit -m "backup: pre-framework-mode-migration state"
git tag v1.0-pre-framework-mode

# 2. 새 브랜치 생성
git checkout -b feature/framework-mode-migration

# 3. 백업 확인
git log --oneline -5
```

**완료 기준**:
- [ ] 백업 커밋 생성 완료
- [ ] 태그 생성 완료
- [ ] 새 브랜치에서 작업 중

---

### SETUP-002: Framework Mode 의존성 설치
**우선순위**: 🔴 Critical  
**예상 시간**: 15분  
**담당자**: Lead Developer

**작업 내용**:
```bash
# Framework Mode 필수 패키지 설치
npm install -D @react-router/dev
npm install @react-router/node

# 패키지 버전 확인
npm list @react-router/dev @react-router/node
```

**완료 기준**:
- [ ] `@react-router/dev` 설치 완료
- [ ] `@react-router/node` 설치 완료
- [ ] package.json 업데이트 확인

---

### SETUP-003: Vite 설정 업데이트
**우선순위**: 🔴 Critical  
**예상 시간**: 30분  
**담당자**: Lead Developer

**작업 내용**:
```typescript
// vite.config.js → vite.config.ts 변환
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    reactRouter({
      appDirectory: "app",
      buildDirectory: "build",
    })
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
});
```

**완료 기준**:
- [ ] vite.config.ts 파일 생성
- [ ] reactRouter 플러그인 설정
- [ ] 별칭 경로 설정 완료
- [ ] 기존 vite.config.js 제거

---

### SETUP-004: React Router 설정 파일 생성
**우선순위**: 🔴 Critical  
**예상 시간**: 20분  
**담당자**: Lead Developer

**작업 내용**:
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
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
} satisfies Config;
```

**완료 기준**:
- [ ] react-router.config.ts 파일 생성
- [ ] 기본 설정 완료
- [ ] Future flags 설정

---

## STRUCTURE 태스크

### STRUCTURE-001: app 디렉토리 구조 생성
**우선순위**: 🔴 Critical  
**예상 시간**: 45분  
**담당자**: Lead Developer

**작업 내용**:
```bash
# app 디렉토리 구조 생성
mkdir -p app/{routes,components,contexts,lib,types,utils}
mkdir -p app/routes/{company,brand,store,admin,api}
mkdir -p app/routes/brand/\$brandId
mkdir -p app/routes/store/\$storeId

# 기본 파일 생성
touch app/root.tsx
touch app/routes/_index.tsx
touch app/routes/login.tsx
```

**디렉토리 구조**:
```
app/
├── routes/
│   ├── _index.tsx
│   ├── login.tsx
│   ├── company/
│   │   ├── _layout.tsx
│   │   └── _index.tsx
│   ├── brand/
│   │   └── $brandId/
│   │       ├── _layout.tsx
│   │       └── _index.tsx
│   └── store/
│       └── $storeId/
│           ├── _layout.tsx
│           └── _index.tsx
├── components/
├── contexts/
├── lib/
├── types/
├── utils/
└── root.tsx
```

**완료 기준**:
- [ ] app 디렉토리 구조 생성
- [ ] 기본 라우트 파일 생성
- [ ] 하위 디렉토리 생성 완료

---

### STRUCTURE-002: 기존 파일 이동 계획 수립
**우선순위**: 🟡 High  
**예상 시간**: 1시간  
**담당자**: Lead Developer

**작업 내용**:
1. 파일 이동 매핑 테이블 작성
2. 임포트 경로 변경 계획 수립
3. 이동 스크립트 작성

**파일 이동 매핑**:
```
src/components/ → app/components/
src/contexts/ → app/contexts/
src/lib/ → app/lib/
src/types/ → app/types/
src/utils/ → app/utils/
src/data/ → app/data/
src/services/ → app/services/
```

**완료 기준**:
- [ ] 이동 매핑 테이블 완성
- [ ] 임포트 경로 변경 계획 수립
- [ ] 이동 스크립트 작성

---

## ROUTES 태스크

### ROUTES-001: 루트 레이아웃 생성
**우선순위**: 🔴 Critical  
**예상 시간**: 1시간  
**담당자**: Lead Developer

**작업 내용**:
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
import { AuthProvider } from "~/contexts/AuthContext";

import "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
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
        <AuthProvider>
          {children}
        </AuthProvider>
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

**완료 기준**:
- [ ] app/root.tsx 파일 생성
- [ ] 기본 HTML 구조 설정
- [ ] AuthProvider 래핑
- [ ] 스타일시트 링크 설정

---

### ROUTES-002: 홈페이지 라우트 생성
**우선순위**: 🔴 Critical  
**예상 시간**: 30분  
**담당자**: Lead Developer

**작업 내용**:
```typescript
// app/routes/_index.tsx
import { redirect } from "@react-router/node";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
  // 인증 상태 확인 후 적절한 대시보드로 리다이렉트
  const url = new URL(request.url);
  const user = await getCurrentUser(request);
  
  if (!user) {
    return redirect("/login");
  }
  
  // 사용자 역할에 따른 리다이렉트
  switch (user.role) {
    case "super_admin":
    case "company_admin":
      return redirect("/company");
    case "brand_admin":
      return redirect(`/brand/${user.brand_id}`);
    case "store_admin":
      return redirect(`/store/${user.store_id}`);
    default:
      return redirect("/login");
  }
}
```

**완료 기준**:
- [ ] app/routes/_index.tsx 파일 생성
- [ ] 로더 함수 구현
- [ ] 역할별 리다이렉트 로직 구현

---

### ROUTES-003: 로그인 라우트 생성
**우선순위**: 🔴 Critical  
**예상 시간**: 1시간  
**담당자**: Lead Developer

**작업 내용**:
```typescript
// app/routes/login.tsx
import { Form, redirect } from "@react-router/react";
import type { Route } from "./+types/login";
import { LoginPage } from "~/components/auth/LoginPage";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);
  if (user) {
    return redirect("/");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  try {
    const user = await signIn(email, password);
    return redirect("/");
  } catch (error) {
    return {
      error: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요."
    };
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  return <LoginPage error={actionData?.error} />;
}
```

**완료 기준**:
- [ ] app/routes/login.tsx 파일 생성
- [ ] 로더 및 액션 함수 구현
- [ ] 로그인 컴포넌트 연결

---

### ROUTES-004: 회사 라우트 레이아웃 생성
**우선순위**: 🟡 High  
**예상 시간**: 1.5시간  
**담당자**: Lead Developer

**작업 내용**:
```typescript
// app/routes/company/_layout.tsx
import { Outlet } from "@react-router/react";
import type { Route } from "./+types/_layout";
import { CompanyDashboardLayout } from "~/components/dashboard/company/CompanyDashboardLayout";
import { ProtectedRoute } from "~/components/auth/ProtectedRoute";
import { DataScopeProvider } from "~/contexts/DataScopeContext";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);
  
  if (!user || !['super_admin', 'company_admin'].includes(user.role)) {
    throw new Response("Unauthorized", { status: 403 });
  }
  
  return { user };
}

export default function CompanyLayout({ loaderData }: Route.ComponentProps) {
  return (
    <DataScopeProvider defaultScope="company">
      <CompanyDashboardLayout>
        <Outlet />
      </CompanyDashboardLayout>
    </DataScopeProvider>
  );
}
```

**완료 기준**:
- [ ] app/routes/company/_layout.tsx 파일 생성
- [ ] 권한 검사 로더 구현
- [ ] 레이아웃 컴포넌트 연결

---

### ROUTES-005: 회사 대시보드 인덱스 생성
**우선순위**: 🟡 High  
**예상 시간**: 1시간  
**담당자**: Lead Developer

**작업 내용**:
```typescript
// app/routes/company/_index.tsx
import type { Route } from "./+types/_index";
import { CompanyDashboard } from "~/components/dashboard/company/CompanyDashboard";
import { getCompanyAnalytics, getCompanies } from "~/services/companyService";

export async function loader({ request }: Route.LoaderArgs) {
  const [companies, analytics] = await Promise.all([
    getCompanies(),
    getCompanyAnalytics()
  ]);
  
  return {
    companies,
    analytics,
    timestamp: new Date().toISOString()
  };
}

export default function CompanyDashboardPage({ loaderData }: Route.ComponentProps) {
  return (
    <CompanyDashboard 
      companies={loaderData.companies}
      analytics={loaderData.analytics}
    />
  );
}
```

**완료 기준**:
- [ ] app/routes/company/_index.tsx 파일 생성
- [ ] 데이터 로더 구현
- [ ] 대시보드 컴포넌트 연결

---

## DATA 태스크

### DATA-001: 서비스 레이어 Framework Mode 호환성 업데이트
**우선순위**: 🟡 High  
**예상 시간**: 2시간  
**담당자**: Lead Developer

**작업 내용**:
1. 기존 서비스 함수들을 서버 환경에서 실행 가능하도록 수정
2. Request 객체에서 인증 정보 추출 로직 구현
3. 에러 핸들링을 Response 객체로 변경

```typescript
// app/services/authService.ts
import { redirect } from "@react-router/node";

export async function getCurrentUser(request: Request) {
  const cookie = request.headers.get("Cookie");
  // 쿠키에서 인증 토큰 추출 및 사용자 정보 반환
}

export async function requireAuth(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    throw redirect("/login");
  }
  return user;
}
```

**완료 기준**:
- [ ] 인증 서비스 업데이트
- [ ] 데이터 서비스 업데이트
- [ ] 에러 핸들링 개선

---

### DATA-002: 타입 정의 파일 생성
**우선순위**: 🟡 High  
**예상 시간**: 1.5시간  
**담당자**: Lead Developer

**작업 내용**:
각 라우트별 타입 정의 파일 생성

```typescript
// app/routes/company/+types/_index.ts
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@react-router/node";

export interface LoaderData {
  companies: Company[];
  analytics: CompanyAnalytics;
  timestamp: string;
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

**완료 기준**:
- [ ] 모든 라우트의 타입 정의 완료
- [ ] 타입 안전성 확보
- [ ] IDE 자동완성 지원

---

## TEST 태스크

### TEST-001: Framework Mode 테스트 환경 설정
**우선순위**: 🟡 High  
**예상 시간**: 1시간  
**담당자**: QA Engineer

**작업 내용**:
```typescript
// app/test-utils.tsx
import { createRemixStub } from "@remix-run/testing";

export function createTestApp(routes: any[]) {
  return createRemixStub(routes);
}
```

**완료 기준**:
- [ ] 테스트 유틸리티 설정
- [ ] 기존 테스트 케이스 호환성 확인
- [ ] 새로운 테스트 패턴 정의

---

### TEST-002: 라우트별 테스트 케이스 작성
**우선순위**: 🟢 Medium  
**예상 시간**: 3시간  
**담당자**: QA Engineer

**작업 내용**:
각 라우트의 로더, 액션, 컴포넌트 테스트 작성

**완료 기준**:
- [ ] 로더 함수 테스트
- [ ] 액션 함수 테스트
- [ ] 컴포넌트 렌더링 테스트
- [ ] 권한 검사 테스트

---

## DEPLOY 태스크

### DEPLOY-001: 빌드 설정 업데이트
**우선순위**: 🟡 High  
**예상 시간**: 1시간  
**담당자**: DevOps Engineer

**작업 내용**:
```json
// package.json scripts 업데이트
{
  "scripts": {
    "build": "react-router build",
    "dev": "react-router dev",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc"
  }
}
```

**완료 기준**:
- [ ] 빌드 스크립트 업데이트
- [ ] 서버 시작 스크립트 설정
- [ ] 타입 체크 스크립트 설정

---

### DEPLOY-002: 서버 설정 파일 생성
**우선순위**: 🟡 High  
**예상 시간**: 45분  
**담당자**: DevOps Engineer

**작업 내용**:
```typescript
// server.ts
import { createRequestHandler } from "@react-router/express";
import express from "express";

const app = express();

app.use(
  "/assets",
  express.static("build/client/assets", { immutable: true, maxAge: "1y" })
);

app.use(express.static("build/client", { maxAge: "1h" }));

app.all(
  "*",
  createRequestHandler({
    build: () => import("./build/server/index.js"),
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
```

**완료 기준**:
- [ ] Express 서버 설정
- [ ] 정적 파일 서빙 설정
- [ ] Request handler 설정

---

## 마일스톤

### 🎯 Milestone 1: 기본 설정 완료 (Day 1-2)
- [ ] SETUP-001 ~ SETUP-004 완료
- [ ] STRUCTURE-001 완료
- [ ] 개발 서버 정상 실행 확인

### 🎯 Milestone 2: 핵심 라우트 완료 (Day 3-5)
- [ ] ROUTES-001 ~ ROUTES-005 완료
- [ ] 기본 네비게이션 동작 확인
- [ ] 인증 플로우 동작 확인

### 🎯 Milestone 3: 데이터 레이어 완료 (Day 6-8)
- [ ] DATA-001 ~ DATA-002 완료
- [ ] 모든 라우트의 데이터 로딩 확인
- [ ] 타입 안전성 확보

### 🎯 Milestone 4: 테스트 및 배포 준비 (Day 9-11)
- [ ] TEST-001 ~ TEST-002 완료
- [ ] DEPLOY-001 ~ DEPLOY-002 완료
- [ ] 프로덕션 빌드 성공 확인

---

## 긴급 상황 대응

### 🚨 롤백 절차
1. 현재 작업 중단
2. 백업 태그로 복원: `git reset --hard v1.0-pre-framework-mode`
3. 기존 브랜치로 전환: `git checkout main`
4. 문제 분석 및 해결 방안 수립

### 🔧 문제 해결 체크리스트
- [ ] 의존성 충돌 확인
- [ ] 타입 에러 해결
- [ ] 빌드 에러 분석
- [ ] 런타임 에러 디버깅
- [ ] 성능 이슈 확인

---

**문서 버전**: 1.0  
**최종 업데이트**: 2025년 8월 1일  
**담당자**: Senior Lead Developer
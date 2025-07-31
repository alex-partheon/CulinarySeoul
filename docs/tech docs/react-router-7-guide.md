# React Router 7 개발자 가이드

## 개요

React Router 7은 React 애플리케이션을 위한 강력하고 다양한 전략을 지원하는 라우팅 라이브러리입니다. 선언적 네비게이션, 서버 렌더링, 타입 안전 라우팅을 지원하며, 세 가지 주요 모드를 제공합니다.

## 주요 특징

- **다중 모드 지원**: Declarative, Data, Framework 모드
- **타입 안전성**: TypeScript 완전 지원
- **서버 사이드 렌더링**: SSR 및 정적 사이트 생성 지원
- **데이터 로딩**: 라우트 레벨 데이터 로딩 및 액션
- **성능 최적화**: 프리페칭, 지연 로딩 등

## 설치

### 기본 설치

```bash
npm install react-router
```

### Framework 모드용 개발 도구 설치

```bash
npm install -D @react-router/dev
npm install @react-router/node
```

## 라우팅 모드

### 1. Declarative 모드

가장 기본적인 라우팅 모드로, JSX를 사용하여 라우트를 정의합니다.

```tsx
import { BrowserRouter } from "react-router";

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
```

**특징:**
- 간단한 설정
- 기본적인 네비게이션 기능
- 컴포넌트 기반 라우트 정의

### 2. Data 모드

데이터 로딩, 액션, 펜딩 상태를 지원하는 고급 라우팅 모드입니다.

```tsx
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

let router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    loader: loadRootData,
  },
]);

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);
```

**특징:**
- 라우트 레벨 데이터 로딩
- 폼 액션 처리
- 로딩 상태 관리
- 에러 바운더리

### 3. Framework 모드

가장 강력한 모드로, 파일 기반 라우팅과 풀스택 기능을 제공합니다.

## Framework 모드 설정

### Vite 설정

```ts
// vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    reactRouter()
  ],
});
```

### React Router 설정

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "app",
  buildDirectory: "build",
  ssr: true,
  prerender: ["/", "/about"],
} satisfies Config;
```

## 라우트 정의

### Framework 모드 라우트 설정

```ts
// routes.ts
import { index, route } from "@react-router/dev/routes";

export default [
  index("./home.tsx"),
  route("products/:pid", "./product.tsx"),
];
```

### 컴포넌트와 로더

```tsx
// product.tsx
import { Route } from "+./types/product.tsx";

export async function loader({ params }: Route.LoaderArgs) {
  let product = await getProduct(params.pid);
  return { product };
}

export default function Product({
  loaderData,
}: Route.ComponentProps) {
  return <div>{loaderData.product.name}</div>;
}
```

## 주요 컴포넌트

### Link와 NavLink

```tsx
import { Link, NavLink } from "react-router";

// 기본 링크
<Link to="/about">About</Link>

// 활성 상태를 알 수 있는 링크
<NavLink 
  to="/products" 
  className={({ isActive }) => isActive ? "active" : ""}
>
  Products
</NavLink>
```

### Form

```tsx
import { Form } from "react-router";

<Form method="post" action="/products">
  <input type="text" name="name" />
  <button type="submit">Create Product</button>
</Form>
```

### Outlet

```tsx
import { Outlet } from "react-router";

function Layout() {
  return (
    <div>
      <nav>...</nav>
      <main>
        <Outlet /> {/* 자식 라우트가 렌더링됩니다 */}
      </main>
    </div>
  );
}
```

## 주요 훅(Hooks)

### useNavigate

```tsx
import { useNavigate } from "react-router";

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/dashboard");
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

### useParams

```tsx
import { useParams } from "react-router";

function ProductDetail() {
  const { productId } = useParams();
  
  return <div>Product ID: {productId}</div>;
}
```

### useLoaderData

```tsx
import { useLoaderData } from "react-router";

function ProductList() {
  const { products } = useLoaderData();
  
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### useSearchParams

```tsx
import { useSearchParams } from "react-router";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  
  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };
  
  return (
    <div>
      <input 
        value={query || ""} 
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
```

## 서버 사이드 렌더링 (SSR)

### SSR 활성화

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender() {
    return ["/", "/about", "/contact"];
  },
} satisfies Config;
```

### SPA 모드 (SSR 비활성화)

```ts
// react-router.config.ts
import { type Config } from "@react-router/dev/config";

export default {
  ssr: false,
} satisfies Config;
```

## 데이터 로딩과 액션

### 로더 함수

```tsx
// 데이터 로딩
export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q");
  
  const products = await searchProducts(searchTerm);
  return { products, searchTerm };
}
```

### 액션 함수

```tsx
// 폼 처리
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  
  const product = await createProduct({ name });
  return redirect(`/products/${product.id}`);
}
```

## 에러 처리

### 에러 바운더리

```tsx
import { useRouteError, isRouteErrorResponse } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
        <p>{error.data}</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error?.message || "Unknown error"}</p>
    </div>
  );
}
```

## 성능 최적화

### 프리페칭

```tsx
// 링크 프리페칭
<Link to="/products" prefetch="intent">
  Products
</Link>

// 페이지 링크 프리페칭
<PrefetchPageLinks page="/products" />
```

### 지연 로딩

```tsx
import { lazy } from "react";

const LazyComponent = lazy(() => import("./LazyComponent"));

export default [
  route("lazy", LazyComponent),
];
```

## 타입 안전성

### 라우트 타입 정의

```tsx
// types/routes.ts
export interface ProductParams {
  productId: string;
}

export interface ProductLoaderData {
  product: Product;
}

// 컴포넌트에서 사용
function ProductDetail() {
  const { productId } = useParams<ProductParams>();
  const { product } = useLoaderData<ProductLoaderData>();
  
  return <div>{product.name}</div>;
}
```

## 마이그레이션 가이드

### React Router v6에서 v7로

1. **패키지 업데이트**
   ```bash
   npm install react-router@7
   npm install -D @react-router/dev
   ```

2. **설정 파일 추가**
   - `react-router.config.ts` 생성
   - `vite.config.ts` 업데이트

3. **라우트 정의 변경**
   - 파일 기반 라우팅으로 마이그레이션 (선택사항)
   - 로더와 액션 함수 추가

## 베스트 프랙티스

### 1. 라우트 구조화

```
app/
├── routes/
│   ├── _index.tsx          # 홈페이지
│   ├── about.tsx           # /about
│   ├── products/
│   │   ├── _index.tsx      # /products
│   │   └── $id.tsx         # /products/:id
│   └── admin/
│       ├── _layout.tsx     # 관리자 레이아웃
│       ├── dashboard.tsx   # /admin/dashboard
│       └── users.tsx       # /admin/users
└── components/
    ├── Layout.tsx
    └── Navigation.tsx
```

### 2. 데이터 로딩 최적화

```tsx
// 병렬 데이터 로딩
export async function loader({ params }: LoaderFunctionArgs) {
  const [product, reviews, recommendations] = await Promise.all([
    getProduct(params.id),
    getProductReviews(params.id),
    getRecommendations(params.id),
  ]);
  
  return { product, reviews, recommendations };
}
```

### 3. 에러 처리 전략

```tsx
// 라우트별 에러 바운더리
export function ErrorBoundary() {
  const error = useRouteError();
  
  // 404 에러
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }
  
  // 서버 에러
  if (isRouteErrorResponse(error) && error.status >= 500) {
    return <ServerErrorPage />;
  }
  
  // 기타 에러
  return <GenericErrorPage error={error} />;
}
```

### 4. 폼 처리

```tsx
// 낙관적 업데이트
function ProductForm() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  return (
    <Form method="post">
      <input name="name" disabled={isSubmitting} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "저장 중..." : "저장"}
      </button>
    </Form>
  );
}
```

## 문제 해결

### 일반적인 문제들

1. **라우트가 매칭되지 않는 경우**
   - 라우트 경로 확인
   - 파일명 규칙 확인
   - 동적 라우트 매개변수 확인

2. **데이터가 로딩되지 않는 경우**
   - 로더 함수 반환값 확인
   - 네트워크 요청 상태 확인
   - 에러 바운더리 설정 확인

3. **SSR 관련 문제**
   - 클라이언트/서버 코드 분리
   - 하이드레이션 불일치 해결
   - 환경 변수 설정 확인

## 참고 자료

- [React Router 공식 문서](https://reactrouter.com)
- [Framework Mode 가이드](https://reactrouter.com/start/framework)
- [마이그레이션 가이드](https://reactrouter.com/upgrading)
- [API 레퍼런스](https://reactrouter.com/reference)

---

이 가이드는 React Router 7의 주요 기능과 Framework 모드를 중심으로 작성되었습니다. 프로젝트의 요구사항에 따라 적절한 모드와 기능을 선택하여 사용하시기 바랍니다.
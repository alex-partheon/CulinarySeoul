# React Router 7 Framework Mode 개발자 가이드

## 개요

React Router 7의 Framework Mode는 풀스택 React 애플리케이션을 구축하기 위한 가장 강력하고 완전한 솔루션입니다. 파일 기반 라우팅, 서버 사이드 렌더링, 데이터 로딩, 타입 안전성을 모두 제공합니다.

## Framework Mode의 장점

- **파일 기반 라우팅**: 직관적인 폴더 구조로 라우트 정의
- **풀스택 기능**: 서버와 클라이언트 코드를 하나의 프로젝트에서 관리
- **타입 안전성**: 라우트, 로더, 액션에 대한 완전한 타입 지원
- **성능 최적화**: 자동 코드 분할, 프리페칭, 번들 최적화
- **개발자 경험**: 핫 리로드, 에러 오버레이, 개발 도구

## 프로젝트 설정

### 1. 새 프로젝트 생성

```bash
npx create-react-router@latest my-app
cd my-app
npm install
```

### 2. 기존 프로젝트에 추가

```bash
# 필수 패키지 설치
npm install -D @react-router/dev
npm install @react-router/node
```

### 3. Vite 설정 업데이트

```ts
// vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    reactRouter({
      // 선택적 설정
      appDirectory: "app",
      buildDirectory: "build",
    })
  ],
});
```

### 4. React Router 설정 파일

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  // 앱 디렉토리 (기본값: "app")
  appDirectory: "app",
  
  // 빌드 출력 디렉토리 (기본값: "build")
  buildDirectory: "build",
  
  // 서버 사이드 렌더링 활성화 (기본값: true)
  ssr: true,
  
  // 정적 사이트 생성을 위한 경로들
  prerender: ["/", "/about", "/contact"],
  
  // 비동기 프리렌더링
  async prerender() {
    // 동적으로 경로 생성
    const posts = await fetchAllPosts();
    return [
      "/",
      "/about",
      ...posts.map(post => `/posts/${post.slug}`)
    ];
  },
  
  // 서버 빌드 설정
  serverBuildFile: "index.js",
  
  // 퍼블릭 경로
  publicPath: "/assets/",
  
  // 개발 서버 설정
  dev: {
    port: 3000,
  },
} satisfies Config;
```

## 파일 기반 라우팅

### 라우트 파일 규칙

Framework Mode는 파일 시스템을 기반으로 라우트를 자동 생성합니다.

```
app/
├── routes/
│   ├── _index.tsx                    # / (홈페이지)
│   ├── about.tsx                     # /about
│   ├── contact.tsx                   # /contact
│   ├── blog/
│   │   ├── _index.tsx                # /blog
│   │   ├── $slug.tsx                 # /blog/:slug
│   │   └── new.tsx                   # /blog/new
│   ├── products/
│   │   ├── _layout.tsx               # 레이아웃 라우트
│   │   ├── _index.tsx                # /products
│   │   ├── $id.tsx                   # /products/:id
│   │   ├── $id.edit.tsx              # /products/:id/edit
│   │   └── categories/
│   │       ├── _index.tsx            # /products/categories
│   │       └── $category.tsx         # /products/categories/:category
│   ├── admin/
│   │   ├── _layout.tsx               # 관리자 레이아웃
│   │   ├── dashboard.tsx             # /admin/dashboard
│   │   ├── users/
│   │   │   ├── _index.tsx            # /admin/users
│   │   │   ├── $id.tsx               # /admin/users/:id
│   │   │   └── new.tsx               # /admin/users/new
│   │   └── settings.tsx              # /admin/settings
│   └── api/
│       ├── auth.tsx                  # /api/auth
│       └── products/
│           ├── _index.tsx            # /api/products
│           └── $id.tsx               # /api/products/:id
└── root.tsx                          # 루트 레이아웃
```

### 파일명 규칙

- `_index.tsx`: 인덱스 라우트 (부모 경로와 동일한 URL)
- `_layout.tsx`: 레이아웃 라우트 (자식 라우트를 감싸는 레이아웃)
- `$param.tsx`: 동적 매개변수 라우트
- `$.tsx`: 스플랫 라우트 (모든 하위 경로 매칭)
- `_`: 언더스코어로 시작하는 파일은 URL에 포함되지 않음

## 라우트 컴포넌트 구조

### 기본 라우트 컴포넌트

```tsx
// app/routes/products/$id.tsx
import type { Route } from "./+types/product";

// 데이터 로더
export async function loader({ params }: Route.LoaderArgs) {
  const product = await getProduct(params.id);
  
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }
  
  return { product };
}

// 액션 핸들러
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  
  switch (intent) {
    case "update":
      const updatedProduct = await updateProduct(params.id, {
        name: formData.get("name"),
        price: Number(formData.get("price")),
      });
      return { product: updatedProduct };
      
    case "delete":
      await deleteProduct(params.id);
      return redirect("/products");
      
    default:
      throw new Response("Invalid intent", { status: 400 });
  }
}

// 메타데이터
export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data.product.name} - Products` },
    { name: "description", content: data.product.description },
    { property: "og:title", content: data.product.name },
    { property: "og:image", content: data.product.imageUrl },
  ];
}

// 에러 바운더리
export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="error-container">
          <h1>제품을 찾을 수 없습니다</h1>
          <p>요청하신 제품이 존재하지 않습니다.</p>
          <Link to="/products">제품 목록으로 돌아가기</Link>
        </div>
      );
    }
  }
  
  return (
    <div className="error-container">
      <h1>오류가 발생했습니다</h1>
      <p>제품을 불러오는 중 문제가 발생했습니다.</p>
    </div>
  );
}

// 메인 컴포넌트
export default function Product({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  const navigation = useNavigation();
  const isUpdating = navigation.state === "submitting" && 
    navigation.formData?.get("intent") === "update";
  
  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} />
      <p>{product.description}</p>
      <p className="price">₩{product.price.toLocaleString()}</p>
      
      <Form method="post" className="product-form">
        <input type="hidden" name="intent" value="update" />
        
        <div>
          <label htmlFor="name">제품명</label>
          <input 
            id="name" 
            name="name" 
            defaultValue={product.name}
            disabled={isUpdating}
          />
        </div>
        
        <div>
          <label htmlFor="price">가격</label>
          <input 
            id="price" 
            name="price" 
            type="number"
            defaultValue={product.price}
            disabled={isUpdating}
          />
        </div>
        
        <div className="button-group">
          <button type="submit" disabled={isUpdating}>
            {isUpdating ? "업데이트 중..." : "업데이트"}
          </button>
          
          <button 
            type="submit" 
            name="intent" 
            value="delete"
            className="delete-button"
            onClick={(e) => {
              if (!confirm("정말 삭제하시겠습니까?")) {
                e.preventDefault();
              }
            }}
          >
            삭제
          </button>
        </div>
      </Form>
    </div>
  );
}
```

### 레이아웃 라우트

```tsx
// app/routes/admin/_layout.tsx
import type { Route } from "./+types/_layout";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  
  if (!user.isAdmin) {
    throw redirect("/login");
  }
  
  return { user };
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>관리자 패널</h1>
        <div className="user-info">
          <span>안녕하세요, {user.name}님</span>
          <Form method="post" action="/logout">
            <button type="submit">로그아웃</button>
          </Form>
        </div>
      </header>
      
      <div className="admin-content">
        <nav className="admin-sidebar">
          <NavLink to="/admin/dashboard">대시보드</NavLink>
          <NavLink to="/admin/users">사용자 관리</NavLink>
          <NavLink to="/admin/products">제품 관리</NavLink>
          <NavLink to="/admin/settings">설정</NavLink>
        </nav>
        
        <main className="admin-main">
          <Outlet /> {/* 자식 라우트가 여기에 렌더링됩니다 */}
        </main>
      </div>
    </div>
  );
}
```

## 타입 안전성

### 자동 타입 생성

Framework Mode는 라우트별로 타입을 자동 생성합니다.

```tsx
// app/routes/products/$id.tsx
import type { Route } from "./+types/product"; // 자동 생성된 타입

// 타입이 자동으로 추론됩니다
export async function loader({ params }: Route.LoaderArgs) {
  // params.id는 string 타입으로 추론
  const product = await getProduct(params.id);
  return { product };
}

export default function Product({ loaderData }: Route.ComponentProps) {
  // loaderData.product는 올바른 타입으로 추론
  const { product } = loaderData;
  return <div>{product.name}</div>;
}
```

### 커스텀 타입 정의

```tsx
// app/types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
}
```

## 데이터 로딩 전략

### 병렬 데이터 로딩

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  // 여러 데이터를 병렬로 로딩
  const [product, reviews, relatedProducts, categories] = await Promise.all([
    getProduct(params.id),
    getProductReviews(params.id),
    getRelatedProducts(params.id),
    getCategories(),
  ]);
  
  return {
    product,
    reviews,
    relatedProducts,
    categories,
  };
}
```

### 조건부 데이터 로딩

```tsx
export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const includeReviews = url.searchParams.get("reviews") === "true";
  
  const product = await getProduct(params.id);
  
  const data: any = { product };
  
  if (includeReviews) {
    data.reviews = await getProductReviews(params.id);
  }
  
  return data;
}
```

### 캐싱 전략

```tsx
// 메모리 캐시 예제
const cache = new Map();

export async function loader({ params }: Route.LoaderArgs) {
  const cacheKey = `product-${params.id}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const product = await getProduct(params.id);
  const data = { product };
  
  // 5분간 캐시
  cache.set(cacheKey, data);
  setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);
  
  return data;
}
```

## 폼과 액션

### 복잡한 폼 처리

```tsx
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  
  // 폼 검증
  const errors: Record<string, string> = {};
  
  const name = formData.get("name") as string;
  if (!name || name.trim().length < 2) {
    errors.name = "제품명은 최소 2글자 이상이어야 합니다.";
  }
  
  const price = Number(formData.get("price"));
  if (!price || price <= 0) {
    errors.price = "가격은 0보다 큰 숫자여야 합니다.";
  }
  
  if (Object.keys(errors).length > 0) {
    return { errors, values: Object.fromEntries(formData) };
  }
  
  switch (intent) {
    case "create":
      const newProduct = await createProduct({
        name: name.trim(),
        description: formData.get("description") as string,
        price,
        categoryId: formData.get("categoryId") as string,
      });
      return redirect(`/products/${newProduct.id}`);
      
    case "update":
      await updateProduct(params.id, {
        name: name.trim(),
        description: formData.get("description") as string,
        price,
        categoryId: formData.get("categoryId") as string,
      });
      return { success: true };
      
    default:
      throw new Response("Invalid intent", { status: 400 });
  }
}
```

### 낙관적 업데이트

```tsx
function ProductForm({ product }: { product: Product }) {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  // 낙관적 업데이트를 위한 상태
  const [optimisticProduct, setOptimisticProduct] = useState(product);
  
  useEffect(() => {
    if (navigation.state === "submitting" && navigation.formData) {
      // 폼 제출 시 즉시 UI 업데이트
      const formData = navigation.formData;
      setOptimisticProduct({
        ...product,
        name: formData.get("name") as string,
        price: Number(formData.get("price")),
      });
    } else if (navigation.state === "idle") {
      // 제출 완료 후 실제 데이터로 복원
      setOptimisticProduct(product);
    }
  }, [navigation.state, navigation.formData, product]);
  
  return (
    <Form method="post">
      <input type="hidden" name="intent" value="update" />
      
      <div>
        <label htmlFor="name">제품명</label>
        <input 
          id="name" 
          name="name" 
          defaultValue={optimisticProduct.name}
          className={actionData?.errors?.name ? "error" : ""}
        />
        {actionData?.errors?.name && (
          <span className="error-message">{actionData.errors.name}</span>
        )}
      </div>
      
      <div>
        <label htmlFor="price">가격</label>
        <input 
          id="price" 
          name="price" 
          type="number"
          defaultValue={optimisticProduct.price}
          className={actionData?.errors?.price ? "error" : ""}
        />
        {actionData?.errors?.price && (
          <span className="error-message">{actionData.errors.price}</span>
        )}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "저장 중..." : "저장"}
      </button>
      
      {actionData?.success && (
        <div className="success-message">성공적으로 저장되었습니다!</div>
      )}
    </Form>
  );
}
```

## 서버 사이드 렌더링

### 서버 엔트리 포인트

```tsx
// app/entry.server.tsx
import { renderToString } from "react-dom/server";
import { ServerRouter } from "react-router";
import type { EntryContext } from "@react-router/node";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  context: EntryContext,
) {
  const html = renderToString(
    <ServerRouter context={context} url={request.url} />
  );
  
  return new Response(`<!DOCTYPE html>${html}`, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
```

### 클라이언트 엔트리 포인트

```tsx
// app/entry.client.tsx
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

hydrateRoot(document, <HydratedRouter />);
```

### 루트 컴포넌트

```tsx
// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
  { rel: "stylesheet", href: stylesheet },
];

export function meta(): Route.MetaDescriptor[] {
  return [
    { title: "CashUp - AI 크리에이터 마케팅 플랫폼" },
    { name: "description", content: "AI 기반 크리에이터 매칭 및 마케팅 플랫폼" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
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

export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <html lang="ko">
      <head>
        <title>오류 발생</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="error-page">
          {isRouteErrorResponse(error) ? (
            <>
              <h1>{error.status} {error.statusText}</h1>
              <p>{error.data}</p>
            </>
          ) : (
            <>
              <h1>예상치 못한 오류가 발생했습니다</h1>
              <p>죄송합니다. 문제가 발생했습니다.</p>
            </>
          )}
        </div>
        <Scripts />
      </body>
    </html>
  );
}
```

## 성능 최적화

### 코드 분할

```tsx
// 자동 코드 분할 (Framework Mode에서 기본 제공)
// 각 라우트는 자동으로 별도 청크로 분할됩니다

// 수동 코드 분할이 필요한 경우
import { lazy } from "react";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

export default function MyRoute() {
  return (
    <div>
      <h1>My Route</h1>
      <Suspense fallback={<div>로딩 중...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

### 프리페칭

```tsx
// 링크 프리페칭
<Link to="/products" prefetch="intent">
  제품 보기
</Link>

// 페이지 링크 프리페칭
<PrefetchPageLinks page="/products" />

// 프로그래매틱 프리페칭
function ProductCard({ product }: { product: Product }) {
  const [shouldPrefetch, setShouldPrefetch] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setShouldPrefetch(true)}
      className="product-card"
    >
      <Link 
        to={`/products/${product.id}`}
        prefetch={shouldPrefetch ? "intent" : "none"}
      >
        {product.name}
      </Link>
    </div>
  );
}
```

### 이미지 최적화

```tsx
// 반응형 이미지
function ProductImage({ product }: { product: Product }) {
  return (
    <picture>
      <source 
        media="(min-width: 768px)" 
        srcSet={`${product.imageUrl}?w=800 1x, ${product.imageUrl}?w=1600 2x`}
      />
      <source 
        media="(max-width: 767px)" 
        srcSet={`${product.imageUrl}?w=400 1x, ${product.imageUrl}?w=800 2x`}
      />
      <img 
        src={`${product.imageUrl}?w=400`}
        alt={product.name}
        loading="lazy"
        className="product-image"
      />
    </picture>
  );
}
```

## 배포

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 확인
ls -la build/
```

### Node.js 서버 배포

```js
// server.js
import { createRequestHandler } from "@react-router/node";
import express from "express";

const app = express();

// 정적 파일 서빙
app.use("/assets", express.static("build/client/assets"));

// React Router 핸들러
app.all(
  "*",
  createRequestHandler({
    build: () => import("./build/server/index.js"),
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### Docker 배포

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 앱 코드 복사
COPY . .

# 빌드
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 베스트 프랙티스

### 1. 라우트 구조 설계

```
✅ 좋은 구조:
app/
├── routes/
│   ├── _index.tsx              # 홈
│   ├── auth/
│   │   ├── login.tsx           # 로그인
│   │   └── register.tsx        # 회원가입
│   ├── dashboard/
│   │   ├── _layout.tsx         # 대시보드 레이아웃
│   │   ├── _index.tsx          # 대시보드 홈
│   │   └── settings.tsx        # 설정
│   └── api/
│       └── webhooks/
│           └── stripe.tsx      # API 엔드포인트

❌ 피해야 할 구조:
app/
├── routes/
│   ├── very-long-route-name-that-is-hard-to-read.tsx
│   ├── user-profile-settings-advanced-options.tsx
│   └── deeply/
│       └── nested/
│           └── route/
│               └── structure.tsx
```

### 2. 에러 처리 전략

```tsx
// 계층적 에러 처리
// 1. 글로벌 에러 (root.tsx)
// 2. 레이아웃 에러 (_layout.tsx)
// 3. 페이지 에러 (개별 라우트)

// 에러 타입별 처리
export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFoundPage />;
      case 401:
        return <UnauthorizedPage />;
      case 403:
        return <ForbiddenPage />;
      case 500:
        return <ServerErrorPage />;
      default:
        return <GenericErrorPage error={error} />;
    }
  }
  
  // 예상치 못한 에러
  console.error("Unexpected error:", error);
  return <UnexpectedErrorPage />;
}
```

### 3. 성능 모니터링

```tsx
// 성능 메트릭 수집
export async function loader({ request }: Route.LoaderArgs) {
  const start = performance.now();
  
  try {
    const data = await fetchData();
    
    // 성공 메트릭
    const duration = performance.now() - start;
    analytics.track("loader_success", {
      route: "/products",
      duration,
      dataSize: JSON.stringify(data).length,
    });
    
    return data;
  } catch (error) {
    // 에러 메트릭
    analytics.track("loader_error", {
      route: "/products",
      error: error.message,
      duration: performance.now() - start,
    });
    
    throw error;
  }
}
```

## 문제 해결

### 일반적인 문제들

1. **하이드레이션 불일치**
   ```tsx
   // ❌ 문제가 되는 코드
   function MyComponent() {
     const [isClient, setIsClient] = useState(false);
     
     useEffect(() => {
       setIsClient(true);
     }, []);
     
     return <div>{isClient ? "클라이언트" : "서버"}</div>;
   }
   
   // ✅ 해결 방법
   function MyComponent() {
     const [isClient, setIsClient] = useState(false);
     
     useEffect(() => {
       setIsClient(true);
     }, []);
     
     // 하이드레이션 완료 전까지는 서버 상태 유지
     if (!isClient) {
       return <div>서버</div>;
     }
     
     return <div>클라이언트</div>;
   }
   ```

2. **메모리 누수**
   ```tsx
   // ❌ 메모리 누수 가능성
   export async function loader() {
     const data = await fetchLargeData();
     // 데이터가 계속 메모리에 남아있음
     return data;
   }
   
   // ✅ 메모리 효율적인 방법
   export async function loader() {
     const data = await fetchLargeData();
     
     // 필요한 데이터만 반환
     return {
       items: data.items.slice(0, 20), // 페이지네이션
       total: data.total,
     };
   }
   ```

3. **타입 에러**
   ```tsx
   // ❌ 타입 에러
   export async function loader({ params }: Route.LoaderArgs) {
     // params.id가 undefined일 수 있음
     const product = await getProduct(params.id);
     return { product };
   }
   
   // ✅ 타입 안전한 방법
   export async function loader({ params }: Route.LoaderArgs) {
     if (!params.id) {
       throw new Response("Product ID is required", { status: 400 });
     }
     
     const product = await getProduct(params.id);
     return { product };
   }
   ```

## 참고 자료

- [React Router Framework Mode 공식 문서](https://reactrouter.com/start/framework)
- [Vite 플러그인 가이드](https://reactrouter.com/start/framework/vite)
- [배포 가이드](https://reactrouter.com/start/framework/deployment)
- [마이그레이션 가이드](https://reactrouter.com/upgrading/framework)

---

Framework Mode는 React Router 7의 가장 강력한 기능으로, 현대적인 풀스택 React 애플리케이션 개발에 필요한 모든 도구를 제공합니다. 이 가이드를 참고하여 효율적이고 확장 가능한 애플리케이션을 구축하시기 바랍니다.
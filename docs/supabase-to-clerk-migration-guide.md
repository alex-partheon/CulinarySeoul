# Supabase에서 Clerk으로 인증 시스템 마이그레이션 가이드

## 개요

이 문서는 CulinarySeoul 프로젝트의 인증 시스템을 Supabase Auth에서 Clerk으로 마이그레이션하는 과정을 단계별로 설명합니다.

## 마이그레이션 이유

### 현재 Supabase Auth의 문제점
1. **복잡한 RLS 정책**: 권한 관리가 복잡하고 오류가 발생하기 쉬움
2. **세션 관리 어려움**: 토큰 처리 및 세션 동기화 문제
3. **사용자 프로필 동기화**: 인증과 프로필 데이터 간 불일치
4. **제한적인 소셜 로그인**: 설정 및 관리의 복잡성
5. **개발자 경험**: 디버깅 및 문제 해결의 어려움

### Clerk의 장점
1. **간소화된 권한 관리**: 직관적인 역할 기반 접근 제어
2. **자동 세션 관리**: 토큰 갱신 및 세션 동기화 자동화
3. **통합된 사용자 관리**: 인증과 사용자 데이터의 완전한 통합
4. **풍부한 소셜 로그인**: 20+ 소셜 제공업체 지원
5. **뛰어난 개발자 경험**: 직관적인 API 및 디버깅 도구
6. **보안 강화**: 업계 표준 보안 관행 자동 적용
7. **UI/UX 개선**: 사전 구축된 인증 컴포넌트

## 마이그레이션 계획

### Phase 1: 준비 단계 (1-2일)
1. Clerk 계정 설정 및 프로젝트 생성
2. 환경 변수 설정
3. 패키지 설치 및 기본 설정
4. 개발 환경에서 Clerk 테스트

### Phase 2: 코드 마이그레이션 (3-5일)
1. AuthContext 리팩토링
2. 인증 관련 컴포넌트 업데이트
3. 권한 시스템 마이그레이션
4. API 라우트 업데이트
5. 미들웨어 설정

### Phase 3: 데이터 마이그레이션 (2-3일)
1. 기존 사용자 데이터 내보내기
2. Clerk으로 사용자 데이터 가져오기
3. 프로필 데이터 동기화
4. 권한 및 역할 매핑

### Phase 4: 테스트 및 배포 (2-3일)
1. 단위 테스트 업데이트
2. 통합 테스트 실행
3. 스테이징 환경 테스트
4. 프로덕션 배포
5. 모니터링 및 롤백 계획

## 상세 구현 단계

### 1. Clerk 설정

#### 1.1 패키지 설치
```bash
npm install @clerk/clerk-react @clerk/themes
npm install --save-dev @types/clerk
```

#### 1.2 환경 변수 설정
```env
# .env.local
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_AFTER_SIGN_IN_URL=/dashboard
VITE_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

#### 1.3 Clerk Provider 설정
```tsx
// src/main.tsx
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#0f172a',
          colorInputBackground: '#1e293b',
          colorInputText: '#f1f5f9'
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
)
```

### 2. AuthContext 마이그레이션

#### 2.1 새로운 AuthContext 생성
```tsx
// src/contexts/ClerkAuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useAuth, useClerk } from '@clerk/clerk-react'
import { UserProfile, UserPermissions } from '../types/auth'

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isSignedIn: boolean
  userPermissions: UserPermissions | null
  signOut: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const { signOut: clerkSignOut } = useClerk()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        // Clerk 사용자를 내부 UserProfile 형식으로 변환
        const userProfile: UserProfile = {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          full_name: clerkUser.fullName || '',
          user_type: clerkUser.publicMetadata.userType as string || 'BRAND_MANAGER',
          onboarding_completed: clerkUser.publicMetadata.onboardingCompleted as boolean || false,
          created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
          updated_at: clerkUser.updatedAt?.toISOString() || new Date().toISOString()
        }
        setUser(userProfile)
        
        // 권한 로드
        loadUserPermissions(clerkUser.id)
      } else {
        setUser(null)
        setUserPermissions(null)
      }
      setIsLoading(false)
    }
  }, [isLoaded, isSignedIn, clerkUser])

  const loadUserPermissions = async (userId: string) => {
    try {
      // Supabase에서 권한 정보 조회 (기존 로직 유지)
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (!error && data) {
        setUserPermissions(data)
      }
    } catch (error) {
      console.error('권한 로드 실패:', error)
    }
  }

  const signOut = async () => {
    await clerkSignOut()
    setUser(null)
    setUserPermissions(null)
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!clerkUser) return
    
    try {
      // Clerk 메타데이터 업데이트
      await clerkUser.update({
        firstName: data.full_name?.split(' ')[0],
        lastName: data.full_name?.split(' ').slice(1).join(' '),
      })
      
      // 공개 메타데이터 업데이트
      await clerkUser.update({
        publicMetadata: {
          ...clerkUser.publicMetadata,
          userType: data.user_type,
          onboardingCompleted: data.onboarding_completed
        }
      })
      
      // Supabase 프로필 동기화
      await syncUserProfile(clerkUser)
      
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isSignedIn: !!isSignedIn,
      userPermissions,
      signOut,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a ClerkAuthProvider')
  }
  return context
}
```

### 3. 라우팅 및 보호된 라우트 설정

#### 3.1 미들웨어 설정
```tsx
// src/middleware/authMiddleware.tsx
import { useAuth } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermissions = [] 
}) => {
  const { isSignedIn, isLoaded } = useAuth()
  const location = useLocation()

  if (!isLoaded) {
    return <div>로딩 중...</div>
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  // 권한 확인 로직 (필요시)
  if (requiredPermissions.length > 0) {
    // 권한 확인 구현
  }

  return <>{children}</>
}
```

#### 3.2 라우터 업데이트
```tsx
// src/router.tsx
import { SignIn, SignUp, UserProfile } from '@clerk/clerk-react'
import { ProtectedRoute } from './middleware/authMiddleware'

const router = createBrowserRouter([
  {
    path: '/sign-in/*',
    element: <SignIn routing="path" path="/sign-in" />
  },
  {
    path: '/sign-up/*',
    element: <SignUp routing="path" path="/sign-up" />
  },
  {
    path: '/profile/*',
    element: (
      <ProtectedRoute>
        <UserProfile routing="path" path="/profile" />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  // 기타 보호된 라우트들...
])
```

### 4. 컴포넌트 마이그레이션

#### 4.1 로그인/로그아웃 버튼 업데이트
```tsx
// src/components/auth/AuthButtons.tsx
import { SignInButton, SignOutButton, UserButton, useAuth } from '@clerk/clerk-react'

export const AuthButtons: React.FC = () => {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }}
        />
        <SignOutButton>
          <button className="btn btn-outline">
            로그아웃
          </button>
        </SignOutButton>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton>
        <button className="btn btn-primary">
          로그인
        </button>
      </SignInButton>
      <SignUpButton>
        <button className="btn btn-outline">
          회원가입
        </button>
      </SignUpButton>
    </div>
  )
}
```

### 5. 데이터 동기화

#### 5.1 Supabase 프로필 동기화
```tsx
// src/utils/clerkSync.ts
import { User } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'

export const syncUserProfile = async (clerkUser: User) => {
  try {
    const profileData = {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress,
      full_name: clerkUser.fullName,
      user_type: clerkUser.publicMetadata.userType || 'BRAND_MANAGER',
      onboarding_completed: clerkUser.publicMetadata.onboardingCompleted || false,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })

    if (error) {
      console.error('프로필 동기화 실패:', error)
    }
  } catch (error) {
    console.error('프로필 동기화 오류:', error)
  }
}

export const deleteUserProfile = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) {
      console.error('프로필 삭제 실패:', error)
    }
  } catch (error) {
    console.error('프로필 삭제 오류:', error)
  }
}
```

#### 5.2 웹훅 설정 (선택사항)
```tsx
// src/api/webhooks/clerk.ts
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/clerk-react'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

export const handleClerkWebhook = async (request: Request) => {
  if (!webhookSecret) {
    throw new Error('CLERK_WEBHOOK_SECRET이 설정되지 않았습니다')
  }

  const svix_id = request.headers.get('svix-id')
  const svix_timestamp = request.headers.get('svix-timestamp')
  const svix_signature = request.headers.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  const payload = await request.text()
  const body = JSON.parse(payload)

  const wh = new Webhook(webhookSecret)
  let evt: WebhookEvent

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', { status: 400 })
  }

  switch (evt.type) {
    case 'user.created':
      await syncUserProfile(evt.data)
      break
    case 'user.updated':
      await syncUserProfile(evt.data)
      break
    case 'user.deleted':
      await deleteUserProfile(evt.data.id)
      break
  }

  return new Response('', { status: 200 })
}
```

### 6. 테스트 업데이트

#### 6.1 테스트 설정 업데이트
```tsx
// src/tests/setup.ts
import { vi } from 'vitest'

// Clerk 모킹
vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => ({
    isSignedIn: true,
    isLoaded: true,
    userId: 'test-user-id'
  }),
  useUser: () => ({
    user: {
      id: 'test-user-id',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
      fullName: 'Test User',
      publicMetadata: {
        userType: 'BRAND_MANAGER',
        onboardingCompleted: true
      }
    },
    isLoaded: true
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  SignOutButton: ({ children }: { children: React.ReactNode }) => children,
  UserButton: () => <div>User Button</div>
}))
```

### 7. 환경별 설정

#### 7.1 개발 환경
```env
# .env.development
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

#### 7.2 프로덕션 환경
```env
# .env.production
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

## 마이그레이션 체크리스트

### 준비 단계
- [ ] Clerk 계정 생성 및 프로젝트 설정
- [ ] 환경 변수 설정
- [ ] 패키지 설치
- [ ] 기본 Clerk Provider 설정

### 코드 마이그레이션
- [ ] AuthContext 리팩토링
- [ ] 보호된 라우트 설정
- [ ] 로그인/로그아웃 컴포넌트 업데이트
- [ ] 사용자 프로필 컴포넌트 업데이트
- [ ] 권한 확인 로직 마이그레이션
- [ ] API 라우트 업데이트

### 데이터 마이그레이션
- [ ] 기존 사용자 데이터 백업
- [ ] Clerk으로 사용자 가져오기
- [ ] 프로필 동기화 설정
- [ ] 권한 매핑 확인

### 테스트
- [ ] 단위 테스트 업데이트
- [ ] 통합 테스트 실행
- [ ] 로그인/로그아웃 플로우 테스트
- [ ] 권한 시스템 테스트
- [ ] 소셜 로그인 테스트

### 배포
- [ ] 스테이징 환경 배포
- [ ] 프로덕션 환경 설정
- [ ] DNS 및 도메인 설정
- [ ] 모니터링 설정
- [ ] 롤백 계획 준비

## 주의사항 및 고려사항

### 1. 데이터 무결성
- 기존 사용자 데이터의 완전한 백업 필수
- 마이그레이션 중 데이터 손실 방지
- 사용자 ID 매핑 정확성 확인

### 2. 다운타임 최소화
- 점진적 마이그레이션 전략 고려
- 블루-그린 배포 방식 활용
- 롤백 계획 사전 준비

### 3. 사용자 경험
- 기존 사용자의 재로그인 필요성 안내
- 마이그레이션 과정 중 사용자 커뮤니케이션
- 새로운 인증 플로우 사용자 가이드 제공

### 4. 보안
- API 키 및 시크릿 안전한 관리
- 환경별 설정 분리
- 웹훅 보안 설정

### 5. 성능
- Clerk API 호출 최적화
- 캐싱 전략 수립
- 로딩 상태 관리

## 예상 일정

| 단계 | 소요 시간 | 담당자 |
|------|-----------|--------|
| 준비 단계 | 1-2일 | 개발팀 |
| 코드 마이그레이션 | 3-5일 | 개발팀 |
| 데이터 마이그레이션 | 2-3일 | 개발팀 + DevOps |
| 테스트 | 2-3일 | QA팀 + 개발팀 |
| 배포 | 1일 | DevOps팀 |
| **총 소요 시간** | **9-14일** | |

## 비용 분석

### Clerk 요금제
- **Free Tier**: 월 10,000 MAU까지 무료
- **Pro Tier**: 월 $25 + MAU당 $0.02
- **Enterprise**: 맞춤형 요금

### 예상 비용 (월간)
- 현재 사용자 수: ~100명
- 예상 성장: 월 50% 증가
- 6개월 후 예상: ~1,000명
- **예상 월 비용**: $25 (Pro Tier 기본) + $20 (1,000 MAU) = $45/월

## 결론

Clerk으로의 마이그레이션은 현재 Supabase Auth의 복잡성과 문제점을 해결하고, 더 나은 개발자 경험과 사용자 경험을 제공할 것입니다. 약 2주간의 마이그레이션 기간이 필요하지만, 장기적으로 개발 생산성과 시스템 안정성이 크게 향상될 것으로 예상됩니다.

## 다음 단계

1. **팀 회의**: 마이그레이션 계획 검토 및 승인
2. **Clerk 계정 설정**: 개발 및 프로덕션 환경 준비
3. **개발 시작**: Phase 1부터 순차적 진행
4. **정기 체크인**: 매일 진행 상황 점검
5. **테스트 및 배포**: 철저한 테스트 후 단계적 배포

---

**문서 작성일**: 2025년 2월 4일  
**작성자**: Senior Lead Developer  
**버전**: 1.0  
**다음 리뷰 예정일**: 마이그레이션 완료 후
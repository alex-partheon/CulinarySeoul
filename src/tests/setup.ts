/**
 * Jest 테스트 설정 파일
 * 보안 테스트를 위한 환경 설정 및 모킹
 */

import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Supabase 클라이언트 모킹
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }))
  },
  permissionCache: {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn()
  }
}));

// React Hot Toast 모킹
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn()
  }
}));

// React Router 모킹
jest.mock('react-router', () => ({
  Link: ({ to, children, className, ...props }: any) => (
    <a 
      href={to} 
      className={className}
      data-testid={`link-${to.replace(/\//g, '-')}`}
      {...props}
    >
      {children}
    </a>
  ),
  useLocation: () => ({
    pathname: '/test',
    search: '',
    hash: '',
    state: null
  }),
  useNavigate: () => jest.fn()
}));

// Clerk 모킹
jest.mock('@clerk/clerk-react', () => ({
  SignIn: ({ appearance, routing, redirectUrl, signUpUrl, ...props }: any) => (
    <div data-testid="clerk-sign-in" data-routing={routing} data-redirect-url={redirectUrl} data-signup-url={signUpUrl}>
      <form data-testid="sign-in-form">
        <input 
          data-testid="email-input" 
          type="email" 
          placeholder="이메일"
          className={appearance?.elements?.formFieldInput}
        />
        <input 
          data-testid="password-input" 
          type="password" 
          placeholder="비밀번호"
          className={appearance?.elements?.formFieldInput}
        />
        <button 
          type="submit" 
          data-testid="sign-in-button"
          className={appearance?.elements?.formButtonPrimary}
        >
          로그인
        </button>
        <div data-testid="social-buttons">
          <button 
            data-testid="google-sign-in"
            className={appearance?.elements?.socialButtonsBlockButton}
          >
            Google로 로그인
          </button>
        </div>
        <a data-testid="forgot-password-link" className={appearance?.elements?.footerActionLink}>
          비밀번호를 잊으셨나요?
        </a>
      </form>
    </div>
  ),
  SignUp: ({ appearance, routing, redirectUrl, signInUrl, ...props }: any) => (
    <div data-testid="clerk-sign-up" data-routing={routing} data-redirect-url={redirectUrl} data-signin-url={signInUrl}>
      <form data-testid="sign-up-form">
        <input 
          data-testid="email-input" 
          type="email" 
          placeholder="이메일"
          className={appearance?.elements?.formFieldInput}
        />
        <input 
          data-testid="password-input" 
          type="password" 
          placeholder="비밀번호"
          className={appearance?.elements?.formFieldInput}
        />
        <input 
          data-testid="first-name-input" 
          type="text" 
          placeholder="이름"
          className={appearance?.elements?.formFieldInput}
        />
        <button 
          type="submit" 
          data-testid="sign-up-button"
          className={appearance?.elements?.formButtonPrimary}
        >
          회원가입
        </button>
        <div data-testid="social-buttons">
          <button 
            data-testid="google-sign-up"
            className={appearance?.elements?.socialButtonsBlockButton}
          >
            Google로 회원가입
          </button>
        </div>
        <div data-testid="terms-agreement" className={appearance?.elements?.formFieldAction}>
          약관에 동의합니다
        </div>
      </form>
    </div>
  ),
  useAuth: () => ({
    isSignedIn: false,
    user: null,
    signOut: jest.fn()
  }),
  useUser: () => ({
    user: null,
    isLoaded: true
  }),
  ClerkProvider: ({ children }: any) => <div data-testid="clerk-provider">{children}</div>
}));

// Lucide React 아이콘 모킹
jest.mock('lucide-react', () => ({
  AlertTriangle: () => 'AlertTriangle',
  Lock: () => 'Lock',
  Loader2: () => 'Loader2',
  Shield: () => 'Shield',
  Users: () => 'Users',
  Settings: () => 'Settings',
  ChevronDown: () => 'ChevronDown',
  LogOut: () => 'LogOut',
  Building: () => 'Building',
  Store: () => 'Store',
  LogIn: () => 'LogIn',
  UserPlus: () => 'UserPlus',
  ChefHat: () => 'ChefHat',
  ArrowLeft: () => 'ArrowLeft',
  Mail: () => 'Mail',
  Sparkles: () => 'Sparkles',
  ArrowRight: () => 'ArrowRight'
}));

// 환경 변수 모킹
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';

// 전역 테스트 설정
beforeEach(() => {
  // 각 테스트 전에 모든 모킹 초기화
  jest.clearAllMocks();
});

// 보안 테스트용 헬퍼 함수들
global.securityTestHelpers = {
  // SQL 인젝션 패턴 생성
  generateSqlInjectionPayloads: () => [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "'; UPDATE users SET role='admin'; --",
    "' UNION SELECT * FROM users --",
    "'; INSERT INTO users (role) VALUES ('admin'); --"
  ],
  
  // XSS 패턴 생성
  generateXssPayloads: () => [
    "<script>alert('xss')</script>",
    "javascript:alert('xss')",
    "<img src=x onerror=alert('xss')>",
    "<svg onload=alert('xss')>"
  ],
  
  // 권한 우회 시도 패턴
  generatePrivilegeEscalationPayloads: () => [
    { role: 'admin', userId: 'fake-admin' },
    { permissions: { globalAdminAccess: true } },
    { canAccessCompanyDashboard: true, canAccessBrandDashboard: true }
  ],
  
  // 세션 토큰 조작 패턴
  generateSessionTokenPayloads: () => [
    'fake-jwt-token',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.signature',
    '',
    null,
    undefined,
    'expired-token'
  ]
};

// 타입 선언
declare global {
  var securityTestHelpers: {
    generateSqlInjectionPayloads: () => string[];
    generateXssPayloads: () => string[];
    generatePrivilegeEscalationPayloads: () => any[];
    generateSessionTokenPayloads: () => (string | null | undefined)[];
  };
}
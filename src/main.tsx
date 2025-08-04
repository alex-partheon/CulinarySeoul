import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import App from './App.tsx'
import './index.css'

// 환경 변수에서 Clerk 설정 가져오기
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const USE_CLERK_AUTH = import.meta.env.VITE_USE_CLERK_AUTH === 'true'

// Clerk 설정
const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: '#3b82f6',
    colorBackground: '#0f172a',
    colorInputBackground: '#1e293b',
    colorInputText: '#f1f5f9',
    colorText: '#f1f5f9',
    colorTextSecondary: '#94a3b8',
    colorNeutral: '#64748b',
    borderRadius: '0.5rem'
  },
  elements: {
    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
    card: 'bg-slate-900 border border-slate-700',
    headerTitle: 'text-white',
    headerSubtitle: 'text-slate-400'
  }
}

// App을 Clerk Provider로 감싸는 컴포넌트
const AppWithClerk = () => {
  if (USE_CLERK_AUTH && PUBLISHABLE_KEY) {
    return (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        appearance={clerkAppearance}
        signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL || '/sign-in'}
        signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL || '/sign-up'}
        afterSignInUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL || '/dashboard'}
        afterSignUpUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL || '/onboarding'}
      >
        <App />
      </ClerkProvider>
    )
  }
  
  // Clerk을 사용하지 않는 경우 기존 방식 유지
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithClerk />
  </React.StrictMode>,
)
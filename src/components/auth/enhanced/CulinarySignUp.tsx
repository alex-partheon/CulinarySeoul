import React from 'react'
import { SignUp } from '@clerk/clerk-react'
import { UserPlus, Users, Shield, Sparkles } from 'lucide-react'
import { CulinaryAuthLayout, AuthCardHeader, AuthFooterLink } from './CulinaryAuthLayout'
import { AuthCard } from '../shared/AuthCard'
import { cn } from '../../../lib/utils'

interface CulinarySignUpProps {
  redirectUrl?: string
  signInUrl?: string
  className?: string
}

/**
 * CulinarySeoul ERP 맞춤 회원가입 컴포넌트
 * - Clerk SignUp과 완전 통합
 * - 현대적인 디자인 시스템 적용
 * - 브랜드 일관성 유지
 * - 온보딩으로 자연스러운 연결
 */
export function CulinarySignUp({ 
  redirectUrl = "/onboarding",
  signInUrl = "/sign-in",
  className 
}: CulinarySignUpProps) {
  return (
    <CulinaryAuthLayout
      title="회원가입"
      subtitle="새 계정을 만들어 CulinarySeoul을 시작해보세요"
      className={className}
    >
      <div className="space-y-6">
        {/* 헤더 */}
        <AuthCardHeader 
          title="새로운 시작!"
          subtitle="몇 분이면 계정을 만들 수 있습니다"
          icon={<UserPlus className="w-6 h-6" />}
        />

        {/* 서비스 소개 */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">통합 관리</h4>
                <p className="text-xs text-muted-foreground">브랜드와 매장을 한 곳에서</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-secondary/5 to-accent/5 border border-secondary/10">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10">
                <Shield className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">안전한 보안</h4>
                <p className="text-xs text-muted-foreground">엔터프라이즈급 보안 시스템</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/10">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">스마트 분석</h4>
                <p className="text-xs text-muted-foreground">AI 기반 비즈니스 인사이트</p>
              </div>
            </div>
          </div>
        </div>

        {/* 회원가입 폼 영역 */}
        <div className="relative">
          <SignUp 
            routing="path" 
            path="/sign-up"
            redirectUrl={redirectUrl}
            signInUrl={signInUrl}
            appearance={{
              elements: {
                // 루트 컨테이너
                rootBox: "w-full",
                
                // 메인 카드
                card: cn(
                  "w-full border-0 shadow-none bg-transparent",
                  "p-0 m-0"
                ),
                
                // 헤더 숨기기 (우리가 커스텀 헤더 사용)
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                
                // 폼 스타일링
                form: "space-y-4",
                
                // 입력 필드들
                formFieldInput: cn(
                  "w-full px-4 py-3 rounded-xl",
                  "border border-border/50 bg-background/50",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20",
                  "transition-all duration-200",
                  "backdrop-blur-sm"
                ),
                
                formFieldLabel: cn(
                  "text-sm font-medium text-foreground mb-2",
                  "block"
                ),
                
                // 메인 액션 버튼
                formButtonPrimary: cn(
                  "w-full py-3 px-6 rounded-xl",
                  "bg-gradient-to-r from-primary to-secondary",
                  "text-primary-foreground font-semibold",
                  "hover:from-primary/90 hover:to-secondary/90",
                  "focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
                  "transition-all duration-200",
                  "shadow-lg shadow-primary/20",
                  "hover:shadow-xl hover:shadow-primary/30",
                  "hover:scale-[1.02]",
                  "active:scale-[0.98]",
                  "relative overflow-hidden",
                  // 버튼 내 그라데이션 애니메이션
                  "before:absolute before:inset-0",
                  "before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0",
                  "before:translate-x-[-100%] hover:before:translate-x-[100%]",
                  "before:transition-transform before:duration-700"
                ),
                
                // 소셜 로그인 버튼들
                socialButtonsBlockButton: cn(
                  "w-full py-3 px-4 rounded-xl",
                  "border border-border/50 bg-background/50",
                  "text-foreground hover:bg-muted/50",
                  "transition-all duration-200",
                  "backdrop-blur-sm",
                  "hover:border-primary/30",
                  "hover:shadow-md hover:scale-[1.01]"
                ),
                
                socialButtonsBlockButtonText: "font-medium",
                
                // 구분선
                dividerLine: "bg-border/30",
                dividerText: "text-muted-foreground text-sm",
                
                // 링크들
                footerActionLink: cn(
                  "text-primary hover:text-primary/80",
                  "font-medium underline-offset-4",
                  "hover:underline transition-colors"
                ),
                
                // 에러 메시지
                formFieldErrorText: "text-destructive text-sm mt-1",
                
                // 성공 메시지
                formFieldSuccessText: "text-secondary text-sm mt-1",
                
                // 로딩 상태
                spinner: "text-primary",
                
                // 알림 메시지
                alertText: cn(
                  "text-sm p-3 rounded-lg border",
                  "bg-muted/50 text-muted-foreground border-border/50"
                ),
                
                // 이메일 인증 관련
                formResendCodeLink: cn(
                  "text-primary hover:text-primary/80 font-medium",
                  "transition-colors underline-offset-4 hover:underline"
                ),
                
                // 약관 동의 체크박스
                formFieldAction: cn(
                  "text-sm text-muted-foreground",
                  "flex items-center gap-2"
                ),
                
                // 추가 옵션들
                alternativeMethodsBlockButton: cn(
                  "text-primary hover:text-primary/80",
                  "font-medium transition-colors"
                ),
                
                // 뒤로 가기 버튼
                backLink: cn(
                  "text-primary hover:text-primary/80",
                  "font-medium transition-colors",
                  "flex items-center gap-2"
                )
              },
              
              // 레이아웃 설정
              layout: {
                socialButtonsVariant: "blockButton",
                showOptionalFields: true
              },
              
              // 변수 설정
              variables: {
                colorPrimary: "hsl(var(--primary))",
                colorDanger: "hsl(var(--destructive))",
                colorSuccess: "hsl(var(--secondary))",
                colorWarning: "hsl(var(--accent))",
                colorNeutral: "hsl(var(--muted))",
                
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                borderRadius: "0.75rem",
                
                spacingUnit: "1rem"
              }
            }}
          />
        </div>

        {/* 추가 정보 및 약관 */}
        <div className="space-y-4">
          {/* 계정 생성 후 혜택 안내 */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-primary/10">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              계정 생성 후 이용할 수 있는 기능들
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 실시간 매장 관리 및 모니터링</li>
              <li>• FIFO 기반 정확한 재고 관리</li>
              <li>• 수익성 분석 및 비즈니스 인사이트</li>
              <li>• 브랜드별 독립 대시보드</li>
            </ul>
          </div>

          {/* 개인정보 및 약관 안내 */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              회원가입을 진행하면{' '}
              <a href="/terms" className="text-primary hover:underline">
                이용약관
              </a>
              {' '}및{' '}
              <a href="/privacy" className="text-primary hover:underline">
                개인정보처리방침
              </a>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>

          {/* 하단 링크 */}
          <AuthFooterLink 
            text="이미 계정이 있으신가요?"
            linkText="로그인하기"
            href={signInUrl}
          />
        </div>
      </div>
    </CulinaryAuthLayout>
  )
}

/**
 * 빠른 회원가입 컴포넌트 (간소화된 버전)
 */
interface QuickSignUpProps {
  onSuccess?: () => void
  className?: string
}

export function QuickSignUp({ 
  onSuccess,
  className 
}: QuickSignUpProps) {
  return (
    <AuthCard variant="elevated" className={className}>
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            빠른 계정 생성
          </h2>
          <p className="text-sm text-muted-foreground">
            1분이면 계정을 만들 수 있습니다
          </p>
        </div>

        <SignUp 
          routing="virtual"
          afterSignUpUrl="/onboarding"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "border-0 shadow-none bg-transparent p-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              
              formButtonPrimary: cn(
                "w-full py-3 rounded-xl",
                "bg-gradient-to-r from-primary to-secondary",
                "text-primary-foreground font-medium",
                "hover:opacity-90 transition-all duration-200"
              ),
              
              formFieldInput: cn(
                "w-full px-3 py-2 rounded-lg",
                "border border-input bg-background",
                "focus:border-primary focus:ring-1 focus:ring-primary"
              ),
              
              socialButtonsBlockButton: cn(
                "w-full py-2.5 rounded-lg",
                "border border-input hover:bg-muted/50",
                "transition-colors"
              )
            },
            
            layout: {
              socialButtonsVariant: "blockButton"
            }
          }}
        />

        <div className="text-center">
          <button 
            onClick={onSuccess}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            나중에 하기
          </button>
        </div>
      </div>
    </AuthCard>
  )
}
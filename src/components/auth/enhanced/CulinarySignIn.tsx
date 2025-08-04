import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react'
import { CulinaryAuthLayout, AuthCardHeader, AuthFooterLink } from './CulinaryAuthLayout'
import { AuthCard } from '../shared/AuthCard'
import { BrandLogo } from '../shared/BrandLogo'
import { cn } from '../../../lib/utils'

interface CulinarySignInProps {
  redirectUrl?: string
  signUpUrl?: string
  className?: string
}

/**
 * CulinarySeoul ERP 맞춤 로그인 컴포넌트
 * - Clerk SignIn과 완전 통합
 * - 현대적인 디자인 시스템 적용
 * - 브랜드 일관성 유지
 * - 완전한 접근성 지원
 */
export function CulinarySignIn({ 
  redirectUrl = "/dashboard",
  signUpUrl = "/sign-up",
  className 
}: CulinarySignInProps) {
  return (
    <CulinaryAuthLayout
      title="로그인"
      subtitle="계정에 로그인하여 대시보드에 접근하세요"
      className={className}
    >
      <div className="space-y-6">
        {/* 헤더 */}
        <AuthCardHeader 
          title="환영합니다!"
          subtitle="CulinarySeoul ERP에 로그인해주세요"
          icon={<LogIn className="w-6 h-6" />}
        />

        {/* 로그인 폼 영역 */}
        <div className="relative">
          {/* Clerk SignIn 컴포넌트 - 커스텀 스타일링 */}
          <SignIn 
            routing="path" 
            path="/sign-in"
            redirectUrl={redirectUrl}
            signUpUrl={signUpUrl}
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
                
                // 버튼 스타일링
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
                  "active:scale-[0.98]"
                ),
                
                // 소셜 로그인 버튼들
                socialButtonsBlockButton: cn(
                  "w-full py-3 px-4 rounded-xl",
                  "border border-border/50 bg-background/50",
                  "text-foreground hover:bg-muted/50",
                  "transition-all duration-200",
                  "backdrop-blur-sm",
                  "hover:border-primary/30",
                  "hover:shadow-md"
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
                
                // 로딩 상태
                spinner: "text-primary",
                
                // 알림 메시지
                alertText: cn(
                  "text-sm p-3 rounded-lg border",
                  "bg-muted/50 text-muted-foreground border-border/50"
                ),
                
                // 내비게이션 (비밀번호 찾기 등)
                backLink: cn(
                  "text-primary hover:text-primary/80",
                  "font-medium transition-colors",
                  "flex items-center gap-2"
                ),
                
                // 추가 옵션들
                formResendCodeLink: "text-primary hover:text-primary/80 font-medium",
                alternativeMethodsBlockButton: cn(
                  "text-primary hover:text-primary/80",
                  "font-medium transition-colors"
                )
              },
              
              // 레이아웃 설정
              layout: {
                socialButtonsVariant: "blockButton",
                showOptionalFields: false
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

        {/* 추가 정보 */}
        <div className="space-y-4">
          {/* 기능 소개 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border/30">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">이메일 로그인</h4>
                <p className="text-xs text-muted-foreground">안전한 이메일 인증</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10">
                <Lock className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">보안 인증</h4>
                <p className="text-xs text-muted-foreground">2단계 인증 지원</p>
              </div>
            </div>
          </div>

          {/* 하단 링크 */}
          <AuthFooterLink 
            text="계정이 없으신가요?"
            linkText="회원가입하기"
            href={signUpUrl}
          />
        </div>
      </div>
    </CulinaryAuthLayout>
  )
}

/**
 * 간소화된 로그인 컴포넌트 (모달용)
 */
interface CulinarySignInModalProps {
  onSuccess?: () => void
  className?: string
}

export function CulinarySignInModal({ 
  onSuccess,
  className 
}: CulinarySignInModalProps) {
  return (
    <AuthCard variant="elevated" className={className}>
      <div className="space-y-6">
        <div className="text-center">
          <BrandLogo size="md" />
          <h2 className="text-xl font-semibold text-foreground mt-4 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-sm text-muted-foreground">
            이 기능을 사용하려면 로그인해주세요
          </p>
        </div>

        <SignIn 
          routing="virtual"
          afterSignInUrl="/dashboard"
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
              )
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
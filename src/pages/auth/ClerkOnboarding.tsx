import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useClerkAuth } from '../../contexts/ClerkAuthContext'
import { CulinaryAuthLayout } from '../../components/auth/enhanced/CulinaryAuthLayout'
import { AuthCard } from '../../components/auth/shared/AuthCard'
import { StepIndicator } from '../../components/auth/shared/StepIndicator'
import { AuthLoadingSpinner } from '../../components/auth/shared/AuthLoadingSpinner'
import { BrandLogo } from '../../components/auth/shared/BrandLogo'
import { User, Building, Crown, CheckCircle, Sparkles, Shield, Users } from 'lucide-react'
import { cn } from '../../lib/utils'

interface OnboardingStep {
  id: string
  title: string
  description: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '환영합니다!',
    description: 'CulinarySeoul에 오신 것을 환영합니다. 몇 가지 설정을 완료해보세요.'
  },
  {
    id: 'profile',
    title: '프로필 설정',
    description: '기본 프로필 정보를 설정해주세요.'
  },
  {
    id: 'role',
    title: '역할 선택',
    description: '주요 업무 역할을 선택해주세요.'
  },
  {
    id: 'complete',
    title: '설정 완료',
    description: '모든 설정이 완료되었습니다!'
  }
]

const ClerkOnboardingPage: React.FC = () => {
  const { user: clerkUser } = useUser()
  const { updateUserProfile, syncUserProfile } = useClerkAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: clerkUser?.fullName || '',
    user_type: 'BRAND_MANAGER',
    company_name: '',
    phone_number: ''
  })

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // 프로필 업데이트
      await updateUserProfile({
        full_name: formData.full_name,
        user_type: formData.user_type,
        onboarding_completed: true
      })

      // Clerk 메타데이터 업데이트 (unsafeMetadata 사용)
      if (clerkUser) {
        await clerkUser.update({
          unsafeMetadata: {
            ...clerkUser.unsafeMetadata,
            userType: formData.user_type,
            onboardingCompleted: true,
            companyName: formData.company_name,
            phoneNumber: formData.phone_number
          }
        })
      }

      // 프로필 동기화
      await syncUserProfile()

      // 대시보드로 이동
      navigate('/dashboard')
    } catch (error) {
      console.error('온보딩 완료 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <BrandLogo size="xl" variant="gradient" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                CulinarySeoul에 오신 것을 환영합니다!
              </h2>
              <p className="text-muted-foreground mb-8">
                스마트 레스토랑 통합 관리 시스템에서 새로운 경험을 시작해보세요
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-foreground text-sm">브랜드 및 매장 관리</h4>
                  <p className="text-xs text-muted-foreground">통합된 멀티 브랜드 운영</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-secondary/5 to-accent/5 border border-secondary/10">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
                  <Sparkles className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-foreground text-sm">실시간 재고 관리</h4>
                  <p className="text-xs text-muted-foreground">FIFO 기반 정확한 재고 추적</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/10">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-foreground text-sm">스마트 분석</h4>
                  <p className="text-xs text-muted-foreground">AI 기반 비즈니스 인사이트</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-foreground text-sm">매출 분석</h4>
                  <p className="text-xs text-muted-foreground">실시간 수익성 분석</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 1: // Profile
        return (
          <div>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                  <User className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                프로필 정보를 입력해주세요
              </h2>
              <p className="text-sm text-muted-foreground">
                서비스 이용을 위한 기본 정보를 설정합니다
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl",
                    "border border-border/50 bg-background/50",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:border-primary focus:ring-2 focus:ring-primary/20",
                    "transition-all duration-200 backdrop-blur-sm"
                  )}
                  placeholder="홍길동"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  회사명
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl",
                    "border border-border/50 bg-background/50",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:border-primary focus:ring-2 focus:ring-primary/20",
                    "transition-all duration-200 backdrop-blur-sm"
                  )}
                  placeholder="회사명을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  연락처
                </label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl",
                    "border border-border/50 bg-background/50",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:border-primary focus:ring-2 focus:ring-primary/20",
                    "transition-all duration-200 backdrop-blur-sm"
                  )}
                  placeholder="010-1234-5678"
                />
              </div>
            </div>
          </div>
        )

      case 2: // Role
        return (
          <div>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10">
                  <Crown className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                주요 업무 역할을 선택해주세요
              </h2>
              <p className="text-sm text-muted-foreground">
                역할에 따라 맞춤화된 대시보드를 제공합니다
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  value: 'BRAND_MANAGER', 
                  label: '브랜드 매니저', 
                  description: '브랜드 전체 관리 및 전략 수립',
                  icon: Crown,
                  color: 'primary'
                },
                { 
                  value: 'STORE_MANAGER', 
                  label: '매장 매니저', 
                  description: '개별 매장 운영 및 관리',
                  icon: Building,
                  color: 'secondary'
                },
                { 
                  value: 'ADMIN', 
                  label: '관리자', 
                  description: '시스템 전체 관리 및 사용자 관리',
                  icon: Shield,
                  color: 'accent'
                }
              ].map((role) => {
                const IconComponent = role.icon
                const isSelected = formData.user_type === role.value
                return (
                  <label 
                    key={role.value} 
                    className={cn(
                      "flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all duration-200",
                      "hover:shadow-lg hover:shadow-primary/5",
                      isSelected 
                        ? "border-primary bg-gradient-to-br from-primary/5 to-secondary/5 shadow-md" 
                        : "border-border/50 bg-background/50 hover:border-primary/30"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-xl transition-colors",
                      isSelected 
                        ? `bg-${role.color}/20` 
                        : `bg-${role.color}/10`
                    )}>
                      <IconComponent className={cn(
                        "w-6 h-6 transition-colors",
                        isSelected 
                          ? `text-${role.color}` 
                          : `text-${role.color}/70`
                      )} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="radio"
                          name="user_type"
                          value={role.value}
                          checked={isSelected}
                          onChange={(e) => setFormData(prev => ({ ...prev, user_type: e.target.value }))}
                          className="sr-only"
                        />
                        <h4 className="font-semibold text-foreground">
                          {role.label}
                        </h4>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        )

      case 3: // Complete
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse"></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                설정이 완료되었습니다!
              </h2>
              <p className="text-muted-foreground mb-8">
                이제 CulinarySeoul의 모든 기능을 사용할 수 있습니다.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  설정된 정보
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">이름:</span>
                  <span className="text-sm font-medium text-foreground">{formData.full_name}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                  <Crown className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-muted-foreground">역할:</span>
                  <span className="text-sm font-medium text-foreground">
                    {formData.user_type === 'BRAND_MANAGER' ? '브랜드 매니저' : 
                     formData.user_type === 'STORE_MANAGER' ? '매장 매니저' : '관리자'}
                  </span>
                </div>
                {formData.company_name && (
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Building className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">회사:</span>
                    <span className="text-sm font-medium text-foreground">{formData.company_name}</span>
                  </div>
                )}
                {formData.phone_number && (
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">연락처:</span>
                    <span className="text-sm font-medium text-foreground">{formData.phone_number}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 rounded-xl p-4">
              <p className="text-sm text-muted-foreground">
                🎉 CulinarySeoul ERP 시스템에서 효율적인 레스토랑 관리를 시작하세요!
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <CulinaryAuthLayout
      title={onboardingSteps[currentStep].title}
      subtitle={onboardingSteps[currentStep].description}
      showBackButton={false}
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <StepIndicator
            steps={onboardingSteps}
            currentStep={currentStep}
            variant="minimal"
          />
        </div>

        {/* Step Content */}
        <AuthCard variant="elevated" className="p-8">
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={cn(
                "px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                "border border-border/50 bg-background/50 text-foreground",
                "hover:border-primary/30 hover:bg-background/80",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "backdrop-blur-sm"
              )}
            >
              이전
            </button>
            
            {currentStep === onboardingSteps.length - 1 ? (
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className={cn(
                  "px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                  "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
                  "hover:from-primary/90 hover:to-secondary/90",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "shadow-lg shadow-primary/20",
                  "flex items-center gap-2"
                )}
              >
                {isLoading ? (
                  <AuthLoadingSpinner size="sm" variant="minimal" text="" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                시작하기
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentStep === 1 && !formData.full_name.trim()}
                className={cn(
                  "px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                  "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
                  "hover:from-primary/90 hover:to-secondary/90",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "shadow-lg shadow-primary/20"
                )}
              >
                다음
              </button>
            )}
          </div>
        </AuthCard>
      </div>
    </CulinaryAuthLayout>
  )
}

export default ClerkOnboardingPage
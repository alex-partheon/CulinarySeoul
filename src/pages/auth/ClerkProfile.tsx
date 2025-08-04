import React from 'react'
import { UserProfile } from '@clerk/clerk-react'
import { ClerkUserProfile, ClerkAuthStatus } from '../../components/auth/ClerkAuthComponents'
import { CulinaryAuthLayout } from '../../components/auth/enhanced/CulinaryAuthLayout'
import { AuthCard } from '../../components/auth/shared/AuthCard'
import { Settings, Shield, HelpCircle, Zap, Home, Building, Store, Trash2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const ClerkProfilePage: React.FC = () => {
  return (
    <CulinaryAuthLayout
      title="사용자 프로필"
      subtitle="계정 정보와 설정을 관리하세요"
      backButtonText="대시보드로"
      backButtonHref="/dashboard"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: Clerk 기본 프로필 */}
          <div className="lg:col-span-2">
            <AuthCard variant="elevated" className="overflow-hidden">
              <div className="px-6 py-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      계정 설정
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      기본 계정 정보, 보안 설정, 연결된 계정 등을 관리합니다
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <UserProfile 
                  routing="path" 
                  path="/profile"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-0 bg-transparent",
                      navbar: cn(
                        "bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl mb-4"
                      ),
                      navbarButton: cn(
                        "text-foreground/70 hover:text-foreground hover:bg-primary/10",
                        "rounded-lg transition-all duration-200"
                      ),
                      pageScrollBox: "bg-transparent",
                      formFieldInput: cn(
                        "rounded-xl border-border/50 bg-background/50",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20"
                      ),
                      formButtonPrimary: cn(
                        "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
                        "hover:from-primary/90 hover:to-secondary/90 rounded-xl"
                      )
                    }
                  }}
                />
              </div>
            </AuthCard>
          </div>
          
          {/* 오른쪽: 추가 정보 */}
          <div className="space-y-6">
            {/* 인증 상태 */}
            <ClerkAuthStatus />
            
            {/* 사용자 프로필 정보 */}
            <ClerkUserProfile />
            
            {/* 도움말 */}
            <AuthCard variant="default">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10">
                    <HelpCircle className="w-4 h-4 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    도움말
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">
                          계정 보안
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          2단계 인증을 활성화하여 계정을 더욱 안전하게 보호하세요.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-accent/5 border border-secondary/10">
                    <div className="flex items-start gap-3">
                      <Settings className="w-4 h-4 text-secondary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">
                          소셜 로그인
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Google, GitHub 등의 소셜 계정을 연결하여 편리하게 로그인하세요.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/10">
                    <div className="flex items-start gap-3">
                      <Building className="w-4 h-4 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground mb-1">
                          프로필 정보
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          사용자 유형과 권한은 관리자가 설정합니다. 변경이 필요한 경우 관리자에게 문의하세요.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AuthCard>
            
            {/* 빠른 액션 */}
            <AuthCard variant="default">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
                    <Zap className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    빠른 액션
                  </h3>
                </div>
                <div className="space-y-2">
                  <button className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200",
                    "text-primary hover:bg-primary/10 hover:text-primary",
                    "border border-transparent hover:border-primary/20"
                  )}>
                    <Home className="w-4 h-4" />
                    대시보드로 이동
                  </button>
                  <button className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200",
                    "text-secondary hover:bg-secondary/10 hover:text-secondary",
                    "border border-transparent hover:border-secondary/20"
                  )}>
                    <Building className="w-4 h-4" />
                    브랜드 관리
                  </button>
                  <button className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200",
                    "text-accent hover:bg-accent/10 hover:text-accent",
                    "border border-transparent hover:border-accent/20"
                  )}>
                    <Store className="w-4 h-4" />
                    매장 관리
                  </button>
                  <button className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200",
                    "text-destructive hover:bg-destructive/10 hover:text-destructive",
                    "border border-transparent hover:border-destructive/20"
                  )}>
                    <Trash2 className="w-4 h-4" />
                    계정 삭제 요청
                  </button>
                </div>
              </div>
            </AuthCard>
          </div>
        </div>
      </div>
    </CulinaryAuthLayout>
  )
}

export default ClerkProfilePage
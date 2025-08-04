import { Check } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface Step {
  id: string
  title: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
  variant?: 'default' | 'minimal' | 'detailed'
}

/**
 * 단계 진행 표시 컴포넌트
 * - 온보딩 및 다단계 프로세스용
 * - 접근성 최적화
 * - 여러 변형 지원
 */
export function StepIndicator({ 
  steps, 
  currentStep, 
  className,
  variant = 'default'
}: StepIndicatorProps) {
  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  if (variant === 'minimal') {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            단계 {currentStep + 1} / {totalSteps}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}% 완료
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={cn("space-y-6", className)}>
        {/* 진행률 헤더 */}
        <div className="text-center">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            {steps[currentStep]?.title}
          </div>
          <div className="text-xs text-muted-foreground">
            {currentStep + 1} / {totalSteps} 단계
          </div>
        </div>

        {/* 스텝 리스트 */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg transition-colors",
                  isCurrent && "bg-primary/5 border border-primary/20",
                  isCompleted && "bg-muted/50"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-colors",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary/20 text-primary border-2 border-primary",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}>
                  {isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-foreground",
                    isCompleted && "text-muted-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("space-y-4", className)}>
      {/* 진행률 표시 */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          단계 {currentStep + 1} / {totalSteps}
        </span>
        <span className="text-muted-foreground">
          {Math.round(progress)}% 완료
        </span>
      </div>

      {/* 진행 바 */}
      <div className="relative">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 스텝 도트들 */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          
          return (
            <div 
              key={step.id}
              className="flex flex-col items-center gap-2"
            >
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-300",
                isCompleted && "bg-primary text-primary-foreground scale-110",
                isCurrent && "bg-primary/20 text-primary border-2 border-primary scale-110",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div className={cn(
                "text-xs text-center max-w-16",
                isCurrent && "text-foreground font-medium",
                isCompleted && "text-muted-foreground",
                !isCompleted && !isCurrent && "text-muted-foreground"
              )}>
                {step.title}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * 간단한 원형 진행률 표시
 */
interface CircularProgressProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function CircularProgress({ 
  progress, 
  size = 'md',
  showText = true,
  className 
}: CircularProgressProps) {
  const sizes = {
    sm: { width: 40, height: 40, strokeWidth: 3, textSize: 'text-xs' },
    md: { width: 60, height: 60, strokeWidth: 4, textSize: 'text-sm' },
    lg: { width: 80, height: 80, strokeWidth: 5, textSize: 'text-base' }
  }

  const { width, height, strokeWidth, textSize } = sizes[size]
  const radius = (width - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={width}
        height={height}
        className="transform -rotate-90"
      >
        {/* 배경 원 */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="transparent"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* 진행률 원 */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="transparent"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showText && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center font-semibold text-foreground",
          textSize
        )}>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}
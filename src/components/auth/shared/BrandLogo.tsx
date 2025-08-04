import { ChefHat, Crown, Coffee, Store } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  brandId?: string
  className?: string
  variant?: 'default' | 'gradient' | 'minimal'
}

/**
 * CulinarySeoul 브랜드 로고 컴포넌트
 * - 다양한 크기 지원
 * - 브랜드별 맞춤화
 * - 그라데이션 및 미니멀 변형
 */
export function BrandLogo({ 
  size = 'md',
  showText = true,
  brandId,
  className,
  variant = 'default'
}: BrandLogoProps) {
  const sizes = {
    sm: {
      icon: 'w-6 h-6',
      container: 'w-10 h-10',
      text: 'text-sm',
      spacing: 'gap-2'
    },
    md: {
      icon: 'w-8 h-8',
      container: 'w-16 h-16',
      text: 'text-base',
      spacing: 'gap-3'
    },
    lg: {
      icon: 'w-10 h-10',
      container: 'w-20 h-20',
      text: 'text-lg',
      spacing: 'gap-4'
    },
    xl: {
      icon: 'w-12 h-12',
      container: 'w-24 h-24',
      text: 'text-xl',
      spacing: 'gap-4'
    }
  }

  const currentSize = sizes[size]

  // 브랜드별 로고 및 색상
  const getBrandConfig = () => {
    switch (brandId) {
      case 'millab':
        return {
          icon: <Coffee className={currentSize.icon} />,
          name: '밀랍',
          colors: 'from-amber-500 to-orange-600',
          bgColors: 'from-amber-500/20 to-orange-600/20'
        }
      case 'premium':
        return {
          icon: <Crown className={currentSize.icon} />,
          name: 'Premium',
          colors: 'from-purple-500 to-pink-600',
          bgColors: 'from-purple-500/20 to-pink-600/20'
        }
      case 'store':
        return {
          icon: <Store className={currentSize.icon} />,
          name: 'Store',
          colors: 'from-blue-500 to-cyan-600',
          bgColors: 'from-blue-500/20 to-cyan-600/20'
        }
      default:
        return {
          icon: <ChefHat className={currentSize.icon} />,
          name: 'CulinarySeoul',
          colors: 'from-primary to-secondary',
          bgColors: 'from-primary/20 to-secondary/20'
        }
    }
  }

  const brandConfig = getBrandConfig()

  const containerStyles = {
    default: [
      "flex items-center justify-center rounded-2xl",
      `bg-gradient-to-br ${brandConfig.bgColors}`,
      "border border-border/50",
      "shadow-lg shadow-primary/10"
    ],
    gradient: [
      "flex items-center justify-center rounded-2xl p-0.5",
      `bg-gradient-to-br ${brandConfig.colors}`
    ],
    minimal: [
      "flex items-center justify-center rounded-xl",
      "bg-muted/50"
    ]
  }

  const iconStyles = {
    default: `text-primary`,
    gradient: `text-white`,
    minimal: `text-muted-foreground`
  }

  return (
    <div className={cn("flex items-center", currentSize.spacing, className)}>
      {/* 로고 아이콘 */}
      <div className={cn(currentSize.container, containerStyles[variant])}>
        {variant === 'gradient' ? (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-background">
            <div className={cn(iconStyles[variant], `bg-gradient-to-br ${brandConfig.colors} bg-clip-text text-transparent`)}>
              {brandConfig.icon}
            </div>
          </div>
        ) : (
          <div className={iconStyles[variant]}>
            {brandConfig.icon}
          </div>
        )}
      </div>

      {/* 브랜드 텍스트 */}
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold",
            currentSize.text,
            variant === 'gradient' 
              ? `bg-gradient-to-r ${brandConfig.colors} bg-clip-text text-transparent`
              : "text-foreground"
          )}>
            {brandConfig.name}
          </span>
          {!brandId && size !== 'sm' && (
            <span className="text-xs text-muted-foreground">
              ERP System
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * 간단한 텍스트 로고
 */
interface TextLogoProps {
  size?: 'sm' | 'md' | 'lg'
  brandId?: string
  className?: string
}

export function TextLogo({ 
  size = 'md', 
  brandId,
  className 
}: TextLogoProps) {
  const brandConfig = (() => {
    switch (brandId) {
      case 'millab':
        return { name: '밀랍', colors: 'from-amber-500 to-orange-600' }
      case 'premium':
        return { name: 'Premium', colors: 'from-purple-500 to-pink-600' }
      case 'store':
        return { name: 'Store', colors: 'from-blue-500 to-cyan-600' }
      default:
        return { name: 'CulinarySeoul', colors: 'from-primary via-secondary to-accent' }
    }
  })()

  const sizeStyles = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  return (
    <h1 className={cn(
      "font-bold",
      sizeStyles[size],
      `bg-gradient-to-r ${brandConfig.colors} bg-clip-text text-transparent`,
      className
    )}>
      {brandConfig.name}
    </h1>
  )
}
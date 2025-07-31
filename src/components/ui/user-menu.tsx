import { User, Settings, LogOut, CreditCard, UserCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Button } from './button'

interface UserMenuProps {
  user: {
    name?: string
    email?: string
    avatar?: string
  }
  onSignOut?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onBillingClick?: () => void
}

/**
 * 사용자 메뉴 드롭다운 컴포넌트
 * @param user - 사용자 정보
 * @param onSignOut - 로그아웃 핸들러
 * @param onProfileClick - 프로필 클릭 핸들러
 * @param onSettingsClick - 설정 클릭 핸들러
 * @param onBillingClick - 결제 정보 클릭 핸들러
 * 
 * @example
 * ```tsx
 * <UserMenu 
 *   user={{ 
 *     name: "김철수", 
 *     email: "kim@example.com" 
 *   }}
 *   onSignOut={handleSignOut}
 * />
 * ```
 */
export function UserMenu({ 
  user, 
  onSignOut,
  onProfileClick,
  onSettingsClick,
  onBillingClick
}: UserMenuProps) {
  const userInitial = user.name?.[0] || user.email?.[0] || 'U'
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name || user.email} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitial.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user.name && (
              <p className="text-sm font-medium leading-none">{user.name}</p>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onProfileClick}>
            <UserCircle className="mr-2 h-4 w-4" />
            <span>프로필</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onBillingClick}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>결제 정보</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            <span>설정</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * 간단한 사용자 아바타 컴포넌트
 * @param user - 사용자 정보
 * @param showName - 이름 표시 여부
 * @param size - 아바타 크기
 */
export function UserAvatar({ 
  user, 
  showName = false,
  size = 'default'
}: { 
  user: { name?: string; email?: string; avatar?: string }
  showName?: boolean
  size?: 'sm' | 'default' | 'lg'
}) {
  const userInitial = user.name?.[0] || user.email?.[0] || 'U'
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    default: 'h-8 w-8',
    lg: 'h-10 w-10'
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.avatar} alt={user.name || user.email} />
        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
          {userInitial.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className="text-sm font-medium">{user.name || user.email}</span>
      )}
    </div>
  )
}
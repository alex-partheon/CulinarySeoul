import React, { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '../../lib/utils'
import { Button } from './button'

export interface SidebarNavItem {
  name: string
  href: string
  icon: React.ReactNode
  subMenu?: {
    name: string
    href: string
  }[]
}

interface SidebarProps {
  navigation: SidebarNavItem[]
  className?: string
  collapsible?: boolean
  currentPath?: string
}

/**
 * 재사용 가능한 사이드바 컴포넌트
 * @param navigation - 네비게이션 아이템 배열
 * @param className - 추가 클래스명
 * @param collapsible - 축소 가능 여부
 * 
 * @example
 * ```tsx
 * const navigation = [
 *   {
 *     name: '대시보드',
 *     href: '/dashboard',
 *     icon: <HomeIcon />
 *   }
 * ]
 * 
 * <Sidebar navigation={navigation} />
 * ```
 */
export function Sidebar({ navigation, className, collapsible = false, currentPath }: SidebarProps) {
  // Router 컨텍스트가 있을 때만 useLocation 사용
  let pathname = currentPath || ''
  try {
    const location = useLocation()
    pathname = location.pathname
  } catch (error) {
    // Router 컨텍스트가 없으면 currentPath 사용
  }
  
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }
  
  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        {/* Logo/Title Section */}
        <div className="flex items-center justify-between flex-shrink-0 px-4 mb-5">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-foreground">CulinarySeoul</h2>
          )}
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5"
            >
              <svg
                className={cn(
                  "w-4 h-4 transition-transform",
                  isCollapsed ? "rotate-180" : ""
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
                />
              </svg>
            </Button>
          )}
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
                           (item.subMenu && item.subMenu.some(sub => pathname === sub.href))
            const isExpanded = expandedItems.includes(item.name)
            
            if (item.subMenu) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={cn(
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      'group flex items-center justify-between w-full px-2 py-2 text-sm font-medium rounded-md transition-colors'
                    )}
                  >
                    <div className="flex items-center">
                      <div className={cn(
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                        'mr-3 flex-shrink-0 transition-colors'
                      )}>
                        {item.icon}
                      </div>
                      {!isCollapsed && item.name}
                    </div>
                    {!isCollapsed && (
                      <svg
                        className={cn(
                          'w-4 h-4 transition-transform',
                          isExpanded ? 'transform rotate-180' : ''
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  {isExpanded && !isCollapsed && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subMenu.map((subItem) => {
                        const isSubActive = pathname === subItem.href
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={cn(
                              isSubActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                              'block px-2 py-2 text-sm rounded-md transition-colors'
                            )}
                          >
                            {subItem.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={cn(
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                  'mr-3 flex-shrink-0 transition-colors'
                )}>
                  {item.icon}
                </div>
                {!isCollapsed && item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

/**
 * 모바일 사이드바 컴포넌트
 * @param navigation - 네비게이션 아이템 배열
 * @param isOpen - 열림 상태
 * @param onClose - 닫기 핸들러
 */
export function MobileSidebar({ 
  navigation, 
  isOpen, 
  onClose 
}: { 
  navigation: SidebarNavItem[]
  isOpen: boolean
  onClose: () => void 
}) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden" 
        onClick={onClose} 
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
        <div className="relative h-full">
          {/* Close Button */}
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
          
          {/* Sidebar Content */}
          <Sidebar navigation={navigation} className="shadow-lg" />
        </div>
      </div>
    </>
  )
}
import { useState } from 'react'
import { Button } from '../ui/button'

interface NavItem {
  id: string
  name: string
  href?: string
  onClick?: () => void
}

interface NavigationProps {
  title: string
  items: NavItem[]
  activeItem?: string
  onItemClick?: (itemId: string) => void
  className?: string
}

export function Navigation({ 
  title, 
  items, 
  activeItem, 
  onItemClick, 
  className = '' 
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleItemClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick()
    } else if (onItemClick) {
      onItemClick(item.id)
    }
    
    // Close mobile menu after selection
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={`sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">
              {title}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105 ${
                  activeItem === item.id
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeItem === item.id
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Specialized StyleGuide Navigation Component
interface StyleGuideNavigationProps {
  activeSection: string
  onSectionChange: (sectionId: string) => void
}

export function StyleGuideNavigation({ 
  activeSection, 
  onSectionChange 
}: StyleGuideNavigationProps) {
  const sections = [
    { id: 'colors', name: '색상' },
    { id: 'typography', name: '타이포그래피' },
    { id: 'spacing', name: '간격' },
    { id: 'components', name: '컴포넌트' },
    { id: 'charts', name: '차트' },
    { id: 'layout', name: '레이아웃' },
  ]

  return (
    <Navigation
      title="CulinarySeoul 스타일 가이드"
      items={sections}
      activeItem={activeSection}
      onItemClick={onSectionChange}
      className="shadow-sm"
    />
  )
}

// Example of how to use the Navigation component
export function ExampleNavigation() {
  const [activeSection, setActiveSection] = useState('home')

  const navItems = [
    { id: 'home', name: '홈' },
    { id: 'about', name: '소개' },
    { id: 'services', name: '서비스' },
    { id: 'contact', name: '연락처' },
  ]

  return (
    <Navigation
      title="CulinarySeoul"
      items={navItems}
      activeItem={activeSection}
      onItemClick={setActiveSection}
    />
  )
}
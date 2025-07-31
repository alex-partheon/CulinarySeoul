import { Button } from '../ui/button'

interface FooterLink {
  id: string
  name: string
  href?: string
  onClick?: () => void
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  sections?: FooterSection[]
  companyName?: string
  description?: string
  socialLinks?: FooterLink[]
  copyrightText?: string
  className?: string
}

export function Footer({
  sections = [],
  companyName = 'CulinarySeoul',
  description = '한국의 아름다운 음식 문화를 세계에 전하는 ERP 솔루션',
  socialLinks = [],
  copyrightText,
  className = ''
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const defaultCopyright = copyrightText || `© ${currentYear} ${companyName}. All rights reserved.`

  const handleLinkClick = (link: FooterLink) => {
    if (link.onClick) {
      link.onClick()
    } else if (link.href) {
      window.open(link.href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <footer className={`bg-card/95 backdrop-blur-sm border-t border-border mt-auto ${className}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {companyName}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                {description}
              </p>
              {socialLinks.length > 0 && (
                <div className="flex space-x-3">
                  {socialLinks.map((link) => (
                    <Button
                      key={link.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleLinkClick(link)}
                      className="hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-200"
                    >
                      {link.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-semibold text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline underline-offset-4"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-muted-foreground">
              {defaultCopyright}
            </p>
            <p className="text-xs text-muted-foreground">
              Made with ❤️ in Seoul, Korea
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Specialized StyleGuide Footer Component
interface StyleGuideFooterProps {
  onSectionChange?: (sectionId: string) => void
}

export function StyleGuideFooter({ onSectionChange }: StyleGuideFooterProps) {
  const sections: FooterSection[] = [
    {
      title: '디자인 시스템',
      links: [
        { id: 'colors', name: '색상 시스템' },
        { id: 'typography', name: '타이포그래피' },
        { id: 'spacing', name: '간격 시스템' },
        { id: 'components', name: '컴포넌트' },
      ]
    },
    {
      title: '개발 리소스',
      links: [
        { id: 'github', name: 'GitHub', href: 'https://github.com' },
        { id: 'docs', name: '문서', href: '#' },
        { id: 'api', name: 'API 가이드', href: '#' },
        { id: 'changelog', name: '변경사항', href: '#' },
      ]
    }
  ]

  const socialLinks: FooterLink[] = [
    { id: 'github', name: 'GitHub', href: 'https://github.com' },
    { id: 'discord', name: 'Discord', href: 'https://discord.com' },
    { id: 'docs', name: 'Docs', href: '#' },
  ]

  // Handle style guide navigation
  const handleStyleGuideNavigation = (link: FooterLink) => {
    if (link.id === 'colors' || link.id === 'typography' || link.id === 'spacing' || link.id === 'components') {
      if (onSectionChange) {
        onSectionChange(link.id)
      }
    } else {
      if (link.onClick) {
        link.onClick()
      } else if (link.href) {
        window.open(link.href, '_blank', 'noopener,noreferrer')
      }
    }
  }

  // Override link handlers for style guide sections
  const processedSections = sections.map(section => ({
    ...section,
    links: section.links.map(link => ({
      ...link,
      onClick: () => handleStyleGuideNavigation(link)
    }))
  }))

  return (
    <Footer
      sections={processedSections}
      companyName="CulinarySeoul 스타일 가이드"
      description="한국의 아름다운 음식 문화를 담은 현대적인 디자인 시스템입니다. 일관되고 접근 가능한 사용자 경험을 제공합니다."
      socialLinks={socialLinks}
      copyrightText="© 2024 CulinarySeoul. 모든 권리 보유."
      className="shadow-lg"
    />
  )
}

// Example of how to use the Footer component
export function ExampleFooter() {
  const sections: FooterSection[] = [
    {
      title: '제품',
      links: [
        { id: 'features', name: '기능' },
        { id: 'pricing', name: '가격' },
        { id: 'demo', name: '데모' },
        { id: 'trial', name: '무료 체험' },
      ]
    },
    {
      title: '회사',
      links: [
        { id: 'about', name: '회사 소개' },
        { id: 'careers', name: '채용' },
        { id: 'contact', name: '연락처' },
        { id: 'blog', name: '블로그' },
      ]
    },
    {
      title: '지원',
      links: [
        { id: 'help', name: '도움말' },
        { id: 'support', name: '고객 지원' },
        { id: 'docs', name: '문서' },
        { id: 'api', name: 'API' },
      ]
    },
    {
      title: '법적 고지',
      links: [
        { id: 'privacy', name: '개인정보처리방침' },
        { id: 'terms', name: '이용약관' },
        { id: 'cookies', name: '쿠키 정책' },
        { id: 'security', name: '보안' },
      ]
    }
  ]

  const socialLinks: FooterLink[] = [
    { id: 'facebook', name: 'Facebook', href: 'https://facebook.com' },
    { id: 'twitter', name: 'Twitter', href: 'https://twitter.com' },
    { id: 'linkedin', name: 'LinkedIn', href: 'https://linkedin.com' },
    { id: 'instagram', name: 'Instagram', href: 'https://instagram.com' },
  ]

  return (
    <Footer
      sections={sections}
      socialLinks={socialLinks}
    />
  )
}
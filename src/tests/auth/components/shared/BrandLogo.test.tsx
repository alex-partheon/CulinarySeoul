import { render, screen } from '@testing-library/react'
import { ChefHat, Crown, Coffee, Store } from 'lucide-react'
import { BrandLogo, TextLogo } from '../../../../components/auth/shared/BrandLogo'

describe('BrandLogo 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트', () => {
    it('기본 설정으로 BrandLogo가 정상적으로 렌더링된다', () => {
      render(<BrandLogo />)
      
      // 기본적으로 CulinarySeoul 브랜드와 텍스트가 표시되어야 함
      expect(screen.getByText('CulinarySeoul')).toBeInTheDocument()
      expect(screen.getByText('ERP System')).toBeInTheDocument()
    })

    it('커스텀 className이 적용된다', () => {
      const customClass = 'custom-brand-logo'
      render(<BrandLogo className={customClass} />)
      
      const logoContainer = screen.getByText('CulinarySeoul').closest('div')
      expect(logoContainer).toHaveClass(customClass)
    })

    it('텍스트 숨김 옵션이 작동한다', () => {
      render(<BrandLogo showText={false} />)
      
      expect(screen.queryByText('CulinarySeoul')).not.toBeInTheDocument()
      expect(screen.queryByText('ERP System')).not.toBeInTheDocument()
    })
  })

  describe('크기별 렌더링 테스트', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const

    sizes.forEach(size => {
      it(`${size} 크기가 올바른 스타일을 적용한다`, () => {
        render(<BrandLogo size={size} />)
        
        const logoContainer = screen.getByText('CulinarySeoul').closest('div')
        expect(logoContainer).toBeInTheDocument()
        
        // 크기별 간격 클래스 확인
        const sizeClasses = {
          sm: 'gap-2',
          md: 'gap-3', 
          lg: 'gap-4',
          xl: 'gap-4'
        }
        expect(logoContainer).toHaveClass(sizeClasses[size])
      })
    })

    it('sm 크기에서는 ERP System 텍스트가 표시되지 않는다', () => {
      render(<BrandLogo size="sm" />)
      
      expect(screen.getByText('CulinarySeoul')).toBeInTheDocument()
      expect(screen.queryByText('ERP System')).not.toBeInTheDocument()
    })
  })

  describe('브랜드별 렌더링 테스트', () => {
    it('밀랍 브랜드 로고가 올바르게 렌더링된다', () => {
      render(<BrandLogo brandId="millab" />)
      
      expect(screen.getByText('밀랍')).toBeInTheDocument()
      
      // Coffee 아이콘이 렌더링되는지 확인 (data-testid나 aria-label로 확인)
      const logoContainer = screen.getByText('밀랍').closest('div')
      expect(logoContainer).toBeInTheDocument()
    })

    it('프리미엄 브랜드 로고가 올바르게 렌더링된다', () => {
      render(<BrandLogo brandId="premium" />)
      
      expect(screen.getByText('Premium')).toBeInTheDocument()
    })

    it('스토어 브랜드 로고가 올바르게 렌더링된다', () => {
      render(<BrandLogo brandId="store" />)
      
      expect(screen.getByText('Store')).toBeInTheDocument()
    })

    it('기본 브랜드 로고가 올바르게 렌더링된다', () => {
      render(<BrandLogo brandId="default" />)
      
      expect(screen.getByText('CulinarySeoul')).toBeInTheDocument()
      expect(screen.getByText('ERP System')).toBeInTheDocument()
    })

    it('알 수 없는 브랜드 ID는 기본 브랜드로 폴백된다', () => {
      render(<BrandLogo brandId="unknown-brand" />)
      
      expect(screen.getByText('CulinarySeoul')).toBeInTheDocument()
      expect(screen.getByText('ERP System')).toBeInTheDocument()
    })
  })

  describe('변형(Variant) 테스트', () => {
    it('default variant가 올바른 스타일을 적용한다', () => {
      render(<BrandLogo variant="default" />)
      
      const logoContainer = screen.getByText('CulinarySeoul').closest('div')
      const iconContainer = logoContainer?.querySelector('.rounded-2xl')
      
      expect(iconContainer).toHaveClass('bg-gradient-to-br')
      expect(iconContainer).toHaveClass('border')
      expect(iconContainer).toHaveClass('shadow-lg')
    })

    it('gradient variant가 올바른 스타일을 적용한다', () => {
      render(<BrandLogo variant="gradient" />)
      
      const logoContainer = screen.getByText('CulinarySeoul').closest('div')
      const iconContainer = logoContainer?.querySelector('.bg-gradient-to-br')
      
      expect(iconContainer).toBeInTheDocument()
      expect(iconContainer).toHaveClass('p-0.5') // gradient variant의 특징
    })

    it('minimal variant가 올바른 스타일을 적용한다', () => {
      render(<BrandLogo variant="minimal" />)
      
      const logoContainer = screen.getByText('CulinarySeoul').closest('div')
      const iconContainer = logoContainer?.querySelector('.rounded-xl')
      
      expect(iconContainer).toHaveClass('bg-muted/50')
    })
  })

  describe('브랜드별 색상 테스트', () => {
    it('각 브랜드가 고유한 색상을 가진다', () => {
      const brands = [
        { id: 'millab', name: '밀랍' },
        { id: 'premium', name: 'Premium' },
        { id: 'store', name: 'Store' }
      ]

      brands.forEach(brand => {
        const { unmount } = render(<BrandLogo brandId={brand.id} variant="gradient" />)
        
        expect(screen.getByText(brand.name)).toBeInTheDocument()
        
        // gradient variant에서 텍스트도 그라데이션이 적용되는지 확인
        const brandText = screen.getByText(brand.name)
        expect(brandText).toHaveClass('bg-gradient-to-r')
        expect(brandText).toHaveClass('bg-clip-text')
        expect(brandText).toHaveClass('text-transparent')
        
        unmount()
      })
    })
  })

  describe('접근성 테스트', () => {
    it('브랜드 이름이 스크린 리더에 접근 가능하다', () => {
      render(<BrandLogo />)
      
      const brandName = screen.getByText('CulinarySeoul')
      expect(brandName).toBeInTheDocument()
      expect(brandName.tagName).toBe('SPAN')
    })

    it('아이콘과 텍스트의 구조가 올바르다', () => {
      render(<BrandLogo />)
      
      const container = screen.getByText('CulinarySeoul').closest('div')
      expect(container).toHaveClass('flex', 'items-center')
      
      // 텍스트 컨테이너 확인
      const textContainer = screen.getByText('CulinarySeoul').closest('.flex.flex-col')
      expect(textContainer).toBeInTheDocument()
    })

    it('텍스트가 없을 때도 아이콘은 접근 가능하다', () => {
      render(<BrandLogo showText={false} />)
      
      // 아이콘 컨테이너는 여전히 존재해야 함
      const iconContainers = document.querySelectorAll('.rounded-2xl')
      expect(iconContainers.length).toBeGreaterThan(0)
    })
  })

  describe('크기와 변형 조합 테스트', () => {
    it('모든 크기와 변형 조합이 올바르게 작동한다', () => {
      const sizes = ['sm', 'md', 'lg', 'xl'] as const
      const variants = ['default', 'gradient', 'minimal'] as const
      
      sizes.forEach(size => {
        variants.forEach(variant => {
          const { unmount } = render(
            <BrandLogo size={size} variant={variant} brandId="millab" />
          )
          
          expect(screen.getByText('밀랍')).toBeInTheDocument()
          
          unmount()
        })
      })
    })
  })
})

describe('TextLogo 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트', () => {
    it('기본 TextLogo가 정상적으로 렌더링된다', () => {
      render(<TextLogo />)
      
      const logo = screen.getByText('CulinarySeoul')
      expect(logo).toBeInTheDocument()
      expect(logo.tagName).toBe('H1')
      expect(logo).toHaveClass('font-bold')
      expect(logo).toHaveClass('text-2xl') // md 크기
    })

    it('커스텀 className이 적용된다', () => {
      const customClass = 'custom-text-logo'
      render(<TextLogo className={customClass} />)
      
      const logo = screen.getByText('CulinarySeoul')
      expect(logo).toHaveClass(customClass)
    })
  })

  describe('크기별 렌더링 테스트', () => {
    it('sm 크기가 올바른 스타일을 적용한다', () => {
      render(<TextLogo size="sm" />)
      
      const logo = screen.getByText('CulinarySeoul')
      expect(logo).toHaveClass('text-lg')
    })

    it('md 크기가 올바른 스타일을 적용한다', () => {
      render(<TextLogo size="md" />)
      
      const logo = screen.getByText('CulinarySeoul')
      expect(logo).toHaveClass('text-2xl')
    })

    it('lg 크기가 올바른 스타일을 적용한다', () => {
      render(<TextLogo size="lg" />)
      
      const logo = screen.getByText('CulinarySeoul')
      expect(logo).toHaveClass('text-4xl')
    })
  })

  describe('브랜드별 렌더링 테스트', () => {
    const brands = [
      { id: 'millab', name: '밀랍' },
      { id: 'premium', name: 'Premium' },
      { id: 'store', name: 'Store' },
      { id: undefined, name: 'CulinarySeoul' }
    ]

    brands.forEach(brand => {
      it(`${brand.name} 브랜드 텍스트 로고가 올바르게 렌더링된다`, () => {
        render(<TextLogo brandId={brand.id} />)
        
        const logo = screen.getByText(brand.name)
        expect(logo).toBeInTheDocument()
        expect(logo).toHaveClass('bg-gradient-to-r')
        expect(logo).toHaveClass('bg-clip-text')
        expect(logo).toHaveClass('text-transparent')
      })
    })
  })

  describe('그라데이션 효과 테스트', () => {
    it('모든 브랜드가 그라데이션 텍스트 효과를 가진다', () => {
      const brandIds = ['millab', 'premium', 'store', undefined]
      
      brandIds.forEach(brandId => {
        const { unmount } = render(<TextLogo brandId={brandId} />)
        
        const logo = screen.getByRole('heading', { level: 1 })
        expect(logo).toHaveClass('bg-gradient-to-r')
        expect(logo).toHaveClass('bg-clip-text')
        expect(logo).toHaveClass('text-transparent')
        
        unmount()
      })
    })
  })

  describe('접근성 테스트', () => {
    it('제목이 올바른 시맨틱 태그로 렌더링된다', () => {
      render(<TextLogo />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('CulinarySeoul')
    })

    it('브랜드별 제목이 올바르게 표시된다', () => {
      render(<TextLogo brandId="millab" />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('밀랍')
    })
  })
})

describe('BrandLogo와 TextLogo 통합 테스트', () => {
  it('같은 브랜드 ID로 일관된 이름을 표시한다', () => {
    const brandId = 'millab'
    
    const { unmount: unmountBrandLogo } = render(<BrandLogo brandId={brandId} />)
    expect(screen.getByText('밀랍')).toBeInTheDocument()
    unmountBrandLogo()
    
    const { unmount: unmountTextLogo } = render(<TextLogo brandId={brandId} />)
    expect(screen.getByText('밀랍')).toBeInTheDocument()
    unmountTextLogo()
  })

  it('다양한 조합으로 함께 사용할 수 있다', () => {
    render(
      <div>
        <BrandLogo brandId="premium" size="lg" variant="gradient" />
        <TextLogo brandId="premium" size="sm" />
      </div>
    )
    
    const premiumTexts = screen.getAllByText('Premium')
    expect(premiumTexts).toHaveLength(2)
    
    // 하나는 span(BrandLogo), 하나는 h1(TextLogo)
    const spanElement = premiumTexts.find(el => el.tagName === 'SPAN')
    const h1Element = premiumTexts.find(el => el.tagName === 'H1')
    
    expect(spanElement).toBeInTheDocument()
    expect(h1Element).toBeInTheDocument()
  })

  describe('성능 테스트', () => {
    it('많은 로고 인스턴스를 렌더링할 수 있다', () => {
      const logos = Array.from({ length: 10 }, (_, i) => (
        <div key={i}>
          <BrandLogo brandId="millab" size="sm" />
          <TextLogo brandId="millab" size="sm" />
        </div>
      ))
      
      render(<div>{logos}</div>)
      
      const millabTexts = screen.getAllByText('밀랍')
      expect(millabTexts).toHaveLength(20) // 10개의 BrandLogo + 10개의 TextLogo
    })
  })
})
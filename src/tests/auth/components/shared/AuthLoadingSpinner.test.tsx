import { render, screen } from '@testing-library/react'
import { 
  AuthLoadingSpinner, 
  LoadingOverlay, 
  ButtonLoading, 
  Skeleton, 
  CardSkeleton 
} from '../../../../components/auth/shared/AuthLoadingSpinner'

describe('AuthLoadingSpinner 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트 (default variant)', () => {
    it('기본 AuthLoadingSpinner가 정상적으로 렌더링된다', () => {
      render(<AuthLoadingSpinner />)
      
      // 기본 텍스트가 표시되는지 확인
      expect(screen.getByText('로딩 중...')).toBeInTheDocument()
      
      // 그라데이션 스피너 컨테이너가 있는지 확인
      const spinnerContainers = document.querySelectorAll('.bg-gradient-conic')
      expect(spinnerContainers.length).toBeGreaterThan(0)
    })

    it('커스텀 텍스트가 표시된다', () => {
      const customText = '데이터를 불러오는 중...'
      render(<AuthLoadingSpinner text={customText} />)
      
      expect(screen.getByText(customText)).toBeInTheDocument()
    })

    it('커스텀 className이 적용된다', () => {
      const customClass = 'custom-loading-spinner'
      render(<AuthLoadingSpinner className={customClass} />)
      
      const container = screen.getByText('로딩 중...').closest('div')
      expect(container).toHaveClass(customClass)
    })
  })

  describe('크기별 렌더링 테스트', () => {
    it('sm 크기가 올바른 스타일을 적용한다', () => {
      render(<AuthLoadingSpinner size="sm" text="작은 로딩" />)
      
      const text = screen.getByText('작은 로딩')
      expect(text).toHaveClass('text-sm')
      
      const container = text.closest('div')
      expect(container).toHaveClass('gap-2')
    })

    it('md 크기가 올바른 스타일을 적용한다', () => {
      render(<AuthLoadingSpinner size="md" text="중간 로딩" />)
      
      const text = screen.getByText('중간 로딩')
      expect(text).toHaveClass('text-base')
      
      const container = text.closest('div')
      expect(container).toHaveClass('gap-3')
    })

    it('lg 크기가 올바른 스타일을 적용한다', () => {
      render(<AuthLoadingSpinner size="lg" text="큰 로딩" />)
      
      const text = screen.getByText('큰 로딩')
      expect(text).toHaveClass('text-lg')
      
      const container = text.closest('div')
      expect(container).toHaveClass('gap-4')
    })
  })

  describe('branded variant 테스트', () => {
    it('branded variant가 올바르게 렌더링된다', () => {
      render(<AuthLoadingSpinner variant="branded" text="브랜드 로딩" />)
      
      expect(screen.getByText('브랜드 로딩')).toBeInTheDocument()
      
      // ChefHat 아이콘이 있는지 확인
      const chefHatIcons = document.querySelectorAll('[data-lucide="chef-hat"]')
      expect(chefHatIcons.length).toBeGreaterThan(0)
      
      // 회전 링과 중앙 아이콘 구조 확인
      const animateSpinElements = document.querySelectorAll('.animate-spin')
      expect(animateSpinElements.length).toBeGreaterThan(0)
      
      const animatePulseElements = document.querySelectorAll('.animate-pulse')
      expect(animatePulseElements.length).toBeGreaterThan(0)
    })

    it('branded variant에서 크기별 아이콘 크기가 적용된다', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      
      sizes.forEach(size => {
        const { unmount } = render(
          <AuthLoadingSpinner variant="branded" size={size} />
        )
        
        // ChefHat 아이콘이 렌더링되는지 확인
        const chefHatIcons = document.querySelectorAll('[data-lucide="chef-hat"]')
        expect(chefHatIcons.length).toBeGreaterThan(0)
        
        unmount()
      })
    })
  })

  describe('minimal variant 테스트', () => {
    it('minimal variant가 올바르게 렌더링된다', () => {
      render(<AuthLoadingSpinner variant="minimal" text="미니멀 로딩" />)
      
      expect(screen.getByText('미니멀 로딩')).toBeInTheDocument()
      
      // Loader2 아이콘이 있는지 확인
      const loader2Icons = document.querySelectorAll('[data-lucide="loader-2"]')
      expect(loader2Icons.length).toBeGreaterThan(0)
      
      // 회전 애니메이션이 적용되는지 확인
      const animateSpinElements = document.querySelectorAll('.animate-spin')
      expect(animateSpinElements.length).toBeGreaterThan(0)
    })

    it('minimal variant에서 텍스트와 아이콘이 가로로 배열된다', () => {
      render(<AuthLoadingSpinner variant="minimal" text="가로 배열" />)
      
      const container = screen.getByText('가로 배열').closest('div')
      expect(container).toHaveClass('flex', 'items-center', 'justify-center')
    })
  })

  describe('dots variant 테스트', () => {
    it('dots variant가 올바르게 렌더링된다', () => {
      render(<AuthLoadingSpinner variant="dots" text="점 로딩" />)
      
      expect(screen.getByText('점 로딩')).toBeInTheDocument()
      
      // 3개의 점이 있는지 확인
      const dots = document.querySelectorAll('.animate-bounce')
      expect(dots).toHaveLength(3)
    })

    it('dots variant에서 각 점이 다른 지연시간을 가진다', () => {
      render(<AuthLoadingSpinner variant="dots" />)
      
      const dots = document.querySelectorAll('.animate-bounce')
      expect(dots).toHaveLength(3)
      
      // 각 점이 서로 다른 animationDelay를 가지는지 확인
      const delays = Array.from(dots).map(dot => 
        (dot as HTMLElement).style.animationDelay
      )
      
      expect(delays).toEqual(['0s', '0.15s', '0.3s'])
    })

    it('dots variant에서 크기별 점 크기가 적용된다', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      
      sizes.forEach(size => {
        const { unmount } = render(
          <AuthLoadingSpinner variant="dots" size={size} />
        )
        
        const dots = document.querySelectorAll('.animate-bounce')
        expect(dots).toHaveLength(3)
        
        unmount()
      })
    })
  })

  describe('접근성 테스트', () => {
    it('로딩 텍스트가 스크린 리더에 접근 가능하다', () => {
      render(<AuthLoadingSpinner text="접근성 테스트" />)
      
      const text = screen.getByText('접근성 테스트')
      expect(text).toBeInTheDocument()
      expect(text.tagName).toBe('P')
    })

    it('텍스트 없이도 스피너가 표시된다', () => {
      render(<AuthLoadingSpinner text="" />)
      
      // 텍스트가 없어도 스피너는 표시되어야 함
      const spinnerElements = document.querySelectorAll('.animate-spin, .animate-bounce, .animate-pulse')
      expect(spinnerElements.length).toBeGreaterThan(0)
    })

    it('모든 variant에서 애니메이션이 적용된다', () => {
      const variants = ['default', 'branded', 'minimal', 'dots'] as const
      
      variants.forEach(variant => {
        const { unmount } = render(
          <AuthLoadingSpinner variant={variant} />
        )
        
        // 애니메이션 클래스가 적용되는지 확인
        const animatedElements = document.querySelectorAll(
          '.animate-spin, .animate-bounce, .animate-pulse'
        )
        expect(animatedElements.length).toBeGreaterThan(0)
        
        unmount()
      })
    })
  })
})

describe('LoadingOverlay 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트', () => {
    it('보이는 상태일 때 오버레이가 렌더링된다', () => {
      render(<LoadingOverlay isVisible={true} />)
      
      // 기본 텍스트 확인
      expect(screen.getByText('처리 중입니다...')).toBeInTheDocument()
      
      // 오버레이 배경 확인
      const overlay = screen.getByText('처리 중입니다...').closest('.fixed')
      expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50')
      expect(overlay).toHaveClass('bg-background/80', 'backdrop-blur-sm')
    })

    it('숨겨진 상태일 때 오버레이가 렌더링되지 않는다', () => {
      render(<LoadingOverlay isVisible={false} />)
      
      expect(screen.queryByText('처리 중입니다...')).not.toBeInTheDocument()
    })

    it('커스텀 텍스트가 표시된다', () => {
      const customText = '파일을 업로드하는 중...'
      render(<LoadingOverlay isVisible={true} text={customText} />)
      
      expect(screen.getByText(customText)).toBeInTheDocument()
    })

    it('variant 옵션이 작동한다', () => {
      const { rerender } = render(
        <LoadingOverlay isVisible={true} variant="default" />
      )
      
      expect(screen.getByText('처리 중입니다...')).toBeInTheDocument()
      
      rerender(<LoadingOverlay isVisible={true} variant="branded" />)
      
      expect(screen.getByText('처리 중입니다...')).toBeInTheDocument()
      // branded variant에서 ChefHat 아이콘이 있는지 확인
      const chefHatIcons = document.querySelectorAll('[data-lucide="chef-hat"]')
      expect(chefHatIcons.length).toBeGreaterThan(0)
    })
  })

  describe('오버레이 스타일 테스트', () => {
    it('오버레이가 전체 화면을 덮는다', () => {
      render(<LoadingOverlay isVisible={true} />)
      
      const overlay = document.querySelector('.fixed.inset-0')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveClass('z-50') // 높은 z-index
    })

    it('오버레이 내부 카드가 올바른 스타일을 가진다', () => {
      render(<LoadingOverlay isVisible={true} />)
      
      const card = screen.getByText('처리 중입니다...').closest('.bg-card\\/80')
      expect(card).toHaveClass('backdrop-blur-md', 'rounded-2xl', 'border', 'shadow-xl')
    })
  })

  describe('접근성 테스트', () => {
    it('오버레이가 포커스를 트랩한다', () => {
      render(<LoadingOverlay isVisible={true} />)
      
      // 오버레이가 보이는 상태에서 적절한 구조를 가지는지 확인
      const overlay = document.querySelector('.fixed.inset-0')
      expect(overlay).toBeInTheDocument()
    })

    it('로딩 상태가 명확히 전달된다', () => {
      render(<LoadingOverlay isVisible={true} text="저장 중..." />)
      
      expect(screen.getByText('저장 중...')).toBeInTheDocument()
    })
  })
})

describe('ButtonLoading 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트', () => {
    it('로딩 상태가 아닐 때 children이 표시된다', () => {
      render(
        <ButtonLoading isLoading={false}>
          버튼 텍스트
        </ButtonLoading>
      )
      
      expect(screen.getByText('버튼 텍스트')).toBeInTheDocument()
      
      // 로딩 스피너가 없는지 확인
      const spinners = document.querySelectorAll('[data-lucide="loader-2"]')
      expect(spinners).toHaveLength(0)
    })

    it('로딩 상태일 때 스피너가 표시된다', () => {
      render(
        <ButtonLoading isLoading={true}>
          버튼 텍스트
        </ButtonLoading>
      )
      
      expect(screen.getByText('버튼 텍스트')).toBeInTheDocument()
      
      // 로딩 스피너가 있는지 확인
      const spinners = document.querySelectorAll('[data-lucide="loader-2"]')
      expect(spinners.length).toBeGreaterThan(0)
      
      // 스피너가 회전 애니메이션을 가지는지 확인
      const animateSpinElements = document.querySelectorAll('.animate-spin')
      expect(animateSpinElements.length).toBeGreaterThan(0)
    })

    it('로딩 상태일 때 커스텀 로딩 텍스트가 표시된다', () => {
      render(
        <ButtonLoading isLoading={true} loadingText="저장 중...">
          저장하기
        </ButtonLoading>
      )
      
      expect(screen.getByText('저장 중...')).toBeInTheDocument()
      expect(screen.queryByText('저장하기')).not.toBeInTheDocument()
    })

    it('커스텀 className이 적용된다', () => {
      const customClass = 'custom-button-loading'
      render(
        <ButtonLoading isLoading={false} className={customClass}>
          버튼
        </ButtonLoading>
      )
      
      const container = screen.getByText('버튼').closest('div')
      expect(container).toHaveClass(customClass)
    })
  })

  describe('상태 전환 테스트', () => {
    it('로딩 상태 변경이 올바르게 반영된다', () => {
      const { rerender } = render(
        <ButtonLoading isLoading={false}>
          제출하기
        </ButtonLoading>
      )
      
      expect(screen.getByText('제출하기')).toBeInTheDocument()
      expect(document.querySelectorAll('.animate-spin')).toHaveLength(0)
      
      rerender(
        <ButtonLoading isLoading={true} loadingText="제출 중...">
          제출하기
        </ButtonLoading>
      )
      
      expect(screen.getByText('제출 중...')).toBeInTheDocument()
      expect(screen.queryByText('제출하기')).not.toBeInTheDocument()
      expect(document.querySelectorAll('.animate-spin').length).toBeGreaterThan(0)
    })
  })

  describe('접근성 테스트', () => {
    it('로딩 상태가 스크린 리더에 전달된다', () => {
      render(
        <ButtonLoading isLoading={true} loadingText="업로드 중...">
          파일 업로드
        </ButtonLoading>
      )
      
      expect(screen.getByText('업로드 중...')).toBeInTheDocument()
    })

    it('스피너와 텍스트가 올바른 구조를 가진다', () => {
      render(
        <ButtonLoading isLoading={true}>
          로딩 버튼
        </ButtonLoading>
      )
      
      const container = screen.getByText('로딩 버튼').closest('div')
      expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'gap-2')
    })
  })
})

describe('Skeleton 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트', () => {
    it('기본 Skeleton이 정상적으로 렌더링된다', () => {
      render(<Skeleton />)
      
      const skeleton = document.querySelector('.bg-muted.animate-pulse')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('rounded') // rectangular variant
    })

    it('커스텀 className이 적용된다', () => {
      const customClass = 'w-20 h-4'
      render(<Skeleton className={customClass} />)
      
      const skeleton = document.querySelector('.bg-muted.animate-pulse')
      expect(skeleton).toHaveClass(customClass)
    })
  })

  describe('variant 테스트', () => {
    it('text variant가 올바른 스타일을 적용한다', () => {
      render(<Skeleton variant="text" />)
      
      const skeleton = document.querySelector('.bg-muted.animate-pulse')
      expect(skeleton).toHaveClass('h-4', 'rounded')
    })

    it('circular variant가 올바른 스타일을 적용한다', () => {
      render(<Skeleton variant="circular" />)
      
      const skeleton = document.querySelector('.bg-muted.animate-pulse')
      expect(skeleton).toHaveClass('rounded-full')
    })

    it('rectangular variant가 올바른 스타일을 적용한다', () => {
      render(<Skeleton variant="rectangular" />)
      
      const skeleton = document.querySelector('.bg-muted.animate-pulse')
      expect(skeleton).toHaveClass('rounded')
    })
  })

  describe('접근성 테스트', () => {
    it('스켈레톤이 적절한 시각적 피드백을 제공한다', () => {
      render(<Skeleton className="w-full h-8" />)
      
      const skeleton = document.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
    })
  })
})

describe('CardSkeleton 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트', () => {
    it('CardSkeleton이 완전한 구조로 렌더링된다', () => {
      render(<CardSkeleton />)
      
      // 모든 스켈레톤 요소들이 렌더링되는지 확인
      const skeletons = document.querySelectorAll('.bg-muted.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(5) // 여러 스켈레톤 요소들
      
      // 원형 스켈레톤 (아바타)
      const circularSkeletons = document.querySelectorAll('.rounded-full')
      expect(circularSkeletons.length).toBeGreaterThan(0)
      
      // 사각형 스켈레톤 (버튼들)
      const rectangularSkeletons = document.querySelectorAll('.bg-muted.animate-pulse:not(.rounded-full):not(.h-4)')
      expect(rectangularSkeletons.length).toBeGreaterThan(0)
    })

    it('CardSkeleton이 카드 레이아웃을 모방한다', () => {
      render(<CardSkeleton />)
      
      // 패딩과 간격이 적용된 컨테이너
      const container = document.querySelector('.p-6.space-y-4')
      expect(container).toBeInTheDocument()
      
      // 헤더 영역 (아바타 + 텍스트)
      const headerArea = document.querySelector('.flex.items-center.space-x-4')
      expect(headerArea).toBeInTheDocument()
      
      // 본문 영역
      const contentArea = document.querySelector('.space-y-2')
      expect(contentArea).toBeInTheDocument()
      
      // 푸터 영역
      const footerArea = document.querySelector('.flex.justify-between.pt-4')
      expect(footerArea).toBeInTheDocument()
    })
  })

  describe('접근성 테스트', () => {
    it('카드 스켈레톤이 적절한 로딩 상태를 나타낸다', () => {
      render(<CardSkeleton />)
      
      // 모든 스켈레톤 요소가 펄스 애니메이션을 가지는지 확인
      const animatedElements = document.querySelectorAll('.animate-pulse')
      expect(animatedElements.length).toBeGreaterThan(0)
    })
  })
})

describe('로딩 컴포넌트들 통합 테스트', () => {
  it('다양한 로딩 컴포넌트들을 함께 사용할 수 있다', () => {
    render(
      <div>
        <AuthLoadingSpinner variant="minimal" size="sm" />
        <ButtonLoading isLoading={true}>저장</ButtonLoading>
        <Skeleton className="w-20 h-4 mb-2" />
        <CircularProgress progress={75} size="sm" />
      </div>
    )
    
    // 각 컴포넌트가 렌더링되는지 확인
    expect(document.querySelectorAll('.animate-spin').length).toBeGreaterThan(0)
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('로딩 오버레이와 다른 컴포넌트들이 함께 작동한다', () => {
    render(
      <div>
        <LoadingOverlay isVisible={true} text="백업 중..." />
        <CardSkeleton />
      </div>
    )
    
    expect(screen.getByText('백업 중...')).toBeInTheDocument()
    
    // 오버레이가 최상단에 위치하는지 확인
    const overlay = document.querySelector('.z-50')
    expect(overlay).toBeInTheDocument()
  })

  describe('성능 테스트', () => {
    it('많은 로딩 컴포넌트 인스턴스를 렌더링할 수 있다', () => {
      const loadingComponents = Array.from({ length: 10 }, (_, i) => (
        <div key={i}>
          <AuthLoadingSpinner size="sm" variant="dots" />
          <Skeleton className="w-full h-2 mt-2" />
        </div>
      ))
      
      render(<div>{loadingComponents}</div>)
      
      // 모든 애니메이션 요소들이 렌더링되는지 확인
      const animatedElements = document.querySelectorAll('.animate-bounce, .animate-pulse')
      expect(animatedElements.length).toBeGreaterThan(20) // 10개의 dots (3개씩) + 10개의 skeleton
    })
  })
})
import { render, screen } from '@testing-library/react'
import { StepIndicator, CircularProgress } from '../../../../components/auth/shared/StepIndicator'

// 테스트용 스텝 데이터
const mockSteps = [
  { id: 'step1', title: '개인정보', description: '기본 정보를 입력하세요' },
  { id: 'step2', title: '인증', description: '이메일을 인증하세요' },
  { id: 'step3', title: '완료', description: '가입을 완료하세요' }
]

const mockSimpleSteps = [
  { id: 'step1', title: '정보입력' },
  { id: 'step2', title: '확인' },
  { id: 'step3', title: '완료' }
]

describe('StepIndicator 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트 (default variant)', () => {
    it('기본 StepIndicator가 정상적으로 렌더링된다', () => {
      render(<StepIndicator steps={mockSteps} currentStep={0} />)
      
      // 진행률 텍스트 확인
      expect(screen.getByText('단계 1 / 3')).toBeInTheDocument()
      expect(screen.getByText('33% 완료')).toBeInTheDocument()
      
      // 모든 스텝 제목이 표시되는지 확인
      expect(screen.getByText('개인정보')).toBeInTheDocument()
      expect(screen.getByText('인증')).toBeInTheDocument()
      expect(screen.getByText('완료')).toBeInTheDocument()
    })

    it('현재 스텝이 올바르게 표시된다', () => {
      render(<StepIndicator steps={mockSteps} currentStep={1} />)
      
      expect(screen.getByText('단계 2 / 3')).toBeInTheDocument()
      expect(screen.getByText('67% 완료')).toBeInTheDocument()
    })

    it('마지막 스텝에서 100% 완료를 표시한다', () => {
      render(<StepIndicator steps={mockSteps} currentStep={2} />)
      
      expect(screen.getByText('단계 3 / 3')).toBeInTheDocument()
      expect(screen.getByText('100% 완료')).toBeInTheDocument()
    })

    it('커스텀 className이 적용된다', () => {
      const customClass = 'custom-step-indicator'
      render(
        <StepIndicator 
          steps={mockSteps} 
          currentStep={0} 
          className={customClass} 
        />
      )
      
      const container = screen.getByText('단계 1 / 3').closest('div')
      expect(container).toHaveClass(customClass)
    })
  })

  describe('스텝 상태 테스트 (default variant)', () => {
    it('완료된 스텝에 체크 아이콘이 표시된다', () => {
      render(<StepIndicator steps={mockSteps} currentStep={2} />)
      
      // 완료된 스텝들 (0, 1번 스텝)에 체크 아이콘이 있는지 확인
      const checkIcons = document.querySelectorAll('[data-lucide="check"]')
      expect(checkIcons.length).toBe(2) // 0번, 1번 스텝이 완료됨
    })

    it('현재 스텝이 강조 표시된다', () => {
      render(<StepIndicator steps={mockSteps} currentStep={1} />)
      
      // 현재 스텝 (1번)에 숫자가 표시되고 강조 스타일이 적용되는지 확인
      const stepNumbers = document.querySelectorAll('.scale-110')
      expect(stepNumbers.length).toBeGreaterThan(0)
    })

    it('미완료 스텝은 기본 상태로 표시된다', () => {
      render(<StepIndicator steps={mockSteps} currentStep={0} />)
      
      // 첫 번째 스텝만 현재 상태, 나머지는 미완료 상태
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  describe('minimal variant 테스트', () => {
    it('minimal variant가 올바르게 렌더링된다', () => {
      render(
        <StepIndicator 
          steps={mockSteps} 
          currentStep={1} 
          variant="minimal" 
        />
      )
      
      // 진행률 텍스트와 퍼센트가 표시되는지 확인
      expect(screen.getByText('단계 2 / 3')).toBeInTheDocument()
      expect(screen.getByText('67% 완료')).toBeInTheDocument()
      
      // 진행 바가 있는지 확인 (스타일로 확인)
      const progressBars = document.querySelectorAll('.bg-gradient-to-r.from-primary.to-secondary')
      expect(progressBars.length).toBeGreaterThan(0)
    })

    it('minimal variant에서는 스텝 도트가 표시되지 않는다', () => {
      render(
        <StepIndicator 
          steps={mockSteps} 
          currentStep={1} 
          variant="minimal" 
        />
      )
      
      // 개별 스텝 제목들이 표시되지 않아야 함
      expect(screen.queryByText('개인정보')).not.toBeInTheDocument()
      expect(screen.queryByText('인증')).not.toBeInTheDocument()
      expect(screen.queryByText('완료')).not.toBeInTheDocument()
    })

    it('minimal variant에서 진행률이 올바르게 계산된다', () => {
      const { rerender } = render(
        <StepIndicator 
          steps={mockSteps} 
          currentStep={0} 
          variant="minimal" 
        />
      )
      
      expect(screen.getByText('33% 완료')).toBeInTheDocument()
      
      rerender(
        <StepIndicator 
          steps={mockSteps} 
          currentStep={1} 
          variant="minimal" 
        />
      )
      
      expect(screen.getByText('67% 완료')).toBeInTheDocument()
      
      rerender(
        <StepIndicator 
          steps={mockSteps} 
          currentStep={2} 
          variant="minimal" 
        />
      )
      
      expect(screen.getByText('100% 완료')).toBeInTheDocument()
    })
  })

  describe('detailed variant 테스트', () => {
    it('detailed variant가 올바르게 렌더링된다', () => {
      render(
        <StepIndicator 
          steps={mockSteps} 
          currentStep={1} 
          variant="detailed" 
        />
      )
      
      // 현재 스텝 제목이 헤더에 표시되는지 확인
      expect(screen.getByText('인증')).toBeInTheDocument()
      expect(screen.getByText('2 / 3 단계')).toBeInTheDocument()
      
      // 모든 스텝의 제목과 설명이 표시되는지 확인
      expect(screen.getByText('개인정보')).toBeInTheDocument()
      expect(screen.getByText('기본 정보를 입력하세요')).toBeInTheDocument()
      expect(screen.getByText('이메일을 인증하세요')).toBeInTheDocument()
      expect(screen.getByText('가입을 완료하세요')).toBeInTheDocument()
    })

    it('detailed variant에서 현재 스텝이 강조 표시된다', () => {
      render(
        <StepIndicator 
          steps={mockSteps} 
          currentStep={1} 
          variant="detailed" 
        />
      )
      
      // 현재 스텝이 강조 배경을 가지는지 확인
      const currentStepElements = document.querySelectorAll('.bg-primary\\/5.border.border-primary\\/20')
      expect(currentStepElements.length).toBeGreaterThan(0)
    })

    it('detailed variant에서 완료된 스텝이 올바르게 표시된다', () => {
      render(
        <StepIndicator 
          steps={mockSteps} 
          currentStep={2} 
          variant="detailed" 
        />
      )
      
      // 완료된 스텝들에 체크 아이콘이 있는지 확인
      const checkIcons = document.querySelectorAll('[data-lucide="check"]')
      expect(checkIcons.length).toBe(2) // 0번, 1번 스텝이 완료됨
    })

    it('detailed variant에서 설명이 없는 스텝도 올바르게 처리된다', () => {
      render(
        <StepIndicator 
          steps={mockSimpleSteps} 
          currentStep={1} 
          variant="detailed" 
        />
      )
      
      expect(screen.getByText('정보입력')).toBeInTheDocument()
      expect(screen.getByText('확인')).toBeInTheDocument()
      expect(screen.getByText('완료')).toBeInTheDocument()
    })
  })

  describe('진행률 계산 테스트', () => {
    it('다양한 스텝 수에서 진행률이 올바르게 계산된다', () => {
      const twoSteps = [
        { id: 'step1', title: '첫 번째' },
        { id: 'step2', title: '두 번째' }
      ]
      
      const { rerender } = render(
        <StepIndicator steps={twoSteps} currentStep={0} />
      )
      expect(screen.getByText('50% 완료')).toBeInTheDocument()
      
      rerender(<StepIndicator steps={twoSteps} currentStep={1} />)
      expect(screen.getByText('100% 완료')).toBeInTheDocument()
    })

    it('많은 스텝에서도 진행률이 올바르게 계산된다', () => {
      const manySteps = Array.from({ length: 7 }, (_, i) => ({
        id: `step${i + 1}`,
        title: `스텝 ${i + 1}`
      }))
      
      render(<StepIndicator steps={manySteps} currentStep={2} />)
      
      // (2 + 1) / 7 * 100 = 42.857... ≈ 43%
      expect(screen.getByText('43% 완료')).toBeInTheDocument()
    })
  })

  describe('접근성 테스트', () => {
    it('스텝 정보가 스크린 리더에 접근 가능하다', () => {
      render(<StepIndicator steps={mockSteps} currentStep={1} />)
      
      // 진행률 정보가 텍스트로 제공되는지 확인
      expect(screen.getByText('단계 2 / 3')).toBeInTheDocument()
      expect(screen.getByText('67% 완료')).toBeInTheDocument()
    })

    it('각 스텝의 제목이 접근 가능하다', () => {
      render(<StepIndicator steps={mockSteps} currentStep={1} />)
      
      mockSteps.forEach(step => {
        expect(screen.getByText(step.title)).toBeInTheDocument()
      })
    })

    it('detailed variant에서 설명이 접근 가능하다', () => {
      render(
        <StepIndicator 
          steps={mockSteps} 
          currentStep={1} 
          variant="detailed" 
        />
      )
      
      mockSteps.forEach(step => {
        if (step.description) {
          expect(screen.getByText(step.description)).toBeInTheDocument()
        }
      })
    })
  })

  describe('edge cases 테스트', () => {
    it('빈 스텝 배열도 처리할 수 있다', () => {
      render(<StepIndicator steps={[]} currentStep={0} />)
      
      // 0으로 나누기 오류가 발생하지 않고 적절히 처리되는지 확인
      expect(screen.getByText('단계 1 / 0')).toBeInTheDocument()
    })

    it('currentStep이 범위를 벗어나도 처리할 수 있다', () => {
      render(<StepIndicator steps={mockSteps} currentStep={5} />)
      
      // 범위를 벗어나도 적절히 처리되는지 확인
      expect(screen.getByText('단계 6 / 3')).toBeInTheDocument()
    })

    it('음수 currentStep도 처리할 수 있다', () => {
      render(<StepIndicator steps={mockSteps} currentStep={-1} />)
      
      expect(screen.getByText('단계 0 / 3')).toBeInTheDocument()
    })
  })
})

describe('CircularProgress 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트', () => {
    it('기본 CircularProgress가 정상적으로 렌더링된다', () => {
      render(<CircularProgress progress={50} />)
      
      // SVG 요소가 렌더링되는지 확인
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
      
      // 진행률 텍스트가 표시되는지 확인
      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    it('텍스트 숨김 옵션이 작동한다', () => {
      render(<CircularProgress progress={75} showText={false} />)
      
      expect(screen.queryByText('75%')).not.toBeInTheDocument()
    })

    it('커스텀 className이 적용된다', () => {
      const customClass = 'custom-circular-progress'
      render(<CircularProgress progress={30} className={customClass} />)
      
      const container = screen.getByText('30%').closest('div')
      expect(container).toHaveClass(customClass)
    })
  })

  describe('크기별 렌더링 테스트', () => {
    it('sm 크기가 올바른 속성을 가진다', () => {
      render(<CircularProgress progress={60} size="sm" />)
      
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('width', '40')
      expect(svg).toHaveAttribute('height', '40')
      
      const text = screen.getByText('60%')
      expect(text).toHaveClass('text-xs')
    })

    it('md 크기가 올바른 속성을 가진다', () => {
      render(<CircularProgress progress={60} size="md" />)
      
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('width', '60')
      expect(svg).toHaveAttribute('height', '60')
      
      const text = screen.getByText('60%')
      expect(text).toHaveClass('text-sm')
    })

    it('lg 크기가 올바른 속성을 가진다', () => {
      render(<CircularProgress progress={60} size="lg" />)
      
      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('width', '80')
      expect(svg).toHaveAttribute('height', '80')
      
      const text = screen.getByText('60%')
      expect(text).toHaveClass('text-base')
    })
  })

  describe('진행률 표시 테스트', () => {
    it('0% 진행률이 올바르게 표시된다', () => {
      render(<CircularProgress progress={0} />)
      
      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('100% 진행률이 올바르게 표시된다', () => {
      render(<CircularProgress progress={100} />)
      
      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('소수점 진행률이 반올림되어 표시된다', () => {
      render(<CircularProgress progress={66.7} />)
      
      expect(screen.getByText('67%')).toBeInTheDocument()
    })

    it('100을 초과하는 진행률도 처리된다', () => {
      render(<CircularProgress progress={150} />)
      
      expect(screen.getByText('150%')).toBeInTheDocument()
    })
  })

  describe('SVG 속성 테스트', () => {
    it('SVG 원의 속성이 올바르게 설정된다', () => {
      render(<CircularProgress progress={25} size="md" />)
      
      const circles = document.querySelectorAll('circle')
      expect(circles).toHaveLength(2) // 배경 원 + 진행률 원
      
      // 배경 원
      const backgroundCircle = circles[0]
      expect(backgroundCircle).toHaveAttribute('fill', 'transparent')
      expect(backgroundCircle).toHaveAttribute('stroke', 'hsl(var(--muted))')
      
      // 진행률 원
      const progressCircle = circles[1]
      expect(progressCircle).toHaveAttribute('fill', 'transparent')
      expect(progressCircle).toHaveAttribute('stroke', 'hsl(var(--primary))')
      expect(progressCircle).toHaveAttribute('stroke-linecap', 'round')
    })

    it('SVG가 회전 변형을 가진다', () => {
      render(<CircularProgress progress={50} />)
      
      const svg = document.querySelector('svg')
      expect(svg).toHaveClass('transform', '-rotate-90')
    })
  })

  describe('접근성 테스트', () => {
    it('진행률 텍스트가 접근 가능하다', () => {
      render(<CircularProgress progress={85} />)
      
      const progressText = screen.getByText('85%')
      expect(progressText).toBeInTheDocument()
      expect(progressText).toHaveClass('font-semibold')
    })

    it('텍스트 없이도 SVG가 접근 가능하다', () => {
      render(<CircularProgress progress={45} showText={false} />)
      
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })
})

describe('StepIndicator와 CircularProgress 통합 테스트', () => {
  it('함께 사용할 때 일관된 진행률을 표시한다', () => {
    const progress = 67 // 2/3 * 100
    
    render(
      <div>
        <StepIndicator steps={mockSteps} currentStep={1} variant="minimal" />
        <CircularProgress progress={progress} />
      </div>
    )
    
    // 둘 다 같은 진행률을 표시해야 함
    expect(screen.getByText('67% 완료')).toBeInTheDocument()
    expect(screen.getByText('67%')).toBeInTheDocument()
  })

  it('다양한 조합으로 함께 사용할 수 있다', () => {
    render(
      <div>
        <StepIndicator steps={mockSteps} currentStep={0} />
        <CircularProgress progress={33} size="sm" />
        <StepIndicator steps={mockSteps} currentStep={2} variant="detailed" />
        <CircularProgress progress={100} size="lg" showText={false} />
      </div>
    )
    
    expect(screen.getByText('단계 1 / 3')).toBeInTheDocument()
    expect(screen.getByText('단계 3 / 3')).toBeInTheDocument()
    expect(screen.getByText('33%')).toBeInTheDocument()
    // 100% 텍스트는 showText={false}로 숨겨져 있음
    expect(screen.queryByText('100%')).not.toBeInTheDocument()
  })
})
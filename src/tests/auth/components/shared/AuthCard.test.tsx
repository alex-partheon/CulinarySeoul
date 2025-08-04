import { render, screen } from '@testing-library/react'
import { User, Shield, Settings } from 'lucide-react'
import { AuthCard, AuthCardHeader, AuthCardFooter } from '../../../../components/auth/shared/AuthCard'

describe('AuthCard 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트', () => {
    it('기본 variant로 AuthCard가 정상적으로 렌더링된다', () => {
      render(
        <AuthCard>
          <div>테스트 내용</div>
        </AuthCard>
      )
      
      const content = screen.getByText('테스트 내용')
      expect(content).toBeInTheDocument()
    })

    it('children이 정상적으로 표시된다', () => {
      const testContent = '인증 카드 내용 테스트'
      render(
        <AuthCard>
          <p data-testid="card-content">{testContent}</p>
        </AuthCard>
      )
      
      expect(screen.getByTestId('card-content')).toHaveTextContent(testContent)
    })

    it('커스텀 className이 적용된다', () => {
      const customClass = 'custom-auth-card'
      render(
        <AuthCard className={customClass}>
          <div data-testid="test-content">테스트 내용</div>
        </AuthCard>
      )
      
      // 커스텀 클래스가 적용되었는지 확인
      const container = document.querySelector(`.${customClass}`)
      expect(container).toBeInTheDocument()
    })
  })

  describe('Variant 테스트', () => {
    it('default variant가 렌더링된다', () => {
      render(
        <AuthCard variant="default">
          <div data-testid="default-content">Default Card</div>
        </AuthCard>
      )
      
      expect(screen.getByTestId('default-content')).toBeInTheDocument()
    })

    it('elevated variant가 렌더링된다', () => {
      render(
        <AuthCard variant="elevated">
          <div data-testid="elevated-content">Elevated Card</div>
        </AuthCard>
      )
      
      expect(screen.getByTestId('elevated-content')).toBeInTheDocument()
    })

    it('elevated variant가 반사 효과 요소를 렌더링한다', () => {
      render(
        <AuthCard variant="elevated">
          <div>Elevated Card</div>
        </AuthCard>
      )
      
      // elevated variant는 반사 효과를 위한 추가 요소를 렌더링
      expect(screen.getByText('Elevated Card')).toBeInTheDocument()
    })

    it('minimal variant가 렌더링된다', () => {
      render(
        <AuthCard variant="minimal">
          <div data-testid="minimal-content">Minimal Card</div>
        </AuthCard>
      )
      
      expect(screen.getByTestId('minimal-content')).toBeInTheDocument()
    })
  })

  describe('접근성 테스트', () => {
    it('스크린 리더가 내용을 읽을 수 있다', () => {
      render(
        <AuthCard>
          <h2>로그인</h2>
          <p>계정에 로그인하세요</p>
        </AuthCard>
      )
      
      expect(screen.getByText('로그인')).toBeInTheDocument()
      expect(screen.getByText('계정에 로그인하세요')).toBeInTheDocument()
    })

    it('중첩된 내용의 구조가 올바르게 유지된다', () => {
      render(
        <AuthCard>
          <div className="relative z-10">
            <form>
              <input type="email" placeholder="이메일" />
              <input type="password" placeholder="비밀번호" />
              <button type="submit">로그인</button>
            </form>
          </div>
        </AuthCard>
      )
      
      expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
    })
  })
})

describe('AuthCardHeader 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트', () => {
    it('제목만 있는 헤더가 정상적으로 렌더링된다', () => {
      const title = '회원가입'
      render(<AuthCardHeader title={title} />)
      
      expect(screen.getByText(title)).toBeInTheDocument()
    })

    it('제목과 부제목이 함께 렌더링된다', () => {
      const title = '로그인'
      const subtitle = '계정에 로그인해주세요'
      render(<AuthCardHeader title={title} subtitle={subtitle} />)
      
      expect(screen.getByText(title)).toBeInTheDocument()
      expect(screen.getByText(subtitle)).toBeInTheDocument()
    })

    it('아이콘이 포함된 헤더가 정상적으로 렌더링된다', () => {
      const title = '보안 설정'
      const subtitle = '계정 보안을 강화하세요'
      render(
        <AuthCardHeader 
          title={title} 
          subtitle={subtitle}
          icon={<Shield />}
        />
      )
      
      // 아이콘이 있을 때 아이콘 컨테이너가 생성되는지 확인
      const iconContainer = document.querySelector('.w-12.h-12.rounded-xl')
      expect(iconContainer).toBeInTheDocument()
      expect(screen.getByText(title)).toBeInTheDocument()
      expect(screen.getByText(subtitle)).toBeInTheDocument()
    })

    it('커스텀 className이 적용된다', () => {
      const customClass = 'custom-header'
      render(
        <AuthCardHeader 
          title="테스트 제목" 
          className={customClass}
        />
      )
      
      const container = document.querySelector(`.${customClass}`)
      expect(container).toBeInTheDocument()
    })
  })

  describe('아이콘 테스트', () => {
    it('아이콘이 포함된 헤더가 아이콘 컨테이너를 렌더링한다', () => {
      render(
        <AuthCardHeader 
          title="테스트 제목" 
          icon={<div data-testid="test-icon">아이콘</div>}
        />
      )
      
      // 아이콘이 렌더링되는지 확인
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
      expect(screen.getByText('테스트 제목')).toBeInTheDocument()
      
      // 아이콘 컨테이너가 렌더링되는지 확인
      const iconContainer = document.querySelector('.w-12.h-12.rounded-xl')
      expect(iconContainer).toBeInTheDocument()
    })

    it('아이콘이 없을 때 아이콘 영역이 렌더링되지 않는다', () => {
      render(<AuthCardHeader title="아이콘 없는 헤더" />)
      
      expect(screen.getByText('아이콘 없는 헤더')).toBeInTheDocument()
      
      // 아이콘 컨테이너가 없는지 확인
      const iconContainer = document.querySelector('.w-12.h-12.rounded-xl')
      expect(iconContainer).not.toBeInTheDocument()
    })
  })

  describe('접근성 테스트', () => {
    it('제목이 올바른 시맨틱 태그로 렌더링된다', () => {
      render(<AuthCardHeader title="접근성 테스트 제목" />)
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('접근성 테스트 제목')
    })

    it('부제목이 적절한 구조로 렌더링된다', () => {
      render(
        <AuthCardHeader 
          title="메인 제목" 
          subtitle="부제목 설명" 
        />
      )
      
      const subtitle = screen.getByText('부제목 설명')
      expect(subtitle.tagName).toBe('P')
    })
  })
})

describe('AuthCardFooter 컴포넌트 테스트', () => {
  describe('기본 렌더링 테스트', () => {
    it('푸터가 정상적으로 렌더링된다', () => {
      const footerContent = '이미 계정이 있으신가요?'
      render(
        <AuthCardFooter>
          <p>{footerContent}</p>
        </AuthCardFooter>
      )
      
      expect(screen.getByText(footerContent)).toBeInTheDocument()
    })

    it('푸터가 적절한 구조를 가진다', () => {
      render(
        <AuthCardFooter>
          <div data-testid="footer-content">푸터 내용</div>
        </AuthCardFooter>
      )
      
      expect(screen.getByTestId('footer-content')).toBeInTheDocument()
    })

    it('커스텀 className이 적용된다', () => {
      const customClass = 'custom-footer'
      render(
        <AuthCardFooter className={customClass}>
          <div data-testid="footer-content">푸터 내용</div>
        </AuthCardFooter>
      )
      
      const container = document.querySelector(`.${customClass}`)
      expect(container).toBeInTheDocument()
    })
  })

  describe('복잡한 내용 테스트', () => {
    it('링크와 버튼이 포함된 푸터가 올바르게 렌더링된다', () => {
      render(
        <AuthCardFooter>
          <div className="flex justify-between">
            <button>도움말</button>
            <a href="/terms">이용약관</a>
          </div>
        </AuthCardFooter>
      )
      
      expect(screen.getByRole('button', { name: '도움말' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '이용약관' })).toBeInTheDocument()
    })

    it('여러 줄 푸터 내용이 올바르게 렌더링된다', () => {
      render(
        <AuthCardFooter>
          <div>
            <p>계정이 없으신가요?</p>
            <button>회원가입하기</button>
          </div>
        </AuthCardFooter>
      )
      
      expect(screen.getByText('계정이 없으신가요?')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '회원가입하기' })).toBeInTheDocument()
    })
  })

  describe('접근성 테스트', () => {
    it('푸터 내 상호작용 요소들이 접근 가능하다', () => {
      render(
        <AuthCardFooter>
          <nav>
            <a href="/privacy">개인정보처리방침</a>
            <a href="/support">고객지원</a>
          </nav>
        </AuthCardFooter>
      )
      
      expect(screen.getByRole('link', { name: '개인정보처리방침' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '고객지원' })).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })
})

describe('AuthCard 통합 테스트', () => {
  it('전체 인증 카드 구조가 올바르게 조합된다', () => {
    render(
      <AuthCard variant="elevated">
        <AuthCardHeader 
          title="회원가입"
          subtitle="새 계정을 만들어보세요"
        />
        
        <form data-testid="signup-form">
          <input type="email" placeholder="이메일" />
          <input type="password" placeholder="비밀번호" />
          <button type="submit">가입하기</button>
        </form>
        
        <AuthCardFooter>
          <p>이미 계정이 있으신가요? <a href="/login">로그인</a></p>
        </AuthCardFooter>
      </AuthCard>
    )
    
    // 헤더 확인
    expect(screen.getByText('회원가입')).toBeInTheDocument()
    expect(screen.getByText('새 계정을 만들어보세요')).toBeInTheDocument()
    
    // 폼 확인
    expect(screen.getByTestId('signup-form')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '가입하기' })).toBeInTheDocument()
    
    // 푸터 확인
    expect(screen.getByText('이미 계정이 있으신가요?')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument()
  })

  it('다양한 variant 조합이 올바르게 작동한다', () => {
    const variants: Array<'default' | 'elevated' | 'minimal'> = ['default', 'elevated', 'minimal']
    
    variants.forEach(variant => {
      const { unmount } = render(
        <AuthCard variant={variant}>
          <AuthCardHeader title={`${variant} 카드`} />
          <div>내용</div>
          <AuthCardFooter>
            <div>푸터</div>
          </AuthCardFooter>
        </AuthCard>
      )
      
      expect(screen.getByText(`${variant} 카드`)).toBeInTheDocument()
      expect(screen.getByText('내용')).toBeInTheDocument()
      expect(screen.getByText('푸터')).toBeInTheDocument()
      
      unmount()
    })
  })
})
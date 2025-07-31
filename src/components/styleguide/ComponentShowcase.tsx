import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { Skeleton } from '../ui/skeleton'
import { Toggle } from '../ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { UserMenu } from '../ui/user-menu'
import { Navigation } from '../ui/navigation'
import { Sidebar, MobileSidebar } from '../ui/sidebar'
import { Home, Settings, FileText, Package, ShoppingBag, BarChart, Users } from 'lucide-react'

export function ComponentShowcase() {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">컴포넌트 쇼케이스</h2>
        <p className="text-muted-foreground">
          CulinarySeoul 디자인 시스템의 모든 UI 컴포넌트와 그 변형들을 확인할 수 있습니다.
        </p>
      </div>

      {/* Buttons */}
      <div>
        <h3 className="text-xl font-semibold mb-4">버튼 (Buttons)</h3>
        <div className="space-y-6">
          {/* Button Variants */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">버튼 변형</h4>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </Card>

          {/* Button Sizes */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">버튼 크기</h4>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Button>
            </div>
          </Card>

          {/* Button States */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">버튼 상태</h4>
            <div className="flex flex-wrap gap-3">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button className="opacity-50 cursor-not-allowed">Loading State</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Cards */}
      <div>
        <h3 className="text-xl font-semibold mb-4">카드 (Cards)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>기본 카드</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                기본 카드 스타일입니다. 가장 일반적으로 사용됩니다.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>그림자 카드</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                그림자가 적용된 카드입니다. 강조가 필요한 콘텐츠에 사용합니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary border-2">
            <CardHeader>
              <CardTitle>강조 카드</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Primary 색상 테두리로 강조된 카드입니다.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardHeader>
              <CardTitle>배경 변형 카드</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                다른 배경색을 사용하는 카드입니다.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>컬러 카드</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">
                Primary 색상으로 배경을 채운 카드입니다.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-secondary text-secondary-foreground">
            <CardHeader>
              <CardTitle>Secondary 카드</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">
                Secondary 색상으로 배경을 채운 카드입니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-xl font-semibold mb-4">배지 (Badges)</h3>
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">배지 변형</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">상태 배지 예시</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="bg-green-500">활성</Badge>
                <Badge variant="secondary">대기</Badge>
                <Badge variant="outline">보류</Badge>
                <Badge variant="destructive">비활성</Badge>
                <Badge variant="outline" className="border-orange-500 text-orange-500">경고</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Form Elements */}
      <div>
        <h3 className="text-xl font-semibold mb-4">폼 요소 (Form Elements)</h3>
        <div className="space-y-6">
          {/* Input Fields */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">입력 필드</h4>
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="normal-input">기본 입력</Label>
                <Input 
                  id="normal-input"
                  placeholder="텍스트를 입력하세요"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="disabled-input">비활성 입력</Label>
                <Input 
                  id="disabled-input"
                  placeholder="비활성 상태"
                  disabled
                />
              </div>
              
              <div>
                <Label htmlFor="error-input">오류 상태 입력</Label>
                <Input 
                  id="error-input"
                  placeholder="오류가 있는 입력"
                  className="border-destructive focus:ring-destructive"
                />
                <p className="text-sm text-destructive mt-1">이 필드는 필수입니다.</p>
              </div>
            </div>
          </Card>

          {/* Textarea */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">텍스트 영역</h4>
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="textarea">기본 텍스트 영역</Label>
                <Textarea
                  id="textarea"
                  placeholder="여러 줄의 텍스트를 입력하세요"
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="disabled-textarea">비활성 텍스트 영역</Label>
                <Textarea
                  id="disabled-textarea"
                  placeholder="비활성 상태"
                  disabled
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Select */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">선택 메뉴</h4>
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="select">기본 선택</Label>
                <Select>
                  <SelectTrigger id="select">
                    <SelectValue placeholder="옵션을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">옵션 1</SelectItem>
                    <SelectItem value="option2">옵션 2</SelectItem>
                    <SelectItem value="option3">옵션 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="disabled-select">비활성 선택</Label>
                <Select disabled>
                  <SelectTrigger id="disabled-select">
                    <SelectValue placeholder="비활성 상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">비활성 옵션</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Interactive States */}
      <div>
        <h3 className="text-xl font-semibold mb-4">인터랙션 상태</h3>
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">호버 상태</h4>
              <p className="text-sm text-muted-foreground mb-3">
                아래 요소들에 마우스를 올려보세요:
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                  호버 효과 버튼
                </Button>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="text-sm">호버 시 그림자 변화</p>
                </Card>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">포커스 상태</h4>
              <p className="text-sm text-muted-foreground mb-3">
                아래 입력 필드를 클릭해보세요:
              </p>
              <div className="max-w-md">
                <Input 
                  placeholder="포커스 링 효과를 확인하세요"
                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">활성 상태</h4>
              <div className="flex flex-wrap gap-3">
                <Button className="active:scale-95 transition-transform">
                  클릭 시 축소 효과
                </Button>
                <Button variant="outline" className="active:bg-muted">
                  클릭 시 배경 변화
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* New UI Components */}
      <div>
        <h3 className="text-xl font-semibold mb-4">추가 UI 컴포넌트</h3>
        <div className="space-y-6">
          {/* Avatar & User Menu */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">아바타 & 사용자 메뉴</h4>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">김</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-secondary text-secondary-foreground">이</AvatarFallback>
                </Avatar>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">사용자 메뉴 드롭다운:</p>
                <UserMenu 
                  user={{
                    name: "김철수",
                    email: "kim@culinaryseoul.com"
                  }}
                  onSignOut={() => alert('로그아웃')}
                />
              </div>
            </div>
          </Card>

          {/* Tooltips */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">툴팁</h4>
            <TooltipProvider>
              <div className="flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">기본 툴팁</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>이것은 기본 툴팁입니다</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary">상단 툴팁</Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>상단에 표시되는 툴팁</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost">긴 내용 툴팁</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>더 많은 정보를 포함하는<br />여러 줄의 툴팁 내용</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </Card>

          {/* Toggle */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">토글 버튼</h4>
            <div className="flex gap-4">
              <Toggle>기본 토글</Toggle>
              <Toggle variant="outline">아웃라인 토글</Toggle>
              <Toggle size="sm">작은 토글</Toggle>
              <Toggle size="lg">큰 토글</Toggle>
            </div>
          </Card>

          {/* Separator */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">구분선</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">가로 구분선</p>
                <Separator />
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm">세로 구분선</p>
                <Separator orientation="vertical" className="h-8" />
                <p className="text-sm">텍스트 사이</p>
              </div>
            </div>
          </Card>

          {/* Skeleton */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">스켈레톤 (로딩 상태)</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </div>
          </Card>

          {/* Scroll Area */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">스크롤 영역</h4>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">스크롤 항목 {i + 1}</p>
                      <p className="text-xs text-muted-foreground">스크롤 가능한 콘텐츠 예시입니다</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Navigation & Sidebar */}
      <div>
        <h3 className="text-xl font-semibold mb-4">네비게이션 & 사이드바</h3>
        <div className="space-y-6">
          {/* Navigation */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">상단 네비게이션</CardTitle>
            </CardHeader>
            <Navigation
              title="CulinarySeoul"
              items={[
                { id: 'home', name: '홈' },
                { id: 'menu', name: '메뉴' },
                { id: 'about', name: '소개' },
                { id: 'contact', name: '문의' }
              ]}
              activeItem="home"
              sticky={false}
              className="rounded-b-lg"
            />
          </Card>

          {/* Sidebar */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">사이드바</h4>
            <div className="flex gap-4">
              <div className="w-64 h-[400px] border rounded-lg overflow-hidden">
                <Sidebar
                  navigation={[
                    {
                      name: '대시보드',
                      href: '#',
                      icon: <Home className="w-5 h-5" />
                    },
                    {
                      name: '주문 관리',
                      href: '#',
                      icon: <ShoppingBag className="w-5 h-5" />
                    },
                    {
                      name: '재고 관리',
                      href: '#',
                      icon: <Package className="w-5 h-5" />
                    },
                    {
                      name: '분석',
                      href: '#',
                      icon: <BarChart className="w-5 h-5" />
                    },
                    {
                      name: '시스템 설정',
                      href: '#',
                      icon: <Settings className="w-5 h-5" />,
                      subMenu: [
                        { name: '사용자 관리', href: '#' },
                        { name: '권한 설정', href: '#' },
                        { name: '시스템 로그', href: '#' }
                      ]
                    }
                  ]}
                  collapsible={true}
                  currentPath="#"
                />
              </div>
              <div className="flex-1 p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  사이드바는 대시보드 레이아웃에서 주로 사용됩니다.<br /><br />
                  • 접기/펼치기 기능<br />
                  • 서브메뉴 지원<br />
                  • 현재 경로 하이라이팅<br />
                  • 모바일 반응형
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Layout Components */}
      <div>
        <h3 className="text-xl font-semibold mb-4">레이아웃 컴포넌트</h3>
        <div className="space-y-4">
          <Card className="p-6">
            <h4 className="font-medium mb-4">그리드 레이아웃</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">그리드 항목 1</p>
              </div>
              <div className="bg-secondary/10 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">그리드 항목 2</p>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">그리드 항목 3</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-medium mb-4">플렉스 레이아웃</h4>
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="bg-primary/10 px-4 py-2 rounded">항목 A</div>
              <div className="bg-secondary/10 px-4 py-2 rounded">항목 B</div>
              <div className="bg-accent/10 px-4 py-2 rounded">항목 C</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Usage Guidelines */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">컴포넌트 사용 가이드</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">버튼 사용법</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Primary: 주요 액션 (저장, 제출)</li>
                <li>• Secondary: 보조 액션 (취소, 재설정)</li>
                <li>• Outline: 대안 액션</li>
                <li>• Ghost: 최소한의 액션</li>
                <li>• Destructive: 삭제, 위험한 액션</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">카드 사용법</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 기본: 일반적인 콘텐츠 그룹화</li>
                <li>• 그림자: 강조가 필요한 콘텐츠</li>
                <li>• 컬러: 특별한 상태나 카테고리</li>
                <li>• 테두리: 중요한 정보 강조</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">접근성 고려사항</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 모든 인터랙티브 요소는 키보드로 접근 가능</li>
              <li>• 충분한 색상 대비 유지 (4.5:1 이상)</li>
              <li>• 포커스 상태 명확히 표시</li>
              <li>• 의미있는 HTML 요소 사용</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
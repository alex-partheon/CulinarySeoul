import React from 'react';
import { useTheme, useThemeColors } from '@/hooks/useTheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ThemeSelector } from './ThemeSelector';
import { Info } from 'lucide-react';

export function ThemeDemo() {
  const { theme } = useTheme();
  const colors = useThemeColors();

  return (
    <div className="space-y-8 p-8">
      {/* Theme Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>테마 시스템 데모</CardTitle>
              <CardDescription>
                CulinarySeoul의 브랜드 테마 시스템과 접근성 기능을 확인하세요
              </CardDescription>
            </div>
            <ThemeSelector />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">현재 설정</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">테마: {theme.name}</Badge>
                <Badge variant="outline">모드: {theme.mode === 'dark' ? '다크' : '라이트'}</Badge>
                <Badge variant="outline">
                  고대비: {theme.accessibility.highContrast ? '켜짐' : '꺼짐'}
                </Badge>
                <Badge variant="outline">
                  모션 감소: {theme.accessibility.reducedMotion ? '켜짐' : '꺼짐'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>색상 팔레트</CardTitle>
          <CardDescription>현재 테마의 색상 시스템</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Primary Colors */}
            <ColorSwatch 
              name="Primary" 
              color={colors.primary}
              textColor={colors['primary-foreground']}
            />
            <ColorSwatch 
              name="Secondary" 
              color={colors.secondary}
              textColor={colors['secondary-foreground']}
            />
            <ColorSwatch 
              name="Accent" 
              color={colors.accent}
              textColor={colors['accent-foreground']}
            />
            <ColorSwatch 
              name="Destructive" 
              color={colors.destructive}
              textColor={colors['destructive-foreground']}
            />
            
            {/* Background Colors */}
            <ColorSwatch 
              name="Background" 
              color={colors.background}
              textColor={colors.foreground}
              border
            />
            <ColorSwatch 
              name="Card" 
              color={colors.card}
              textColor={colors['card-foreground']}
              border
            />
            <ColorSwatch 
              name="Muted" 
              color={colors.muted}
              textColor={colors['muted-foreground']}
            />
            <ColorSwatch 
              name="Border" 
              color={colors.border}
              textColor={colors.foreground}
              border
            />
          </div>
        </CardContent>
      </Card>

      {/* Interactive Components */}
      <Card>
        <CardHeader>
          <CardTitle>인터랙티브 컴포넌트</CardTitle>
          <CardDescription>다양한 상태의 UI 컴포넌트를 확인하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons */}
          <div>
            <h3 className="text-sm font-medium mb-3">버튼</h3>
            <div className="flex flex-wrap gap-2">
              <Button>기본 버튼</Button>
              <Button variant="secondary">보조 버튼</Button>
              <Button variant="destructive">삭제</Button>
              <Button variant="outline">아웃라인</Button>
              <Button variant="ghost">고스트</Button>
              <Button variant="link">링크</Button>
              <Button disabled>비활성화</Button>
            </div>
          </div>

          {/* Form Elements */}
          <div>
            <h3 className="text-sm font-medium mb-3">폼 요소</h3>
            <div className="grid gap-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="input-demo">입력 필드</Label>
                <Input id="input-demo" placeholder="텍스트를 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="input-focus">포커스 테스트 (Tab 키 사용)</Label>
                <Input id="input-focus" placeholder="키보드 탐색을 테스트하세요" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div>
            <h3 className="text-sm font-medium mb-3">탭</h3>
            <Tabs defaultValue="tab1" className="max-w-md">
              <TabsList>
                <TabsTrigger value="tab1">탭 1</TabsTrigger>
                <TabsTrigger value="tab2">탭 2</TabsTrigger>
                <TabsTrigger value="tab3">탭 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    첫 번째 탭의 내용입니다.
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    두 번째 탭의 내용입니다.
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    세 번째 탭의 내용입니다.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Alerts */}
          <div>
            <h3 className="text-sm font-medium mb-3">알림</h3>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>접근성 팁</AlertTitle>
              <AlertDescription>
                Tab 키를 사용하여 요소 간 이동을 테스트하고, 
                고대비 모드를 켜서 가시성을 확인해보세요.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Features */}
      <Card>
        <CardHeader>
          <CardTitle>접근성 기능</CardTitle>
          <CardDescription>WCAG AA 준수를 위한 접근성 기능들</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium mb-2">키보드 탐색</h3>
              <p className="text-sm text-muted-foreground">
                모든 인터랙티브 요소는 키보드로 접근 가능하며, 
                포커스 인디케이터가 명확하게 표시됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">고대비 모드</h3>
              <p className="text-sm text-muted-foreground">
                시각적 대비를 높여 저시력 사용자의 가독성을 향상시킵니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">모션 감소</h3>
              <p className="text-sm text-muted-foreground">
                애니메이션과 트랜지션을 제거하여 모션에 민감한 사용자를 배려합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">스크린 리더 지원</h3>
              <p className="text-sm text-muted-foreground">
                ARIA 레이블과 시맨틱 마크업으로 스크린 리더 사용자를 지원합니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screen Reader Only Content Demo */}
      <div className="sr-only" role="status" aria-live="polite">
        이 메시지는 스크린 리더 사용자에게만 들립니다.
      </div>
    </div>
  );
}

interface ColorSwatchProps {
  name: string;
  color: string;
  textColor: string;
  border?: boolean;
}

function ColorSwatch({ name, color, textColor, border }: ColorSwatchProps) {
  return (
    <div className="space-y-2">
      <div 
        className={`h-16 rounded-md flex items-center justify-center text-sm font-medium ${
          border ? 'border-2' : ''
        }`}
        style={{ 
          backgroundColor: color,
          color: textColor,
          borderColor: border ? 'var(--color-border)' : undefined
        }}
      >
        {name}
      </div>
      <p className="text-xs text-muted-foreground text-center">{color}</p>
    </div>
  );
}
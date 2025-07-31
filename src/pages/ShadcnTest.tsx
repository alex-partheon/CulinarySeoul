import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ShadcnTest() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">shadcn/ui 테스트 페이지</h1>
        <p className="text-muted-foreground">shadcn/ui 컴포넌트들이 정상적으로 작동하는지 확인합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 버튼 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>Button 컴포넌트</CardTitle>
            <CardDescription>다양한 버튼 스타일을 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* 입력 폼 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>Form 컴포넌트</CardTitle>
            <CardDescription>입력 폼 컴포넌트들을 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="이메일을 입력하세요" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" placeholder="이름을 입력하세요" />
            </div>
            <Button className="w-full">제출</Button>
          </CardContent>
        </Card>

        {/* 배지 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>Badge 컴포넌트</CardTitle>
            <CardDescription>다양한 배지 스타일을 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </CardContent>
        </Card>

        {/* 탭 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs 컴포넌트</CardTitle>
            <CardDescription>탭 컴포넌트를 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tab1">탭 1</TabsTrigger>
                <TabsTrigger value="tab2">탭 2</TabsTrigger>
                <TabsTrigger value="tab3">탭 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4">
                <p className="text-sm text-muted-foreground">첫 번째 탭의 내용입니다.</p>
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                <p className="text-sm text-muted-foreground">두 번째 탭의 내용입니다.</p>
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                <p className="text-sm text-muted-foreground">세 번째 탭의 내용입니다.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>설정 완료!</CardTitle>
          <CardDescription>
            shadcn/ui가 성공적으로 설정되었습니다. 모든 컴포넌트가 정상적으로 렌더링되고 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">✅ Tailwind CSS 설정 완료</p>
            <p className="text-sm">✅ shadcn/ui 컴포넌트 설정 완료</p>
            <p className="text-sm">✅ CSS 변수 및 테마 설정 완료</p>
            <p className="text-sm">✅ TypeScript 설정 완료</p>
            <p className="text-sm">✅ Path alias (@/) 설정 완료</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
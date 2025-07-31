import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';

// 데모용 사용자 역할 및 데이터
interface DemoUser {
  id: string;
  role: 'super_admin' | 'company_admin' | 'brand_admin' | 'store_admin';
  name: string;
  companyId?: string;
  brandId?: string;
}

const demoUsers: DemoUser[] = [
  {
    id: 'user-1',
    role: 'super_admin',
    name: '슈퍼 관리자',
    companyId: 'company-1'
  },
  {
    id: 'user-2',
    role: 'company_admin',
    name: '회사 관리자 (CulinarySeoul)',
    companyId: 'company-1'
  },
  {
    id: 'user-3',
    role: 'brand_admin',
    name: '브랜드 관리자 (밀랍)',
    companyId: 'company-1',
    brandId: 'brand-1'
  },
  {
    id: 'user-4',
    role: 'store_admin',
    name: '매장 관리자 (밀랍 성수점)',
    companyId: 'company-1',
    brandId: 'brand-1'
  }
];

function DashboardDemo() {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제 앱에서는 인증 상태를 확인하고 사용자 정보를 로드
    // 데모에서는 기본값으로 회사 관리자 설정
    setCurrentUser(demoUsers[1]);
    setIsLoading(false);
  }, []);

  const handleUserChange = (userId: string) => {
    const user = demoUsers.find(u => u.id === userId);
    setCurrentUser(user || null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>로그인 필요</CardTitle>
            <CardDescription>
              대시보드에 접근하려면 로그인이 필요합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setCurrentUser(demoUsers[1])}>
              데모 로그인
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 데모용 사용자 전환 헤더 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">
              CulinarySeoul 관리 시스템
            </h1>
            <div className="text-sm text-gray-500">
              데모 버전 - 실제 데이터베이스 연결 필요
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="user-select" className="text-sm font-medium">
                사용자 전환:
              </Label>
              <Select value={currentUser.id} onValueChange={handleUserChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {demoUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 대시보드 */}
      <Dashboard
        userRole={currentUser.role}
        userId={currentUser.id}
        companyId={currentUser.companyId}
        brandId={currentUser.brandId}
      />
    </div>
  );
}

export default DashboardDemo;
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Play, 
  Database, 
  Users, 
  Building2, 
  Store as StoreIcon,
  Crown,
  RefreshCw
} from 'lucide-react';
import MainDashboard from '../components/dashboard/MainDashboard';
import { mockCompanies, mockUsers } from '../data/mockData';

function DashboardDemo() {
  const [selectedUserId, setSelectedUserId] = useState<string>('user-2'); // 기본값: 회사 관리자
  const [isDemoMode, setIsDemoMode] = useState(true);

  const selectedUser = mockUsers.find(user => user.id === selectedUserId);
  const company = mockCompanies.find(c => c.id === selectedUser?.company_id);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4" />;
      case 'company_admin': return <Building2 className="h-4 w-4" />;
      case 'brand_manager': return <Users className="h-4 w-4" />;
      case 'store_manager': return <StoreIcon className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return '슈퍼 관리자';
      case 'company_admin': return '회사 관리자';
      case 'brand_manager': return '브랜드 매니저';
      case 'store_manager': return '매장 매니저';
      default: return '사용자';
    }
  };

  if (!selectedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              사용자 선택 필요
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              데모를 시작하려면 사용자를 선택해주세요.
            </p>
            <Button onClick={() => setSelectedUserId('user-2')}>
              기본 사용자로 시작
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 데모 헤더 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">
                  CulinarySeoul 대시보드 데모
                </h1>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Play className="h-3 w-3 mr-1" />
                Mock 데이터 모드
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              {/* 현재 사용자 정보 */}
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
                {getRoleIcon(selectedUser.role)}
                <span className="text-sm font-medium">{selectedUser.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {getRoleLabel(selectedUser.role)}
                </Badge>
              </div>
              
              {/* 사용자 전환 */}
              <div className="flex items-center gap-2">
                <Label htmlFor="user-select" className="text-sm font-medium text-gray-700">
                  사용자 전환:
                </Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span>{user.name}</span>
                          <Badge variant="outline" className="text-xs ml-auto">
                            {getRoleLabel(user.role)}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 새로고침 버튼 */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                새로고침
              </Button>
            </div>
          </div>
          
          {/* 회사 정보 */}
          {company && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>{company.name}</span>
              {selectedUser.brand_id && (
                <>
                  <span>•</span>
                  <span>브랜드 ID: {selectedUser.brand_id}</span>
                </>
              )}
              {selectedUser.store_id && (
                <>
                  <span>•</span>
                  <span>매장 ID: {selectedUser.store_id}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 메인 대시보드 */}
      <div className="container mx-auto px-4 py-6">
        <MainDashboard userId={selectedUserId} />
      </div>
    </div>
  );
}

export default DashboardDemo;
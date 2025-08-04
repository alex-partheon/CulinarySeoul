import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Eye, Clock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { MockDataService } from '@/services/mockDataService';
import type { MockBrand } from '@/data/mockData';

interface BrandApproval {
  id: string;
  brand: MockBrand;
  requested_by: string;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected';
  review_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export default function BrandApprovalsPage() {
  const [selectedApproval, setSelectedApproval] = useState<BrandApproval | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 대기 중인 브랜드 승인 요청 조회
  const { data: pendingApprovals = [], isLoading: isLoadingApprovals } = useQuery({
    queryKey: ['brand-approvals'],
    queryFn: async () => {
      // 실제로는 API 호출
      const brands = await MockDataService.getBrands();
      
      // is_active가 false인 브랜드를 승인 대기로 간주
      return brands
        .filter(brand => !brand.is_active)
        .map(brand => ({
          id: `approval-${brand.id}`,
          brand,
          requested_by: 'admin@company.com',
          requested_at: brand.created_at,
          status: 'pending' as const,
          review_notes: '',
        }));
    }
  });

  // 브랜드 승인
  const approveBrandMutation = useMutation({
    mutationFn: async (approvalId: string) => {
      const brandId = approvalId.replace('approval-', '');
      
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시: 브랜드 활성화
      const brands = await MockDataService.getBrands();
      const brandIndex = brands.findIndex(b => b.id === brandId);
      if (brandIndex !== -1) {
        brands[brandIndex].is_active = true;
      }
      
      return brandId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setIsDetailDialogOpen(false);
      toast({
        title: "브랜드 승인 완료",
        description: "브랜드가 성공적으로 승인되었습니다.",
        duration: 3000,
      });
    }
  });

  // 브랜드 거부
  const rejectBrandMutation = useMutation({
    mutationFn: async ({ approvalId, reason }: { approvalId: string; reason: string }) => {
      const brandId = approvalId.replace('approval-', '');
      
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시: 브랜드 거부 처리 (실제로는 별도의 거부 목록에 추가)
      console.log(`Brand ${brandId} rejected with reason: ${reason}`);
      
      return { brandId, reason };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-approvals'] });
      setIsRejectDialogOpen(false);
      setIsDetailDialogOpen(false);
      setRejectReason('');
      toast({
        title: "브랜드 거부 완료",
        description: "브랜드 승인이 거부되었습니다.",
        duration: 3000,
      });
    }
  });

  const handleApprove = (approval: BrandApproval) => {
    approveBrandMutation.mutate(approval.id);
  };

  const handleReject = (approval: BrandApproval) => {
    setSelectedApproval(approval);
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedApproval || !rejectReason.trim()) return;
    
    rejectBrandMutation.mutate({
      approvalId: selectedApproval.id,
      reason: rejectReason
    });
  };

  const openDetailDialog = (approval: BrandApproval) => {
    setSelectedApproval(approval);
    setIsDetailDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">승인 대기</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">승인됨</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">거부됨</Badge>;
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">브랜드 승인 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          새로 생성된 브랜드의 승인을 관리합니다
        </p>
      </div>

      {isLoadingApprovals ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pendingApprovals.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">승인 대기 브랜드 없음</h3>
              <p className="text-gray-500">현재 승인 대기 중인 브랜드가 없습니다.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
            <Card key={approval.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={approval.brand.logo_url} alt={approval.brand.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        <Building2 className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{approval.brand.name}</CardTitle>
                      <CardDescription>
                        카테고리: {approval.brand.category} • 
                        코드: {approval.brand.code}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(approval.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDetailDialog(approval)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {approval.brand.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    요청일: {new Date(approval.requested_at).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(approval)}
                      disabled={approveBrandMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      승인
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(approval)}
                      disabled={rejectBrandMutation.isPending}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      거부
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 브랜드 상세 정보 다이얼로그 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>브랜드 상세 정보</DialogTitle>
            <DialogDescription>
              브랜드 생성 요청의 상세 정보를 확인합니다.
            </DialogDescription>
          </DialogHeader>
          
          {selectedApproval && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">브랜드명</Label>
                  <p className="text-sm text-gray-900">{selectedApproval.brand.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">영문명</Label>
                  <p className="text-sm text-gray-900">{(selectedApproval.brand as any).english_name || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">카테고리</Label>
                  <p className="text-sm text-gray-900">{selectedApproval.brand.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">담당자</Label>
                  <p className="text-sm text-gray-900">{(selectedApproval.brand as any).manager_name || '-'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">브랜드 코드</Label>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                  {selectedApproval.brand.code}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">설명</Label>
                <p className="text-sm text-gray-900">{selectedApproval.brand.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">로고 URL</Label>
                  <p className="text-sm text-gray-900">
                    {selectedApproval.brand.logo_url || '미지정'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">웹사이트</Label>
                  <p className="text-sm text-gray-900">
                    {selectedApproval.brand.website_url ? (
                      <a href={selectedApproval.brand.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedApproval.brand.website_url}
                      </a>
                    ) : '미지정'}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">도메인</Label>
                <p className="text-sm text-gray-900">
                  {selectedApproval.brand.domain || '미지정'}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">요청일</Label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedApproval.requested_at).toLocaleString()}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">상태</Label>
                <div className="mt-1">
                  {getStatusBadge(selectedApproval.status)}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDetailDialogOpen(false)}
            >
              닫기
            </Button>
            {selectedApproval?.status === 'pending' && (
              <>
                <Button
                  onClick={() => handleReject(selectedApproval)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  disabled={rejectBrandMutation.isPending}
                >
                  거부
                </Button>
                <Button
                  onClick={() => handleApprove(selectedApproval)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={approveBrandMutation.isPending}
                >
                  승인
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 거부 사유 입력 다이얼로그 */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>브랜드 거부</DialogTitle>
            <DialogDescription>
              브랜드 승인을 거부합니다. 거부 사유를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-reason">거부 사유 *</Label>
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="브랜드 승인을 거부하는 이유를 입력하세요..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectReason('');
              }}
            >
              취소
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={rejectBrandMutation.isPending || !rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {rejectBrandMutation.isPending ? "거부 중..." : "거부 확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
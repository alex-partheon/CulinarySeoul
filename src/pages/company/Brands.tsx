import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { BrandService } from '@/domains/brand/brandService';
import type { Brand, CreateBrandRequest, UpdateBrandRequest, BusinessCategory } from '@/domains/brand/types';

const BRAND_CATEGORIES = [
  { value: 'restaurant', label: '레스토랑' },
  { value: 'cafe', label: '카페' },
  { value: 'bakery', label: '베이커리' },
  { value: 'fast_food', label: '패스트푸드' },
  { value: 'fine_dining', label: '파인다이닝' },
  { value: 'bar', label: '바' },
  { value: 'dessert', label: '디저트' },
  { value: 'food_truck', label: '푸드트럭' },
  { value: 'catering', label: '케이터링' },
  { value: 'other', label: '기타' }
];

interface BrandFormData {
  name: string;
  code: string;
  domain: string;
  business_category: BusinessCategory;
  description?: string;
}

export default function BrandsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [brandForm, setBrandForm] = useState<BrandFormData>({
    name: '',
    code: '',
    domain: '',
    business_category: 'restaurant' as BusinessCategory,
    description: ''
  });

  const queryClient = useQueryClient();
  const COMPANY_ID = 'comp-1';

  // 브랜드 목록 조회
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => BrandService.getBrands()
  });

  // 브랜드 생성
  const createBrandMutation = useMutation({
    mutationFn: async (data: BrandFormData) => {
      const createRequest: CreateBrandRequest = {
        company_id: COMPANY_ID,
        name: data.name,
        code: data.code.toUpperCase(),
        domain: data.domain,
        business_category: data.business_category,
        description: data.description,
        is_active: true
      };
      return await BrandService.createBrand(createRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setIsCreateDialogOpen(false);
      setBrandForm({
        name: '',
        code: '',
        domain: '',
        business_category: 'restaurant' as BusinessCategory,
        description: ''
      });
      toast.success('브랜드가 성공적으로 생성되었습니다.');
    },
    onError: (error: any) => {
      toast.error(`브랜드 생성 실패: ${error.message}`);
    }
  });

  const handleCreateBrand = () => {
    if (!brandForm.name || !brandForm.code || !brandForm.domain) {
      toast.error('필수 필드를 모두 입력해주세요.');
      return;
    }
    createBrandMutation.mutate(brandForm);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">브랜드 관리</h1>
        </div>
        <div className="text-center py-8">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">브랜드 관리</h1>
          <p className="mt-1 text-sm text-gray-500">
            브랜드를 등록하고 관리합니다. 새 브랜드는 슈퍼어드민 승인 후 활성화됩니다.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          새 브랜드 추가
        </Button>
      </div>

      {/* 브랜드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Card key={brand.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{brand.name}</CardTitle>
                <Badge variant={brand.is_active ? "default" : "secondary"}>
                  {brand.is_active ? "활성" : "대기"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                {brand.description}
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">코드:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {brand.code}
                  </span>
                </div>
                {brand.domain && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">도메인:</span>
                    <span className="text-blue-600">
                      {brand.domain}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 브랜드 생성 다이얼로그 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>새 브랜드 추가</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">브랜드명 *</Label>
              <Input
                id="name"
                value={brandForm.name}
                onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                placeholder="브랜드명을 입력하세요"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">브랜드 코드 *</Label>
              <Input
                id="code"
                value={brandForm.code}
                onChange={(e) => setBrandForm({ ...brandForm, code: e.target.value })}
                placeholder="BRAND_CODE"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain">도메인 *</Label>
              <Input
                id="domain"
                value={brandForm.domain}
                onChange={(e) => setBrandForm({ ...brandForm, domain: e.target.value })}
                placeholder="example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">업종 카테고리</Label>
              <Select
                value={brandForm.business_category}
                onValueChange={(value) => setBrandForm({ ...brandForm, business_category: value as BusinessCategory })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="업종을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {BRAND_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={brandForm.description}
                onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                placeholder="브랜드 설명을 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              취소
            </Button>
            <Button 
              onClick={handleCreateBrand}
              disabled={createBrandMutation.isPending}
            >
              {createBrandMutation.isPending ? "생성 중..." : "생성하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
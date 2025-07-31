import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { BusinessCategory } from '../../domains/brand/types';
import type { Brand } from '../../domains/types';
import { brandService } from '../../domains/brand/brandService';

interface CategoryManagementProps {
  brands: Brand[];
  onDataUpdate: () => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ brands, onDataUpdate }) => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [newCategory, setNewCategory] = useState<BusinessCategory>(BusinessCategory.CAFE);
  const [newDescription, setNewDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 업종별 브랜드 그룹화
  const brandsByCategory = brands.reduce((acc, brand) => {
    const category = brand.business_category || BusinessCategory.OTHER;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(brand);
    return acc;
  }, {} as Record<BusinessCategory, Brand[]>);

  // 업종 카테고리 한글 이름 매핑
  const categoryNames: Record<BusinessCategory, string> = {
    [BusinessCategory.CAFE]: '카페',
    [BusinessCategory.RESTAURANT]: '레스토랑',
    [BusinessCategory.BAKERY]: '베이커리',
    [BusinessCategory.FAST_FOOD]: '패스트푸드',
    [BusinessCategory.FINE_DINING]: '파인다이닝',
    [BusinessCategory.BAR]: '바/주점',
    [BusinessCategory.DESSERT]: '디저트',
    [BusinessCategory.FOOD_TRUCK]: '푸드트럭',
    [BusinessCategory.CATERING]: '케이터링',
    [BusinessCategory.OTHER]: '기타'
  };

  const handleUpdateCategory = async () => {
    if (!selectedBrand) return;

    try {
      setIsUpdating(true);
      await brandService.updateBrand(selectedBrand.id, {
        business_category: newCategory,
        description: newDescription || selectedBrand.description
      });
      
      setIsDialogOpen(false);
      setSelectedBrand(null);
      setNewDescription('');
      onDataUpdate();
    } catch (error) {
      console.error('Failed to update brand category:', error);
      alert('브랜드 카테고리 업데이트에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditDialog = (brand: Brand) => {
    setSelectedBrand(brand);
    setNewCategory(brand.business_category || BusinessCategory.OTHER);
    setNewDescription(brand.description || '');
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>업종 카테고리 관리</CardTitle>
          <CardDescription>
            브랜드별 업종 카테고리를 관리하고 수정할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {Object.entries(categoryNames).map(([category, name]) => {
              const categoryBrands = brandsByCategory[category as BusinessCategory] || [];
              
              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <Badge variant="secondary">{categoryBrands.length}개 브랜드</Badge>
                  </div>
                  
                  {categoryBrands.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {categoryBrands.map((brand) => (
                        <Card key={brand.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">{brand.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {brand.code}
                              </p>
                              {brand.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {brand.description}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(brand)}
                            >
                              수정
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4">
                      이 카테고리에 속한 브랜드가 없습니다.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 카테고리 수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>브랜드 카테고리 수정</DialogTitle>
            <DialogDescription>
              {selectedBrand?.name}의 업종 카테고리와 설명을 수정합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">업종 카테고리</Label>
              <Select
                value={newCategory}
                onValueChange={(value) => setNewCategory(value as BusinessCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryNames).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">브랜드 설명</Label>
              <Textarea
                id="description"
                placeholder="브랜드에 대한 설명을 입력하세요"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isUpdating}
            >
              취소
            </Button>
            <Button
              onClick={handleUpdateCategory}
              disabled={isUpdating}
            >
              {isUpdating ? '업데이트 중...' : '업데이트'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
export type { CategoryManagementProps };
// TASK-006: 원재료 관리 도메인 서비스
// Domain-Driven Design 패턴 적용

import { SupabaseClient } from '@supabase/supabase-js';
import {
  RawMaterial,
  CreateRawMaterialDto,
  UpdateRawMaterialDto,
  InventoryFilter,
  InventoryCategory,
  Unit,
  StorageConditions,
  QualitySpecification,
  Money
} from './types';

/**
 * 원재료 마스터 데이터 관리 서비스
 * 원재료 등록, 수정, 조회, 삭제 및 카테고리 관리
 */
export class RawMaterialService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * 새로운 원재료 등록
   * @param materialData 원재료 등록 정보
   * @returns 등록된 원재료 정보
   */
  async createRawMaterial(materialData: CreateRawMaterialDto): Promise<RawMaterial> {
    try {
      // 중복 이름 체크
      const { data: existing } = await this.supabase
        .from('raw_materials')
        .select('id')
        .eq('name', materialData.name)
        .eq('is_active', true)
        .single();

      if (existing) {
        throw new Error(`원재료 '${materialData.name}'이 이미 존재합니다.`);
      }

      // 기본값 설정
      const newMaterial = {
        name: materialData.name,
        description: materialData.description,
        category: materialData.category,
        unit: materialData.unit,
        minimum_stock_level: materialData.minimumStockLevel || 0,
        maximum_stock_level: materialData.maximumStockLevel,
        reorder_point: materialData.reorderPoint || 0,
        standard_cost: materialData.standardCost || { amount: 0, currency: 'KRW' },
        nutritional_info: materialData.nutritionalInfo,
        storage_conditions: materialData.storageConditions,
        quality_specifications: materialData.qualitySpecifications,
        supplier_info: materialData.supplierInfo,
        is_active: true
      };

      const { data, error } = await this.supabase
        .from('raw_materials')
        .insert(newMaterial)
        .select()
        .single();

      if (error) {
        throw new Error(`원재료 등록 실패: ${error.message}`);
      }

      return this.mapToRawMaterial(data);
    } catch (error) {
      console.error('Error creating raw material:', error);
      throw error;
    }
  }

  /**
   * 원재료 정보 수정
   * @param id 원재료 ID
   * @param updateData 수정할 정보
   * @returns 수정된 원재료 정보
   */
  async updateRawMaterial(
    id: string,
    updateData: UpdateRawMaterialDto
  ): Promise<RawMaterial> {
    try {
      // 존재 여부 확인
      const { data: existing } = await this.supabase
        .from('raw_materials')
        .select('id')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (!existing) {
        throw new Error('원재료를 찾을 수 없습니다.');
      }

      // 이름 중복 체크 (다른 원재료와)
      if (updateData.name) {
        const { data: duplicate } = await this.supabase
          .from('raw_materials')
          .select('id')
          .eq('name', updateData.name)
          .eq('is_active', true)
          .neq('id', id)
          .single();

        if (duplicate) {
          throw new Error(`원재료 '${updateData.name}'이 이미 존재합니다.`);
        }
      }

      const updateFields: any = {};
      if (updateData.name !== undefined) updateFields.name = updateData.name;
      if (updateData.description !== undefined) updateFields.description = updateData.description;
      if (updateData.category !== undefined) updateFields.category = updateData.category;
      if (updateData.unit !== undefined) updateFields.unit = updateData.unit;
      if (updateData.minimumStockLevel !== undefined) updateFields.minimum_stock_level = updateData.minimumStockLevel;
      if (updateData.maximumStockLevel !== undefined) updateFields.maximum_stock_level = updateData.maximumStockLevel;
      if (updateData.reorderPoint !== undefined) updateFields.reorder_point = updateData.reorderPoint;
      if (updateData.standardCost !== undefined) updateFields.standard_cost = updateData.standardCost;
      if (updateData.nutritionalInfo !== undefined) updateFields.nutritional_info = updateData.nutritionalInfo;
      if (updateData.storageConditions !== undefined) updateFields.storage_conditions = updateData.storageConditions;
      if (updateData.qualitySpecifications !== undefined) updateFields.quality_specifications = updateData.qualitySpecifications;
      if (updateData.supplierInfo !== undefined) updateFields.supplier_info = updateData.supplierInfo;

      const { data, error } = await this.supabase
        .from('raw_materials')
        .update(updateFields)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`원재료 수정 실패: ${error.message}`);
      }

      return this.mapToRawMaterial(data);
    } catch (error) {
      console.error('Error updating raw material:', error);
      throw error;
    }
  }

  /**
   * 원재료 삭제 (논리 삭제)
   * @param id 원재료 ID
   * @returns 삭제 성공 여부
   */
  async deleteRawMaterial(id: string): Promise<boolean> {
    try {
      // 재고가 있는지 확인
      const { data: stockCheck } = await this.supabase
        .from('inventory_lots')
        .select('id')
        .eq('material_id', id)
        .eq('status', 'active')
        .gt('available_quantity', 0)
        .limit(1);

      if (stockCheck && stockCheck.length > 0) {
        throw new Error('재고가 있는 원재료는 삭제할 수 없습니다.');
      }

      const { error } = await this.supabase
        .from('raw_materials')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        throw new Error(`원재료 삭제 실패: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting raw material:', error);
      throw error;
    }
  }

  /**
   * 원재료 단일 조회
   * @param id 원재료 ID
   * @returns 원재료 정보
   */
  async getRawMaterialById(id: string): Promise<RawMaterial | null> {
    try {
      const { data, error } = await this.supabase
        .from('raw_materials')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`원재료 조회 실패: ${error.message}`);
      }

      return this.mapToRawMaterial(data);
    } catch (error) {
      console.error('Error getting raw material:', error);
      throw error;
    }
  }

  /**
   * 원재료 목록 조회 (필터링 및 페이징 지원)
   * @param filter 필터 조건
   * @returns 원재료 목록
   */
  async getRawMaterials(filter?: InventoryFilter): Promise<{
    materials: RawMaterial[];
    totalCount: number;
    hasMore: boolean;
  }> {
    try {
      let query = this.supabase
        .from('raw_materials')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      // 필터 적용
      if (filter?.category) {
        query = query.eq('category', filter.category);
      }

      if (filter?.searchTerm) {
        query = query.or(`name.ilike.%${filter.searchTerm}%,description.ilike.%${filter.searchTerm}%`);
      }

      if (filter?.unit) {
        query = query.eq('unit', filter.unit);
      }

      // 정렬
      const sortBy = filter?.sortBy || 'name';
      const sortOrder = filter?.sortOrder || 'asc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // 페이징
      const page = filter?.page || 1;
      const limit = filter?.limit || 50;
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`원재료 목록 조회 실패: ${error.message}`);
      }

      const materials = (data || []).map(item => this.mapToRawMaterial(item));
      const totalCount = count || 0;
      const hasMore = offset + limit < totalCount;

      return {
        materials,
        totalCount,
        hasMore
      };
    } catch (error) {
      console.error('Error getting raw materials:', error);
      throw error;
    }
  }

  /**
   * 카테고리별 원재료 개수 조회
   * @returns 카테고리별 통계
   */
  async getMaterialCountByCategory(): Promise<{
    category: InventoryCategory;
    count: number;
  }[]> {
    try {
      const { data, error } = await this.supabase
        .from('raw_materials')
        .select('category')
        .eq('is_active', true);

      if (error) {
        throw new Error(`카테고리별 통계 조회 실패: ${error.message}`);
      }

      // 카테고리별 집계
      const categoryCount = (data || []).reduce((acc, item) => {
        const category = item.category as InventoryCategory;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<InventoryCategory, number>);

      return Object.entries(categoryCount).map(([category, count]) => ({
        category: category as InventoryCategory,
        count
      }));
    } catch (error) {
      console.error('Error getting category statistics:', error);
      throw error;
    }
  }

  /**
   * 재주문 필요 원재료 조회
   * @param storeId 매장 ID
   * @returns 재주문 필요 원재료 목록
   */
  async getMaterialsNeedingReorder(storeId: string): Promise<{
    material: RawMaterial;
    currentStock: number;
    reorderPoint: number;
    suggestedOrderQuantity: number;
  }[]> {
    try {
      // 매장별 현재 재고량과 재주문점 비교
      const { data, error } = await this.supabase
        .from('raw_materials')
        .select(`
          *,
          inventory_lots!inner(
            available_quantity
          )
        `)
        .eq('is_active', true)
        .eq('inventory_lots.store_id', storeId)
        .eq('inventory_lots.status', 'active')
        .gt('inventory_lots.available_quantity', 0);

      if (error) {
        throw new Error(`재주문 필요 원재료 조회 실패: ${error.message}`);
      }

      const reorderList: {
        material: RawMaterial;
        currentStock: number;
        reorderPoint: number;
        suggestedOrderQuantity: number;
      }[] = [];

      // 원재료별 재고 집계 및 재주문점 비교
      const materialStocks = new Map<string, { material: any; totalStock: number }>();
      
      (data || []).forEach(item => {
        const materialId = item.id;
        if (!materialStocks.has(materialId)) {
          materialStocks.set(materialId, {
            material: item,
            totalStock: 0
          });
        }
        
        const stockInfo = materialStocks.get(materialId)!;
        stockInfo.totalStock += item.inventory_lots.available_quantity;
      });

      // 재주문 필요 여부 판단
      materialStocks.forEach(({ material, totalStock }) => {
        if (totalStock <= material.reorder_point) {
          const suggestedOrderQuantity = Math.max(
            material.maximum_stock_level - totalStock,
            material.minimum_stock_level
          );

          reorderList.push({
            material: this.mapToRawMaterial(material),
            currentStock: totalStock,
            reorderPoint: material.reorder_point,
            suggestedOrderQuantity
          });
        }
      });

      return reorderList.sort((a, b) => 
        (a.currentStock / a.reorderPoint) - (b.currentStock / b.reorderPoint)
      );
    } catch (error) {
      console.error('Error getting materials needing reorder:', error);
      throw error;
    }
  }

  /**
   * 데이터베이스 레코드를 도메인 객체로 변환
   * @param data 데이터베이스 레코드
   * @returns RawMaterial 도메인 객체
   */
  private mapToRawMaterial(data: any): RawMaterial {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category as InventoryCategory,
      unit: data.unit as Unit,
      minimumStockLevel: data.minimum_stock_level,
      maximumStockLevel: data.maximum_stock_level,
      reorderPoint: data.reorder_point,
      standardCost: data.standard_cost as Money,
      nutritionalInfo: data.nutritional_info,
      storageConditions: data.storage_conditions as StorageConditions,
      qualitySpecifications: data.quality_specifications as QualitySpecification,
      supplierInfo: data.supplier_info,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}
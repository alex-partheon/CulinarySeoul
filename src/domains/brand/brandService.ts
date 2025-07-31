// TASK-003: 브랜드 도메인 서비스 레이어 (CRUD API)

import { supabase } from '../../lib/supabase';
import type { Brand, CreateBrandRequest, UpdateBrandRequest, BusinessCategory } from './types';

export class BrandService {
  /**
   * 모든 브랜드 목록 조회
   */
  static async getBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        company:companies(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch brands: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      company_id: item.company_id || '',
      business_category: item.business_category,
      description: item.description,
      brand_settings: item.brand_settings as Record<string, any> || {},
      separation_readiness: item.separation_readiness as Record<string, any> || {}
    })) as Brand[];
  }

  /**
   * 특정 브랜드 조회
   */
  static async getBrandById(id: string): Promise<Brand | null> {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch brand: ${error.message}`);
    }

    return {
      ...data,
      company_id: data.company_id || '',
      business_category: data.business_category,
      description: data.description,
      brand_settings: data.brand_settings as Record<string, any> || {},
      separation_readiness: data.separation_readiness as Record<string, any> || {}
    } as Brand;
  }

  /**
   * 브랜드 코드로 조회
   */
  static async getBrandByCode(code: string): Promise<Brand | null> {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('code', code)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch brand by code: ${error.message}`);
    }

    return {
      ...data,
      company_id: data.company_id || '',
      business_category: data.business_category,
      description: data.description,
      brand_settings: data.brand_settings as Record<string, any> || {},
      separation_readiness: data.separation_readiness as Record<string, any> || {}
    } as Brand;
  }

  /**
   * 회사별 브랜드 목록 조회
   */
  static async getBrandsByCompany(companyId: string): Promise<Brand[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch brands by company: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      company_id: item.company_id || '',
      business_category: item.business_category,
      description: item.description,
      brand_settings: item.brand_settings as Record<string, any> || {},
      separation_readiness: item.separation_readiness as Record<string, any> || {}
    })) as Brand[];
  }

  /**
   * 새 브랜드 생성
   */
  static async createBrand(request: CreateBrandRequest): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .insert({
        company_id: request.company_id,
        name: request.name || '밀랍',
        code: request.code || 'millab',
        domain: request.domain || 'cafe-millab.com',
        business_category: request.business_category,
        description: request.description,
        brand_settings: request.brand_settings || {},
        separation_readiness: request.separation_readiness || {},
        is_active: request.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create brand: ${error.message}`);
    }

    return {
      ...data,
      company_id: data.company_id || '',
      business_category: data.business_category,
      description: data.description,
      brand_settings: data.brand_settings as Record<string, any> || {},
      separation_readiness: data.separation_readiness as Record<string, any> || {}
    } as Brand;
  }

  /**
   * 브랜드 정보 업데이트
   */
  static async updateBrand(id: string, request: UpdateBrandRequest): Promise<Brand> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (request.name !== undefined) updateData.name = request.name;
    if (request.code !== undefined) updateData.code = request.code;
    if (request.domain !== undefined) updateData.domain = request.domain;
    if (request.business_category !== undefined) updateData.business_category = request.business_category;
    if (request.description !== undefined) updateData.description = request.description;
    if (request.brand_settings !== undefined) updateData.brand_settings = request.brand_settings;
    if (request.separation_readiness !== undefined) updateData.separation_readiness = request.separation_readiness;
    if (request.is_active !== undefined) updateData.is_active = request.is_active;

    const { data, error } = await supabase
      .from('brands')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update brand: ${error.message}`);
    }

    return {
      ...data,
      company_id: data.company_id || '',
      business_category: data.business_category,
      description: data.description,
      brand_settings: data.brand_settings as Record<string, any> || {},
      separation_readiness: data.separation_readiness as Record<string, any> || {}
    } as Brand;
  }

  /**
   * 브랜드 삭제
   */
  static async deleteBrand(id: string): Promise<void> {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete brand: ${error.message}`);
    }
  }

  /**
   * 브랜드의 매장 목록 조회
   */
  static async getBrandStores(brandId: string) {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch brand stores: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 브랜드 설정 업데이트
   */
  static async updateBrandSettings(id: string, settings: Record<string, any>): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .update({
        brand_settings: settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update brand settings: ${error.message}`);
    }

    return {
      ...data,
      company_id: data.company_id || '',
      business_category: data.business_category,
      description: data.description,
      brand_settings: data.brand_settings as Record<string, any> || {},
      separation_readiness: data.separation_readiness as Record<string, any> || {}
    } as Brand;
  }

  /**
   * 브랜드 분리 준비도 업데이트
   */
  static async updateSeparationReadiness(id: string, readiness: Record<string, any>): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .update({
        separation_readiness: readiness,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update separation readiness: ${error.message}`);
    }

    return {
      ...data,
      company_id: data.company_id || '',
      business_category: data.business_category,
      description: data.description,
      brand_settings: data.brand_settings as Record<string, any> || {},
      separation_readiness: data.separation_readiness as Record<string, any> || {}
    } as Brand;
  }

  /**
   * 브랜드 활성화/비활성화
   */
  static async toggleBrandStatus(id: string, isActive: boolean): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to toggle brand status: ${error.message}`);
    }

    return {
      ...data,
      company_id: data.company_id || '',
      brand_settings: data.brand_settings as Record<string, any> || {},
      separation_readiness: data.separation_readiness as Record<string, any> || {}
    } as Brand;
  }
}
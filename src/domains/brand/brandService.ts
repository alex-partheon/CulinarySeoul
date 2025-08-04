// TASK-003: 브랜드 도메인 서비스 레이어 (CRUD API)

import { supabase } from '../../lib/supabase';
import type { Brand, CreateBrandRequest, UpdateBrandRequest, BusinessCategory } from './types';
import { BrandInsert } from '../../lib/supabase/types';

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
  /**
   * 입력 데이터 검증
   */
  private static validateCreateBrandRequest(request: CreateBrandRequest): void {
    // 회사 ID 검증
    if (!request.company_id || request.company_id.trim() === '') {
      throw new Error('회사 ID는 필수입니다');
    }

    // 필수 필드 검증
    if (!request.name || request.name.trim() === '') {
      throw new Error('브랜드 이름은 필수입니다');
    }

    if (!request.code || request.code.trim() === '') {
      throw new Error('브랜드 코드는 필수입니다');
    }

    if (!request.domain || request.domain.trim() === '') {
      throw new Error('도메인은 필수입니다');
    }

    if (!request.business_category || request.business_category.trim() === '') {
      throw new Error('업종 카테고리는 필수입니다');
    }

    // 브랜드 이름 길이 검증
    if (request.name.trim().length > 100) {
      throw new Error('브랜드 이름은 100자 이하여야 합니다');
    }

    // 브랜드 코드 길이 검증
    const trimmedCode = request.code.trim().toUpperCase();
    if (trimmedCode.length < 2 || trimmedCode.length > 10) {
      throw new Error('브랜드 코드는 2-10자 사이여야 합니다');
    }

    // 브랜드 코드 형식 검증 (대문자와 숫자만 허용)
    const codePattern = /^[A-Z0-9]+$/;
    if (!codePattern.test(trimmedCode)) {
      throw new Error('브랜드 코드는 대문자와 숫자만 사용 가능합니다');
    }

    // 도메인 형식 검증 (더 엄격한 검증)
    const trimmedDomain = request.domain.trim().toLowerCase();
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainPattern.test(trimmedDomain) || 
        trimmedDomain.includes('..') || 
        trimmedDomain.startsWith('.') || 
        trimmedDomain.endsWith('.') ||
        trimmedDomain.includes(' ') ||
        trimmedDomain.startsWith('http://') ||
        trimmedDomain.startsWith('https://')) {
      throw new Error('올바른 도메인 형식을 입력해주세요');
    }

    // 설명 길이 검증
    if (request.description && request.description.trim().length > 500) {
      throw new Error('설명은 500자 이하여야 합니다');
    }

    // 유효한 비즈니스 카테고리 검증
    const validCategories = [
      'restaurant', 'cafe', 'bakery', 'fast_food', 'fine_dining',
      'bar', 'dessert', 'food_truck', 'catering', 'other'
    ];
    if (!validCategories.includes(request.business_category)) {
      throw new Error('유효하지 않은 업종 카테고리입니다');
    }
  }

  static async createBrand(request: CreateBrandRequest): Promise<Brand> {
    // 입력 데이터 검증
    this.validateCreateBrandRequest(request);

    const brandData: BrandInsert = {
      company_id: request.company_id,
      name: request.name.trim(),
      code: request.code.trim().toUpperCase(),
      domain: request.domain.trim().toLowerCase(),
      business_category: request.business_category,
      description: request.description?.trim() || null,
      brand_settings: request.brand_settings || {},
      separation_readiness: request.separation_readiness || {},
      is_active: request.is_active ?? true,
    };

    const { data, error } = await supabase
      .from('brands')
      .insert(brandData)
      .select()
      .single();

    if (error) {
      // 중복 키 오류 처리
      if (error.code === '23505') {
        if (error.message.includes('brands_code_key')) {
          throw new Error('이미 존재하는 브랜드 코드입니다');
        }
        if (error.message.includes('brands_domain_key')) {
          throw new Error('이미 존재하는 도메인입니다');
        }
      }
      // 네트워크 오류나 서버 오류에 대한 더 명확한 메시지
      if (error.message.includes('fetch') || error.message.includes('network')) {
        throw new Error('네트워크 연결에 실패했습니다');
      }
      throw new Error(`브랜드 생성 중 오류가 발생했습니다: ${error.message}`);
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
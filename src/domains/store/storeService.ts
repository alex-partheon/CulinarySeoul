// TASK-003: 매장 도메인 서비스 레이어 (CRUD API)

import { supabase } from '../../lib/supabase';
import type { Store, CreateStoreRequest, UpdateStoreRequest } from './types';

export class StoreService {
  /**
   * 모든 매장 목록 조회
   */
  static async getStores(): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select(`
        *,
        brand:brands(*),
        company:brands(company:companies(*))
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch stores: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      brand_id: item.brand_id || '',
      address: item.address as StoreAddress || {},
      contact_info: item.contact_info as StoreContactInfo || {},
      operating_hours: item.operating_hours as OperatingHours || {}
    })) as Store[];
  }

  /**
   * 특정 매장 조회
   */
  static async getStoreById(id: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from('stores')
      .select(`
        *,
        brand:brands(*),
        company:brands(company:companies(*))
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch store: ${error.message}`);
    }

    return {
      ...data,
      brand_id: data.brand_id || '',
      address: data.address as StoreAddress || {},
      contact_info: data.contact_info as StoreContactInfo || {},
      operating_hours: data.operating_hours as OperatingHours || {}
    } as Store;
  }

  /**
   * 매장 코드로 조회
   */
  static async getStoreByCode(code: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from('stores')
      .select(`
        *,
        brand:brands(*),
        company:brands(company:companies(*))
      `)
      .eq('code', code)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch store by code: ${error.message}`);
    }

    return {
      ...data,
      brand_id: data.brand_id || '',
      address: data.address as StoreAddress || {},
      contact_info: data.contact_info as StoreContactInfo || {},
      operating_hours: data.operating_hours as OperatingHours || {}
    } as Store;
  }

  /**
   * 브랜드별 매장 목록 조회
   */
  static async getStoresByBrand(brandId: string): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch stores by brand: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      brand_id: item.brand_id || '',
      address: item.address as StoreAddress || {},
      contact_info: item.contact_info as StoreContactInfo || {},
      operating_hours: item.operating_hours as OperatingHours || {}
    })) as Store[];
  }

  /**
   * 회사별 매장 목록 조회 (모든 브랜드의 매장 포함)
   */
  static async getStoresByCompany(companyId: string): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select(`
        *,
        brand:brands!inner(*)
      `)
      .eq('brand.company_id', companyId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch stores by company: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      brand_id: item.brand_id || '',
      address: item.address as StoreAddress || {},
      contact_info: item.contact_info as StoreContactInfo || {},
      operating_hours: item.operating_hours as OperatingHours || {}
    })) as Store[];
  }

  /**
   * 새 매장 생성
   */
  static async createStore(request: CreateStoreRequest): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .insert({
        brand_id: request.brand_id,
        name: request.name || '성수점',
        code: request.code || 'seongsu',
        address: request.address || {},
        contact_info: request.contact_info || {},
        operating_hours: request.operating_hours || {},
        is_active: request.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create store: ${error.message}`);
    }

    return {
      ...data,
      brand_id: data.brand_id || '',
      address: data.address as StoreAddress || {},
      contact_info: data.contact_info as StoreContactInfo || {},
      operating_hours: data.operating_hours as OperatingHours || {}
    } as Store;
  }

  /**
   * 매장 정보 업데이트
   */
  static async updateStore(id: string, request: UpdateStoreRequest): Promise<Store> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (request.name !== undefined) updateData.name = request.name;
    if (request.code !== undefined) updateData.code = request.code;
    if (request.address !== undefined) updateData.address = request.address;
    if (request.contact_info !== undefined) updateData.contact_info = request.contact_info;
    if (request.operating_hours !== undefined) updateData.operating_hours = request.operating_hours;
    if (request.is_active !== undefined) updateData.is_active = request.is_active;

    const { data, error } = await supabase
      .from('stores')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update store: ${error.message}`);
    }

    return {
      ...data,
      brand_id: data.brand_id || '',
      address: data.address as StoreAddress || {},
      contact_info: data.contact_info as StoreContactInfo || {},
      operating_hours: data.operating_hours as OperatingHours || {}
    } as Store;
  }

  /**
   * 매장 삭제
   */
  static async deleteStore(id: string): Promise<void> {
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete store: ${error.message}`);
    }
  }

  /**
   * 매장 주소 업데이트
   */
  static async updateStoreAddress(id: string, address: Record<string, any>): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .update({
        address,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update store address: ${error.message}`);
    }

    return {
      ...data,
      brand_id: data.brand_id || '',
      address: data.address as StoreAddress || {},
      contact_info: data.contact_info as StoreContactInfo || {},
      operating_hours: data.operating_hours as OperatingHours || {}
    } as Store;
  }

  /**
   * 매장 연락처 정보 업데이트
   */
  static async updateStoreContactInfo(id: string, contactInfo: Record<string, any>): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .update({
        contact_info: contactInfo,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update store contact info: ${error.message}`);
    }

    return {
      ...data,
      brand_id: data.brand_id || '',
      address: data.address as StoreAddress || {},
      contact_info: data.contact_info as StoreContactInfo || {},
      operating_hours: data.operating_hours as OperatingHours || {}
    } as Store;
  }

  /**
   * 매장 운영시간 업데이트
   */
  static async updateStoreOperatingHours(id: string, operatingHours: Record<string, any>): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .update({
        operating_hours: operatingHours,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update store operating hours: ${error.message}`);
    }

    return {
      ...data,
      brand_id: data.brand_id || '',
      address: data.address as StoreAddress || {},
      contact_info: data.contact_info as StoreContactInfo || {},
      operating_hours: data.operating_hours as OperatingHours || {}
    } as Store;
  }

  /**
   * 매장 활성화/비활성화
   */
  static async toggleStoreStatus(id: string, isActive: boolean): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to toggle store status: ${error.message}`);
    }

    return {
      ...data,
      brand_id: data.brand_id || '',
      address: data.address as StoreAddress || {},
      contact_info: data.contact_info as StoreContactInfo || {},
      operating_hours: data.operating_hours as OperatingHours || {}
    } as Store;
  }

  /**
   * 활성 매장 목록 조회
   */
  static async getActiveStores(): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select(`
        *,
        brand:brands(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch active stores: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      brand_id: item.brand_id || '',
      address: item.address as StoreAddress || {},
      contact_info: item.contact_info as StoreContactInfo || {},
      operating_hours: item.operating_hours as OperatingHours || {}
    })) as Store[];
  }

  /**
   * 지역별 매장 검색
   */
  static async getStoresByRegion(region: string): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .ilike('address->>city', `%${region}%`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch stores by region: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      brand_id: item.brand_id || '',
      address: item.address as StoreAddress || {},
      contact_info: item.contact_info as StoreContactInfo || {},
      operating_hours: item.operating_hours as OperatingHours || {}
    })) as Store[];
  }
}
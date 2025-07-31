// TASK-003: 회사 도메인 서비스 레이어 (CRUD API)

import { supabase } from '../../lib/supabase';
import type { Company, CreateCompanyRequest, UpdateCompanyRequest } from './types';

export class CompanyService {
  /**
   * 모든 회사 목록 조회
   */
  static async getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch companies: ${error.message}`);
    }

    return (data || []).map(item => ({
      ...item,
      settings: item.settings as Record<string, any> || {}
    }));
  }

  /**
   * 특정 회사 조회
   */
  static async getCompanyById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch company: ${error.message}`);
    }

    return {
      ...data,
      settings: data.settings as Record<string, any> || {}
    };
  }

  /**
   * 도메인으로 회사 조회
   */
  static async getCompanyByDomain(domain: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('domain', domain)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch company by domain: ${error.message}`);
    }

    return {
      ...data,
      settings: data.settings as Record<string, any> || {}
    };
  }

  /**
   * 새 회사 생성
   */
  static async createCompany(request: CreateCompanyRequest): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: request.name || 'CulinarySeoul',
        domain: request.domain || 'culinaryseoul.com',
        settings: request.settings || {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create company: ${error.message}`);
    }

    return {
      ...data,
      settings: data.settings as Record<string, any> || {}
    };
  }

  /**
   * 회사 정보 업데이트
   */
  static async updateCompany(id: string, request: UpdateCompanyRequest): Promise<Company> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (request.name !== undefined) updateData.name = request.name;
    if (request.domain !== undefined) updateData.domain = request.domain;
    if (request.settings !== undefined) updateData.settings = request.settings;

    const { data, error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update company: ${error.message}`);
    }

    return {
      ...data,
      settings: data.settings as Record<string, any> || {}
    };
  }

  /**
   * 회사 삭제
   */
  static async deleteCompany(id: string): Promise<void> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete company: ${error.message}`);
    }
  }

  /**
   * 회사의 브랜드 목록 조회
   */
  static async getCompanyBrands(companyId: string) {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch company brands: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 회사 설정 업데이트
   */
  static async updateCompanySettings(id: string, settings: Record<string, any>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .update({
        settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update company settings: ${error.message}`);
    }

    return {
      ...data,
      settings: data.settings as Record<string, any> || {}
    };
  }
}
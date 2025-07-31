// TASK-003: 데이터 무결성 검증 유틸리티

import { supabase } from '../lib/supabase';

/**
 * 데이터 무결성 검증 결과
 */
export interface IntegrityCheckResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalCompanies: number;
    totalBrands: number;
    totalStores: number;
    orphanedBrands: number;
    orphanedStores: number;
  };
}

/**
 * 회사-브랜드-매장 계층 구조의 데이터 무결성을 검증합니다.
 */
export class DataIntegrityChecker {
  /**
   * 전체 데이터 무결성 검증
   */
  static async checkIntegrity(): Promise<IntegrityCheckResult> {
    const result: IntegrityCheckResult = {
      isValid: true,
      errors: [],
      warnings: [],
      summary: {
        totalCompanies: 0,
        totalBrands: 0,
        totalStores: 0,
        orphanedBrands: 0,
        orphanedStores: 0,
      },
    };

    try {
      // 1. 기본 카운트 수집
      await this.collectBasicCounts(result);

      // 2. 고아 레코드 검증
      await this.checkOrphanedRecords(result);

      // 3. 중복 코드 검증
      await this.checkDuplicateCodes(result);

      // 4. 필수 필드 검증
      await this.checkRequiredFields(result);

      // 5. 계층 구조 일관성 검증
      await this.checkHierarchyConsistency(result);

      // 최종 유효성 판단
      result.isValid = result.errors.length === 0;

    } catch (error) {
      result.isValid = false;
      result.errors.push(`Integrity check failed: ${error}`);
    }

    return result;
  }

  /**
   * 기본 카운트 수집
   */
  private static async collectBasicCounts(result: IntegrityCheckResult): Promise<void> {
    // 회사 수
    const { count: companyCount } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    result.summary.totalCompanies = companyCount || 0;

    // 브랜드 수
    const { count: brandCount } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true });
    result.summary.totalBrands = brandCount || 0;

    // 매장 수
    const { count: storeCount } = await supabase
      .from('stores')
      .select('*', { count: 'exact', head: true });
    result.summary.totalStores = storeCount || 0;
  }

  /**
   * 고아 레코드 검증
   */
  private static async checkOrphanedRecords(result: IntegrityCheckResult): Promise<void> {
    // 고아 브랜드 (존재하지 않는 company_id 참조)
    const { data: allCompanies } = await supabase
      .from('companies')
      .select('id');
    
    const companyIds = allCompanies?.map(c => c.id) || [];
    
    const { data: allBrands } = await supabase
      .from('brands')
      .select('id, name, company_id');
    
    const orphanedBrands = allBrands?.filter(brand => 
      !companyIds.includes(brand.company_id)
    ) || [];

    if (orphanedBrands.length > 0) {
      result.summary.orphanedBrands = orphanedBrands.length;
      result.errors.push(`Found ${orphanedBrands.length} orphaned brands with invalid company_id`);
      orphanedBrands.forEach(brand => {
        result.errors.push(`  - Brand "${brand.name}" (${brand.id}) references non-existent company ${brand.company_id}`);
      });
    }

    // 고아 매장 (존재하지 않는 brand_id 참조)
    const { data: allBrandsForStores } = await supabase
      .from('brands')
      .select('id');
    
    const brandIds = allBrandsForStores?.map(b => b.id) || [];
    
    const { data: allStores } = await supabase
      .from('stores')
      .select('id, name, brand_id');
    
    const orphanedStores = allStores?.filter(store => 
      !brandIds.includes(store.brand_id)
    ) || [];

    if (orphanedStores.length > 0) {
      result.summary.orphanedStores = orphanedStores.length;
      result.errors.push(`Found ${orphanedStores.length} orphaned stores with invalid brand_id`);
      orphanedStores.forEach(store => {
        result.errors.push(`  - Store "${store.name}" (${store.id}) references non-existent brand ${store.brand_id}`);
      });
    }
  }

  /**
   * 중복 코드 검증
   */
  private static async checkDuplicateCodes(result: IntegrityCheckResult): Promise<void> {
    // 브랜드 코드 중복 검증 (같은 회사 내에서)
    const { data: allBrands } = await supabase
      .from('brands')
      .select('company_id, code');
    
    const brandCodeMap = new Map<string, number>();
    allBrands?.forEach(brand => {
      const key = `${brand.company_id}-${brand.code}`;
      const count = brandCodeMap.get(key) || 0;
      brandCodeMap.set(key, count + 1);
    });
    
    const duplicateBrandCodes = Array.from(brandCodeMap.entries())
      .filter(([_, count]) => count > 1)
      .map(([key, count]) => {
        const [company_id, code] = key.split('-');
        return { company_id, code, count };
      });

    if (duplicateBrandCodes.length > 0) {
      result.errors.push('Found duplicate brand codes within the same company:');
      duplicateBrandCodes.forEach(dup => {
        result.errors.push(`  - Company ${dup.company_id}: code "${dup.code}" appears ${dup.count} times`);
      });
    }

    // 매장 코드 중복 검증 (같은 브랜드 내에서)
    const { data: allStores } = await supabase
      .from('stores')
      .select('brand_id, code');
    
    const storeCodeMap = new Map<string, number>();
    allStores?.forEach(store => {
      const key = `${store.brand_id}-${store.code}`;
      const count = storeCodeMap.get(key) || 0;
      storeCodeMap.set(key, count + 1);
    });
    
    const duplicateStoreCodes = Array.from(storeCodeMap.entries())
      .filter(([_, count]) => count > 1)
      .map(([key, count]) => {
        const [brand_id, code] = key.split('-');
        return { brand_id, code, count };
      });

    if (duplicateStoreCodes.length > 0) {
      result.errors.push('Found duplicate store codes within the same brand:');
      duplicateStoreCodes.forEach(dup => {
        result.errors.push(`  - Brand ${dup.brand_id}: code "${dup.code}" appears ${dup.count} times`);
      });
    }
  }

  /**
   * 필수 필드 검증
   */
  private static async checkRequiredFields(result: IntegrityCheckResult): Promise<void> {
    // 회사 필수 필드
    const { data: allCompanies } = await supabase
      .from('companies')
      .select('id, name, domain');

    const companiesWithMissingFields = allCompanies?.filter(company => 
      !company.name || !company.domain
    ) || [];

    if (companiesWithMissingFields.length > 0) {
      result.errors.push('Found companies with missing required fields:');
      companiesWithMissingFields.forEach(company => {
        const missing = [];
        if (!company.name) missing.push('name');
        if (!company.domain) missing.push('domain');
        result.errors.push(`  - Company ${company.id}: missing ${missing.join(', ')}`);
      });
    }

    // 브랜드 필수 필드
    const { data: allBrands } = await supabase
      .from('brands')
      .select('id, name, code, company_id');

    const brandsWithMissingFields = allBrands?.filter(brand => 
      !brand.name || !brand.code || !brand.company_id
    ) || [];

    if (brandsWithMissingFields.length > 0) {
      result.errors.push('Found brands with missing required fields:');
      brandsWithMissingFields.forEach(brand => {
        const missing = [];
        if (!brand.name) missing.push('name');
        if (!brand.code) missing.push('code');
        if (!brand.company_id) missing.push('company_id');
        result.errors.push(`  - Brand ${brand.id}: missing ${missing.join(', ')}`);
      });
    }

    // 매장 필수 필드
    const { data: allStores } = await supabase
      .from('stores')
      .select('id, name, code, brand_id');

    const storesWithMissingFields = allStores?.filter(store => 
      !store.name || !store.code || !store.brand_id
    ) || [];

    if (storesWithMissingFields.length > 0) {
      result.errors.push('Found stores with missing required fields:');
      storesWithMissingFields.forEach(store => {
        const missing = [];
        if (!store.name) missing.push('name');
        if (!store.code) missing.push('code');
        if (!store.brand_id) missing.push('brand_id');
        result.errors.push(`  - Store ${store.id}: missing ${missing.join(', ')}`);
      });
    }
  }

  /**
   * 계층 구조 일관성 검증
   */
  private static async checkHierarchyConsistency(result: IntegrityCheckResult): Promise<void> {
    // 비활성 회사의 활성 브랜드 검증
    const { data: inconsistentBrands } = await supabase
      .from('brands')
      .select(`
        id, name, is_active,
        company:companies!inner(id, name, is_active)
      `)
      .eq('is_active', true)
      .eq('companies.is_active', false);

    if (inconsistentBrands && inconsistentBrands.length > 0) {
      result.warnings.push('Found active brands under inactive companies:');
      inconsistentBrands.forEach(brand => {
        result.warnings.push(`  - Brand "${brand.name}" (${brand.id}) is active but company is inactive`);
      });
    }

    // 비활성 브랜드의 활성 매장 검증
    const { data: inconsistentStores } = await supabase
      .from('stores')
      .select(`
        id, name, is_active,
        brand:brands!inner(id, name, is_active)
      `)
      .eq('is_active', true)
      .eq('brands.is_active', false);

    if (inconsistentStores && inconsistentStores.length > 0) {
      result.warnings.push('Found active stores under inactive brands:');
      inconsistentStores.forEach(store => {
        result.warnings.push(`  - Store "${store.name}" (${store.id}) is active but brand is inactive`);
      });
    }
  }

  /**
   * 특정 회사의 데이터 무결성 검증
   */
  static async checkCompanyIntegrity(companyId: string): Promise<IntegrityCheckResult> {
    const result: IntegrityCheckResult = {
      isValid: true,
      errors: [],
      warnings: [],
      summary: {
        totalCompanies: 1,
        totalBrands: 0,
        totalStores: 0,
        orphanedBrands: 0,
        orphanedStores: 0,
      },
    };

    try {
      // 회사 존재 확인
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (!company) {
        result.isValid = false;
        result.errors.push(`Company with ID ${companyId} not found`);
        return result;
      }

      // 해당 회사의 브랜드 및 매장 수 계산
      const { count: brandCount } = await supabase
        .from('brands')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId);
      result.summary.totalBrands = brandCount || 0;

      const { count: storeCount } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true })
        .in('brand_id', `(SELECT id FROM brands WHERE company_id = '${companyId}')`);
      result.summary.totalStores = storeCount || 0;

      result.isValid = result.errors.length === 0;

    } catch (error) {
      result.isValid = false;
      result.errors.push(`Company integrity check failed: ${error}`);
    }

    return result;
  }
}
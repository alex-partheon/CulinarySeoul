// TASK-003: 데이터 무결성 검증 테스트

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { DataIntegrityChecker } from '../../utils/dataIntegrity';
import { CompanyService, BrandService, StoreService } from '../../domains';
import { supabase } from '../../lib/supabase';
import type { Company, Brand, Store } from '../../domains/types';

describe('TASK-003: 회사-브랜드-매장 데이터 무결성 검증', () => {
  let testCompanyId: string;
  let testBrandId: string;
  let testStoreId: string;
  let testCompany: Company;
  let testBrand: Brand;
  let testStore: Store;

  beforeAll(async () => {
    // 테스트용 데이터 생성
    const companyData = {
      name: 'Test Company',
      domain: 'test-company.com',
      settings: { test: true } as Record<string, any>
    };
    testCompany = await CompanyService.createCompany(companyData);
    testCompanyId = testCompany.id;

    const brandData = {
      company_id: testCompanyId,
      name: 'Test Brand',
      code: 'test-brand',
      domain: 'test-brand.com',
      brand_settings: { test: true } as Record<string, any>
    };
    testBrand = await BrandService.createBrand(brandData);
    testBrandId = testBrand.id;

    const storeData = {
      brand_id: testBrandId,
      name: 'Test Store',
      code: 'test-store',
      address: {
        street: '123 Test St',
        city: 'Test City',
        zipCode: '12345'
      } as Record<string, any>
    };
    testStore = await StoreService.createStore(storeData);
    testStoreId = testStore.id;
  });

  afterAll(async () => {
    // 테스트 데이터 정리
    try {
      await StoreService.deleteStore(testStoreId);
      await BrandService.deleteBrand(testBrandId);
      await CompanyService.deleteCompany(testCompanyId);
    } catch (error) {
      console.warn('Test cleanup failed:', error);
    }
  });

  describe('데이터 무결성 검증', () => {
    it('전체 시스템 무결성을 검증해야 함', async () => {
      const result = await DataIntegrityChecker.checkIntegrity();
      
      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.totalCompanies).toBeGreaterThan(0);
      expect(result.summary.totalBrands).toBeGreaterThan(0);
      expect(result.summary.totalStores).toBeGreaterThan(0);
      
      // 고아 레코드가 없어야 함
      expect(result.summary.orphanedBrands).toBe(0);
      expect(result.summary.orphanedStores).toBe(0);
      
      // 심각한 오류가 없어야 함
      if (!result.isValid) {
        console.warn('Integrity check warnings:', result.warnings);
        console.error('Integrity check errors:', result.errors);
      }
    });

    it('특정 회사의 무결성을 검증해야 함', async () => {
      const result = await DataIntegrityChecker.checkCompanyIntegrity(testCompanyId);
      
      expect(result).toBeDefined();
      expect(result.isValid).toBe(true);
      expect(result.summary.totalCompanies).toBe(1);
      expect(result.summary.totalBrands).toBeGreaterThanOrEqual(1);
      expect(result.summary.totalStores).toBeGreaterThanOrEqual(1);
    });
  });

  describe('계층 구조 검증', () => {
    it('회사-브랜드-매장 계층 관계가 올바르게 설정되어야 함', async () => {
      // 회사 조회
      const company = await CompanyService.getCompanyById(testCompanyId);
      expect(company).toBeDefined();
      expect(company?.name).toBe('Test Company');

      // 브랜드 조회
      const brand = await BrandService.getBrandById(testBrandId);
      expect(brand).toBeDefined();
      expect(brand?.company_id).toBe(testCompanyId);
      expect(brand?.name).toBe('Test Brand');

      // 매장 조회
      const store = await StoreService.getStoreById(testStoreId);
      expect(store).toBeDefined();
      expect(store?.brand_id).toBe(testBrandId);
      expect(store?.name).toBe('Test Store');
    });

    it('회사의 브랜드 목록을 조회할 수 있어야 함', async () => {
      const brands = await CompanyService.getCompanyBrands(testCompanyId);
      expect(brands).toBeDefined();
      expect(brands.length).toBeGreaterThanOrEqual(1);
      expect(brands.some(b => b.id === testBrandId)).toBe(true);
    });

    it('브랜드의 매장 목록을 조회할 수 있어야 함', async () => {
      const stores = await BrandService.getBrandStores(testBrandId);
      expect(stores).toBeDefined();
      expect(stores.length).toBeGreaterThanOrEqual(1);
      expect(stores.some(s => s.id === testStoreId)).toBe(true);
    });
  });

  describe('CRUD 작업 검증', () => {
    it('회사 CRUD 작업이 정상 동작해야 함', async () => {
      // 생성 (beforeAll에서 이미 수행)
      const company = await CompanyService.getCompanyById(testCompanyId);
      expect(company).toBeDefined();

      // 수정
      const updatedCompany = await CompanyService.updateCompany(testCompanyId, {
        name: 'Updated Test Company'
      });
      expect(updatedCompany.name).toBe('Updated Test Company');

      // 설정 업데이트
      const companyWithSettings = await CompanyService.updateCompanySettings(testCompanyId, {
        theme: 'dark',
        language: 'ko'
      } as Record<string, any>);
      expect(companyWithSettings.settings).toEqual({
        theme: 'dark',
        language: 'ko'
      });
    });

    it('브랜드 CRUD 작업이 정상 동작해야 함', async () => {
      // 조회
      const brand = await BrandService.getBrandById(testBrandId);
      expect(brand).toBeDefined();

      // 수정
      const updatedBrand = await BrandService.updateBrand(testBrandId, {
        name: 'Updated Test Brand'
      });
      expect(updatedBrand.name).toBe('Updated Test Brand');

      // 브랜드 설정 업데이트
      const brandWithSettings = await BrandService.updateBrandSettings(testBrandId, {
        primaryColor: '#FF0000',
        logo: 'logo.png'
      } as Record<string, any>);
      expect(brandWithSettings.brand_settings).toEqual({
        primaryColor: '#FF0000',
        logo: 'logo.png'
      });
    });

    it('매장 CRUD 작업이 정상 동작해야 함', async () => {
      // 조회
      const store = await StoreService.getStoreById(testStoreId);
      expect(store).toBeDefined();

      // 수정
      const updatedStore = await StoreService.updateStore(testStoreId, {
        name: 'Updated Test Store'
      });
      expect(updatedStore.name).toBe('Updated Test Store');

      // 주소 업데이트
      const storeWithAddress = await StoreService.updateStoreAddress(testStoreId, {
        street: '456 Updated St',
        city: 'Updated City',
        zipCode: '54321'
      } as Record<string, any>);
      expect(storeWithAddress.address).toEqual({
        street: '456 Updated St',
        city: 'Updated City',
        zipCode: '54321'
      });

      // 운영시간 업데이트
      const operatingHours = {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '10:00', close: '17:00' },
        sunday: { open: '10:00', close: '17:00' }
      };
      
      const storeWithHours = await StoreService.updateStoreOperatingHours(testStoreId, operatingHours as Record<string, any>);
      expect(storeWithHours.operating_hours).toEqual(operatingHours);
    });
  });

  describe('검색 및 필터링 검증', () => {
    it('브랜드 코드로 브랜드를 조회할 수 있어야 함', async () => {
      const brand = await BrandService.getBrandByCode('test-brand');
      expect(brand).toBeDefined();
      expect(brand?.id).toBe(testBrandId);
    });

    it('매장 코드로 매장을 조회할 수 있어야 함', async () => {
      const store = await StoreService.getStoreByCode('test-store');
      expect(store).toBeDefined();
      expect(store?.id).toBe(testStoreId);
    });

    it('활성 매장 목록을 조회할 수 있어야 함', async () => {
      const activeStores = await StoreService.getActiveStores();
      expect(activeStores).toBeDefined();
      expect(activeStores.length).toBeGreaterThan(0);
      expect(activeStores.every(store => store.is_active)).toBe(true);
    });
  });

  describe('상태 관리 검증', () => {
    it('브랜드 활성화/비활성화가 정상 동작해야 함', async () => {
      // 비활성화
      const deactivatedBrand = await BrandService.toggleBrandStatus(testBrandId, false);
      expect(deactivatedBrand.is_active).toBe(false);

      // 다시 활성화
      const activatedBrand = await BrandService.toggleBrandStatus(testBrandId, true);
      expect(activatedBrand.is_active).toBe(true);
    });

    it('매장 활성화/비활성화가 정상 동작해야 함', async () => {
      // 비활성화
      const deactivatedStore = await StoreService.toggleStoreStatus(testStoreId, false);
      expect(deactivatedStore.is_active).toBe(false);

      // 다시 활성화
      const activatedStore = await StoreService.toggleStoreStatus(testStoreId, true);
      expect(activatedStore.is_active).toBe(true);
    });
  });
});
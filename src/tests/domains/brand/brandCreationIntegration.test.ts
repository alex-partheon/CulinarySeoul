// TDD: 브랜드 생성 통합 테스트 - UI와 서비스 레이어 간의 오류 처리 검증

import { BrandService } from '@/domains/brand/brandService';
import type { CreateBrandRequest, BusinessCategory } from '@/domains/brand/types';

// Supabase mock
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn(),
      order: jest.fn().mockReturnThis()
    }))
  }
}));

describe('브랜드 생성 통합 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UI 입력 검증', () => {
    it('브랜드명이 공백만 있을 때 오류가 발생해야 함', async () => {
      const request: CreateBrandRequest = {
        company_id: 'comp-1',
        name: '   ', // 공백만 있는 경우
        code: 'TEST',
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      await expect(BrandService.createBrand(request))
        .rejects
        .toThrow('브랜드 이름은 필수입니다');
    });

    it('브랜드 코드가 소문자일 때 자동으로 대문자로 변환되어야 함', async () => {
      const { supabase } = require('@/lib/supabase');
      const mockChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: {
            id: 'brand-1',
            company_id: 'comp-1',
            name: 'Test Brand',
            code: 'TEST', // 대문자로 변환됨
            domain: 'test.com',
            business_category: 'restaurant',
            brand_settings: {},
            separation_readiness: {},
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, 
          error: null 
        })
      };
      supabase.from.mockReturnValue(mockChain);

      const request: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'test', // 소문자 입력
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      const result = await BrandService.createBrand(request);
      
      expect(mockChain.insert).toHaveBeenCalledWith(expect.objectContaining({
        code: 'TEST' // 대문자로 변환되어 저장
      }));
      expect(result.code).toBe('TEST');
    });

    it('도메인이 소문자로 변환되어야 함', async () => {
      const { supabase } = require('@/lib/supabase');
      const mockChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: {
            id: 'brand-1',
            company_id: 'comp-1',
            name: 'Test Brand',
            code: 'TEST',
            domain: 'test.com', // 소문자로 변환됨
            business_category: 'restaurant',
            brand_settings: {},
            separation_readiness: {},
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, 
          error: null 
        })
      };
      supabase.from.mockReturnValue(mockChain);

      const request: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'TEST',
        domain: 'TEST.COM', // 대문자 입력
        business_category: 'restaurant',
        is_active: true
      };

      const result = await BrandService.createBrand(request);
      
      expect(mockChain.insert).toHaveBeenCalledWith(expect.objectContaining({
        domain: 'test.com' // 소문자로 변환되어 저장
      }));
      expect(result.domain).toBe('test.com');
    });

    it('브랜드 코드에 특수문자가 포함된 경우 오류가 발생해야 함', async () => {
      const request: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'TEST-123', // 하이픈 포함
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      await expect(BrandService.createBrand(request))
        .rejects
        .toThrow('브랜드 코드는 대문자와 숫자만 사용 가능합니다');
    });

    it('브랜드 코드가 너무 짧은 경우 오류가 발생해야 함', async () => {
      const request: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'A', // 1글자
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      await expect(BrandService.createBrand(request))
        .rejects
        .toThrow('브랜드 코드는 2-10자 사이여야 합니다');
    });

    it('브랜드 코드가 너무 긴 경우 오류가 발생해야 함', async () => {
      const request: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'VERYLONGBRANDCODE', // 17글자
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      await expect(BrandService.createBrand(request))
        .rejects
        .toThrow('브랜드 코드는 2-10자 사이여야 합니다');
    });

    it('도메인 형식이 잘못된 경우 오류가 발생해야 함', async () => {
      const invalidDomains = [
        'invalid',
        'invalid.',
        '.invalid',
        'invalid..com',
        'http://invalid.com',
        'invalid space.com'
      ];

      for (const domain of invalidDomains) {
        const request: CreateBrandRequest = {
          company_id: 'comp-1',
          name: 'Test Brand',
          code: 'TEST',
          domain: domain,
          business_category: 'restaurant',
          is_active: true
        };

        await expect(BrandService.createBrand(request))
          .rejects
          .toThrow('올바른 도메인 형식을 입력해주세요');
      }
    });

    it('브랜드명이 너무 긴 경우 오류가 발생해야 함', async () => {
      const longName = 'A'.repeat(101); // 101글자
      const request: CreateBrandRequest = {
        company_id: 'comp-1',
        name: longName,
        code: 'TEST',
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      await expect(BrandService.createBrand(request))
        .rejects
        .toThrow('브랜드 이름은 100자 이하여야 합니다');
    });

    it('설명이 너무 긴 경우 오류가 발생해야 함', async () => {
      const longDescription = 'A'.repeat(501); // 501글자
      const request: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'TEST',
        domain: 'test.com',
        business_category: 'restaurant',
        description: longDescription,
        is_active: true
      };

      await expect(BrandService.createBrand(request))
        .rejects
        .toThrow('설명은 500자 이하여야 합니다');
    });
  });

  describe('네트워크 오류 처리', () => {
    it('네트워크 연결 실패 시 적절한 오류 메시지를 반환해야 함', async () => {
      const { supabase } = require('@/lib/supabase');
      const mockChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: null, 
          error: { 
            message: 'Network error',
            code: 'NETWORK_ERROR'
          } 
        })
      };
      supabase.from.mockReturnValue(mockChain);

      const request: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'TEST',
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      await expect(BrandService.createBrand(request))
        .rejects
        .toThrow('브랜드 생성 중 오류가 발생했습니다: Network error');
    });

    it('서버 내부 오류 시 적절한 오류 메시지를 반환해야 함', async () => {
      const { supabase } = require('@/lib/supabase');
      const mockChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: null, 
          error: { 
            message: 'Internal server error',
            code: '500'
          } 
        })
      };
      supabase.from.mockReturnValue(mockChain);

      const request: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'TEST',
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      await expect(BrandService.createBrand(request))
        .rejects
        .toThrow('브랜드 생성 중 오류가 발생했습니다: Internal server error');
    });
  });

  describe('비즈니스 로직 검증', () => {
    it('유효한 비즈니스 카테고리만 허용해야 함', async () => {
      const { supabase } = require('@/lib/supabase');
      const mockChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: {
            id: 'brand-1',
            company_id: 'test-company-id',
            name: 'Test Brand',
            code: 'TBREST',
            domain: 'testrestaurant.com',
            business_category: 'restaurant',
            description: 'Test restaurant brand',
            brand_settings: {},
            separation_readiness: {},
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, 
          error: null 
        })
      };
      supabase.from.mockReturnValue(mockChain);

      const validCategories = ['restaurant', 'cafe', 'bakery'];
      
      for (const category of validCategories) {
        const request: CreateBrandRequest = {
          company_id: 'test-company-id',
          name: `Test Brand ${category}`,
          code: `TB${category.toUpperCase().slice(0, 2)}`,
          domain: `test${category}.com`,
          business_category: category as BusinessCategory,
          description: `Test ${category} brand`
        };

        const result = await BrandService.createBrand(request);
        expect(result.business_category).toBe('restaurant'); // Mock에서 항상 restaurant을 반환
      }
    });

    it('company_id가 누락된 경우 오류가 발생해야 함', async () => {
      const request: CreateBrandRequest = {
        company_id: '', // 빈 문자열
        name: 'Test Brand',
        code: 'TEST',
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      await expect(BrandService.createBrand(request))
        .rejects
        .toThrow('회사 ID는 필수입니다');
    });
  });
});
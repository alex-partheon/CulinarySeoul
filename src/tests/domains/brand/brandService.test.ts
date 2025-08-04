import { BrandService } from '@/domains/brand/brandService';
import type { CreateBrandRequest, UpdateBrandRequest } from '@/domains/brand/types';

// Mock functions
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();
const mockFrom = jest.fn();

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
    }))
  }
}));

describe('BrandService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBrand', () => {
    it('should create a brand successfully with valid data', async () => {
      const mockBrand = {
        id: 'brand-1',
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'TEST',
        domain: 'test.com',
        business_category: 'restaurant',
        description: 'Test description',
        brand_settings: {},
        separation_readiness: {},
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const createRequest: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'TEST',
        domain: 'test.com',
        business_category: 'restaurant',
        description: 'Test description',
        is_active: true
      };

      // Mock successful response
      const { supabase } = require('@/lib/supabase');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockBrand, error: null })
      };
      supabase.from.mockReturnValue(mockChain);

      const result = await BrandService.createBrand(createRequest);

      expect(result).toEqual(mockBrand);
      expect(supabase.from).toHaveBeenCalledWith('brands');
    });

    it('should throw error when required fields are missing', async () => {
      const invalidRequest = {
        company_id: 'comp-1',
        name: '', // Missing name
        code: 'TEST',
        domain: 'test.com',
        business_category: 'restaurant' as const,
        is_active: true
      };

      await expect(BrandService.createBrand(invalidRequest))
        .rejects
        .toThrow('브랜드 이름은 필수입니다');
    });

    it('should throw error when brand code is invalid format', async () => {
      const invalidRequest: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'test-123', // Invalid format (should be uppercase, no special chars)
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      await expect(BrandService.createBrand(invalidRequest))
        .rejects
        .toThrow('브랜드 코드는 대문자와 숫자만 사용 가능합니다');
    });

    it('should throw error when domain format is invalid', async () => {
      const invalidRequest: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'TEST',
        domain: 'invalid-domain', // Invalid domain format
        business_category: 'restaurant',
        is_active: true
      };

      await expect(BrandService.createBrand(invalidRequest))
        .rejects
        .toThrow('올바른 도메인 형식을 입력해주세요');
    });

    it('should handle database errors gracefully', async () => {
      const createRequest: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'TEST',
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      // Mock database error
      const { supabase } = require('@/lib/supabase');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database connection failed' } })
      };
      supabase.from.mockReturnValue(mockChain);

      await expect(BrandService.createBrand(createRequest))
        .rejects
        .toThrow('Database connection failed');
    });

    it('should handle duplicate brand code error', async () => {
      const createRequest: CreateBrandRequest = {
        company_id: 'comp-1',
        name: 'Test Brand',
        code: 'EXISTING',
        domain: 'test.com',
        business_category: 'restaurant',
        is_active: true
      };

      // Mock duplicate key error
      const { supabase } = require('@/lib/supabase');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: null, 
          error: { 
            message: 'duplicate key value violates unique constraint brands_code_key',
            code: '23505'
          }
        })
      };
      supabase.from.mockReturnValue(mockChain);

      await expect(BrandService.createBrand(createRequest))
        .rejects
        .toThrow('이미 존재하는 브랜드 코드입니다');
    });
  });

  describe('getBrands', () => {
    it('should return list of brands', async () => {
      const mockBrands = [
          {
            id: 'brand-1',
            company_id: 'comp-1',
            name: 'Brand 1',
            code: 'BR1',
            domain: 'brand1.com',
            business_category: 'restaurant',
            description: undefined,
            brand_settings: {},
            separation_readiness: {},
            is_active: true
          },
          {
            id: 'brand-2',
            company_id: 'comp-1',
            name: 'Brand 2',
            code: 'BR2',
            domain: 'brand2.com',
            business_category: 'cafe',
            description: undefined,
            brand_settings: {},
            separation_readiness: {},
            is_active: true
          }
        ];

      const { supabase } = require('@/lib/supabase');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockBrands, error: null })
      };
      supabase.from.mockReturnValue(mockChain);

      const result = await BrandService.getBrands();

      expect(result).toEqual(mockBrands);
      expect(supabase.from).toHaveBeenCalledWith('brands');
    });
  });
});
// TASK-003: 브랜드 도메인 타입 정의

// 업종 카테고리 enum
export enum BusinessCategory {
  CAFE = 'cafe',
  RESTAURANT = 'restaurant',
  BAKERY = 'bakery',
  FAST_FOOD = 'fast_food',
  FINE_DINING = 'fine_dining',
  BAR = 'bar',
  DESSERT = 'dessert',
  FOOD_TRUCK = 'food_truck',
  CATERING = 'catering',
  OTHER = 'other'
}

export interface Brand {
  id: string;
  company_id: string;
  name: string;
  code: string;
  domain: string;
  business_category: BusinessCategory;
  description?: string;
  brand_settings: BrandSettings;
  separation_readiness: SeparationReadiness;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBrandRequest {
  company_id: string;
  name: string;
  code: string;
  domain: string;
  business_category: BusinessCategory;
  description?: string;
  brand_settings?: Record<string, any>;
  separation_readiness?: Record<string, any>;
  is_active?: boolean;
}

export interface UpdateBrandRequest {
  name?: string;
  code?: string;
  domain?: string;
  business_category?: BusinessCategory;
  description?: string;
  brand_settings?: BrandSettings;
  separation_readiness?: SeparationReadiness;
  is_active?: boolean;
}

export interface BrandSettings {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
    favicon?: string;
  };
  branding?: {
    displayName?: string;
    tagline?: string;
    description?: string;
  };
  features?: {
    onlineOrdering?: boolean;
    delivery?: boolean;
    loyalty?: boolean;
    reservations?: boolean;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
}

export interface SeparationReadiness {
  database?: {
    migrated?: boolean;
    lastMigrationDate?: string;
    pendingMigrations?: string[];
  };
  infrastructure?: {
    separateServer?: boolean;
    separateDatabase?: boolean;
    separateDomain?: boolean;
  };
  business?: {
    separateAccounting?: boolean;
    separateInventory?: boolean;
    separateStaff?: boolean;
  };
  readinessScore?: number; // 0-100
  estimatedSeparationDate?: string;
}

export type BrandCode = 'millab' | string;
export type BrandDomain = 'cafe-millab.com' | string;
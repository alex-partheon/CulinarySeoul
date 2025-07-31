// TASK-003: 회사-브랜드-매장 핵심 데이터 모델 타입 정의

export interface Company {
  id: string;
  name: string;
  domain: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyRequest {
  name?: string;
  domain?: string;
  settings?: Record<string, any>;
}

export interface UpdateCompanyRequest {
  name?: string;
  domain?: string;
  settings?: Record<string, any>;
}

export interface CompanySettings {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
  };
  features?: {
    multiTenant?: boolean;
    analytics?: boolean;
    reporting?: boolean;
  };
  integrations?: {
    payment?: string[];
    pos?: string[];
    delivery?: string[];
  };
}
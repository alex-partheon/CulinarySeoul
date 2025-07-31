// TASK-003: 도메인 모듈 메인 인덱스
// 회사-브랜드-매장 핵심 데이터 모델 통합 모듈

// 회사 도메인
export * from './company';

// 브랜드 도메인
export * from './brand';

// 매장 도메인
export * from './store';

// 재고 도메인
export * from './inventory';

// 도메인 서비스 집합
export { CompanyService } from './company/companyService';
export { BrandService } from './brand/brandService';
export { StoreService } from './store/storeService';

// 타입 집합
export type {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CompanySettings,
} from './company/types';

export type {
  Brand,
  CreateBrandRequest,
  UpdateBrandRequest,
  BrandSettings,
  SeparationReadiness,
} from './brand/types';

export type {
  Store,
  CreateStoreRequest,
  UpdateStoreRequest,
  StoreAddress,
  StoreContactInfo,
  OperatingHours,
  DaySchedule,
  HolidaySchedule,
} from './store/types';
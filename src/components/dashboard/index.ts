export { default as CompanyDashboard } from './CompanyDashboard';
export { default as BrandDashboard } from './BrandDashboard';
export { default as CategoryManagement } from './CategoryManagement';

export type { CompanyDashboardProps } from './CompanyDashboard';
export type { BrandDashboardProps } from './BrandDashboard';
export type { CategoryManagementProps } from './CategoryManagement';

// Re-export types for convenience
export type {
  Company,
  Brand,
  Store
} from '../../domains/types';

export { BusinessCategory } from '../../domains/brand/types';
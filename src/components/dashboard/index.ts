export { default as CompanyDashboard } from './CompanyDashboard';
export { default as BrandDashboard } from './BrandDashboard';
export { default as CategoryManagement } from './CategoryManagement';

export type { CompanyDashboardProps } from './CompanyDashboard';
export type { BrandDashboardProps } from './BrandDashboard';
export type { CategoryManagementProps } from './CategoryManagement';

// Export new dashboard components
export * from './MetricCard';
export * from './ActivityFeed';
export * from './QuickActions';
export * from './InventoryAlerts';
export * from './OrderSummary';
export * from './RecentActivity';
export * from './shared';
export * from './company';

// Re-export types for convenience
export type {
  Company,
  Brand,
  Store
} from '../../domains/types';

export { BusinessCategory } from '../../domains/brand/types';
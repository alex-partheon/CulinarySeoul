import type { Brand } from '../../../domains/brand/types';

export interface BrandMetrics {
  todaySales: number;
  activeStores: number;
  totalStores: number;
  lowStockAlerts: number;
  orderCount: number;
}

export interface BrandWithMetrics {
  brand: Brand;
  status: 'online' | 'offline' | 'issues';
  metrics: BrandMetrics;
  logo?: React.ReactNode;
}

export type BrandStatus = 'online' | 'offline' | 'issues';

export interface BrandStatusConfig {
  label: string;
  className: string;
  pulseClassName: string;
}
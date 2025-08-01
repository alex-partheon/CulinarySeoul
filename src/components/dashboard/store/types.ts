import type { Store } from '../../../domains/store/types';

export interface StoreMetrics {
  dailySales: number;
  dailyTarget: number;
  todayOrders: number;
  avgOrderValue: number;
  customersInStore: number;
  activeStaff: number;
  totalStaff: number;
  waitTime: number;
  queueLength: number;
  kitchenLoad: number;
  deliveryOrders: number;
}

export interface StoreWithMetrics {
  store: Store;
  status: 'open' | 'closed' | 'preparing' | 'emergency';
  metrics: StoreMetrics;
  healthScore: number;
  lastSync: Date;
}

export type StoreStatus = 'open' | 'closed' | 'preparing' | 'emergency';

export interface StoreStatusConfig {
  label: string;
  className: string;
  pulseClassName: string;
  icon: React.ElementType;
}

export interface RealtimeStoreMetrics {
  customersInStore: number;
  queueLength: number;
  averageWaitTime: number;
  kitchenLoad: number;
  deliveryOrders: number;
  temperature: number;
  isOnline: boolean;
}

export interface StoreOperationalData {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  address: string;
  manager: string;
  phone: string;
  openingHours: string;
  isOpen: boolean;
  hasDelivery: boolean;
  healthScore: number;
  emergencyMode: boolean;
  realtimeMetrics: RealtimeStoreMetrics;
}
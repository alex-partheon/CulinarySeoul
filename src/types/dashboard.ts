// Dashboard types
export interface DashboardMetrics {
  totalRevenue: number;
  orderCount: number;
  customerCount: number;
  avgOrderValue: number;
  growthRate: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface DashboardActivity {
  id: string;
  type: 'order' | 'customer' | 'product' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  icon?: string;
  link?: string;
}

// Connection and Sync Types
export interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  quality: 'excellent' | 'good' | 'poor' | 'offline';
  lastSync: Date | null;
  message?: string;
}

export interface SyncStatus {
  module: string;
  status: 'synced' | 'syncing' | 'pending' | 'error';
  lastSync: Date | null;
  itemsToSync?: number;
  progress?: number;
}

export interface SeparationStatus {
  dataCompleteness: {
    percentage: number;
    details: {
      inventory: number;
      orders: number;
      customers: number;
      suppliers: number;
      financials: number;
    };
  };
  systemReadiness: {
    percentage: number;
    details: {
      apiIntegration: boolean;
      paymentSetup: boolean;
      deliverySetup: boolean;
      taxConfiguration: boolean;
      backupSystem: boolean;
    };
  };
  independentCapability: {
    percentage: number;
    details: {
      operationalAutonomy: number;
      financialIndependence: number;
      systemStability: number;
      staffReadiness: number;
    };
  };
  estimatedTime: {
    days: number;
    confidence: 'high' | 'medium' | 'low';
    blockers: string[];
  };
  overallReadiness: number;
}

export interface SeparationActionItem {
  id: string;
  category: 'data' | 'system' | 'operational' | 'financial';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  completed: boolean;
  estimatedDays?: number;
}
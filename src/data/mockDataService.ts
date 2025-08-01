import {
  mockCompanies,
  mockBrands,
  mockStores,
  mockUsers,
  mockOrders,
  mockInventory,
  type MockCompany,
  type MockBrand,
  type MockStore,
  type MockUser,
  type MockOrder,
  type MockInventoryItem
} from './mockData';

export class MockDataService {
  // 회사 관련 메서드
  static getCompanies(): MockCompany[] {
    return mockCompanies;
  }

  static getCompany(id: string): MockCompany | undefined {
    return mockCompanies.find(c => c.id === id);
  }

  // 브랜드 관련 메서드
  static getBrands(): MockBrand[] {
    return mockBrands;
  }

  static getBrand(id: string): MockBrand | undefined {
    return mockBrands.find(b => b.id === id);
  }

  static getBrandsByCompany(companyId: string): MockBrand[] {
    return mockBrands.filter(b => b.company_id === companyId);
  }

  // 매장 관련 메서드
  static getStores(): MockStore[] {
    return mockStores;
  }

  static getStore(id: string): MockStore | undefined {
    return mockStores.find(s => s.id === id);
  }

  static getStoresByBrand(brandId: string): MockStore[] {
    return mockStores.filter(s => s.brand_id === brandId);
  }

  static getStoresByCompany(companyId: string): MockStore[] {
    const companyBrands = this.getBrandsByCompany(companyId);
    const brandIds = companyBrands.map(b => b.id);
    return mockStores.filter(s => brandIds.includes(s.brand_id));
  }

  // 사용자 관련 메서드
  static getUsers(): MockUser[] {
    return mockUsers;
  }

  static getUser(id: string): MockUser | undefined {
    return mockUsers.find(u => u.id === id);
  }

  static getUsersByCompany(companyId: string): MockUser[] {
    return mockUsers.filter(u => u.company_id === companyId);
  }

  // 주문 관련 메서드
  static getOrders(): MockOrder[] {
    return mockOrders;
  }

  static getOrdersByStore(storeId: string): MockOrder[] {
    return mockOrders.filter(o => o.store_id === storeId);
  }

  static getOrdersByBrand(brandId: string): MockOrder[] {
    const brandStores = this.getStoresByBrand(brandId);
    const storeIds = brandStores.map(s => s.id);
    return mockOrders.filter(o => storeIds.includes(o.store_id));
  }

  static getOrdersByCompany(companyId: string): MockOrder[] {
    const companyStores = this.getStoresByCompany(companyId);
    const storeIds = companyStores.map(s => s.id);
    return mockOrders.filter(o => storeIds.includes(o.store_id));
  }

  static getOrdersByCustomer(customerId: string): MockOrder[] {
    return mockOrders.filter(o => o.customer_id === customerId);
  }

  static getRecentOrders(storeId?: string, limit: number = 10): MockOrder[] {
    let orders = mockOrders;
    if (storeId) {
      orders = orders.filter(o => o.store_id === storeId);
    }
    return orders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  // 재고 관련 메서드
  static getInventory(): MockInventoryItem[] {
    return mockInventory;
  }

  static getInventoryByStore(storeId: string): MockInventoryItem[] {
    return mockInventory.filter(i => i.store_id === storeId);
  }

  static getLowStockItems(storeId?: string, threshold: number = 10): MockInventoryItem[] {
    let items = mockInventory;
    if (storeId) {
      items = items.filter(i => i.store_id === storeId);
    }
    return items.filter(i => i.current_stock <= threshold);
  }

  // 분석 데이터 메서드
  static getAnalyticsData(options: {
    storeId?: string;
    brandId?: string;
    companyId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    let orders = mockOrders;
    
    // 필터링
    if (options.storeId) {
      orders = orders.filter(o => o.store_id === options.storeId);
    } else if (options.brandId) {
      const brandStores = this.getStoresByBrand(options.brandId);
      const storeIds = brandStores.map(s => s.id);
      orders = orders.filter(o => storeIds.includes(o.store_id));
    } else if (options.companyId) {
      const companyStores = this.getStoresByCompany(options.companyId);
      const storeIds = companyStores.map(s => s.id);
      orders = orders.filter(o => storeIds.includes(o.store_id));
    }

    // 날짜 필터링
    if (options.startDate) {
      orders = orders.filter(o => new Date(o.created_at) >= options.startDate!);
    }
    if (options.endDate) {
      orders = orders.filter(o => new Date(o.created_at) <= options.endDate!);
    }

    // 분석 데이터 계산
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // 완료된 주문만으로 수익률 계산 (임시로 85% 가정)
    const completedOrders = orders.filter(o => o.status === 'completed');
    const profitMargin = 0.15; // 15% 수익률 가정
    
    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      profitMargin,
      completedOrders: completedOrders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      cancelledOrders: orders.filter(o => o.status === 'cancelled').length
    };
  }

  // 인기 상품 분석
  static getPopularProducts(options: {
    storeId?: string;
    brandId?: string;
    companyId?: string;
    limit?: number;
  } = {}) {
    let orders = mockOrders;
    const limit = options.limit || 10;
    
    // 필터링 로직 (위와 동일)
    if (options.storeId) {
      orders = orders.filter(o => o.store_id === options.storeId);
    } else if (options.brandId) {
      const brandStores = this.getStoresByBrand(options.brandId);
      const storeIds = brandStores.map(s => s.id);
      orders = orders.filter(o => storeIds.includes(o.store_id));
    } else if (options.companyId) {
      const companyStores = this.getStoresByCompany(options.companyId);
      const storeIds = companyStores.map(s => s.id);
      orders = orders.filter(o => storeIds.includes(o.store_id));
    }

    // 상품별 주문 횟수 계산
    const productCounts: { [key: string]: { name: string; count: number; revenue: number } } = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productCounts[item.product_id]) {
          productCounts[item.product_id] = {
            name: item.product_name,
            count: 0,
            revenue: 0
          };
        }
        productCounts[item.product_id].count += item.quantity;
        productCounts[item.product_id].revenue += item.price * item.quantity;
      });
    });

    return Object.entries(productCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}

export default MockDataService;
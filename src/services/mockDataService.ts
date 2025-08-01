// Mock data service for dashboard testing before Supabase integration

import {
  mockCompanies,
  mockBrands,
  mockStores,
  mockUsers,
  mockMenuCategories,
  mockMenuItems,
  mockCustomers,
  mockOrders,
  mockOrderItems,
  mockInventoryItems,
  getMockDataByRole,
  getMockAnalyticsData,
  getMockInventoryData,
  getMockMenuData,
  type MockCompany,
  type MockBrand,
  type MockStore,
  type MockUser,
  type MockMenuItem,
  type MockMenuCategory,
  type MockCustomer,
  type MockOrder,
  type MockOrderItem,
  type MockInventoryItem
} from '../data/mockData';

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class MockDataService {
  // Authentication
  static async getCurrentUser(): Promise<MockUser | null> {
    await delay(200);
    // For testing, return the first user (super admin)
    return mockUsers[0] || null;
  }

  static async getUserById(id: string): Promise<MockUser | null> {
    await delay(200);
    return mockUsers.find(user => user.id === id) || null;
  }

  // Companies
  static async getCompanies(): Promise<MockCompany[]> {
    await delay();
    return [...mockCompanies];
  }

  static async getCompanyById(id: string): Promise<MockCompany | null> {
    await delay();
    return mockCompanies.find(company => company.id === id) || null;
  }

  // Brands
  static async getBrands(companyId?: string): Promise<MockBrand[]> {
    await delay();
    if (companyId) {
      return mockBrands.filter(brand => brand.company_id === companyId);
    }
    return [...mockBrands];
  }

  static async getBrandById(id: string): Promise<MockBrand | null> {
    await delay();
    return mockBrands.find(brand => brand.id === id) || null;
  }

  // Stores
  static async getStores(brandId?: string): Promise<MockStore[]> {
    await delay();
    if (brandId) {
      return mockStores.filter(store => store.brand_id === brandId);
    }
    return [...mockStores];
  }

  static async getStoreById(id: string): Promise<MockStore | null> {
    await delay();
    return mockStores.find(store => store.id === id) || null;
  }

  static async getStoresByBrand(brandId: string): Promise<MockStore[]> {
    await delay();
    return mockStores.filter(store => store.brand_id === brandId);
  }

  // Menu Management
  static async getMenuCategories(brandId: string): Promise<MockMenuCategory[]> {
    await delay();
    return mockMenuCategories.filter(cat => cat.brand_id === brandId);
  }

  static async getMenuItems(brandId: string, categoryId?: string): Promise<MockMenuItem[]> {
    await delay();
    let items = mockMenuItems.filter(item => item.brand_id === brandId);
    if (categoryId) {
      items = items.filter(item => item.category_id === categoryId);
    }
    return items;
  }

  static async getMenuItemById(id: string): Promise<MockMenuItem | null> {
    await delay();
    return mockMenuItems.find(item => item.id === id) || null;
  }

  // Customer Management
  static async getCustomers(limit: number = 100, offset: number = 0): Promise<MockCustomer[]> {
    await delay();
    return mockCustomers.slice(offset, offset + limit);
  }

  static async getCustomerById(id: string): Promise<MockCustomer | null> {
    await delay();
    return mockCustomers.find(customer => customer.id === id) || null;
  }

  static async searchCustomers(query: string): Promise<MockCustomer[]> {
    await delay();
    const lowerQuery = query.toLowerCase();
    return mockCustomers.filter(customer => 
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email?.toLowerCase().includes(lowerQuery) ||
      customer.phone?.includes(query)
    );
  }

  // Order Management
  static async getOrders(
    storeId?: string, 
    status?: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<MockOrder[]> {
    await delay();
    let filteredOrders = [...mockOrders];
    
    if (storeId) {
      filteredOrders = filteredOrders.filter(order => order.store_id === storeId);
    }
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    return filteredOrders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(offset, offset + limit);
  }

  static async getOrderById(id: string): Promise<MockOrder | null> {
    await delay();
    return mockOrders.find(order => order.id === id) || null;
  }

  static async getOrderItems(orderId: string): Promise<MockOrderItem[]> {
    await delay();
    return mockOrderItems.filter(item => item.order_id === orderId);
  }

  static async getOrdersByCustomer(customerId: string): Promise<MockOrder[]> {
    await delay();
    return mockOrders.filter(order => order.customer_id === customerId);
  }

  // Inventory Management
  static async getInventoryItems(storeId: string): Promise<MockInventoryItem[]> {
    await delay();
    return getMockInventoryData(storeId);
  }

  static async getInventoryItemById(id: string): Promise<MockInventoryItem | null> {
    await delay();
    return mockInventoryItems.find(item => item.id === id) || null;
  }

  static async getLowStockItems(storeId: string): Promise<MockInventoryItem[]> {
    await delay();
    return mockInventoryItems.filter(item => 
      item.store_id === storeId && item.current_stock <= item.min_stock
    );
  }

  // Analytics
  static async getDashboardAnalytics(storeId?: string, brandId?: string) {
    await delay();
    return getMockAnalyticsData(storeId, brandId);
  }

  static async getSalesAnalytics(
    storeId?: string, 
    brandId?: string, 
    startDate?: string, 
    endDate?: string
  ) {
    await delay();
    
    let filteredOrders = [...mockOrders];
    
    if (storeId) {
      filteredOrders = filteredOrders.filter(order => order.store_id === storeId);
    } else if (brandId) {
      const brandStores = mockStores.filter(store => store.brand_id === brandId);
      const storeIds = brandStores.map(store => store.id);
      filteredOrders = filteredOrders.filter(order => storeIds.includes(order.store_id));
    }
    
    if (startDate) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.created_at) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.created_at) <= new Date(endDate)
      );
    }
    
    // Group by date
    const salesByDate = filteredOrders.reduce((acc, order) => {
      const date = order.created_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          revenue: 0,
          cost: 0,
          orders: 0,
          profit: 0
        };
      }
      acc[date].revenue += order.total_amount;
      acc[date].cost += order.total_cost;
      acc[date].orders += 1;
      acc[date].profit = acc[date].revenue - acc[date].cost;
      return acc;
    }, {} as Record<string, any>);
    
    return {
      totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total_amount, 0),
      totalCost: filteredOrders.reduce((sum, order) => sum + order.total_cost, 0),
      totalOrders: filteredOrders.length,
      avgOrderValue: filteredOrders.length > 0 
        ? filteredOrders.reduce((sum, order) => sum + order.total_amount, 0) / filteredOrders.length 
        : 0,
      salesByDate: Object.values(salesByDate),
      orders: filteredOrders
    };
  }

  static async getTopSellingItems(storeId?: string, brandId?: string, limit: number = 10) {
    await delay();
    
    let filteredOrderItems = [...mockOrderItems];
    
    if (storeId) {
      const storeOrders = mockOrders.filter(order => order.store_id === storeId);
      const orderIds = storeOrders.map(order => order.id);
      filteredOrderItems = filteredOrderItems.filter(item => orderIds.includes(item.order_id));
    } else if (brandId) {
      const brandStores = mockStores.filter(store => store.brand_id === brandId);
      const storeIds = brandStores.map(store => store.id);
      const brandOrders = mockOrders.filter(order => storeIds.includes(order.store_id));
      const orderIds = brandOrders.map(order => order.id);
      filteredOrderItems = filteredOrderItems.filter(item => orderIds.includes(item.order_id));
    }
    
    // Group by menu item
    const itemStats = filteredOrderItems.reduce((acc, orderItem) => {
      const menuItem = mockMenuItems.find(item => item.id === orderItem.menu_item_id);
      if (!menuItem) return acc;
      
      if (!acc[orderItem.menu_item_id]) {
        acc[orderItem.menu_item_id] = {
          id: orderItem.menu_item_id,
          name: menuItem.name,
          totalQuantity: 0,
          totalRevenue: 0,
          totalCost: 0,
          avgPrice: 0
        };
      }
      
      acc[orderItem.menu_item_id].totalQuantity += orderItem.quantity;
      acc[orderItem.menu_item_id].totalRevenue += orderItem.total_price;
      acc[orderItem.menu_item_id].totalCost += orderItem.total_cost;
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(itemStats)
      .map((item: any) => ({
        ...item,
        avgPrice: item.totalQuantity > 0 ? item.totalRevenue / item.totalQuantity : 0,
        profit: item.totalRevenue - item.totalCost,
        profitMargin: item.totalRevenue > 0 ? ((item.totalRevenue - item.totalCost) / item.totalRevenue) * 100 : 0
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  }

  // Permission-based data access
  static async getDataByUserRole(userId: string) {
    await delay();
    const user = await this.getUserById(userId);
    if (!user) return null;
    
    return getMockDataByRole(user.role, userId);
  }

  // Real-time updates simulation
  static subscribeToOrders(storeId: string, callback: (orders: MockOrder[]) => void) {
    // Simulate real-time order updates
    const interval = setInterval(async () => {
      const orders = await this.getOrders(storeId);
      callback(orders);
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }

  static subscribeToInventory(storeId: string, callback: (items: MockInventoryItem[]) => void) {
    // Simulate real-time inventory updates
    const interval = setInterval(async () => {
      const items = await this.getInventoryItems(storeId);
      callback(items);
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }

  // CRUD Operations (for testing)
  static async createOrder(orderData: Partial<MockOrder>): Promise<MockOrder> {
    await delay();
    const newOrder: MockOrder = {
      id: `order-${Date.now()}`,
      store_id: orderData.store_id!,
      customer_id: orderData.customer_id,
      order_number: `ORD-${new Date().toISOString().split('T')[0]}-${String(mockOrders.length + 1).padStart(3, '0')}`,
      total_amount: orderData.total_amount || 0,
      total_cost: orderData.total_cost || 0,
      status: orderData.status || 'pending',
      order_type: orderData.order_type || 'dine_in',
      payment_method: orderData.payment_method || 'card',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockOrders.push(newOrder);
    return newOrder;
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<MockOrder | null> {
    await delay();
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;
    
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status: status as any,
      updated_at: new Date().toISOString()
    };
    
    return mockOrders[orderIndex];
  }

  static async updateInventoryStock(itemId: string, newStock: number): Promise<MockInventoryItem | null> {
    await delay();
    const itemIndex = mockInventoryItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return null;
    
    mockInventoryItems[itemIndex] = {
      ...mockInventoryItems[itemIndex],
      current_stock: newStock,
      updated_at: new Date().toISOString()
    };
    
    return mockInventoryItems[itemIndex];
  }
}

// Export singleton instance
export const mockDataService = MockDataService;
export default mockDataService;
// Mock data for dashboard testing before Supabase integration

export interface MockCompany {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface MockBrand {
  id: string;
  company_id: string;
  name: string;
  category: string;
  description: string;
  logo_url?: string;
  website_url?: string;
  code: string;
  domain?: string;
  business_category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MockStore {
  id: string;
  brand_id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  manager_name?: string;
  store_type: 'flagship' | 'franchise' | 'popup';
  status: 'active' | 'inactive' | 'maintenance';
  opening_hours?: string;
  code: string;
  description: string;
  is_active: boolean;
  contact_info: {
    phone: string;
    email: string;
    manager_name?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'company_admin' | 'brand_manager' | 'store_manager';
  company_id?: string;
  brand_id?: string;
  store_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MockMenuItem {
  id: string;
  brand_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface MockMenuCategory {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MockCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  total_orders: number;
  total_spent: number;
  last_visit?: string;
  created_at: string;
  updated_at: string;
}

export interface MockOrder {
  id: string;
  store_id: string;
  customer_id?: string;
  customer_name: string;
  order_number: string;
  total_amount: number;
  total_cost: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  order_type: 'dine_in' | 'takeout' | 'delivery';
  payment_method: 'cash' | 'card' | 'mobile';
  created_at: string;
  updated_at: string;
}

export interface MockOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  total_price: number;
  total_cost: number;
  notes?: string;
  created_at: string;
}

export interface MockInventoryItem {
  id: string;
  store_id: string;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  unit_cost: number;
  supplier_id?: string;
  supplier: string;
  last_restocked?: string;
  created_at: string;
  updated_at: string;
}

// Mock Companies
export const mockCompanies: MockCompany[] = [
  {
    id: 'comp-1',
    name: '컬리너리서울',
    description: '프리미엄 한식 레스토랑 체인',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Brands
export const mockBrands: MockBrand[] = [
  {
    id: 'brand-1',
    company_id: 'comp-1',
    name: '한식당',
    category: 'Korean Restaurant',
    description: '전통 한식을 현대적으로 재해석한 레스토랑',
    logo_url: '/logos/hansikdang.png',
    website_url: 'https://hansikdang.co.kr',
    code: 'HANSIK',
    domain: 'hansikdang.co.kr',
    business_category: 'restaurant',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'brand-2',
    company_id: 'comp-1',
    name: '카페서울',
    category: 'Cafe',
    description: '프리미엄 커피와 디저트를 제공하는 카페',
    logo_url: '/logos/cafe-seoul.png',
    website_url: 'https://cafeseoul.co.kr',
    code: 'CAFE_SEOUL',
    domain: 'cafeseoul.co.kr',
    business_category: 'cafe',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'brand-3',
    company_id: 'comp-1',
    name: '분식마을',
    category: 'Street Food',
    description: '전통 분식을 현대적으로 업그레이드한 브랜드',
    logo_url: '/logos/bunsik-village.png',
    website_url: 'https://bunsikvillage.co.kr',
    code: 'BUNSIK',
    domain: 'bunsikvillage.co.kr',
    business_category: 'street_food',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Stores
export const mockStores: MockStore[] = [
  {
    id: 'store-1',
    brand_id: 'brand-1',
    name: '한식당 강남점',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    email: 'gangnam@hansikdang.com',
    manager_name: '김매니저',
    store_type: 'flagship',
    status: 'active',
    opening_hours: '11:00-22:00',
    code: 'HANSIK_GANGNAM',
    description: '강남 비즈니스 중심가의 프리미엄 한식당',
    is_active: true,
    contact_info: {
      phone: '02-1234-5678',
      email: 'gangnam@hansikdang.com',
      manager_name: '김매니저'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'store-2',
    brand_id: 'brand-1',
    name: '한식당 홍대점',
    address: '서울시 마포구 홍익로 456',
    phone: '02-2345-6789',
    email: 'hongdae@hansikdang.com',
    manager_name: '이매니저',
    store_type: 'franchise',
    status: 'active',
    opening_hours: '11:00-23:00',
    code: 'HANSIK_HONGDAE',
    description: '홍대 젊음의 거리 한식당',
    is_active: true,
    contact_info: {
      phone: '02-2345-6789',
      email: 'hongdae@hansikdang.com',
      manager_name: '이매니저'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'store-3',
    brand_id: 'brand-2',
    name: '카페서울 신촌점',
    address: '서울시 서대문구 신촌로 789',
    phone: '02-3456-7890',
    email: 'sinchon@cafe-seoul.com',
    manager_name: '박매니저',
    store_type: 'flagship',
    status: 'active',
    opening_hours: '07:00-22:00',
    code: 'CAFE_SINCHON',
    description: '신촌 대학가의 모던 카페',
    is_active: true,
    contact_info: {
      phone: '02-3456-7890',
      email: 'sinchon@cafe-seoul.com',
      manager_name: '박매니저'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'store-4',
    brand_id: 'brand-3',
    name: '분식마을 명동점',
    address: '서울시 중구 명동길 321',
    phone: '02-4567-8901',
    email: 'myeongdong@bunsik-village.com',
    manager_name: '최매니저',
    store_type: 'franchise',
    status: 'active',
    opening_hours: '10:00-21:00',
    code: 'BUNSIK_MYEONGDONG',
    description: '명동 관광지의 전통 분식집',
    is_active: true,
    contact_info: {
      phone: '02-4567-8901',
      email: 'myeongdong@bunsik-village.com',
      manager_name: '최매니저'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'admin@culinaryseoul.com',
    name: '김광일',
    role: 'super_admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    email: 'company@culinaryseoul.com',
    name: '이회사',
    role: 'company_admin',
    company_id: 'comp-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-3',
    email: 'brand@hansikdang.com',
    name: '박브랜드',
    role: 'brand_manager',
    company_id: 'comp-1',
    brand_id: 'brand-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-4',
    email: 'store@hansikdang.com',
    name: '김매니저',
    role: 'store_manager',
    company_id: 'comp-1',
    brand_id: 'brand-1',
    store_id: 'store-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Menu Categories
export const mockMenuCategories: MockMenuCategory[] = [
  {
    id: 'cat-1',
    brand_id: 'brand-1',
    name: '메인요리',
    description: '대표 한식 메인 요리',
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-2',
    brand_id: 'brand-1',
    name: '사이드메뉴',
    description: '반찬 및 사이드 메뉴',
    sort_order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-3',
    brand_id: 'brand-2',
    name: '커피',
    description: '프리미엄 원두 커피',
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-4',
    brand_id: 'brand-2',
    name: '디저트',
    description: '수제 케이크 및 디저트',
    sort_order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Menu Items
export const mockMenuItems: MockMenuItem[] = [
  {
    id: 'item-1',
    brand_id: 'brand-1',
    category_id: 'cat-1',
    name: '불고기정식',
    description: '프리미엄 한우 불고기와 반찬 구성',
    price: 18000,
    cost: 8000,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-2',
    brand_id: 'brand-1',
    category_id: 'cat-1',
    name: '비빔밥',
    description: '신선한 나물과 고추장 비빔밥',
    price: 12000,
    cost: 5000,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-3',
    brand_id: 'brand-2',
    category_id: 'cat-3',
    name: '아메리카노',
    description: '에티오피아 원두 아메리카노',
    price: 4500,
    cost: 1500,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-4',
    brand_id: 'brand-2',
    category_id: 'cat-4',
    name: '티라미수',
    description: '수제 티라미수 케이크',
    price: 6500,
    cost: 2500,
    is_available: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Customers
export const mockCustomers: MockCustomer[] = [
  {
    id: 'cust-1',
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    birth_date: '1985-05-15',
    gender: 'male',
    total_orders: 15,
    total_spent: 450000,
    last_visit: '2024-02-01T18:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-02-01T18:30:00Z'
  },
  {
    id: 'cust-2',
    name: '김영희',
    email: 'kim@example.com',
    phone: '010-2345-6789',
    birth_date: '1990-08-22',
    gender: 'female',
    total_orders: 8,
    total_spent: 180000,
    last_visit: '2024-01-28T12:15:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-28T12:15:00Z'
  }
];

// Mock Orders
export const mockOrders: MockOrder[] = [
  {
    id: 'order-1',
    store_id: 'store-1',
    customer_id: 'cust-1',
    customer_name: '홍길동',
    order_number: 'ORD-20240201-001',
    total_amount: 30000,
    total_cost: 13000,
    status: 'completed',
    order_type: 'dine_in',
    payment_method: 'card',
    created_at: '2024-02-01T18:30:00Z',
    updated_at: '2024-02-01T19:15:00Z'
  },
  {
    id: 'order-2',
    store_id: 'store-1',
    customer_id: 'cust-2',
    customer_name: '김영희',
    order_number: 'ORD-20240201-002',
    total_amount: 18000,
    total_cost: 8000,
    status: 'completed',
    order_type: 'takeout',
    payment_method: 'mobile',
    created_at: '2024-02-01T19:45:00Z',
    updated_at: '2024-02-01T20:15:00Z'
  },
  {
    id: 'order-3',
    store_id: 'store-3',
    customer_name: '익명고객',
    order_number: 'ORD-20240202-001',
    total_amount: 11000,
    total_cost: 4000,
    status: 'preparing',
    order_type: 'dine_in',
    payment_method: 'card',
    created_at: '2024-02-02T10:30:00Z',
    updated_at: '2024-02-02T10:35:00Z'
  }
];

// Mock Order Items
export const mockOrderItems: MockOrderItem[] = [
  {
    id: 'oi-1',
    order_id: 'order-1',
    menu_item_id: 'item-1',
    quantity: 1,
    unit_price: 18000,
    unit_cost: 8000,
    total_price: 18000,
    total_cost: 8000,
    created_at: '2024-02-01T18:30:00Z'
  },
  {
    id: 'oi-2',
    order_id: 'order-1',
    menu_item_id: 'item-2',
    quantity: 1,
    unit_price: 12000,
    unit_cost: 5000,
    total_price: 12000,
    total_cost: 5000,
    created_at: '2024-02-01T18:30:00Z'
  },
  {
    id: 'oi-3',
    order_id: 'order-2',
    menu_item_id: 'item-1',
    quantity: 1,
    unit_price: 18000,
    unit_cost: 8000,
    total_price: 18000,
    total_cost: 8000,
    created_at: '2024-02-01T19:45:00Z'
  },
  {
    id: 'oi-4',
    order_id: 'order-3',
    menu_item_id: 'item-3',
    quantity: 2,
    unit_price: 4500,
    unit_cost: 1500,
    total_price: 9000,
    total_cost: 3000,
    created_at: '2024-02-02T10:30:00Z'
  },
  {
    id: 'oi-5',
    order_id: 'order-3',
    menu_item_id: 'item-4',
    quantity: 1,
    unit_price: 6500,
    unit_cost: 2500,
    total_price: 6500,
    total_cost: 2500,
    notes: '설탕 적게',
    created_at: '2024-02-02T10:30:00Z'
  }
];

// Mock Inventory Items
export const mockInventoryItems: MockInventoryItem[] = [
  {
    id: 'inv-1',
    store_id: 'store-1',
    name: '한우 등심',
    category: '육류',
    unit: 'kg',
    current_stock: 25.5,
    min_stock: 10.0,
    max_stock: 50.0,
    unit_cost: 45000,
    supplier_id: 'sup-1',
    supplier: '한우농장',
    last_restocked: '2024-01-30T09:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-30T09:00:00Z'
  },
  {
    id: 'inv-2',
    store_id: 'store-1',
    name: '쌀',
    category: '곡물',
    unit: 'kg',
    current_stock: 180.0,
    min_stock: 50.0,
    max_stock: 200.0,
    unit_cost: 3500,
    supplier_id: 'sup-2',
    supplier: '농협',
    last_restocked: '2024-01-28T14:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-28T14:00:00Z'
  },
  {
    id: 'inv-3',
    store_id: 'store-3',
    name: '원두 (에티오피아)',
    category: '음료',
    unit: 'kg',
    current_stock: 12.5,
    min_stock: 5.0,
    max_stock: 20.0,
    unit_cost: 28000,
    supplier_id: 'sup-3',
    supplier: '커피빈컴퍼니',
    last_restocked: '2024-01-29T11:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-29T11:00:00Z'
  },
  {
    id: 'inv-4',
    store_id: 'store-3',
    name: '마스카포네 치즈',
    category: '유제품',
    unit: 'kg',
    current_stock: 3.2,
    min_stock: 2.0,
    max_stock: 10.0,
    unit_cost: 18000,
    supplier_id: 'sup-4',
    supplier: '이탈리아치즈',
    last_restocked: '2024-01-31T16:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-31T16:00:00Z'
  }
];

// Helper functions to get mock data
export const getMockDataByRole = (role: string, userId: string) => {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return null;

  switch (role) {
    case 'super_admin':
      return {
        companies: mockCompanies,
        brands: mockBrands,
        stores: mockStores,
        users: mockUsers
      };
    
    case 'company_admin':
      const companyBrands = mockBrands.filter(b => b.company_id === user.company_id);
      const companyStores = mockStores.filter(s => 
        companyBrands.some(b => b.id === s.brand_id)
      );
      return {
        companies: mockCompanies.filter(c => c.id === user.company_id),
        brands: companyBrands,
        stores: companyStores,
        users: mockUsers.filter(u => u.company_id === user.company_id)
      };
    
    case 'brand_manager':
      const brandStores = mockStores.filter(s => s.brand_id === user.brand_id);
      return {
        brands: mockBrands.filter(b => b.id === user.brand_id),
        stores: brandStores,
        users: mockUsers.filter(u => u.brand_id === user.brand_id)
      };
    
    case 'store_manager':
      return {
        stores: mockStores.filter(s => s.id === user.store_id),
        users: mockUsers.filter(u => u.store_id === user.store_id)
      };
    
    default:
      return null;
  }
};

export const getMockAnalyticsData = (storeId?: string, brandId?: string) => {
  const filteredOrders = storeId 
    ? mockOrders.filter(o => o.store_id === storeId)
    : brandId 
    ? mockOrders.filter(o => {
        const store = mockStores.find(s => s.id === o.store_id);
        return store?.brand_id === brandId;
      })
    : mockOrders;

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalCost = filteredOrders.reduce((sum, order) => sum + order.total_cost, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;

  return {
    totalRevenue,
    totalCost,
    totalOrders,
    avgOrderValue,
    profitMargin,
    orders: filteredOrders
  };
};

export const getMockInventoryData = (storeId: string) => {
  return mockInventoryItems.filter(item => item.store_id === storeId);
};

export const getMockMenuData = (brandId: string) => {
  const categories = mockMenuCategories.filter(cat => cat.brand_id === brandId);
  const items = mockMenuItems.filter(item => item.brand_id === brandId);
  
  return {
    categories,
    items
  };
};
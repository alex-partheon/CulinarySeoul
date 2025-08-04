/**
 * 테스트용 계정 데이터
 * 
 * 실제 Clerk에 생성된 테스트 계정들의 정보를 포함합니다.
 * 이 데이터는 인증 테스트에서 사용됩니다.
 */

export interface TestAccount {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  publicMetadata: Record<string, any>;
  expectedPermissions: string[];
  restrictedAccess: string[];
}

export const testAccounts: Record<string, TestAccount> = {
  superAdmin: {
    email: 'alex@culinaryseoul.com',
    password: 'rlarhkdlf3!@',
    username: 'alex_ceo',
    firstName: '김광일',
    lastName: '(대표이사)',
    role: 'super_admin',
    publicMetadata: {
      role: 'super_admin',
      companyName: '컬리너리서울',
      department: '경영진',
      position: '대표이사',
      createdDate: '2025-01-27'
    },
    expectedPermissions: [
      'company:read',
      'company:write',
      'company:delete',
      'brand:read',
      'brand:write',
      'brand:delete',
      'store:read',
      'store:write',
      'store:delete',
      'user:read',
      'user:write',
      'user:delete',
      'analytics:read',
      'analytics:write',
      'system:admin'
    ],
    restrictedAccess: [] // Super Admin은 제한 없음
  },

  companyAdmin: {
    email: 'company.admin@culinaryseoul.com',
    password: 'CompanyAdmin123!@',
    username: 'company_admin',
    firstName: '박영희',
    lastName: '(운영이사)',
    role: 'company_admin',
    publicMetadata: {
      role: 'company_admin',
      companyName: '컬리너리서울',
      department: '운영'
    },
    expectedPermissions: [
      'company:read',
      'company:write',
      'brand:read',
      'brand:write',
      'store:read',
      'store:write',
      'user:read',
      'user:write',
      'analytics:read'
    ],
    restrictedAccess: [
      'system:admin',
      'company:delete',
      'brand:delete',
      'store:delete',
      'user:delete'
    ]
  },

  companyAnalyst: {
    email: 'company.analyst@culinaryseoul.com',
    password: 'CompanyAnalyst123!@',
    username: 'company_analyst',
    firstName: '이민수',
    lastName: '(데이터분석가)',
    role: 'company_general_admin',
    publicMetadata: {
      role: 'company_general_admin',
      companyName: '컬리너리서울',
      department: '데이터분석'
    },
    expectedPermissions: [
      'company:read',
      'brand:read',
      'store:read',
      'analytics:read',
      'analytics:write'
    ],
    restrictedAccess: [
      'company:write',
      'company:delete',
      'brand:write',
      'brand:delete',
      'store:write',
      'store:delete',
      'user:write',
      'user:delete',
      'system:admin'
    ]
  },

  brandManagerMillab: {
    email: 'brand.millab@culinaryseoul.com',
    password: 'BrandMillab123!@',
    username: 'brand_millab',
    firstName: '최수진',
    lastName: '(밀라브 브랜드매니저)',
    role: 'brand_manager',
    publicMetadata: {
      role: 'brand_manager',
      brandId: 'millab',
      brandName: '밀라브'
    },
    expectedPermissions: [
      'brand:read:millab',
      'brand:write:millab',
      'store:read:millab',
      'store:write:millab',
      'analytics:read:millab'
    ],
    restrictedAccess: [
      'brand:read:cafebene',
      'brand:write:cafebene',
      'store:read:cafebene',
      'store:write:cafebene',
      'company:write',
      'company:delete',
      'brand:delete',
      'store:delete',
      'system:admin'
    ]
  },

  brandManagerCafebene: {
    email: 'brand.cafebene@culinaryseoul.com',
    password: 'BrandCafebene123!@',
    username: 'brand_cafebene',
    firstName: '정현우',
    lastName: '(카페베네 브랜드매니저)',
    role: 'brand_manager',
    publicMetadata: {
      role: 'brand_manager',
      brandId: 'cafebene',
      brandName: '카페베네'
    },
    expectedPermissions: [
      'brand:read:cafebene',
      'brand:write:cafebene',
      'store:read:cafebene',
      'store:write:cafebene',
      'analytics:read:cafebene'
    ],
    restrictedAccess: [
      'brand:read:millab',
      'brand:write:millab',
      'store:read:millab',
      'store:write:millab',
      'company:write',
      'company:delete',
      'brand:delete',
      'store:delete',
      'system:admin'
    ]
  },

  storeManagerGangnam: {
    email: 'store.gangnam@culinaryseoul.com',
    password: 'StoreGangnam123!@',
    username: 'store_gangnam',
    firstName: '김지영',
    lastName: '(강남점 매니저)',
    role: 'store_manager',
    publicMetadata: {
      role: 'store_manager',
      storeId: 'gangnam',
      storeName: '강남점',
      brandId: 'millab'
    },
    expectedPermissions: [
      'store:read:gangnam',
      'store:write:gangnam',
      'analytics:read:gangnam'
    ],
    restrictedAccess: [
      'store:read:hongdae',
      'store:write:hongdae',
      'brand:write',
      'brand:delete',
      'company:write',
      'company:delete',
      'store:delete',
      'system:admin'
    ]
  },

  storeManagerHongdae: {
    email: 'store.hongdae@culinaryseoul.com',
    password: 'StoreHongdae123!@',
    username: 'store_hongdae',
    firstName: '이상호',
    lastName: '(홍대점 매니저)',
    role: 'store_manager',
    publicMetadata: {
      role: 'store_manager',
      storeId: 'hongdae',
      storeName: '홍대점',
      brandId: 'cafebene'
    },
    expectedPermissions: [
      'store:read:hongdae',
      'store:write:hongdae',
      'analytics:read:hongdae'
    ],
    restrictedAccess: [
      'store:read:gangnam',
      'store:write:gangnam',
      'brand:write',
      'brand:delete',
      'company:write',
      'company:delete',
      'store:delete',
      'system:admin'
    ]
  },

  employeeGangnam: {
    email: 'staff.gangnam@culinaryseoul.com',
    password: 'StaffGangnam123!@',
    username: 'staff_gangnam',
    firstName: '박민지',
    lastName: '(강남점 바리스타)',
    role: 'employee',
    publicMetadata: {
      role: 'employee',
      storeId: 'gangnam',
      storeName: '강남점',
      brandId: 'millab',
      position: '바리스타'
    },
    expectedPermissions: [
      'store:read:gangnam:basic',
      'inventory:read:gangnam',
      'order:read:gangnam'
    ],
    restrictedAccess: [
      'store:write',
      'store:delete',
      'brand:read',
      'brand:write',
      'brand:delete',
      'company:read',
      'company:write',
      'company:delete',
      'analytics:read',
      'analytics:write',
      'user:write',
      'user:delete',
      'system:admin'
    ]
  },

  employeeHongdae: {
    email: 'staff.hongdae@culinaryseoul.com',
    password: 'StaffHongdae123!@',
    username: 'staff_hongdae',
    firstName: '조은별',
    lastName: '(홍대점 서빙)',
    role: 'employee',
    publicMetadata: {
      role: 'employee',
      storeId: 'hongdae',
      storeName: '홍대점',
      brandId: 'cafebene',
      position: '서빙'
    },
    expectedPermissions: [
      'store:read:hongdae:basic',
      'inventory:read:hongdae',
      'order:read:hongdae'
    ],
    restrictedAccess: [
      'store:write',
      'store:delete',
      'brand:read',
      'brand:write',
      'brand:delete',
      'company:read',
      'company:write',
      'company:delete',
      'analytics:read',
      'analytics:write',
      'user:write',
      'user:delete',
      'system:admin'
    ]
  }
};

/**
 * 역할별 기본 권한 매핑
 */
export const rolePermissions: Record<string, string[]> = {
  super_admin: [
    'company:*',
    'brand:*',
    'store:*',
    'user:*',
    'analytics:*',
    'system:*'
  ],
  company_admin: [
    'company:read',
    'company:write',
    'brand:read',
    'brand:write',
    'store:read',
    'store:write',
    'user:read',
    'user:write',
    'analytics:read'
  ],
  company_general_admin: [
    'company:read',
    'brand:read',
    'store:read',
    'analytics:read',
    'analytics:write'
  ],
  brand_manager: [
    'brand:read:own',
    'brand:write:own',
    'store:read:own',
    'store:write:own',
    'analytics:read:own'
  ],
  store_manager: [
    'store:read:own',
    'store:write:own',
    'analytics:read:own'
  ],
  employee: [
    'store:read:own:basic',
    'inventory:read:own',
    'order:read:own'
  ]
};

/**
 * 테스트 시나리오별 데이터
 */
export const testScenarios = {
  crossBrandAccess: {
    description: '다른 브랜드 데이터 접근 시도',
    testCases: [
      {
        user: 'brandManagerMillab',
        attemptAccess: 'brand:read:cafebene',
        expectedResult: 'denied'
      },
      {
        user: 'brandManagerCafebene',
        attemptAccess: 'brand:read:millab',
        expectedResult: 'denied'
      }
    ]
  },
  crossStoreAccess: {
    description: '다른 매장 데이터 접근 시도',
    testCases: [
      {
        user: 'storeManagerGangnam',
        attemptAccess: 'store:read:hongdae',
        expectedResult: 'denied'
      },
      {
        user: 'storeManagerHongdae',
        attemptAccess: 'store:read:gangnam',
        expectedResult: 'denied'
      },
      {
        user: 'employeeGangnam',
        attemptAccess: 'store:read:hongdae',
        expectedResult: 'denied'
      },
      {
        user: 'employeeHongdae',
        attemptAccess: 'store:read:gangnam',
        expectedResult: 'denied'
      }
    ]
  },
  privilegeEscalation: {
    description: '권한 상승 시도',
    testCases: [
      {
        user: 'employeeGangnam',
        attemptAccess: 'store:write:gangnam',
        expectedResult: 'denied'
      },
      {
        user: 'storeManagerGangnam',
        attemptAccess: 'brand:write:millab',
        expectedResult: 'denied'
      },
      {
        user: 'brandManagerMillab',
        attemptAccess: 'company:write',
        expectedResult: 'denied'
      }
    ]
  }
};
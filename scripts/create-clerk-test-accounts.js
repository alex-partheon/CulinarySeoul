/**
 * Clerk 테스트 계정 생성 스크립트
 * 
 * 이 스크립트는 test-accounts.md에 정의된 테스트 계정들을
 * Clerk API를 사용하여 자동으로 생성합니다.
 */

import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 로드
dotenv.config({ path: join(__dirname, '../.env.local') });

// Clerk 클라이언트 초기화
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

// 테스트 계정 정의
const testAccounts = [
  {
    email: 'alex@culinaryseoul.com',
    username: 'alex_ceo',
    password: 'rlarhkdlf3!@',
    firstName: '김광일',
    lastName: '(대표이사)',
    publicMetadata: {
      role: 'super_admin',
      companyName: '컬리너리서울',
      department: '경영진',
      position: '대표이사',
      createdDate: '2025-01-27'
    }
  },
  {
    email: 'company.admin@culinaryseoul.com',
    username: 'company_admin',
    password: 'CompanyAdmin123!@',
    firstName: '박영희',
    lastName: '(운영이사)',
    publicMetadata: {
      role: 'company_admin',
      companyName: '컬리너리서울',
      department: '운영'
    }
  },
  {
    email: 'company.analyst@culinaryseoul.com',
    username: 'company_analyst',
    password: 'CompanyAnalyst123!@',
    firstName: '이민수',
    lastName: '(데이터분석가)',
    publicMetadata: {
      role: 'company_general_admin',
      companyName: '컬리너리서울',
      department: '데이터분석'
    }
  },
  {
    email: 'brand.millab@culinaryseoul.com',
    username: 'brand_millab',
    password: 'BrandMillab123!@',
    firstName: '최수진',
    lastName: '(밀라브 브랜드매니저)',
    publicMetadata: {
      role: 'brand_manager',
      brandId: 'millab',
      brandName: '밀라브'
    }
  },
  {
    email: 'brand.cafebene@culinaryseoul.com',
    username: 'brand_cafebene',
    password: 'BrandCafebene123!@',
    firstName: '정현우',
    lastName: '(카페베네 브랜드매니저)',
    publicMetadata: {
      role: 'brand_manager',
      brandId: 'cafebene',
      brandName: '카페베네'
    }
  },
  {
    email: 'store.gangnam@culinaryseoul.com',
    username: 'store_gangnam',
    password: 'StoreGangnam123!@',
    firstName: '김지영',
    lastName: '(강남점 매니저)',
    publicMetadata: {
      role: 'store_manager',
      storeId: 'gangnam',
      storeName: '강남점',
      brandId: 'millab'
    }
  },
  {
    email: 'store.hongdae@culinaryseoul.com',
    username: 'store_hongdae',
    password: 'StoreHongdae123!@',
    firstName: '이상호',
    lastName: '(홍대점 매니저)',
    publicMetadata: {
      role: 'store_manager',
      storeId: 'hongdae',
      storeName: '홍대점',
      brandId: 'cafebene'
    }
  },
  {
    email: 'staff.gangnam@culinaryseoul.com',
    username: 'staff_gangnam',
    password: 'StaffGangnam123!@',
    firstName: '박민지',
    lastName: '(강남점 바리스타)',
    publicMetadata: {
      role: 'employee',
      storeId: 'gangnam',
      storeName: '강남점',
      brandId: 'millab',
      position: '바리스타'
    }
  },
  {
    email: 'staff.hongdae@culinaryseoul.com',
    username: 'staff_hongdae',
    password: 'StaffHongdae123!@',
    firstName: '조은별',
    lastName: '(홍대점 서빙)',
    publicMetadata: {
      role: 'employee',
      storeId: 'hongdae',
      storeName: '홍대점',
      brandId: 'cafebene',
      position: '서빙'
    }
  }
];

/**
 * 단일 사용자 생성 함수
 */
async function createUser(accountData) {
  try {
    console.log(`\n📧 Creating user: ${accountData.email}`);
    
    const userData = {
      emailAddress: [accountData.email],
      username: accountData.username,
      password: accountData.password,
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      publicMetadata: accountData.publicMetadata,
      skipPasswordChecks: true, // 개발 환경에서 비밀번호 정책 우회
      skipPasswordRequirement: false
    };

    const user = await clerkClient.users.createUser(userData);
    
    console.log(`✅ Successfully created user: ${accountData.email}`);
    console.log(`   - User ID: ${user.id}`);
    console.log(`   - Name: ${accountData.firstName} ${accountData.lastName}`);
    console.log(`   - Role: ${accountData.publicMetadata.role}`);
    
    return user;
  } catch (error) {
    if (error.errors && error.errors[0]?.code === 'form_identifier_exists') {
      console.log(`⚠️  User already exists: ${accountData.email}`);
      return null;
    } else {
      console.error(`❌ Error creating user ${accountData.email}:`, error.errors || error.message);
      throw error;
    }
  }
}

/**
 * 모든 테스트 계정 생성 함수
 */
async function createAllTestAccounts() {
  console.log('🚀 Starting Clerk test account creation...');
  console.log(`📊 Total accounts to create: ${testAccounts.filter(acc => !acc.skip).length}`);
  
  const results = {
    created: [],
    existing: [],
    failed: []
  };

  for (const account of testAccounts) {
    if (account.skip) {
      console.log(`⏭️  Skipping: ${account.email} (already exists)`);
      results.existing.push(account.email);
      continue;
    }

    try {
      const user = await createUser(account);
      if (user) {
        results.created.push(account.email);
      } else {
        results.existing.push(account.email);
      }
      
      // API 레이트 리밋 방지를 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      results.failed.push({
        email: account.email,
        error: error.message
      });
    }
  }

  // 결과 요약
  console.log('\n📋 Creation Summary:');
  console.log(`✅ Created: ${results.created.length}`);
  console.log(`⚠️  Already existed: ${results.existing.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.created.length > 0) {
    console.log('\n🎉 Successfully created accounts:');
    results.created.forEach(email => console.log(`   - ${email}`));
  }
  
  if (results.existing.length > 0) {
    console.log('\n📝 Already existing accounts:');
    results.existing.forEach(email => console.log(`   - ${email}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\n💥 Failed to create:');
    results.failed.forEach(item => {
      console.log(`   - ${item.email}: ${item.error}`);
    });
  }
  
  console.log('\n🏁 Test account creation completed!');
  console.log('\n📖 Next steps:');
  console.log('   1. Test login with each account');
  console.log('   2. Verify role-based access controls');
  console.log('   3. Check data scope restrictions');
  console.log('   4. Update test-accounts.md with creation status');
  
  return results;
}

/**
 * 기존 사용자 목록 조회 함수
 */
async function listExistingUsers() {
  try {
    console.log('📋 Fetching existing users from Clerk...');
    const users = await clerkClient.users.getUserList({ limit: 50 });
    
    console.log(`\n👥 Found ${users.data.length} existing users:`);
    users.data.forEach(user => {
      const role = user.publicMetadata?.role || 'no-role';
      console.log(`   - ${user.emailAddresses[0]?.emailAddress} (${role})`);
    });
    
    return users.data;
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
    throw error;
  }
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'list') {
    listExistingUsers()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else if (command === 'create') {
    createAllTestAccounts()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    console.log('Usage:');
    console.log('  node create-clerk-test-accounts.js list    # 기존 사용자 목록 조회');
    console.log('  node create-clerk-test-accounts.js create  # 테스트 계정 생성');
    process.exit(1);
  }
}

export {
  createAllTestAccounts,
  listExistingUsers,
  createUser
};
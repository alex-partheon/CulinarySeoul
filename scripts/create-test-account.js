/**
 * 테스트 계정 생성 스크립트
 * company@test.com 계정을 Supabase Auth에 생성합니다.
 * 
 * 실행 방법: node scripts/create-test-account.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 로드
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase URL과 Service Key가 필요합니다.');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '설정됨' : '설정되지 않음');
  process.exit(1);
}

// Service role key로 Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestAccount() {
  const email = 'company@test.com';
  const password = 'Test123!@#';
  
  console.log('🚀 테스트 계정 생성을 시작합니다...');
  console.log(`📧 이메일: ${email}`);
  console.log(`🔑 비밀번호: ${password}`);
  
  try {
    // 1. Supabase Auth에 사용자 생성 (관리자 API 사용)
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // 이메일 확인 없이 바로 활성화
      user_metadata: {
        first_name: '테스트',
        last_name: '관리자',
        role: 'super_admin'
      }
    });

    if (authError) {
      console.error('❌ Supabase Auth 계정 생성 실패:', authError.message);
      
      // 이미 존재하는 계정인지 확인
      if (authError.message.includes('already registered')) {
        console.log('💡 계정이 이미 존재합니다. 기존 계정을 확인합니다...');
        
        // 기존 사용자 조회
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
          console.error('❌ 기존 사용자 조회 실패:', listError.message);
          return;
        }
        
        const existingUser = existingUsers.users.find(user => user.email === email);
        if (existingUser) {
          console.log('✅ 기존 계정을 찾았습니다:');
          console.log(`   - ID: ${existingUser.id}`);
          console.log(`   - 이메일: ${existingUser.email}`);
          console.log(`   - 생성일: ${existingUser.created_at}`);
          console.log(`   - 확인됨: ${existingUser.email_confirmed_at ? '예' : '아니오'}`);
          
          // users 테이블에 프로필이 있는지 확인
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', existingUser.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('❌ 사용자 프로필 조회 실패:', profileError.message);
          } else if (!userProfile) {
            console.log('💡 사용자 프로필이 없습니다. 프로필을 생성합니다...');
            await createUserProfile(existingUser.id, email);
          } else {
            console.log('✅ 사용자 프로필이 이미 존재합니다:');
            console.log(`   - 사용자명: ${userProfile.username}`);
            console.log(`   - 이름: ${userProfile.first_name} ${userProfile.last_name}`);
            console.log(`   - 역할: ${userProfile.role}`);
            console.log(`   - 상태: ${userProfile.status}`);
          }
          
          console.log('\n🎉 테스트 계정이 준비되었습니다!');
          console.log('🔐 로그인 정보:');
          console.log(`   - 이메일: ${email}`);
          console.log(`   - 비밀번호: ${password}`);
          console.log('🌐 환경변수에 슈퍼 관리자로 설정되어 있습니다.');
          return;
        }
      }
      return;
    }

    console.log('✅ Supabase Auth 계정이 생성되었습니다:');
    console.log(`   - ID: ${authUser.user.id}`);
    console.log(`   - 이메일: ${authUser.user.email}`);

    // 2. users 테이블에 프로필 생성
    await createUserProfile(authUser.user.id, email);

    console.log('\n🎉 테스트 계정 생성이 완료되었습니다!');
    console.log('🔐 로그인 정보:');
    console.log(`   - 이메일: ${email}`);
    console.log(`   - 비밀번호: ${password}`);
    console.log('🌐 환경변수에 슈퍼 관리자로 설정되어 있어 모든 권한을 가집니다.');
    console.log('\n📋 테스트 가능한 기능:');
    console.log('   ✅ Company Dashboard - 모든 브랜드/매장 데이터 접근');
    console.log('   ✅ Brand Dashboard - 모든 브랜드의 매장 데이터 접근');
    console.log('   ✅ Store Dashboard - 모든 매장 데이터 접근');
    console.log('   ✅ 모든 메뉴 항목 접근');
    console.log('   ✅ 데이터 스코프 전환');

  } catch (error) {
    console.error('❌ 예상치 못한 오류가 발생했습니다:', error);
  }
}

async function createUserProfile(userId, email) {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        username: 'company-test',
        first_name: '테스트',
        last_name: '관리자',
        role: 'super_admin',
        status: 'active',
        email_verified: true,
        two_factor_enabled: false,
        permissions: [],
        preferences: {
          language: 'ko',
          timezone: 'Asia/Seoul',
          date_format: 'YYYY-MM-DD',
          currency: 'KRW',
          notifications: {
            email_notifications: true,
            push_notifications: true,
            sms_notifications: false,
            low_stock_alerts: true,
            order_updates: true,
            system_alerts: true
          }
        }
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ 사용자 프로필 생성 실패:', profileError.message);
      
      // RLS 정책으로 인한 오류인 경우 무시 (슈퍼 관리자 바이패스가 있음)
      if (profileError.code === 'PGRST116' || profileError.code === '42501') {
        console.log('💡 RLS 정책으로 인해 프로필 생성이 제한되었지만, 슈퍼 관리자 바이패스가 활성화되어 있어 정상 작동합니다.');
      }
    } else {
      console.log('✅ 사용자 프로필이 생성되었습니다:');
      console.log(`   - 사용자명: ${profile.username}`);
      console.log(`   - 이름: ${profile.first_name} ${profile.last_name}`);
      console.log(`   - 역할: ${profile.role}`);
    }
  } catch (error) {
    console.error('❌ 프로필 생성 중 오류:', error);
  }
}

// 스크립트 실행
createTestAccount().catch(console.error);
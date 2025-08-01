-- CulinarySeoul 김광일 계정 수동 생성 스크립트
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. 먼저 기존 사용자가 있는지 확인
SELECT 'Checking existing users...' as step;
SELECT id, email, role FROM auth.users WHERE email = 'alex@culinaryseoul.com';
SELECT id, email, role FROM public.users WHERE email = 'alex@culinaryseoul.com';

-- 2. auth.users에 사용자가 있는지 확인 후, public.users에 프로필 생성
-- 아래 UUID는 실제 auth.users의 ID로 교체해야 합니다
-- (위의 SELECT 결과에서 확인 가능)

INSERT INTO public.users (
  id,
  email,
  username,
  first_name,
  last_name,
  role,
  status,
  email_verified,
  preferences,
  permissions,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'alex@culinaryseoul.com' LIMIT 1), -- auth.users의 실제 ID 사용
  'alex@culinaryseoul.com',
  'alex',
  '김광일',
  '',
  'super_admin',
  'active',
  true,
  '{
    "language": "ko",
    "timezone": "Asia/Seoul",
    "date_format": "YYYY-MM-DD",
    "currency": "KRW",
    "notifications": {
      "email_notifications": true,
      "push_notifications": true,
      "sms_notifications": false,
      "low_stock_alerts": true,
      "order_updates": true,
      "system_alerts": true
    }
  }'::jsonb,
  ARRAY['*'], -- 모든 권한
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- 3. 생성 결과 확인
SELECT 'User creation result:' as step;
SELECT 
  u.id,
  u.email,
  u.username,
  u.first_name,
  u.last_name,
  u.role,
  u.status,
  u.permissions,
  au.email_confirmed_at,
  au.created_at as auth_created_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'alex@culinaryseoul.com';

-- 4. RLS 정책 테스트 (임시로 비활성화)
-- 문제가 계속되면 아래 명령으로 RLS를 임시 비활성화할 수 있습니다
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
-- 테스트 완료 후 다시 활성화: ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

SELECT 'Setup completed!' as result;
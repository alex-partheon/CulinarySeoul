-- Clerk 마이그레이션을 위한 Supabase 스키마 업데이트
-- 이 스크립트는 기존 Supabase Auth에서 Clerk으로 마이그레이션할 때 필요한 스키마 변경사항을 포함합니다.

-- 1. profiles 테이블에 clerk_user_id 컬럼 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS clerk_user_id TEXT UNIQUE;

-- 2. profiles 테이블에 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles(clerk_user_id);

-- 3. user_permissions 테이블에 clerk_user_id 컬럼 추가
ALTER TABLE user_permissions 
ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;

-- 4. user_permissions 테이블에 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_user_permissions_clerk_user_id ON user_permissions(clerk_user_id);

-- 5. 기존 user_id 컬럼을 nullable로 변경 (마이그레이션 기간 동안)
ALTER TABLE profiles 
ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE user_permissions 
ALTER COLUMN user_id DROP NOT NULL;

-- 6. Clerk 사용자 프로필 동기화를 위한 함수 생성
CREATE OR REPLACE FUNCTION sync_clerk_user_profile(
  p_clerk_user_id TEXT,
  p_email TEXT,
  p_full_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_user_type TEXT DEFAULT 'BRAND_MANAGER',
  p_onboarding_completed BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- 기존 프로필 확인
  SELECT id INTO profile_id
  FROM profiles
  WHERE clerk_user_id = p_clerk_user_id;
  
  IF profile_id IS NOT NULL THEN
    -- 기존 프로필 업데이트
    UPDATE profiles
    SET 
      email = p_email,
      full_name = COALESCE(p_full_name, full_name),
      avatar_url = COALESCE(p_avatar_url, avatar_url),
      user_type = p_user_type,
      onboarding_completed = p_onboarding_completed,
      updated_at = NOW()
    WHERE id = profile_id;
  ELSE
    -- 새 프로필 생성
    INSERT INTO profiles (
      clerk_user_id,
      email,
      full_name,
      avatar_url,
      user_type,
      onboarding_completed,
      created_at,
      updated_at
    )
    VALUES (
      p_clerk_user_id,
      p_email,
      p_full_name,
      p_avatar_url,
      p_user_type,
      p_onboarding_completed,
      NOW(),
      NOW()
    )
    RETURNING id INTO profile_id;
    
    -- 기본 권한 부여
    INSERT INTO user_permissions (
      clerk_user_id,
      permission_type,
      granted_by,
      granted_at
    )
    VALUES (
      p_clerk_user_id,
      p_user_type,
      p_clerk_user_id,
      NOW()
    );
  END IF;
  
  RETURN profile_id;
END;
$$;

-- 7. Clerk 사용자 삭제를 위한 함수 생성
CREATE OR REPLACE FUNCTION delete_clerk_user_profile(p_clerk_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 권한 삭제
  DELETE FROM user_permissions
  WHERE clerk_user_id = p_clerk_user_id;
  
  -- 프로필 삭제
  DELETE FROM profiles
  WHERE clerk_user_id = p_clerk_user_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- 8. Clerk 사용자 권한 확인 함수 생성
CREATE OR REPLACE FUNCTION get_clerk_user_permissions(p_clerk_user_id TEXT)
RETURNS TABLE(permission_type TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT up.permission_type
  FROM user_permissions up
  WHERE up.clerk_user_id = p_clerk_user_id;
END;
$$;

-- 9. Clerk 사용자 최고 권한 확인 함수 생성
CREATE OR REPLACE FUNCTION get_clerk_user_highest_permission(p_clerk_user_id TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  highest_permission TEXT;
  permission_levels JSONB := '{
    "SUPER_ADMIN": 100,
    "ADMIN": 80,
    "BRAND_MANAGER": 60,
    "STORE_MANAGER": 40,
    "STAFF": 20
  }';
BEGIN
  SELECT up.permission_type INTO highest_permission
  FROM user_permissions up
  WHERE up.clerk_user_id = p_clerk_user_id
  ORDER BY (permission_levels->>up.permission_type)::INTEGER DESC
  LIMIT 1;
  
  RETURN highest_permission;
END;
$$;

-- 10. Clerk 기반 RLS 정책 생성

-- profiles 테이블 RLS 정책
DROP POLICY IF EXISTS "Users can view own profile via Clerk" ON profiles;
CREATE POLICY "Users can view own profile via Clerk"
  ON profiles FOR SELECT
  USING (
    clerk_user_id = current_setting('app.current_clerk_user_id', true)
    OR 
    EXISTS (
      SELECT 1 FROM user_permissions up
      WHERE up.clerk_user_id = current_setting('app.current_clerk_user_id', true)
      AND up.permission_type IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

DROP POLICY IF EXISTS "Users can update own profile via Clerk" ON profiles;
CREATE POLICY "Users can update own profile via Clerk"
  ON profiles FOR UPDATE
  USING (
    clerk_user_id = current_setting('app.current_clerk_user_id', true)
    OR 
    EXISTS (
      SELECT 1 FROM user_permissions up
      WHERE up.clerk_user_id = current_setting('app.current_clerk_user_id', true)
      AND up.permission_type IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

DROP POLICY IF EXISTS "Users can insert own profile via Clerk" ON profiles;
CREATE POLICY "Users can insert own profile via Clerk"
  ON profiles FOR INSERT
  WITH CHECK (
    clerk_user_id = current_setting('app.current_clerk_user_id', true)
  );

-- user_permissions 테이블 RLS 정책
DROP POLICY IF EXISTS "Users can view permissions via Clerk" ON user_permissions;
CREATE POLICY "Users can view permissions via Clerk"
  ON user_permissions FOR SELECT
  USING (
    clerk_user_id = current_setting('app.current_clerk_user_id', true)
    OR 
    EXISTS (
      SELECT 1 FROM user_permissions up
      WHERE up.clerk_user_id = current_setting('app.current_clerk_user_id', true)
      AND up.permission_type IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

DROP POLICY IF EXISTS "Admins can manage permissions via Clerk" ON user_permissions;
CREATE POLICY "Admins can manage permissions via Clerk"
  ON user_permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_permissions up
      WHERE up.clerk_user_id = current_setting('app.current_clerk_user_id', true)
      AND up.permission_type IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- 11. Clerk 사용자 컨텍스트 설정 함수
CREATE OR REPLACE FUNCTION set_clerk_user_context(p_clerk_user_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.current_clerk_user_id', p_clerk_user_id, true);
END;
$$;

-- 12. 권한 부여 함수 (Clerk 버전)
CREATE OR REPLACE FUNCTION grant_clerk_permission(
  p_clerk_user_id TEXT,
  p_permission_type TEXT,
  p_granted_by TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_permissions (
    clerk_user_id,
    permission_type,
    granted_by,
    granted_at
  )
  VALUES (
    p_clerk_user_id,
    p_permission_type,
    p_granted_by,
    NOW()
  )
  ON CONFLICT (clerk_user_id, permission_type) DO NOTHING;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- 13. 권한 취소 함수 (Clerk 버전)
CREATE OR REPLACE FUNCTION revoke_clerk_permission(
  p_clerk_user_id TEXT,
  p_permission_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM user_permissions
  WHERE clerk_user_id = p_clerk_user_id
  AND permission_type = p_permission_type;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;
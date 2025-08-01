-- Fix RLS Policies for Super Admin Bypass
-- Run this in Supabase SQL Editor to fix authentication issues

-- First, get the super admin user ID
SELECT 'Finding super admin user...' as step;
SELECT id, email, role FROM auth.users WHERE email = 'alex@culinaryseoul.com';

-- Store the super admin UUID for reference
DO $$
DECLARE
    super_admin_uuid UUID;
BEGIN
    -- Get the super admin UUID
    SELECT id INTO super_admin_uuid 
    FROM auth.users 
    WHERE email = 'alex@culinaryseoul.com';
    
    IF super_admin_uuid IS NULL THEN
        RAISE NOTICE 'Super admin user not found in auth.users!';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Super admin UUID: %', super_admin_uuid;
END $$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Super admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Super admins can delete users" ON public.users;

-- Create super admin bypass function
CREATE OR REPLACE FUNCTION is_super_admin() 
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if current user is the known super admin
    RETURN auth.uid() IN (
        SELECT id FROM auth.users WHERE email = 'alex@culinaryseoul.com'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new simplified policies with super admin bypass
-- 1. Super admin can view all users, others can view own profile
CREATE POLICY "Super admin bypass or own profile" ON public.users
    FOR SELECT
    USING (
        is_super_admin() 
        OR auth.uid() = id
    );

-- 2. Super admin can update any user, others can update own profile  
CREATE POLICY "Super admin bypass or own profile update" ON public.users
    FOR UPDATE
    USING (
        is_super_admin() 
        OR auth.uid() = id
    )
    WITH CHECK (
        is_super_admin() 
        OR auth.uid() = id
    );

-- 3. Super admin can insert new users
CREATE POLICY "Super admin can insert users" ON public.users
    FOR INSERT
    WITH CHECK (is_super_admin());

-- 4. Super admin can delete users
CREATE POLICY "Super admin can delete users" ON public.users
    FOR DELETE
    USING (is_super_admin());

-- Fix permission table policies with super admin bypass
DROP POLICY IF EXISTS "Users can view own permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Admins can manage permissions" ON public.user_permissions;

CREATE POLICY "Super admin bypass or own permissions" ON public.user_permissions
    FOR ALL
    USING (
        is_super_admin() 
        OR auth.uid() = user_id
    );

-- Fix dashboard sessions policies with super admin bypass
DROP POLICY IF EXISTS "Users can view own sessions" ON public.dashboard_sessions;
DROP POLICY IF EXISTS "Users can create own sessions" ON public.dashboard_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.dashboard_sessions;

CREATE POLICY "Super admin bypass or own sessions" ON public.dashboard_sessions
    FOR ALL
    USING (
        is_super_admin() 
        OR auth.uid() = user_id
    )
    WITH CHECK (
        is_super_admin() 
        OR auth.uid() = user_id
    );

-- Emergency: Create super admin profile if it doesn't exist
INSERT INTO public.users (
    id,
    email,
    username,
    first_name,
    last_name,
    role,
    status,
    email_verified,
    permissions
) 
SELECT 
    au.id,
    'alex@culinaryseoul.com',
    'alex',
    '김광일',
    '',
    'super_admin',
    'active',
    true,
    ARRAY['*']
FROM auth.users au 
WHERE au.email = 'alex@culinaryseoul.com'
ON CONFLICT (id) DO UPDATE SET
    role = 'super_admin',
    status = 'active',
    permissions = ARRAY['*'],
    updated_at = NOW();

-- Create super admin permissions
INSERT INTO public.user_permissions (
    user_id,
    can_access_company_dashboard,
    can_access_brand_dashboard,
    allowed_brand_ids,
    company_permissions,
    brand_permissions
)
SELECT 
    au.id,
    true,
    true,
    ARRAY['*'],
    '{"*": true}',
    '{"*": true}'
FROM auth.users au 
WHERE au.email = 'alex@culinaryseoul.com'
ON CONFLICT (user_id) DO UPDATE SET
    can_access_company_dashboard = true,
    can_access_brand_dashboard = true,
    allowed_brand_ids = ARRAY['*'],
    company_permissions = '{"*": true}',
    brand_permissions = '{"*": true}';

-- Verification
SELECT 'Verification Results:' as step;
SELECT 
    u.id,
    u.email,
    u.role,
    u.status,
    u.permissions,
    up.can_access_company_dashboard,
    up.can_access_brand_dashboard
FROM public.users u
LEFT JOIN public.user_permissions up ON u.id = up.user_id
WHERE u.email = 'alex@culinaryseoul.com';

SELECT 'RLS Policies fixed successfully!' as result;
-- CulinarySeoul ERP Database Schema
-- Created: 2025-01-31
-- Description: Core database schema for user management and authentication

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'manager', 'employee', 'viewer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'employee',
  status user_status DEFAULT 'active',
  email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{
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
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- 1. Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- 2. Admins can view all users (fixed to avoid recursion)
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT
  USING (
    -- Allow users to view their own profile
    auth.uid() = id
    OR
    -- Allow if user has admin role (check via JWT claims to avoid recursion)
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' IN ('super_admin', 'admin')
  );

-- 3. Users can update own profile, admins can update any profile (fixed to avoid recursion)
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' IN ('super_admin', 'admin')
  );

-- 4. Only super admins can insert new users (fixed to avoid recursion)
CREATE POLICY "Super admins can insert users" ON public.users
  FOR INSERT
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'super_admin'
  );

-- 5. Only super admins can delete users (fixed to avoid recursion)
CREATE POLICY "Super admins can delete users" ON public.users
  FOR DELETE
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'super_admin'
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    new.id,
    new.email,
    SPLIT_PART(new.email, '@', 1)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Hybrid Permission System Tables
-- User permissions for dual dashboard access
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  can_access_company_dashboard BOOLEAN DEFAULT false,
  can_access_brand_dashboard BOOLEAN DEFAULT false,
  allowed_brand_ids TEXT[] DEFAULT '{}',
  company_permissions JSONB DEFAULT '{}',
  brand_permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  UNIQUE(user_id)
);

-- Dashboard sessions for tracking current context
CREATE TABLE IF NOT EXISTS public.dashboard_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('company', 'brand')),
  brand_context TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '8 hours',
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Indexes for permission system
CREATE INDEX idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX idx_dashboard_sessions_user_id ON public.dashboard_sessions(user_id);
CREATE INDEX idx_dashboard_sessions_active ON public.dashboard_sessions(is_active, expires_at);

-- RLS for permission tables
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_sessions ENABLE ROW LEVEL SECURITY;

-- User permissions policies
CREATE POLICY "Users can view own permissions" ON public.user_permissions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage permissions" ON public.user_permissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
    )
  );

-- Dashboard sessions policies
CREATE POLICY "Users can view own sessions" ON public.dashboard_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON public.dashboard_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.dashboard_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Audit log table for security
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);

-- Insert test user (김광일 대표이사)
-- Note: You must first create the user in Supabase Auth dashboard with email/password
-- Then run this to create the user profile:
/*
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
) VALUES (
  '[REPLACE_WITH_AUTH_USER_ID]', -- Get this from Supabase Auth after creating user
  'alex@culinaryseoul.com',
  'alex',
  '김',
  '광일',
  'super_admin',
  'active',
  true,
  ARRAY['all']
) ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  status = 'active',
  permissions = ARRAY['all'];

-- Also create permissions for the test user
INSERT INTO public.user_permissions (
  user_id,
  can_access_company_dashboard,
  can_access_brand_dashboard,
  allowed_brand_ids,
  company_permissions,
  brand_permissions
) VALUES (
  '[REPLACE_WITH_AUTH_USER_ID]',
  true,
  true,
  ARRAY['*'], -- Access to all brands
  '{"*": true}', -- All company permissions
  '{"*": true}' -- All brand permissions
) ON CONFLICT (user_id) DO UPDATE SET
  can_access_company_dashboard = true,
  can_access_brand_dashboard = true;
*/
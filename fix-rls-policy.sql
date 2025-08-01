-- Fix infinite recursion in RLS policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Create a simpler policy that doesn't cause recursion
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT
  USING (
    -- Allow if user is super_admin or admin (check auth metadata instead of table)
    (auth.jwt() ->> 'role')::text IN ('super_admin', 'admin')
    OR
    -- Allow users to view their own profile
    auth.uid() = id
  );

-- Alternative: Disable RLS temporarily for testing
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
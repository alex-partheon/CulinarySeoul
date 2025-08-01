import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // 1. Create auth user using signUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'alex@culinaryseoul.com',
      password: 'rlarhkdlf3!@',
      options: {
        data: {
          first_name: '김광일',
          last_name: ''
        }
      }
    });
    
    if (authError) {
      console.error('Auth user creation error:', authError);
      return;
    }
    
    console.log('Auth user created:', authData.user.id);
    
    // 2. Create profile in users table with RLS bypass
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'alex@culinaryseoul.com',
        first_name: '김광일',
        last_name: '',
        role: 'super_admin',
        status: 'active',
        permissions: ['*'] // All permissions
      })
      .select();
    
    if (profileError) {
      console.error('Profile creation error:', profileError);
      return;
    }
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: alex@culinaryseoul.com');
    console.log('Password: rlarhkdlf3!@');
    console.log('Role: super_admin');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser();
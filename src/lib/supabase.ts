import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Vite 환경 변수 접근
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// 권한 캐시 관리
class PermissionCache {
  private cache = new Map<string, any>();
  private readonly TTL = 5 * 60 * 1000; // 5분

  set(key: string, value: any): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const permissionCache = new PermissionCache();

// Clerk 사용자 컨텍스트 설정
export const setClerkUserContext = async (clerkUserId: string) => {
  try {
    const { error } = await supabase.rpc('set_clerk_user_context', {
      p_clerk_user_id: clerkUserId
    });
    
    if (error) {
      console.error('Clerk 사용자 컨텍스트 설정 실패:', error);
      throw error;
    }
  } catch (error) {
    console.error('Clerk 사용자 컨텍스트 설정 오류:', error);
    throw error;
  }
};

// Clerk 사용자 프로필 동기화
export const syncClerkUserProfileToSupabase = async (
  clerkUserId: string,
  email: string,
  fullName?: string,
  avatarUrl?: string,
  userType: string = 'BRAND_MANAGER',
  onboardingCompleted: boolean = false
) => {
  try {
    const { data, error } = await supabase.rpc('sync_clerk_user_profile', {
      p_clerk_user_id: clerkUserId,
      p_email: email,
      p_full_name: fullName,
      p_avatar_url: avatarUrl,
      p_user_type: userType,
      p_onboarding_completed: onboardingCompleted
    });
    
    if (error) {
      console.error('Clerk 사용자 프로필 동기화 실패:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Clerk 사용자 프로필 동기화 오류:', error);
    throw error;
  }
};

// Clerk 사용자 권한 조회
export const getClerkUserPermissions = async (clerkUserId: string) => {
  try {
    const { data, error } = await supabase.rpc('get_clerk_user_permissions', {
      p_clerk_user_id: clerkUserId
    });
    
    if (error) {
      console.error('Clerk 사용자 권한 조회 실패:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Clerk 사용자 권한 조회 오류:', error);
    throw error;
  }
};

// Clerk 사용자 최고 권한 조회
export const getClerkUserHighestPermission = async (clerkUserId: string) => {
  try {
    const { data, error } = await supabase.rpc('get_clerk_user_highest_permission', {
      p_clerk_user_id: clerkUserId
    });
    
    if (error) {
      console.error('Clerk 사용자 최고 권한 조회 실패:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Clerk 사용자 최고 권한 조회 오류:', error);
    throw error;
  }
};

// Supabase 실시간 구독 관리
export class RealtimeManager {
  private subscriptions = new Map<string, any>();

  subscribe(channel: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel(channel)
      .on('postgres_changes', {
        event: '*',
        schema: 'public'
      }, callback)
      .subscribe();

    this.subscriptions.set(channel, subscription);
    return subscription;
  }

  unsubscribe(channel: string) {
    const subscription = this.subscriptions.get(channel);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(channel);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }
}

export const realtimeManager = new RealtimeManager();
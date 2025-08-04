import { User } from '@clerk/clerk-react'
import { supabase } from './supabase'

// Clerk 사용자 타입 확장
export interface ExtendedClerkUser extends User {
  publicMetadata: {
    userType?: string
    onboardingCompleted?: boolean
    companyName?: string
    phoneNumber?: string
    [key: string]: any
  }
}

// 사용자 권한 타입
export type UserPermission = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'BRAND_MANAGER'
  | 'STORE_MANAGER'
  | 'STAFF'

// 권한 레벨 매핑
export const PERMISSION_LEVELS: Record<UserPermission, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  BRAND_MANAGER: 60,
  STORE_MANAGER: 40,
  STAFF: 20
}

// 권한 확인 함수
export function hasPermission(
  userPermission: UserPermission,
  requiredPermission: UserPermission
): boolean {
  return PERMISSION_LEVELS[userPermission] >= PERMISSION_LEVELS[requiredPermission]
}

// Clerk 사용자 메타데이터 업데이트
export async function updateClerkUserMetadata(
  user: User,
  metadata: Record<string, any>
) {
  try {
    await user.update({
      publicMetadata: {
        ...user.publicMetadata,
        ...metadata
      }
    })
    return { success: true }
  } catch (error) {
    console.error('Clerk 메타데이터 업데이트 실패:', error)
    throw error
  }
}

// Supabase 프로필과 Clerk 사용자 동기화
export async function syncClerkUserWithSupabase(clerkUser: User) {
  try {
    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) {
      throw new Error('이메일 주소가 없습니다')
    }

    const fullName = clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}`
      : clerkUser.firstName || clerkUser.lastName || ''

    const profileData = {
      clerk_user_id: clerkUser.id,
      email,
      full_name: fullName,
      avatar_url: clerkUser.imageUrl,
      user_type: clerkUser.publicMetadata?.userType || 'BRAND_MANAGER',
      onboarding_completed: clerkUser.publicMetadata?.onboardingCompleted || false,
      updated_at: new Date().toISOString()
    }

    // 기존 프로필 확인
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, created_at')
      .eq('clerk_user_id', clerkUser.id)
      .single()

    if (existingProfile) {
      // 기존 프로필 업데이트
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('clerk_user_id', clerkUser.id)
        .select()
        .single()

      if (error) {
        throw error
      }
      return data
    } else {
      // 새 프로필 생성
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          ...profileData,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // 기본 권한 설정
      await supabase
        .from('user_permissions')
        .insert({
          clerk_user_id: clerkUser.id,
          permission_type: profileData.user_type,
          granted_by: clerkUser.id,
          granted_at: new Date().toISOString()
        })

      return data
    }
  } catch (error) {
    console.error('Clerk 사용자 동기화 실패:', error)
    throw error
  }
}

// 사용자 권한 조회
export async function getUserPermissions(clerkUserId: string): Promise<UserPermission[]> {
  try {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('permission_type')
      .eq('clerk_user_id', clerkUserId)

    if (error) {
      throw error
    }

    return data?.map(p => p.permission_type as UserPermission) || []
  } catch (error) {
    console.error('사용자 권한 조회 실패:', error)
    return []
  }
}

// 최고 권한 조회
export async function getHighestPermission(clerkUserId: string): Promise<UserPermission | null> {
  try {
    const permissions = await getUserPermissions(clerkUserId)
    if (permissions.length === 0) return null

    return permissions.reduce((highest, current) => {
      return PERMISSION_LEVELS[current] > PERMISSION_LEVELS[highest] ? current : highest
    })
  } catch (error) {
    console.error('최고 권한 조회 실패:', error)
    return null
  }
}

// 권한 부여
export async function grantPermission(
  clerkUserId: string,
  permission: UserPermission,
  grantedBy: string
) {
  try {
    const { error } = await supabase
      .from('user_permissions')
      .insert({
        clerk_user_id: clerkUserId,
        permission_type: permission,
        granted_by: grantedBy,
        granted_at: new Date().toISOString()
      })

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('권한 부여 실패:', error)
    throw error
  }
}

// 권한 취소
export async function revokePermission(
  clerkUserId: string,
  permission: UserPermission
) {
  try {
    const { error } = await supabase
      .from('user_permissions')
      .delete()
      .eq('clerk_user_id', clerkUserId)
      .eq('permission_type', permission)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('권한 취소 실패:', error)
    throw error
  }
}

// 도메인별 리디렉션 URL 생성
export function getRedirectUrl(userType: string, afterSignIn = true): string {
  const baseUrl = window.location.origin
  
  if (afterSignIn) {
    switch (userType) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return `${baseUrl}/company`
      case 'BRAND_MANAGER':
        return `${baseUrl}/company` // 또는 특정 브랜드 대시보드
      case 'STORE_MANAGER':
        return `${baseUrl}/company` // 또는 특정 매장 대시보드
      default:
        return `${baseUrl}/clerk-onboarding`
    }
  } else {
    return `${baseUrl}/clerk-sign-in`
  }
}

// 온보딩 완료 여부 확인
export function isOnboardingCompleted(user: User): boolean {
  return user.publicMetadata?.onboardingCompleted === true
}

// 사용자 타입 확인
export function getUserType(user: User): string {
  return user.publicMetadata?.userType || 'BRAND_MANAGER'
}

// Clerk 환경 설정 확인
export function isClerkEnabled(): boolean {
  return import.meta.env.VITE_USE_CLERK_AUTH === 'true' && 
         !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
}

// 개발 모드 확인
export function isDevelopment(): boolean {
  return import.meta.env.DEV
}

// 에러 메시지 한국어 변환
export function translateClerkError(error: any): string {
  const errorCode = error?.code || error?.message || ''
  
  const translations: Record<string, string> = {
    'form_identifier_not_found': '등록되지 않은 이메일 주소입니다.',
    'form_password_incorrect': '비밀번호가 올바르지 않습니다.',
    'form_identifier_exists': '이미 등록된 이메일 주소입니다.',
    'form_password_pwned': '보안상 안전하지 않은 비밀번호입니다.',
    'form_password_length_too_short': '비밀번호가 너무 짧습니다.',
    'form_password_validation_failed': '비밀번호 형식이 올바르지 않습니다.',
    'verification_failed': '인증에 실패했습니다.',
    'session_exists': '이미 로그인되어 있습니다.',
    'not_allowed_access': '접근 권한이 없습니다.'
  }

  return translations[errorCode] || error?.message || '알 수 없는 오류가 발생했습니다.'
}
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useAuth, useClerk } from '@clerk/clerk-react'
import { 
  supabase, 
  setClerkUserContext, 
  syncClerkUserProfileToSupabase, 
  getClerkUserPermissions,
  getClerkUserHighestPermission 
} from '../lib/supabase'

// 기존 타입 재사용
interface UserProfile {
  id: string
  email: string
  full_name: string
  user_type: string
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

interface UserPermissions {
  permission_type: string
  permissions: string[]
}

interface ClerkAuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isSignedIn: boolean
  userPermissions: UserPermissions | null
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  signOut: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  syncUserProfile: () => Promise<void>
}

const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined)

export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const { signOut: clerkSignOut } = useClerk()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        // Clerk 사용자를 내부 UserProfile 형식으로 변환
        const userProfile: UserProfile = {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          full_name: clerkUser.fullName || '',
          user_type: (clerkUser.publicMetadata.userType as string) || 'BRAND_MANAGER',
          onboarding_completed: (clerkUser.publicMetadata.onboardingCompleted as boolean) || false,
          created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
          updated_at: clerkUser.updatedAt?.toISOString() || new Date().toISOString()
        }
        setUser(userProfile)
        
        // Supabase와 동기화
        syncUserWithSupabase(clerkUser)
        
        // 권한 로드
        loadUserPermissions(clerkUser.id)
      } else {
        setUser(null)
        setUserPermissions(null)
      }
      setIsLoading(false)
    }
  }, [isLoaded, isSignedIn, clerkUser])

  const loadUserPermissions = async (clerkUserId: string) => {
    try {
      // Clerk 사용자 컨텍스트 설정
      await setClerkUserContext(clerkUserId)
      
      // Clerk 사용자 권한 조회
      const permissions = await getClerkUserPermissions(clerkUserId)
      const highestPermission = await getClerkUserHighestPermission(clerkUserId)
      
      if (permissions && Array.isArray(permissions) && permissions.length > 0) {
        setUserPermissions({
          permission_type: highestPermission || 'BRAND_MANAGER',
          permissions: permissions.map((p: any) => p.permission_type)
        })
      } else {
        setUserPermissions({
          permission_type: 'BRAND_MANAGER',
          permissions: []
        })
      }
    } catch (error) {
      console.error('권한 로드 실패:', error)
      setUserPermissions({
        permission_type: 'BRAND_MANAGER',
        permissions: []
      })
    }
  }



  const syncUserWithSupabase = async (clerkUser: any) => {
    try {
      await syncClerkUserProfileToSupabase(
        clerkUser.id,
        clerkUser.primaryEmailAddress?.emailAddress || '',
        clerkUser.fullName,
        clerkUser.imageUrl,
        clerkUser.publicMetadata.userType as string || 'BRAND_MANAGER',
        clerkUser.publicMetadata.onboardingCompleted as boolean || false
      )
    } catch (error) {
      console.error('Supabase 동기화 실패:', error)
    }
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!clerkUser) return
    
    try {
      // Clerk 사용자 정보 업데이트
      if (data.full_name) {
        const nameParts = data.full_name.split(' ')
        await clerkUser.update({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
        })
      }
      
      // 공개 메타데이터 업데이트
      await clerk.users.updateUserMetadata(clerkUser.id, {
        publicMetadata: {
          ...clerkUser.publicMetadata,
          userType: data.user_type || clerkUser.publicMetadata.userType,
          onboardingCompleted: data.onboarding_completed ?? clerkUser.publicMetadata.onboardingCompleted
        }
      })
      
      // Supabase 프로필 동기화
      await syncUserWithSupabase(clerkUser)
      
      // 사용자 상태 업데이트
      const updatedProfile: UserProfile = {
        ...user!,
        ...data,
        updated_at: new Date().toISOString()
      }
      setUser(updatedProfile)
      
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
      throw error
    }
  }

  const syncUserProfile = async () => {
    if (!clerkUser) return
    await syncUserWithSupabase(clerkUser)
  }

  const hasRole = (role: string): boolean => {
    if (!user || !userPermissions) return false
    return userPermissions.permission_type === role || userPermissions.permissions.includes(role)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user || !userPermissions) return false
    return userPermissions.permissions.includes(permission)
  }

  const signOut = async () => {
    try {
      await clerkSignOut()
      setUser(null)
      setUserPermissions(null)
    } catch (error) {
      console.error('로그아웃 실패:', error)
      throw error
    }
  }

  return (
    <ClerkAuthContext.Provider value={{
      user,
      isLoading,
      isSignedIn: !!isSignedIn,
      userPermissions,
      hasRole,
      hasPermission,
      signOut,
      updateUserProfile,
      syncUserProfile
    }}>
      {children}
    </ClerkAuthContext.Provider>
  )
}

export const useClerkAuth = () => {
  const context = useContext(ClerkAuthContext)
  if (context === undefined) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider')
  }
  return context
}
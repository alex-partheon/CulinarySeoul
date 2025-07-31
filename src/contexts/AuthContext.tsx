import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { User, UserRole } from '../domains/user/types'
import { permissionService } from '../services/permissionService'
import type { UserPermissions, DashboardSession } from '../types/database'
import { toast } from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: Error | null }>
  updateProfile: (updates: Partial<User>) => Promise<{ error: Error | null }>
  hasPermission: (permission: string) => boolean
  hasRole: (role: UserRole) => boolean
  // 하이브리드 권한 시스템
  userPermissions: UserPermissions | null
  currentDashboardSession: DashboardSession | null
  switchToDashboard: (dashboardType: 'company' | 'brand', brandContext?: string) => Promise<boolean>
  canAccessDashboard: (dashboardType: 'company' | 'brand', brandId?: string) => Promise<boolean>
  refreshPermissions: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  // 하이브리드 권한 시스템 상태
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null)
  const [currentDashboardSession, setCurrentDashboardSession] = useState<DashboardSession | null>(null)

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error) {
        console.error('Error loading user profile:', error)
        // 사용자 프로필이 없으면 기본 프로필 생성
        if (error.code === 'PGRST116') {
          await createUserProfile(supabaseUser)
        }
      } else {
        setUser(data as User)
        // 권한 정보 로드
        await loadUserPermissions(supabaseUser.id)
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error)
    } finally {
      setLoading(false)
    }
  }

  const createUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const newUser: Partial<User> = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        username: supabaseUser.email!.split('@')[0],
        first_name: supabaseUser.user_metadata?.first_name || '',
        last_name: supabaseUser.user_metadata?.last_name || '',
        role: UserRole.EMPLOYEE,
        status: 'active' as any,
        email_verified: supabaseUser.email_confirmed_at !== null,
        two_factor_enabled: false,
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
        },
        permissions: []
      }

      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
      } else {
        setUser(data as User)
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name
          }
        }
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (!error) {
        setUser({ ...user, ...updates })
      }

      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions?.includes(permission as any) || false
  }

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false
    return user.role === role
  }

  // 하이브리드 권한 시스템 함수들
  const loadUserPermissions = async (userId: string) => {
    try {
      const permissions = await permissionService.getUserPermissions(userId)
      setUserPermissions(permissions)
      
      // 현재 세션 확인
      const currentSession = permissionService.getCurrentSession()
      setCurrentDashboardSession(currentSession)
    } catch (error) {
      console.error('권한 로드 오류:', error)
      toast.error('권한 정보를 불러오는데 실패했습니다.')
    }
  }

  const switchToDashboard = async (
    dashboardType: 'company' | 'brand',
    brandContext?: string
  ): Promise<boolean> => {
    if (!user?.id) {
      toast.error('로그인이 필요합니다.')
      return false
    }

    try {
      const session = await permissionService.createDashboardSession(
        user.id,
        dashboardType,
        brandContext
      )

      if (session) {
        setCurrentDashboardSession(session)
        toast.success(`${dashboardType === 'company' ? '회사' : '브랜드'} 대시보드로 전환되었습니다.`)
        return true
      } else {
        toast.error('대시보드 전환에 실패했습니다.')
        return false
      }
    } catch (error) {
      console.error('대시보드 전환 오류:', error)
      toast.error('대시보드 전환 중 오류가 발생했습니다.')
      return false
    }
  }

  const canAccessDashboard = async (
    dashboardType: 'company' | 'brand',
    brandId?: string
  ): Promise<boolean> => {
    if (!user?.id) return false
    return await permissionService.canAccessDashboard(user.id, dashboardType, brandId)
  }

  const refreshPermissions = async (): Promise<void> => {
    if (user?.id) {
      permissionService.invalidatePermissionCache(user.id)
      await loadUserPermissions(user.id)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
    signUp,
    updateProfile,
    hasPermission,
    hasRole,
    // 하이브리드 권한 시스템
    userPermissions,
    currentDashboardSession,
    switchToDashboard,
    canAccessDashboard,
    refreshPermissions
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
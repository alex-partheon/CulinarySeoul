import React from 'react'
import { 
  SignInButton, 
  SignOutButton, 
  SignUpButton, 
  UserButton, 
  useAuth,
  useUser
} from '@clerk/clerk-react'
import { useClerkAuth } from '../../contexts/ClerkAuthContext'

// 로그인/로그아웃 버튼 컴포넌트
export const ClerkAuthButtons: React.FC = () => {
  const { isSignedIn } = useAuth()
  const { user } = useUser()

  if (isSignedIn && user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userButtonPopoverCard: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                userButtonPopoverActionButton: "hover:bg-gray-100 dark:hover:bg-gray-700"
              }
            }}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user.fullName || user.primaryEmailAddress?.emailAddress}
          </span>
        </div>
        <SignOutButton>
          <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            로그아웃
          </button>
        </SignOutButton>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          로그인
        </button>
      </SignInButton>
      <SignUpButton>
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          회원가입
        </button>
      </SignUpButton>
    </div>
  )
}

// 사용자 프로필 표시 컴포넌트
export const ClerkUserProfile: React.FC = () => {
  const { user, userPermissions, updateUserProfile } = useClerkAuth()
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState({
    full_name: user?.full_name || '',
    user_type: user?.user_type || 'BRAND_MANAGER'
  })

  React.useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        user_type: user.user_type
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      await updateUserProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
    }
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-gray-500">
        사용자 정보를 불러오는 중...
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">사용자 프로필</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            이메일
          </label>
          <input 
            type="email" 
            value={user.email} 
            disabled 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            이름
          </label>
          {isEditing ? (
            <input 
              type="text" 
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <input 
              type="text" 
              value={user.full_name} 
              disabled 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            사용자 유형
          </label>
          {isEditing ? (
            <select 
              value={formData.user_type}
              onChange={(e) => setFormData(prev => ({ ...prev, user_type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="BRAND_MANAGER">브랜드 매니저</option>
              <option value="STORE_MANAGER">매장 매니저</option>
              <option value="ADMIN">관리자</option>
            </select>
          ) : (
            <input 
              type="text" 
              value={user.user_type} 
              disabled 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            온보딩 완료 여부
          </label>
          <input 
            type="text" 
            value={user.onboarding_completed ? '완료' : '미완료'} 
            disabled 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
          />
        </div>

        {userPermissions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              권한
            </label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={`p-2 rounded ${userPermissions.can_manage_brands ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                브랜드 관리: {userPermissions.can_manage_brands ? '가능' : '불가능'}
              </div>
              <div className={`p-2 rounded ${userPermissions.can_manage_stores ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                매장 관리: {userPermissions.can_manage_stores ? '가능' : '불가능'}
              </div>
              <div className={`p-2 rounded ${userPermissions.can_view_analytics ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                분석 조회: {userPermissions.can_view_analytics ? '가능' : '불가능'}
              </div>
              <div className={`p-2 rounded ${userPermissions.can_manage_inventory ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                재고 관리: {userPermissions.can_manage_inventory ? '가능' : '불가능'}
              </div>
              <div className={`p-2 rounded ${userPermissions.can_manage_orders ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                주문 관리: {userPermissions.can_manage_orders ? '가능' : '불가능'}
              </div>
              <div className={`p-2 rounded ${userPermissions.can_manage_users ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                사용자 관리: {userPermissions.can_manage_users ? '가능' : '불가능'}
              </div>
              {userPermissions.is_super_admin && (
                <div className="col-span-2 p-2 rounded bg-purple-100 text-purple-800 font-semibold">
                  슈퍼 관리자
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-6">
        {isEditing ? (
          <>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              저장
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
          </>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            편집
          </button>
        )}
      </div>
    </div>
  )
}

// 로딩 컴포넌트
export const ClerkAuthLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">인증 정보를 확인하는 중...</p>
      </div>
    </div>
  )
}

// 인증 상태 표시 컴포넌트
export const ClerkAuthStatus: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { userPermissions } = useClerkAuth()

  if (!isLoaded) {
    return <ClerkAuthLoading />
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">인증 상태</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>로그인 상태:</span>
          <span className={`font-semibold ${isSignedIn ? 'text-green-600' : 'text-red-600'}`}>
            {isSignedIn ? '로그인됨' : '로그인 안됨'}
          </span>
        </div>
        {isSignedIn && user && (
          <>
            <div className="flex justify-between">
              <span>사용자 ID:</span>
              <span className="font-mono text-xs">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span>이메일:</span>
              <span>{user.primaryEmailAddress?.emailAddress}</span>
            </div>
            <div className="flex justify-between">
              <span>권한 로드:</span>
              <span className={`font-semibold ${userPermissions ? 'text-green-600' : 'text-yellow-600'}`}>
                {userPermissions ? '완료' : '로딩 중'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
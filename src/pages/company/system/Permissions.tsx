import React from 'react'

/**
 * 권한 설정 페이지
 * 권한 및 역할 관리
 */
export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">권한 설정</h1>
        <p className="mt-1 text-sm text-gray-500">
          권한 및 역할을 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">권한 설정</h3>
          <p className="text-gray-500">사용자 역할 및 접근 권한을 세밀하게 설정하세요</p>
        </div>
      </div>
    </div>
  )
}
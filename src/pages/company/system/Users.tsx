import React from 'react'

/**
 * 사용자 관리 페이지
 * 사용자 계정 관리
 */
export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          사용자 계정을 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">사용자 관리</h3>
          <p className="text-gray-500">사용자 계정, 역할 및 접근 권한을 관리하세요</p>
        </div>
      </div>
    </div>
  )
}
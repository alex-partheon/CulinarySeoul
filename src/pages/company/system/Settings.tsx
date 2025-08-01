import React from 'react'

/**
 * 시스템 설정 페이지
 * 시스템 환경 설정
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">시스템 설정</h1>
        <p className="mt-1 text-sm text-gray-500">
          시스템 환경을 설정합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">시스템 설정</h3>
          <p className="text-gray-500">전체 시스템 환경 및 기본 설정을 관리하세요</p>
        </div>
      </div>
    </div>
  )
}
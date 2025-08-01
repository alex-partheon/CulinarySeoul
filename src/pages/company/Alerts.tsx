import React from 'react'

/**
 * 알림 센터 페이지
 * 시스템 알림 및 경고를 관리하는 페이지
 */
export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">알림 센터</h1>
        <p className="mt-1 text-sm text-gray-500">
          시스템 알림 및 경고를 확인합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <span className="text-2xl">🔔</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">알림 센터</h3>
          <p className="text-gray-500">시스템 알림과 중요한 경고를 확인하세요</p>
        </div>
      </div>
    </div>
  )
}
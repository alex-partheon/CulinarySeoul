import React from 'react'

/**
 * 시설 관리 페이지
 * 장비 및 시설 관리
 */
export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">시설 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          장비 및 시설을 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <span className="text-2xl">🔧</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">시설 관리</h3>
          <p className="text-gray-500">장비 유지보수 및 시설 점검을 관리하세요</p>
        </div>
      </div>
    </div>
  )
}
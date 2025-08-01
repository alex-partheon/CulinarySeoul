import React from 'react'

/**
 * 컴플라이언스 페이지
 * 규정 준수 관리
 */
export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">컴플라이언스</h1>
        <p className="mt-1 text-sm text-gray-500">
          규정 준수를 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <span className="text-2xl">📜</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">컴플라이언스</h3>
          <p className="text-gray-500">법적 규정 및 내부 지침 준수를 관리하세요</p>
        </div>
      </div>
    </div>
  )
}
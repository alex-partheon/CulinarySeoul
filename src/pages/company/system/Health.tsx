import React from 'react'

/**
 * 시스템 상태 페이지
 * 시스템 모니터링
 */
export default function HealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">시스템 상태</h1>
        <p className="mt-1 text-sm text-gray-500">
          시스템을 모니터링합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-2xl">❤️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">시스템 상태</h3>
          <p className="text-gray-500 mb-4">시스템 성능 및 건강 상태를 모니터링하세요</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            정상
          </div>
        </div>
      </div>
    </div>
  )
}
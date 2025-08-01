import React from 'react'

/**
 * 매출 현황 페이지
 * 일/월/년 매출 현황
 */
export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">매출 현황</h1>
        <p className="mt-1 text-sm text-gray-500">
          일/월/년 매출 현황을 확인합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">매출 현황</h3>
          <p className="text-gray-500 mb-4">매출 통계 및 트렌드를 분석하세요</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
            구현중
          </div>
        </div>
      </div>
    </div>
  )
}
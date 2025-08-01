import React from 'react'

/**
 * 재고 이동 페이지
 * 매장 간 재고 이동
 */
export default function TransfersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">재고 이동</h1>
        <p className="mt-1 text-sm text-gray-500">
          매장 간 재고를 이동합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <span className="text-2xl">↔️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">재고 이동</h3>
          <p className="text-gray-500">매장 간 재고 이동 요청 및 처리를 관리하세요</p>
        </div>
      </div>
    </div>
  )
}
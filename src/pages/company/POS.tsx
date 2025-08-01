import React from 'react'

/**
 * POS 연동 페이지
 * POS 시스템 연동
 */
export default function POSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">POS 연동</h1>
        <p className="mt-1 text-sm text-gray-500">
          POS 시스템과 연동합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-2xl">💳</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">POS 연동</h3>
          <p className="text-gray-500">POS 시스템 연동 및 결제 관리를 설정하세요</p>
        </div>
      </div>
    </div>
  )
}
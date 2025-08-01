import React from 'react'

/**
 * 프로모션 관리 페이지
 * 할인 및 쿠폰 관리
 */
export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">프로모션 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          할인 및 쿠폰을 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
            <span className="text-2xl">🏷️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">프로모션 관리</h3>
          <p className="text-gray-500">할인 쿠폰, 프로모션 이벤트를 설정하세요</p>
        </div>
      </div>
    </div>
  )
}
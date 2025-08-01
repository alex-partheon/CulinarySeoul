import React from 'react'

/**
 * 적립금 관리 페이지
 * 포인트 및 멤버십
 */
export default function LoyaltyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">적립금 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          포인트 및 멤버십을 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <span className="text-2xl">⭐</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">적립금 관리</h3>
          <p className="text-gray-500">포인트 적립, 사용 및 멤버십 등급을 관리하세요</p>
        </div>
      </div>
    </div>
  )
}
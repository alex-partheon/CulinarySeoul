import React from 'react'

/**
 * 재무 리포트 페이지
 * 손익 및 현금흐름
 */
export default function FinancialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">재무 리포트</h1>
        <p className="mt-1 text-sm text-gray-500">
          손익 및 현금흐름을 분석합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">재무 리포트</h3>
          <p className="text-gray-500">손익계산서 및 현금흐름 분석을 확인하세요</p>
        </div>
      </div>
    </div>
  )
}
import React from 'react'

/**
 * 마케팅 현황 페이지
 * 마케팅 성과 대시보드
 */
export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">마케팅 현황</h1>
        <p className="mt-1 text-sm text-gray-500">
          마케팅 성과를 확인합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <span className="text-2xl">📢</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">마케팅 현황</h3>
          <p className="text-gray-500">마케팅 캠페인 성과 및 ROI를 분석하세요</p>
        </div>
      </div>
    </div>
  )
}
import React from 'react'

/**
 * 경영 분석 페이지
 * 종합 경영 지표
 */
export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">경영 분석</h1>
        <p className="mt-1 text-sm text-gray-500">
          종합 경영 지표를 분석합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">경영 분석</h3>
          <p className="text-gray-500">종합적인 경영 지표 및 트렌드를 분석하세요</p>
        </div>
      </div>
    </div>
  )
}
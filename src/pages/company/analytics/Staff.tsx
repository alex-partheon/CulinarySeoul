import React from 'react'

/**
 * 직원 성과 페이지
 * 직원 성과 분석
 */
export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">직원 성과</h1>
        <p className="mt-1 text-sm text-gray-500">
          직원 성과를 분석합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">직원 성과</h3>
          <p className="text-gray-500">직원 성과 지표 및 평가를 확인하세요</p>
        </div>
      </div>
    </div>
  )
}
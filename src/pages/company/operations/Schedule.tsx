import React from 'react'

/**
 * 근무 스케듸 페이지
 * 직원 근무표
 */
export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">근무 스케듸</h1>
        <p className="mt-1 text-sm text-gray-500">
          직원 근무표를 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">근무 스케듸</h3>
          <p className="text-gray-500">직원 근무 시간표 및 교대 계획을 관리하세요</p>
        </div>
      </div>
    </div>
  )
}
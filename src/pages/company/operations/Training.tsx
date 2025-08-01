import React from 'react'

/**
 * 교육 관리 페이지
 * 직원 교육 프로그램
 */
export default function TrainingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">교육 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          직원 교육 프로그램을 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">교육 관리</h3>
          <p className="text-gray-500">직원 교육 커리큘럼 및 진도를 관리하세요</p>
        </div>
      </div>
    </div>
  )
}
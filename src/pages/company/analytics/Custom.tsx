import React from 'react'

/**
 * 맞춤 리포트 페이지
 * 사용자 정의 리포트
 */
export default function CustomPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">맞춤 리포트</h1>
        <p className="mt-1 text-sm text-gray-500">
          사용자 정의 리포트를 만듭니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">맞춤 리포트</h3>
          <p className="text-gray-500">원하는 지표로 커스텀 리포트를 생성하세요</p>
        </div>
      </div>
    </div>
  )
}
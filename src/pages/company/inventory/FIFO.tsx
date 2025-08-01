import React from 'react'

/**
 * 선입선출 추적 페이지
 * 유통기한 관리
 */
export default function FIFOPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">선입선출 추적</h1>
        <p className="mt-1 text-sm text-gray-500">
          유통기한을 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <span className="text-2xl">🔄</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">선입선출 추적</h3>
          <p className="text-gray-500">유통기한 및 선입선출 규칙을 관리하세요</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800 mt-2">
            <span className="font-medium">New</span>
          </div>
        </div>
      </div>
    </div>
  )
}
import React from 'react'

/**
 * 브랜드 관리 페이지
 * 브랜드 등록 및 관리
 */
export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">브랜드 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          브랜드를 등록하고 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <span className="text-2xl">🏢</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">브랜드 관리</h3>
          <p className="text-gray-500">브랜드 정보 및 설정을 관리하세요</p>
        </div>
      </div>
    </div>
  )
}
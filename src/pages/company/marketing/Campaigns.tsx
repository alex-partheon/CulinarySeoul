import React from 'react'

/**
 * 캠페인 관리 페이지
 * 마케팅 캠페인
 */
export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">캠페인 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          마케팅 캠페인을 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">캠페인 관리</h3>
          <p className="text-gray-500">마케팅 캠페인 기획, 실행 및 성과를 관리하세요</p>
        </div>
      </div>
    </div>
  )
}
import React from 'react'

/**
 * 감사 로그 페이지
 * 시스템 로그
 */
export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">감사 로그</h1>
        <p className="mt-1 text-sm text-gray-500">
          시스템 로그를 확인합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <span className="text-2xl">📜</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">감사 로그</h3>
          <p className="text-gray-500">사용자 활동 및 시스템 이벤트 로그를 모니터링하세요</p>
        </div>
      </div>
    </div>
  )
}
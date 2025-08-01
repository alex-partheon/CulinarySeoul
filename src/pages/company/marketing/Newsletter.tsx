import React from 'react'

/**
 * 뉴스레터 페이지
 * 이메일 마케팅
 */
export default function NewsletterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">뉴스레터</h1>
        <p className="mt-1 text-sm text-gray-500">
          이메일 마케팅을 관리합니다
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-2xl">📧</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">뉴스레터</h3>
          <p className="text-gray-500">이메일 뉴스레터 작성 및 발송을 관리하세요</p>
        </div>
      </div>
    </div>
  )
}
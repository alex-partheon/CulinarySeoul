import React from 'react'
import { formatRelativeTime } from '../../lib/utils'

export function RecentOrders() {
  // 임시 데이터 - 실제로는 API에서 가져올 데이터
  const recentOrders = [
    {
      id: 'ORD-2024-001',
      customerName: '김민수',
      items: ['김치찌개', '공기밥'],
      total: 18000,
      status: 'completed' as const,
      orderTime: new Date(Date.now() - 5 * 60 * 1000), // 5분 전
      paymentMethod: 'card'
    },
    {
      id: 'ORD-2024-002',
      customerName: '이영희',
      items: ['불고기', '된장찌개', '공기밥 2개'],
      total: 32000,
      status: 'preparing' as const,
      orderTime: new Date(Date.now() - 12 * 60 * 1000), // 12분 전
      paymentMethod: 'cash'
    },
    {
      id: 'ORD-2024-003',
      customerName: '박철수',
      items: ['비빔밥', '미역국'],
      total: 22000,
      status: 'pending' as const,
      orderTime: new Date(Date.now() - 18 * 60 * 1000), // 18분 전
      paymentMethod: 'card'
    },
    {
      id: 'ORD-2024-004',
      customerName: '정수진',
      items: ['삼겹살', '상추쌈', '된장찌개'],
      total: 45000,
      status: 'completed' as const,
      orderTime: new Date(Date.now() - 25 * 60 * 1000), // 25분 전
      paymentMethod: 'card'
    },
    {
      id: 'ORD-2024-005',
      customerName: '최동욱',
      items: ['냉면'],
      total: 15000,
      status: 'cancelled' as const,
      orderTime: new Date(Date.now() - 35 * 60 * 1000), // 35분 전
      paymentMethod: 'card'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료'
      case 'preparing':
        return '준비중'
      case 'pending':
        return '대기'
      case 'cancelled':
        return '취소'
      default:
        return '알 수 없음'
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'card':
        return '카드'
      case 'cash':
        return '현금'
      default:
        return method
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">최근 주문</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-500">
          전체 보기
        </button>
      </div>
      
      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-indigo-600">
                      {order.customerName.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-xs text-gray-500">{order.id}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getStatusColor(order.status)
                }`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                {order.items.join(', ')}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">
                  {formatRelativeTime(order.orderTime)}
                </span>
                <span className="text-gray-500">
                  {getPaymentMethodText(order.paymentMethod)}
                </span>
              </div>
              <span className="font-medium text-gray-900">
                ₩{order.total.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* 하단 요약 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">총 주문</span>
            <span className="font-medium text-gray-900">{recentOrders.length}건</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">총 금액</span>
            <span className="font-medium text-gray-900">
              ₩{recentOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
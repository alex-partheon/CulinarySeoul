import React from 'react'

export function PopularItems() {
  // 임시 데이터 - 실제로는 API에서 가져올 데이터
  const popularItems = [
    {
      id: 1,
      name: '김치찌개',
      sales: 156,
      revenue: 2340000,
      change: '+12%',
      changeType: 'increase' as const,
      image: '🍲'
    },
    {
      id: 2,
      name: '불고기',
      sales: 134,
      revenue: 2010000,
      change: '+8%',
      changeType: 'increase' as const,
      image: '🥩'
    },
    {
      id: 3,
      name: '비빔밥',
      sales: 98,
      revenue: 1470000,
      change: '+5%',
      changeType: 'increase' as const,
      image: '🍚'
    },
    {
      id: 4,
      name: '삼겹살',
      sales: 87,
      revenue: 1305000,
      change: '-3%',
      changeType: 'decrease' as const,
      image: '🥓'
    },
    {
      id: 5,
      name: '냉면',
      sales: 76,
      revenue: 1140000,
      change: '+15%',
      changeType: 'increase' as const,
      image: '🍜'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">인기 메뉴</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-500">
          전체 보기
        </button>
      </div>
      
      <div className="space-y-4">
        {popularItems.map((item, index) => {
          const isIncrease = item.changeType === 'increase'
          return (
            <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              {/* 순위 */}
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">{index + 1}</span>
              </div>
              
              {/* 메뉴 이미지 */}
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                {item.image}
              </div>
              
              {/* 메뉴 정보 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-500">
                    {item.sales}개 판매
                  </p>
                  <span className="text-gray-300">•</span>
                  <p className="text-xs text-gray-500">
                    ₩{(item.revenue / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
              
              {/* 변화율 */}
              <div className="flex-shrink-0">
                <div className={`flex items-center text-xs font-medium ${
                  isIncrease ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isIncrease ? (
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                    </svg>
                  )}
                  {item.change}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* 하단 요약 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">총 판매량</span>
          <span className="font-medium text-gray-900">
            {popularItems.reduce((sum, item) => sum + item.sales, 0)}개
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">총 매출</span>
          <span className="font-medium text-gray-900">
            ₩{(popularItems.reduce((sum, item) => sum + item.revenue, 0) / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>
    </div>
  )
}
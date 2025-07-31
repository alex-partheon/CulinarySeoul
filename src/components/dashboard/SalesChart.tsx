import React from 'react'

export function SalesChart() {
  // 임시 데이터 - 실제로는 API에서 가져올 데이터
  const salesData = [
    { day: '월', sales: 2400000 },
    { day: '화', sales: 1800000 },
    { day: '수', sales: 3200000 },
    { day: '목', sales: 2800000 },
    { day: '금', sales: 3600000 },
    { day: '토', sales: 4200000 },
    { day: '일', sales: 3800000 }
  ]

  const maxSales = Math.max(...salesData.map(d => d.sales))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">주간 매출 현황</h3>
        <div className="flex items-center space-x-2">
          <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>이번 주</option>
            <option>지난 주</option>
            <option>지난 달</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* 차트 영역 */}
        <div className="h-64 flex items-end justify-between space-x-2">
          {salesData.map((data, index) => {
            const height = (data.sales / maxSales) * 100
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-1">
                    ₩{(data.sales / 1000000).toFixed(1)}M
                  </div>
                  <div 
                    className="w-full bg-indigo-500 rounded-t-sm transition-all duration-300 hover:bg-indigo-600"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  />
                </div>
                <div className="text-sm font-medium text-gray-700 mt-2">
                  {data.day}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* 요약 정보 */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              ₩{(salesData.reduce((sum, d) => sum + d.sales, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">총 매출</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              ₩{(salesData.reduce((sum, d) => sum + d.sales, 0) / salesData.length / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">일평균</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">+15%</div>
            <div className="text-sm text-gray-600">전주 대비</div>
          </div>
        </div>
      </div>
    </div>
  )
}
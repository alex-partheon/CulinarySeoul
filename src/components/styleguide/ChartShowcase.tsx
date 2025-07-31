import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'

// 한국 비즈니스 맥락의 샘플 데이터
const monthlyRevenueData = [
  { month: '1월', revenue: 4500, customers: 890, avgOrder: 5050 },
  { month: '2월', revenue: 5200, customers: 1020, avgOrder: 5100 },
  { month: '3월', revenue: 4800, customers: 960, avgOrder: 5000 },
  { month: '4월', revenue: 6100, customers: 1250, avgOrder: 4880 },
  { month: '5월', revenue: 7200, customers: 1440, avgOrder: 5000 },
  { month: '6월', revenue: 8500, customers: 1680, avgOrder: 5060 },
  { month: '7월', revenue: 9200, customers: 1820, avgOrder: 5055 },
  { month: '8월', revenue: 8800, customers: 1750, avgOrder: 5030 },
  { month: '9월', revenue: 7600, customers: 1520, avgOrder: 5000 },
  { month: '10월', revenue: 8200, customers: 1640, avgOrder: 5000 },
  { month: '11월', revenue: 9500, customers: 1900, avgOrder: 5000 },
  { month: '12월', revenue: 11200, customers: 2240, avgOrder: 5000 }
]

const categoryData = [
  { category: '한식', sales: 3500, profit: 1050, satisfaction: 4.8 },
  { category: '일식', sales: 2800, profit: 980, satisfaction: 4.6 },
  { category: '중식', sales: 2200, profit: 770, satisfaction: 4.4 },
  { category: '양식', sales: 1800, profit: 630, satisfaction: 4.2 },
  { category: '베이커리', sales: 1500, profit: 450, satisfaction: 4.5 },
  { category: '음료', sales: 1200, profit: 600, satisfaction: 4.3 }
]

const marketShareData = [
  { name: '한식', value: 35, color: 'var(--chart-1)' },
  { name: '일식', value: 25, color: 'var(--chart-2)' },
  { name: '중식', value: 18, color: 'var(--chart-3)' },
  { name: '양식', value: 12, color: 'var(--chart-4)' },
  { name: '기타', value: 10, color: 'var(--chart-5)' }
]

const growthData = [
  { month: '1월', accumulated: 4500, newCustomers: 890 },
  { month: '2월', accumulated: 9700, newCustomers: 1020 },
  { month: '3월', accumulated: 14500, newCustomers: 960 },
  { month: '4월', accumulated: 20600, newCustomers: 1250 },
  { month: '5월', accumulated: 27800, newCustomers: 1440 },
  { month: '6월', accumulated: 36300, newCustomers: 1680 },
  { month: '7월', accumulated: 45500, newCustomers: 1820 },
  { month: '8월', accumulated: 54300, newCustomers: 1750 },
  { month: '9월', accumulated: 61900, newCustomers: 1520 },
  { month: '10월', accumulated: 70100, newCustomers: 1640 },
  { month: '11월', accumulated: 79600, newCustomers: 1900 },
  { month: '12월', accumulated: 90800, newCustomers: 2240 }
]

const priceAnalysisData = [
  { price: 8000, popularity: 85, profit: 2400 },
  { price: 12000, popularity: 92, profit: 4800 },
  { price: 15000, popularity: 78, profit: 6750 },
  { price: 18000, popularity: 65, profit: 8100 },
  { price: 22000, popularity: 58, profit: 9900 },
  { price: 25000, popularity: 45, profit: 10000 },
  { price: 28000, popularity: 35, profit: 9800 },
  { price: 32000, popularity: 28, profit: 8960 }
]

const performanceData = [
  { month: '1월', revenue: 4500, orders: 890, avgOrderValue: 5050 },
  { month: '2월', revenue: 5200, orders: 1020, avgOrderValue: 5100 },
  { month: '3월', revenue: 4800, orders: 960, avgOrderValue: 5000 },
  { month: '4월', revenue: 6100, orders: 1250, avgOrderValue: 4880 },
  { month: '5월', revenue: 7200, orders: 1440, avgOrderValue: 5000 },
  { month: '6월', revenue: 8500, orders: 1680, avgOrderValue: 5060 }
]

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
        <p className="font-medium text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            <span style={{ color: entry.color }}>●</span>
            {` ${entry.name}: ${entry.value.toLocaleString('ko-KR')}${entry.unit || ''}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ChartShowcase() {
  const [exportedChart, setExportedChart] = useState<string | null>(null)

  const handleExport = (chartType: string) => {
    setExportedChart(chartType)
    setTimeout(() => setExportedChart(null), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">차트 & 그래프</h2>
        <p className="text-muted-foreground">
          CulinarySeoul의 데이터 시각화를 위한 다양한 차트 컴포넌트들입니다. 
          한국 F&B 비즈니스 맥락에 최적화된 예제와 인터랙션을 제공합니다.
        </p>
      </div>

      {/* 선형 차트 - 월별 매출 추이 */}
      <div>
        <h3 className="text-xl font-semibold mb-4">선형 차트 (Line Chart)</h3>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-lg">월별 매출 추이</h4>
              <p className="text-sm text-muted-foreground">2024년 연간 매출 및 고객 수 변화</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('line')}
              className="text-xs"
            >
              {exportedChart === 'line' ? '내보내기 완료!' : '차트 내보내기'}
            </Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--chart-1)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--chart-1)', strokeWidth: 2, r: 4 }}
                  name="매출 (만원)"
                />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="var(--chart-2)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--chart-2)', strokeWidth: 2, r: 3 }}
                  name="고객 수 (명)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 막대 차트 - 카테고리별 판매량 */}
      <div>
        <h3 className="text-xl font-semibold mb-4">막대 차트 (Bar Chart)</h3>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-lg">카테고리별 판매 성과</h4>
              <p className="text-sm text-muted-foreground">메뉴 카테고리별 매출 및 수익 비교</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('bar')}
              className="text-xs"
            >
              {exportedChart === 'bar' ? '내보내기 완료!' : '차트 내보내기'}
            </Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="category" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="sales" 
                  fill="var(--chart-1)" 
                  name="매출 (만원)"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="profit" 
                  fill="var(--chart-2)" 
                  name="수익 (만원)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 원형 차트 - 시장 점유율 */}
      <div>
        <h3 className="text-xl font-semibold mb-4">원형 차트 (Pie Chart)</h3>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-lg">메뉴 카테고리 점유율</h4>
              <p className="text-sm text-muted-foreground">전체 매출에서 각 카테고리가 차지하는 비중</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pie')}
              className="text-xs"
            >
              {exportedChart === 'pie' ? '내보내기 완료!' : '차트 내보내기'}
            </Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketShareData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {marketShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, '점유율']}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 영역 차트 - 누적 성장 */}
      <div>
        <h3 className="text-xl font-semibold mb-4">영역 차트 (Area Chart)</h3>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-lg">누적 매출 성장</h4>
              <p className="text-sm text-muted-foreground">월간 누적 매출과 신규 고객 증가 추이</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('area')}
              className="text-xs"
            >
              {exportedChart === 'area' ? '내보내기 완료!' : '차트 내보내기'}
            </Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="accumulated"
                  stackId="1"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.8}
                  name="누적 매출 (만원)"
                />
                <Area
                  type="monotone"
                  dataKey="newCustomers"
                  stackId="2"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.6}
                  name="신규 고객 (명)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 산점도 - 가격 대비 인기도 분석 */}
      <div>
        <h3 className="text-xl font-semibold mb-4">산점도 (Scatter Plot)</h3>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-lg">메뉴 가격 대비 인기도 분석</h4>
              <p className="text-sm text-muted-foreground">가격과 인기도의 상관관계 (점 크기는 수익성)</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('scatter')}
              className="text-xs"
            >
              {exportedChart === 'scatter' ? '내보내기 완료!' : '차트 내보내기'}
            </Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={priceAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  type="number" 
                  dataKey="price" 
                  name="가격"
                  stroke="var(--muted-foreground)" 
                  fontSize={12}
                  domain={['dataMin - 1000', 'dataMax + 1000']}
                />
                <YAxis 
                  type="number" 
                  dataKey="popularity" 
                  name="인기도"
                  stroke="var(--muted-foreground)" 
                  fontSize={12}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
                          <p className="font-medium text-foreground">메뉴 분석</p>
                          <p className="text-sm text-muted-foreground">
                            가격: {data.price.toLocaleString('ko-KR')}원
                          </p>
                          <p className="text-sm text-muted-foreground">
                            인기도: {data.popularity}점
                          </p>
                          <p className="text-sm text-muted-foreground">
                            수익: {data.profit.toLocaleString('ko-KR')}원
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Scatter 
                  name="메뉴"
                  dataKey="popularity" 
                  fill="var(--chart-3)"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 복합 차트 - 종합 성과 대시보드 */}
      <div>
        <h3 className="text-xl font-semibold mb-4">복합 차트 (Composed Chart)</h3>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-lg">종합 성과 대시보드</h4>
              <p className="text-sm text-muted-foreground">매출, 주문량, 평균 주문금액을 한눈에 비교</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('composed')}
              className="text-xs"
            >
              {exportedChart === 'composed' ? '내보내기 완료!' : '차트 내보내기'}
            </Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12}
                />
                <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="revenue" 
                  fill="var(--chart-1)" 
                  name="매출 (만원)"
                  radius={[2, 2, 0, 0]}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="var(--chart-2)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--chart-2)', strokeWidth: 2, r: 4 }}
                  name="주문 수 (건)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="avgOrderValue" 
                  stroke="var(--chart-3)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'var(--chart-3)', strokeWidth: 2, r: 3 }}
                  name="평균 주문액 (원)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 사용 가이드 */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">차트 사용 가이드</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">차트 선택 기준</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>선형 차트</strong>: 시간별 트렌드 분석</li>
                <li>• <strong>막대 차트</strong>: 카테고리별 비교</li>
                <li>• <strong>원형 차트</strong>: 전체 대비 비율</li>
                <li>• <strong>영역 차트</strong>: 누적 데이터 표현</li>
                <li>• <strong>산점도</strong>: 두 변수 간 상관관계</li>
                <li>• <strong>복합 차트</strong>: 다중 데이터 비교</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">색상 시스템</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Chart 1: 주요 메트릭 (매출, 주문량)</li>
                <li>• Chart 2: 보조 메트릭 (고객수, 수익)</li>
                <li>• Chart 3: 세부 메트릭 (평균값, 비율)</li>
                <li>• Chart 4-5: 추가 카테고리</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">접근성 고려사항</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 색상 대비 4.5:1 이상 유지</li>
              <li>• 툴팁으로 정확한 수치 제공</li>
              <li>• 한국어 숫자 포맷팅 적용</li>
              <li>• 반응형 디자인으로 모든 디바이스 지원</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
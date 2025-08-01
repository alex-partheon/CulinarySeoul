import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { BrandOverviewGrid } from '@/components/dashboard/company/BrandOverviewGrid'
import { ActivityFeed, type ActivityItem } from '@/components/dashboard/ActivityFeed'
import { QuickActions, inventoryQuickActions } from '@/components/dashboard/QuickActions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RealtimeInventoryProvider, useRealtimeInventory } from '@/contexts/RealtimeInventoryContext'
import { AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

// Inner component that uses the realtime inventory context
function CompanyDashboardContent() {
  const { user } = useAuth()
  const { 
    lowStockItems, 
    activeAlerts, 
    recentTransactions,
    inventoryStatus,
    loading 
  } = useRealtimeInventory()
  
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [error, setError] = useState<string | null>(null)

  // Convert transactions to activity items
  useEffect(() => {
    if (recentTransactions.length > 0) {
      const activityItems: ActivityItem[] = recentTransactions.slice(0, 10).map(trans => ({
        id: trans.id,
        type: trans.type === 'in' ? 'inventory' : 'order',
        title: trans.type === 'in' ? '재고 입고' : '재고 출고',
        description: `${trans.quantity}개 ${trans.type === 'in' ? '입고' : '출고'}`,
        timestamp: new Date(trans.created_at),
        color: trans.type === 'in' ? 'primary' : 'secondary'
      }))
      setActivities(activityItems)
    }
  }, [recentTransactions])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(value)
  }

  // Handle quick action clicks
  const handleQuickAction = (action: any) => {
    toast.success(`${action.title} 기능을 실행합니다`)
  }

  const enhancedQuickActions = inventoryQuickActions.map(action => ({
    ...action,
    onClick: () => handleQuickAction(action)
  }))

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">브랜드 현황</TabsTrigger>
            <TabsTrigger value="activity">실시간 활동</TabsTrigger>
            <TabsTrigger value="quick-actions">빠른 작업</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Brand Overview Grid */}
            <BrandOverviewGrid />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityFeed
                items={activities}
                title="실시간 재고 활동"
                loading={loading}
                emptyMessage="최근 재고 활동이 없습니다"
                onItemClick={(item) => {
                  console.log('Activity clicked:', item)
                }}
              />
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">재고 상태</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">총 재고 가치</span>
                    <span className="text-sm font-medium">{formatCurrency(inventoryStatus?.totalValue || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">재고 부족 품목</span>
                    <span className="text-sm font-medium">{lowStockItems.length}개</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">활성 알림</span>
                    <span className="text-sm font-medium">{activeAlerts.length}개</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quick-actions" className="space-y-6">
            {/* Quick Actions */}
            <QuickActions
              actions={enhancedQuickActions}
              title="빠른 작업"
              columns={4}
              variant="card"
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// Main component with provider
export function CompanyDashboard() {
  return (
    <RealtimeInventoryProvider>
      <CompanyDashboardContent />
    </RealtimeInventoryProvider>
  )
}
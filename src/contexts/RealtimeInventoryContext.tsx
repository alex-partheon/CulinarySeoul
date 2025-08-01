import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import { toast } from 'react-hot-toast'
import type { 
  RawMaterial, 
  InventoryTransaction, 
  InventoryAlert,
  InventoryStatus
} from '@/domains/inventory/types'

interface RealtimeInventoryContextType {
  // Real-time data
  lowStockItems: RawMaterial[]
  expiringItems: RawMaterial[]
  recentTransactions: InventoryTransaction[]
  activeAlerts: InventoryAlert[]
  inventoryStatus: InventoryStatus | null
  
  // Actions
  refreshInventory: () => Promise<void>
  acknowledgeAlert: (alertId: string) => Promise<void>
  
  // Loading states
  loading: boolean
  error: string | null
}

const RealtimeInventoryContext = createContext<RealtimeInventoryContextType | undefined>(undefined)

export function useRealtimeInventory() {
  const context = useContext(RealtimeInventoryContext)
  if (context === undefined) {
    throw new Error('useRealtimeInventory must be used within a RealtimeInventoryProvider')
  }
  return context
}

interface RealtimeInventoryProviderProps {
  children: React.ReactNode
  storeId?: string
  brandId?: string
}

export function RealtimeInventoryProvider({ 
  children, 
  storeId,
  brandId 
}: RealtimeInventoryProviderProps) {
  const { user, currentDashboardSession } = useAuth()
  const [lowStockItems, setLowStockItems] = useState<RawMaterial[]>([])
  const [expiringItems, setExpiringItems] = useState<RawMaterial[]>([])
  const [recentTransactions, setRecentTransactions] = useState<InventoryTransaction[]>([])
  const [activeAlerts, setActiveAlerts] = useState<InventoryAlert[]>([])
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Determine context based on dashboard session
  const contextStoreId = storeId || currentDashboardSession?.store_context
  const contextBrandId = brandId || currentDashboardSession?.brand_context

  // Load initial inventory data
  const loadInventoryData = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Build query based on context
      let query = supabase.from('raw_materials').select('*')
      
      if (contextStoreId) {
        query = query.eq('store_id', contextStoreId)
      } else if (contextBrandId) {
        // Get all stores for the brand
        const { data: stores } = await supabase
          .from('stores')
          .select('id')
          .eq('brand_id', contextBrandId)
        
        if (stores) {
          const storeIds = stores.map(s => s.id)
          query = query.in('store_id', storeIds)
        }
      }

      // Fetch low stock items
      const { data: lowStock, error: lowStockError } = await query
        .lte('current_quantity', 'min_quantity')
        .order('current_quantity', { ascending: true })
        .limit(10)

      if (lowStockError) throw lowStockError
      setLowStockItems(lowStock || [])

      // Fetch expiring items (within 7 days)
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 7)
      
      const { data: expiring, error: expiringError } = await query
        .lte('expiry_date', expiryDate.toISOString())
        .gte('expiry_date', new Date().toISOString())
        .order('expiry_date', { ascending: true })
        .limit(10)

      if (expiringError) throw expiringError
      setExpiringItems(expiring || [])

      // Fetch recent transactions
      let transQuery = supabase
        .from('inventory_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (contextStoreId) {
        transQuery = transQuery.eq('store_id', contextStoreId)
      }

      const { data: transactions, error: transError } = await transQuery
      if (transError) throw transError
      setRecentTransactions(transactions || [])

      // Fetch active alerts
      let alertQuery = supabase
        .from('inventory_alerts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (contextStoreId) {
        alertQuery = alertQuery.eq('store_id', contextStoreId)
      }

      const { data: alerts, error: alertError } = await alertQuery
      if (alertError) throw alertError
      setActiveAlerts(alerts || [])

      // Calculate inventory status
      const status: InventoryStatus = {
        totalItems: lowStock?.length || 0,
        lowStockCount: lowStock?.length || 0,
        expiringCount: expiring?.length || 0,
        totalValue: 0, // Calculate from items
        lastUpdated: new Date().toISOString()
      }
      setInventoryStatus(status)

    } catch (err) {
      console.error('Error loading inventory data:', err)
      setError('재고 데이터를 불러오는데 실패했습니다.')
      toast.error('재고 데이터 로드 실패')
    } finally {
      setLoading(false)
    }
  }, [user, contextStoreId, contextBrandId])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return

    // Load initial data
    loadInventoryData()

    // Subscribe to inventory changes
    const inventoryChannel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'raw_materials',
          filter: contextStoreId ? `store_id=eq.${contextStoreId}` : undefined
        },
        (payload) => {
          console.log('Inventory change:', payload)
          // Reload inventory data on changes
          loadInventoryData()
          
          // Show notification for significant changes
          if (payload.eventType === 'UPDATE') {
            const newItem = payload.new as RawMaterial
            const oldItem = payload.old as RawMaterial
            
            if (newItem.current_quantity <= newItem.min_quantity && 
                oldItem.current_quantity > oldItem.min_quantity) {
              toast.error(`재고 부족: ${newItem.name}`)
            }
          }
        }
      )
      .subscribe()

    // Subscribe to transaction updates
    const transactionChannel = supabase
      .channel('transaction-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'inventory_transactions',
          filter: contextStoreId ? `store_id=eq.${contextStoreId}` : undefined
        },
        (payload) => {
          const newTransaction = payload.new as InventoryTransaction
          setRecentTransactions(prev => [newTransaction, ...prev].slice(0, 20))
          
          // Show notification
          toast.success(`재고 ${newTransaction.type === 'in' ? '입고' : '출고'}: ${newTransaction.quantity}개`)
        }
      )
      .subscribe()

    // Subscribe to alert updates
    const alertChannel = supabase
      .channel('alert-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_alerts',
          filter: contextStoreId ? `store_id=eq.${contextStoreId}` : undefined
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newAlert = payload.new as InventoryAlert
            setActiveAlerts(prev => [newAlert, ...prev])
            
            // Show notification based on alert type
            const alertMessages = {
              low_stock: '재고 부족 알림',
              expiring: '유통기한 임박 알림',
              expired: '유통기한 만료 알림',
              overstock: '재고 과잉 알림'
            }
            
            toast.error(alertMessages[newAlert.type as keyof typeof alertMessages] || '재고 알림')
          }
        }
      )
      .subscribe()

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(inventoryChannel)
      supabase.removeChannel(transactionChannel)
      supabase.removeChannel(alertChannel)
    }
  }, [user, contextStoreId, loadInventoryData])

  const refreshInventory = async () => {
    await loadInventoryData()
  }

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('inventory_alerts')
        .update({ 
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: user?.id
        })
        .eq('id', alertId)

      if (error) throw error

      // Remove from active alerts
      setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId))
      toast.success('알림이 확인되었습니다.')
    } catch (err) {
      console.error('Error acknowledging alert:', err)
      toast.error('알림 확인 실패')
    }
  }

  const value: RealtimeInventoryContextType = {
    lowStockItems,
    expiringItems,
    recentTransactions,
    activeAlerts,
    inventoryStatus,
    refreshInventory,
    acknowledgeAlert,
    loading,
    error
  }

  return (
    <RealtimeInventoryContext.Provider value={value}>
      {children}
    </RealtimeInventoryContext.Provider>
  )
}
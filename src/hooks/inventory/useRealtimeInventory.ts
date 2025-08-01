import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'

interface InventoryUpdate {
  id: string
  product_id: string
  store_id: string
  quantity: number
  updated_at: string
  operation: 'INSERT' | 'UPDATE' | 'DELETE'
}

interface UseRealtimeInventoryOptions {
  storeId?: string
  brandId?: string
  companyId?: string
  onUpdate?: (update: InventoryUpdate) => void
}

export function useRealtimeInventory({
  storeId,
  brandId,
  companyId,
  onUpdate
}: UseRealtimeInventoryOptions = {}) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<InventoryUpdate | null>(null)

  // Handle inventory updates
  const handleInventoryUpdate = useCallback((payload: any) => {
    const update: InventoryUpdate = {
      id: payload.new?.id || payload.old?.id,
      product_id: payload.new?.product_id || payload.old?.product_id,
      store_id: payload.new?.store_id || payload.old?.store_id,
      quantity: payload.new?.quantity || 0,
      updated_at: payload.new?.updated_at || new Date().toISOString(),
      operation: payload.eventType
    }

    setLastUpdate(update)
    onUpdate?.(update)

    // Show toast notification for significant changes
    if (update.operation === 'UPDATE' && payload.old?.quantity !== payload.new?.quantity) {
      const diff = payload.new.quantity - payload.old.quantity
      if (Math.abs(diff) > 10) {
        toast.success(`재고 ${diff > 0 ? '증가' : '감소'}: ${Math.abs(diff)}개`, {
          duration: 3000,
          position: 'bottom-right'
        })
      }
    }
  }, [onUpdate])

  // Subscribe to realtime updates
  useEffect(() => {
    // Build channel name based on scope
    let channelName = 'inventory'
    if (storeId) {
      channelName = `inventory:${storeId}`
    } else if (brandId) {
      channelName = `inventory:brand:${brandId}`
    } else if (companyId) {
      channelName = `inventory:company:${companyId}`
    }

    // Create channel
    const newChannel = supabase.channel(channelName)

    // Subscribe to inventory changes
    newChannel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory',
          filter: storeId ? `store_id=eq.${storeId}` : undefined
        },
        handleInventoryUpdate
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
        if (status === 'SUBSCRIBED') {
          console.log(`Connected to realtime inventory updates: ${channelName}`)
        }
      })

    setChannel(newChannel)

    // Cleanup
    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel)
      }
    }
  }, [storeId, brandId, companyId, handleInventoryUpdate])

  // Manual refresh function
  const refresh = useCallback(async () => {
    if (!channel) return

    // Trigger a manual sync by querying latest data
    try {
      let query = supabase
        .from('inventory')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(10)

      if (storeId) {
        query = query.eq('store_id', storeId)
      }

      const { data, error } = await query

      if (error) throw error

      // Process the latest updates
      data?.forEach((item) => {
        handleInventoryUpdate({
          eventType: 'UPDATE',
          new: item,
          old: item
        })
      })

      toast.success('재고 데이터를 새로고침했습니다')
    } catch (error) {
      console.error('Error refreshing inventory:', error)
      toast.error('재고 새로고침 실패')
    }
  }, [channel, storeId, handleInventoryUpdate])

  return {
    isConnected,
    lastUpdate,
    refresh
  }
}
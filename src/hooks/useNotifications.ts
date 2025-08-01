import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Notification, NotificationType } from '@/types/notifications';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.read_at).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('알림을 읽음으로 표시하는데 실패했습니다.');
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('read_at', null);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
      toast.success('모든 알림을 읽음으로 표시했습니다.');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('알림을 읽음으로 표시하는데 실패했습니다.');
    }
  }, [user]);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications([]);
      setUnreadCount(0);
      toast.success('모든 알림을 삭제했습니다.');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      toast.error('알림을 삭제하는데 실패했습니다.');
    }
  }, [user]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for new notification
          toast(newNotification.title, {
            icon: getNotificationIcon(newNotification.type),
            duration: 4000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearAll,
    refetch: fetchNotifications
  };
}

// Helper function to get notification icon
function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case NotificationType.LOW_STOCK:
      return '📦';
    case NotificationType.ORDER:
      return '🛒';
    case NotificationType.SYSTEM:
      return '⚙️';
    case NotificationType.ALERT:
      return '🚨';
    default:
      return '📢';
  }
}
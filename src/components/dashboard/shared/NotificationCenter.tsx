import { useState, useMemo } from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '../../ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification, NotificationType, NotificationGroup } from '@/types/notifications';
import { cn } from '@/lib/utils';

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Group notifications by time
  const groupedNotifications = useMemo(() => {
    const groups: NotificationGroup[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayNotifications: Notification[] = [];
    const yesterdayNotifications: Notification[] = [];
    const olderNotifications: Notification[] = [];

    notifications.forEach(notification => {
      const notificationDate = new Date(notification.created_at);
      
      if (notificationDate.toDateString() === today.toDateString()) {
        todayNotifications.push(notification);
      } else if (notificationDate.toDateString() === yesterday.toDateString()) {
        yesterdayNotifications.push(notification);
      } else {
        olderNotifications.push(notification);
      }
    });

    if (todayNotifications.length > 0) {
      groups.push({ label: '오늘', notifications: todayNotifications });
    }
    if (yesterdayNotifications.length > 0) {
      groups.push({ label: '어제', notifications: yesterdayNotifications });
    }
    if (olderNotifications.length > 0) {
      groups.push({ label: '이전', notifications: olderNotifications });
    }

    return groups;
  }, [notifications]);

  const getNotificationIcon = (type: NotificationType) => {
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
  };

  const getNotificationTypeLabel = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LOW_STOCK:
        return '재고 부족';
      case NotificationType.ORDER:
        return '주문';
      case NotificationType.SYSTEM:
        return '시스템';
      case NotificationType.ALERT:
        return '경고';
      default:
        return '알림';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
    
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold">알림</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                모두 읽음
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                모두 삭제
              </Button>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              알림이 없습니다.
            </div>
          ) : (
            <div className="p-2">
              {groupedNotifications.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {group.label}
                  </div>
                  {group.notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 p-3 cursor-pointer",
                        !notification.read_at && "bg-accent/50"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <span className="text-lg flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-none">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          {notification.action_url && (
                            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {getNotificationTypeLabel(notification.type)}
                          </Badge>
                          <span>
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: ko
                            })}
                          </span>
                        </div>
                      </div>
                      {!notification.read_at && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
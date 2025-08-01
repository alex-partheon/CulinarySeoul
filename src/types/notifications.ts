export enum NotificationType {
  LOW_STOCK = 'low_stock',
  ORDER = 'order',
  SYSTEM = 'system',
  ALERT = 'alert'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  read_at: string | null;
  user_id: string;
  metadata?: Record<string, any>;
  action_url?: string;
}

export interface NotificationGroup {
  label: string;
  notifications: Notification[];
}
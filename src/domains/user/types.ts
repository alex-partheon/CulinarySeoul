import { BaseEntity, AuditableEntity, ContactInfo, Status } from '../shared/types'

// 사용자 역할
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  VIEWER = 'viewer'
}

// 사용자 권한
export enum Permission {
  // 사용자 관리
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  
  // 재고 관리
  INVENTORY_CREATE = 'inventory:create',
  INVENTORY_READ = 'inventory:read',
  INVENTORY_UPDATE = 'inventory:update',
  INVENTORY_DELETE = 'inventory:delete',
  
  // 주문 관리
  ORDER_CREATE = 'order:create',
  ORDER_READ = 'order:read',
  ORDER_UPDATE = 'order:update',
  ORDER_DELETE = 'order:delete',
  
  // 공급업체 관리
  SUPPLIER_CREATE = 'supplier:create',
  SUPPLIER_READ = 'supplier:read',
  SUPPLIER_UPDATE = 'supplier:update',
  SUPPLIER_DELETE = 'supplier:delete',
  
  // 보고서
  REPORT_VIEW = 'report:view',
  REPORT_EXPORT = 'report:export',
  
  // 시스템 설정
  SYSTEM_CONFIG = 'system:config'
}

// 사용자 엔티티
export interface User extends AuditableEntity {
  email: string
  username: string
  first_name: string
  last_name: string
  role: UserRole
  status: Status
  contact_info?: ContactInfo
  avatar_url?: string
  last_login_at?: string
  email_verified: boolean
  two_factor_enabled: boolean
  preferences: UserPreferences
  permissions: Permission[]
}

// 사용자 환경설정
export interface UserPreferences {
  language: string
  timezone: string
  date_format: string
  currency: string
  notifications: NotificationSettings
  dashboard_layout?: DashboardLayout
}

// 알림 설정
export interface NotificationSettings {
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  low_stock_alerts: boolean
  order_updates: boolean
  system_alerts: boolean
}

// 대시보드 레이아웃
export interface DashboardLayout {
  widgets: DashboardWidget[]
  layout: 'grid' | 'list'
  theme: 'light' | 'dark' | 'auto'
}

export interface DashboardWidget {
  id: string
  type: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  config: Record<string, any>
}

// 사용자 세션
export interface UserSession extends BaseEntity {
  user_id: string
  token: string
  expires_at: string
  ip_address: string
  user_agent: string
  is_active: boolean
}

// 사용자 활동 로그
export interface UserActivity extends BaseEntity {
  user_id: string
  action: string
  resource_type: string
  resource_id?: string
  details?: Record<string, any>
  ip_address: string
  user_agent: string
}

// 사용자 생성 DTO
export interface CreateUserDto {
  email: string
  username: string
  first_name: string
  last_name: string
  role: UserRole
  contact_info?: ContactInfo
  send_invitation?: boolean
}

// 사용자 업데이트 DTO
export interface UpdateUserDto {
  username?: string
  first_name?: string
  last_name?: string
  role?: UserRole
  status?: Status
  contact_info?: ContactInfo
  avatar_url?: string
  preferences?: Partial<UserPreferences>
}

// 사용자 필터
export interface UserFilter {
  role?: UserRole
  status?: Status
  search?: string
  created_after?: string
  created_before?: string
  last_login_after?: string
  last_login_before?: string
}
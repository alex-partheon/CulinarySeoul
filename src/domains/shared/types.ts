// 공통 도메인 타입 정의
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

export interface AuditableEntity extends BaseEntity {
  created_by?: string
  updated_by?: string
}

// 값 객체 (Value Objects)
export interface Money {
  amount: number
  currency: string
}

export interface Address {
  street: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface ContactInfo {
  phone?: string
  email?: string
  fax?: string
}

// 공통 열거형
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// 도메인 이벤트 기본 인터페이스
export interface DomainEvent {
  id: string
  aggregate_id: string
  event_type: string
  event_data: Record<string, any>
  occurred_at: string
  version: number
}

// 페이지네이션
export interface PaginationParams {
  page: number
  limit: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
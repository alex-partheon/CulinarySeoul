import { BaseEntity, AuditableEntity, Money, Address, ContactInfo } from '../shared/types'
import { InventoryItem } from '../inventory/types'

// 주문 상태
export enum OrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

// 주문 타입
export enum OrderType {
  PURCHASE = 'purchase',
  SALE = 'sale',
  TRANSFER = 'transfer',
  RETURN = 'return'
}

// 결제 상태
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIAL = 'partial',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

// 결제 방법
export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  DIGITAL_WALLET = 'digital_wallet',
  CREDIT_TERMS = 'credit_terms'
}

// 주문 엔티티
export interface Order extends AuditableEntity {
  order_number: string
  type: OrderType
  status: OrderStatus
  customer_id?: string
  supplier_id?: string
  order_date: string
  expected_delivery_date?: string
  actual_delivery_date?: string
  shipping_address?: Address
  billing_address?: Address
  contact_info?: ContactInfo
  subtotal: Money
  tax_amount: Money
  shipping_cost: Money
  discount_amount: Money
  total_amount: Money
  payment_status: PaymentStatus
  payment_method?: PaymentMethod
  payment_terms?: string
  notes?: string
  internal_notes?: string
  tracking_number?: string
  items: OrderItem[]
  payments: OrderPayment[]
  status_history: OrderStatusHistory[]
}

// 주문 아이템
export interface OrderItem extends BaseEntity {
  order_id: string
  item_id: string
  item: InventoryItem
  quantity: number
  unit_price: Money
  discount_amount: Money
  tax_amount: Money
  total_amount: Money
  notes?: string
  received_quantity?: number
  damaged_quantity?: number
}

// 주문 결제
export interface OrderPayment extends AuditableEntity {
  order_id: string
  payment_method: PaymentMethod
  amount: Money
  payment_date: string
  reference_number?: string
  notes?: string
  processed_by: string
}

// 주문 상태 이력
export interface OrderStatusHistory extends BaseEntity {
  order_id: string
  old_status: OrderStatus
  new_status: OrderStatus
  changed_by: string
  notes?: string
}

// 고객 정보
export interface Customer extends AuditableEntity {
  customer_code: string
  name: string
  type: CustomerType
  contact_info: ContactInfo
  billing_address: Address
  shipping_address?: Address
  payment_terms?: string
  credit_limit?: Money
  tax_id?: string
  notes?: string
  is_active: boolean
}

export enum CustomerType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
  RESTAURANT = 'restaurant',
  HOTEL = 'hotel',
  CATERING = 'catering'
}

// 공급업체 정보
export interface Supplier extends AuditableEntity {
  supplier_code: string
  name: string
  contact_info: ContactInfo
  address: Address
  payment_terms?: string
  lead_time_days?: number
  minimum_order_amount?: Money
  tax_id?: string
  website?: string
  notes?: string
  is_active: boolean
  rating?: number
  categories: string[]
}

// 주문 템플릿
export interface OrderTemplate extends AuditableEntity {
  name: string
  description?: string
  type: OrderType
  supplier_id?: string
  items: OrderTemplateItem[]
  is_active: boolean
}

export interface OrderTemplateItem {
  item_id: string
  quantity: number
  notes?: string
}

// 주문 보고서
export interface OrderReport {
  total_orders: number
  total_value: Money
  orders_by_status: StatusSummary[]
  orders_by_type: TypeSummary[]
  top_customers: Customer[]
  top_suppliers: Supplier[]
  recent_orders: Order[]
  payment_summary: PaymentSummary
}

export interface StatusSummary {
  status: OrderStatus
  count: number
  total_value: Money
}

export interface TypeSummary {
  type: OrderType
  count: number
  total_value: Money
}

export interface PaymentSummary {
  total_paid: Money
  total_pending: Money
  total_overdue: Money
  by_method: PaymentMethodSummary[]
}

export interface PaymentMethodSummary {
  method: PaymentMethod
  count: number
  total_amount: Money
}

// DTO 타입들
export interface CreateOrderDto {
  type: OrderType
  customer_id?: string
  supplier_id?: string
  expected_delivery_date?: string
  shipping_address?: Address
  billing_address?: Address
  contact_info?: ContactInfo
  payment_method?: PaymentMethod
  payment_terms?: string
  notes?: string
  items: CreateOrderItemDto[]
}

export interface CreateOrderItemDto {
  item_id: string
  quantity: number
  unit_price?: Money
  discount_amount?: Money
  notes?: string
}

export interface UpdateOrderDto {
  status?: OrderStatus
  expected_delivery_date?: string
  actual_delivery_date?: string
  shipping_address?: Address
  billing_address?: Address
  contact_info?: ContactInfo
  payment_method?: PaymentMethod
  payment_terms?: string
  notes?: string
  internal_notes?: string
  tracking_number?: string
}

export interface CreateCustomerDto {
  name: string
  type: CustomerType
  contact_info: ContactInfo
  billing_address: Address
  shipping_address?: Address
  payment_terms?: string
  credit_limit?: Money
  tax_id?: string
  notes?: string
}

export interface CreateSupplierDto {
  name: string
  contact_info: ContactInfo
  address: Address
  payment_terms?: string
  lead_time_days?: number
  minimum_order_amount?: Money
  tax_id?: string
  website?: string
  notes?: string
  categories: string[]
}

export interface OrderFilter {
  type?: OrderType
  status?: OrderStatus
  customer_id?: string
  supplier_id?: string
  payment_status?: PaymentStatus
  order_date_from?: string
  order_date_to?: string
  delivery_date_from?: string
  delivery_date_to?: string
  search?: string
}
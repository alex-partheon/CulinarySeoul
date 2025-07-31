import { BaseEntity, AuditableEntity, Money, Status } from '../shared/types'

// 재고 카테고리
export enum InventoryCategory {
  INGREDIENTS = 'ingredients',
  BEVERAGES = 'beverages',
  PACKAGING = 'packaging',
  CLEANING = 'cleaning',
  EQUIPMENT = 'equipment',
  OFFICE = 'office'
}

// 측정 단위
export enum Unit {
  // 무게
  GRAM = 'g',
  KILOGRAM = 'kg',
  POUND = 'lb',
  OUNCE = 'oz',
  
  // 부피
  MILLILITER = 'ml',
  LITER = 'l',
  GALLON = 'gal',
  FLUID_OUNCE = 'fl_oz',
  
  // 개수
  PIECE = 'pcs',
  DOZEN = 'dozen',
  CASE = 'case',
  BOX = 'box',
  
  // 기타
  PACKAGE = 'pkg',
  BOTTLE = 'bottle',
  CAN = 'can'
}

// 재고 상태
export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
  EXPIRED = 'expired'
}

// 재고 아이템
export interface InventoryItem extends AuditableEntity {
  sku: string
  name: string
  description?: string
  category: InventoryCategory
  unit: Unit
  current_quantity: number
  minimum_quantity: number
  maximum_quantity: number
  reorder_point: number
  reorder_quantity: number
  unit_cost: Money
  selling_price?: Money
  supplier_id?: string
  location: string
  barcode?: string
  expiry_date?: string
  batch_number?: string
  status: InventoryStatus
  is_perishable: boolean
  storage_requirements?: string
  nutritional_info?: NutritionalInfo
  allergens?: string[]
  tags?: string[]
}

// 영양 정보
export interface NutritionalInfo {
  calories_per_100g?: number
  protein_g?: number
  carbs_g?: number
  fat_g?: number
  fiber_g?: number
  sodium_mg?: number
  sugar_g?: number
}

// 재고 이동
export interface InventoryMovement extends AuditableEntity {
  item_id: string
  movement_type: MovementType
  quantity: number
  unit_cost?: Money
  reference_id?: string
  reference_type?: string
  notes?: string
  location_from?: string
  location_to?: string
  batch_number?: string
  expiry_date?: string
}

export enum MovementType {
  PURCHASE = 'purchase',
  SALE = 'sale',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  WASTE = 'waste',
  RETURN = 'return',
  PRODUCTION_USE = 'production_use',
  SAMPLE = 'sample'
}

// 재고 조정
export interface InventoryAdjustment extends AuditableEntity {
  item_id: string
  old_quantity: number
  new_quantity: number
  adjustment_quantity: number
  reason: AdjustmentReason
  notes?: string
  approved_by?: string
  approved_at?: string
}

export enum AdjustmentReason {
  PHYSICAL_COUNT = 'physical_count',
  DAMAGE = 'damage',
  THEFT = 'theft',
  EXPIRY = 'expiry',
  SYSTEM_ERROR = 'system_error',
  OTHER = 'other'
}

// 재고 알림
export interface InventoryAlert extends BaseEntity {
  item_id: string
  alert_type: AlertType
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  is_read: boolean
  acknowledged_by?: string
  acknowledged_at?: string
}

export enum AlertType {
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  EXPIRY_WARNING = 'expiry_warning',
  EXPIRED = 'expired',
  OVERSTOCK = 'overstock'
}

// 재고 보고서
export interface InventoryReport {
  total_items: number
  total_value: Money
  low_stock_items: number
  out_of_stock_items: number
  expired_items: number
  categories: CategorySummary[]
  top_items: InventoryItem[]
  recent_movements: InventoryMovement[]
}

export interface CategorySummary {
  category: InventoryCategory
  item_count: number
  total_value: Money
  low_stock_count: number
}

// DTO 타입들
export interface CreateInventoryItemDto {
  sku: string
  name: string
  description?: string
  category: InventoryCategory
  unit: Unit
  minimum_quantity: number
  maximum_quantity: number
  reorder_point: number
  reorder_quantity: number
  unit_cost: Money
  selling_price?: Money
  supplier_id?: string
  location: string
  barcode?: string
  is_perishable: boolean
  storage_requirements?: string
  nutritional_info?: NutritionalInfo
  allergens?: string[]
  tags?: string[]
}

export interface UpdateInventoryItemDto {
  name?: string
  description?: string
  category?: InventoryCategory
  unit?: Unit
  minimum_quantity?: number
  maximum_quantity?: number
  reorder_point?: number
  reorder_quantity?: number
  unit_cost?: Money
  selling_price?: Money
  supplier_id?: string
  location?: string
  barcode?: string
  storage_requirements?: string
  nutritional_info?: NutritionalInfo
  allergens?: string[]
  tags?: string[]
}

export interface InventoryFilter {
  category?: InventoryCategory
  status?: InventoryStatus
  supplier_id?: string
  location?: string
  search?: string
  low_stock_only?: boolean
  expired_only?: boolean
  tags?: string[]
}
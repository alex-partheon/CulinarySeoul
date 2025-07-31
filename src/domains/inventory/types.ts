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

// TASK-006: FIFO 기반 원재료 관리 시스템 타입 정의

// 재고 로트 (FIFO 처리를 위한 핵심 엔티티)
export interface InventoryLot extends AuditableEntity {
  material_id: string
  store_id: string
  lot_number: string
  received_date: string
  expiry_date?: string
  received_quantity: number
  available_quantity: number
  unit_cost: Money
  supplier_info: SupplierInfo
  status: LotStatus
}

// 로트 상태
export enum LotStatus {
  ACTIVE = 'active',
  DEPLETED = 'depleted',
  EXPIRED = 'expired',
  QUARANTINED = 'quarantined'
}

// 공급업체 정보
export interface SupplierInfo {
  supplier_id?: string
  supplier_name?: string
  invoice_number?: string
  delivery_note?: string
  quality_grade?: string
  certification?: string[]
}

// FIFO 출고 처리 결과
export interface OutboundResult {
  success: boolean
  usedLots: UsedLot[]
  totalCost: number
  averageUnitCost: number
  shortageQuantity: number
  transactionId: string
}

// 사용된 로트 정보
export interface UsedLot {
  lotId: string
  quantity: number
  unitCost: number
  totalCost: number
  lotNumber: string
  receivedDate: string
}

// FIFO 입고 처리 요청
export interface InboundRequest {
  materialId: string
  storeId: string
  quantity: number
  unitCost: number
  lotNumber?: string
  expiryDate?: string
  supplierInfo: SupplierInfo
  receivedDate?: string
}

// FIFO 출고 처리 요청
export interface OutboundRequest {
  materialId: string
  storeId: string
  quantity: number
  reason: MovementType
  referenceId?: string
  notes?: string
}

// 재고 조정 요청
export interface StockAdjustmentRequest {
  lotId: string
  newQuantity: number
  reason: AdjustmentReason
  notes?: string
  approvedBy: string
}

// 재고 회전율 분석 결과
export interface InventoryTurnoverAnalysis {
  materialId: string
  materialName: string
  period: AnalysisPeriod
  averageInventory: number
  costOfGoodsSold: number
  turnoverRatio: number
  daysInInventory: number
  trend: 'improving' | 'declining' | 'stable'
  recommendations: string[]
}

// 분석 기간
export interface AnalysisPeriod {
  startDate: string
  endDate: string
  periodType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
}

// 안전재고 알림 설정
export interface SafetyStockAlert {
  materialId: string
  storeId: string
  currentStock: number
  safetyStockLevel: number
  reorderPoint: number
  alertLevel: 'warning' | 'critical'
  estimatedStockoutDate?: string
  suggestedOrderQuantity: number
}

// 유통기한 알림
export interface ExpiryAlert {
  lotId: string
  materialId: string
  materialName: string
  lotNumber: string
  expiryDate: string
  daysUntilExpiry: number
  availableQuantity: number
  alertLevel: 'warning' | 'critical' | 'expired'
  suggestedAction: 'use_first' | 'discount' | 'dispose'
}

// 재고 폐기 처리
export interface WasteDisposal {
  lotId: string
  disposalQuantity: number
  disposalReason: WasteReason
  disposalDate: string
  disposalCost?: number
  approvedBy: string
  notes?: string
  environmentalImpact?: EnvironmentalImpact
}

// 폐기 사유
export enum WasteReason {
  EXPIRED = 'expired',
  DAMAGED = 'damaged',
  CONTAMINATED = 'contaminated',
  QUALITY_ISSUE = 'quality_issue',
  OVERSTOCK = 'overstock',
  RECALL = 'recall'
}

// 환경 영향
export interface EnvironmentalImpact {
  carbonFootprint?: number
  wasteWeight?: number
  recyclingMethod?: string
  disposalMethod: string
}

// 원재료 마스터 데이터
export interface RawMaterial extends AuditableEntity {
  code: string
  name: string
  description?: string
  category: InventoryCategory
  unit: Unit
  standardCost: Money
  safetyStockDays: number
  leadTimeDays: number
  shelfLifeDays?: number
  storageConditions: StorageConditions
  qualitySpecs: QualitySpecification[]
  allergens: string[]
  nutritionalInfo?: NutritionalInfo
  isActive: boolean
}

// 보관 조건
export interface StorageConditions {
  temperature?: TemperatureRange
  humidity?: HumidityRange
  lightCondition: 'dark' | 'normal' | 'bright'
  ventilation: 'none' | 'normal' | 'high'
  specialRequirements?: string[]
}

// 온도 범위
export interface TemperatureRange {
  min: number
  max: number
  unit: 'celsius' | 'fahrenheit'
}

// 습도 범위
export interface HumidityRange {
  min: number
  max: number
}

// 품질 규격
export interface QualitySpecification {
  parameter: string
  specification: string
  testMethod?: string
  acceptanceCriteria: string
}
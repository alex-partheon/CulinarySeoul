// 토스페이먼츠 결제 도메인 타입 정의
// 매출관리(구현중): 토스페이먼츠 연동을 통한 자동 매출 수집 시스템은 현재 구현 중단 상태입니다.
// 추후 개발 예정이며, 현재는 기본 타입 정의만 제공됩니다.

import { AuditableEntity, Money } from '../shared/types'

// 토스페이먼츠 계정 설정
export interface TossPaymentsAccount {
  id: string
  name: string
  clientKey: string
  secretKey: string
  environment: 'test' | 'live'
  isActive: boolean
  storeId?: string
  companyId?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// 결제 요청
export interface PaymentRequest {
  orderId: string
  amount: Money
  orderName: string
  customerKey: string
  customerName?: string
  customerEmail?: string
  customerMobilePhone?: string
  accountId: string // 사용할 토스페이먼츠 계정 ID
  successUrl?: string
  failUrl?: string
  metadata?: Record<string, any>
}

// 결제 응답
export interface PaymentResponse {
  paymentKey: string
  orderId: string
  status: PaymentStatus
  totalAmount: number
  balanceAmount: number
  suppliedAmount: number
  vat: number
  isPartialCancelable: boolean
  currency: string
  method: PaymentMethod
  requestedAt: string
  approvedAt?: string
  useEscrow: boolean
  cultureExpense: boolean
  card?: CardInfo
  virtualAccount?: VirtualAccountInfo
  transfer?: TransferInfo
  mobilePhone?: MobilePhoneInfo
  giftCertificate?: GiftCertificateInfo
  cashReceipt?: CashReceiptInfo
  discount?: DiscountInfo
  cancels?: CancelInfo[]
  secret?: string
  type: string
  easyPay?: EasyPayInfo
  country: string
  failure?: FailureInfo
  cashReceipts?: CashReceiptInfo[]
  receipt?: ReceiptInfo
}

// 결제 상태
export type PaymentStatus = 
  | 'READY'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_DEPOSIT'
  | 'DONE'
  | 'CANCELED'
  | 'PARTIAL_CANCELED'
  | 'ABORTED'
  | 'EXPIRED'

// 결제 수단
export type PaymentMethod = 
  | '카드'
  | '가상계좌'
  | '계좌이체'
  | '휴대폰'
  | '상품권'
  | '간편결제'
  | '포인트'

// 카드 정보
export interface CardInfo {
  issuerCode: string
  acquirerCode?: string
  number: string
  installmentPlanMonths: number
  isInterestFree: boolean
  interestPayer?: string
  approveNo: string
  useCardPoint: boolean
  cardType: string
  ownerType: string
  acquireStatus: string
  receiptUrl?: string
  amount: number
}

// 가상계좌 정보
export interface VirtualAccountInfo {
  accountType: string
  accountNumber: string
  bankCode: string
  customerName: string
  dueDate: string
  refundStatus: string
  expired: boolean
  settlementStatus: string
  refundReceiveAccount?: RefundReceiveAccount
}

// 계좌이체 정보
export interface TransferInfo {
  bankCode: string
  settlementStatus: string
}

// 휴대폰 결제 정보
export interface MobilePhoneInfo {
  customerMobilePhone: string
  settlementStatus: string
  receiptUrl: string
}

// 상품권 정보
export interface GiftCertificateInfo {
  approveNo: string
  settlementStatus: string
}

// 현금영수증 정보
export interface CashReceiptInfo {
  type?: string
  receiptKey?: string
  issueNumber?: string
  receiptUrl?: string
  amount?: number
  taxFreeAmount?: number
}

// 할인 정보
export interface DiscountInfo {
  amount: number
}

// 취소 정보
export interface CancelInfo {
  cancelAmount: number
  cancelReason: string
  taxFreeAmount: number
  taxExemptionAmount: number
  refundableAmount: number
  easyPayDiscountAmount: number
  canceledAt: string
  transactionKey: string
  receiptKey?: string
}

// 간편결제 정보
export interface EasyPayInfo {
  provider: string
  amount: number
  discountAmount: number
}

// 실패 정보
export interface FailureInfo {
  code: string
  message: string
}

// 영수증 정보
export interface ReceiptInfo {
  url: string
}

// 환불 계좌 정보
export interface RefundReceiveAccount {
  bankCode: string
  accountNumber: string
  holderName: string
}

// 매출 데이터
export interface SalesData extends AuditableEntity {
  paymentKey: string
  orderId: string
  amount: Money
  method: PaymentMethod
  status: PaymentStatus
  approvedAt: Date
  accountId: string
  storeId?: string
  companyId?: string
  metadata?: Record<string, any>
  isProcessed: boolean // 재고 차감 처리 여부
  processedAt?: Date
  hash: string // 중복 방지용 해시
}

// 웹훅 이벤트
export interface WebhookEvent {
  eventType: string
  data: PaymentResponse
  createdAt: string
}

// 웹훅 검증 결과
export interface WebhookVerificationResult {
  isValid: boolean
  error?: string
}

// 스케줄러 설정
export interface SchedulerConfig {
  cronExpression: string
  retryAttempts: number
  retryInterval: number
  batchSize: number
  timeoutMs: number
}

// 매출 수집 결과
export interface SalesCollectionResult {
  success: boolean
  totalCollected: number
  newRecords: number
  duplicateRecords: number
  errors: string[]
  processedAt: Date
}

// 재고 차감 트리거 요청
export interface InventoryDeductionRequest {
  orderId: string
  paymentKey: string
  items: InventoryDeductionItem[]
  storeId: string
  processedBy: string
}

// 재고 차감 아이템
export interface InventoryDeductionItem {
  materialId: string
  quantity: number
  unitCost: Money
}

// 재고 차감 결과
export interface InventoryDeductionResult {
  success: boolean
  orderId: string
  paymentKey: string
  processedItems: ProcessedInventoryItem[]
  errors: string[]
  processedAt: Date
}

// 처리된 재고 아이템
export interface ProcessedInventoryItem {
  materialId: string
  requestedQuantity: number
  processedQuantity: number
  shortageQuantity: number
  averageUnitCost: Money
  totalCost: Money
}

// 대시보드 업데이트 이벤트
export interface DashboardUpdateEvent {
  type: 'payment' | 'inventory' | 'sales'
  data: any
  timestamp: Date
  accountId?: string
  storeId?: string
  companyId?: string
}

// 결제 테스트 케이스
export interface PaymentTestCase {
  id: string
  name: string
  description: string
  accountId: string
  testData: PaymentRequest
  expectedResult: Partial<PaymentResponse>
  isActive: boolean
}

// 결제 테스트 결과
export interface PaymentTestResult {
  testCaseId: string
  success: boolean
  actualResult?: PaymentResponse
  error?: string
  executedAt: Date
  duration: number
}
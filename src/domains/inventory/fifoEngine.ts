// TASK-006: FIFO 기반 원재료 관리 엔진 구현
// Domain-Driven Design 패턴 적용

import { SupabaseClient } from '@supabase/supabase-js';
import {
  InventoryLot,
  OutboundRequest,
  InboundRequest,
  OutboundResult,
  UsedLot,
  LotStatus,
  SupplierInfo,
  StockAdjustmentRequest,
  ExpiryAlert,
  SafetyStockAlert,
  InventoryTurnoverAnalysis,
  WasteDisposal,
  Money
} from './types';

/**
 * FIFO (First In, First Out) 재고 관리 엔진
 * 선입선출 방식으로 원재료 입고/출고를 처리하고 정확한 원가 추적을 제공
 */
export class FIFOInventoryEngine {
  constructor(private supabase: SupabaseClient) {}

  /**
   * FIFO 방식으로 출고 처리
   * @param request 출고 요청 정보
   * @returns 출고 처리 결과
   */
  async processOutbound(request: OutboundRequest): Promise<OutboundResult> {
    try {
      // Handle zero quantity requests
      if (request.quantity === 0) {
        const transactionId = this.generateTransactionId();
        
        // Create movement record for zero quantity
        await this.createInventoryMovement({
          materialId: request.materialId,
          storeId: request.storeId,
          movementType: request.reason,
          quantity: 0,
          totalCost: 0,
          usedLots: [],
          transactionId,
          referenceId: request.referenceId,
          notes: request.notes
        });
        
        return {
          success: true,
          usedLots: [],
          totalCost: 0,
          averageUnitCost: 0,
          shortageQuantity: 0,
          transactionId
        };
      }

      // 1. FIFO 순서로 재고 로트 조회 (입고일 순)
      const stockLots = await this.getStockLotsByFIFO(
        request.materialId,
        request.storeId
      );

      if (!stockLots || stockLots.length === 0) {
        throw new Error('No stock available for the requested material');
      }

      // 2. 순차적으로 출고 처리
      const usedLots: UsedLot[] = [];
      let remainingQuantity = request.quantity;
      const transactionId = this.generateTransactionId();

      for (const lot of stockLots) {
        if (remainingQuantity <= 0) break;

        const usedFromLot = Math.min(lot.available_quantity, remainingQuantity);
        
        if (usedFromLot > 0) {
          usedLots.push({
            lotId: lot.id,
            quantity: usedFromLot,
            unitCost: lot.unit_cost.amount,
            totalCost: usedFromLot * lot.unit_cost.amount,
            lotNumber: lot.lot_number,
            receivedDate: lot.received_date
          });

          remainingQuantity -= usedFromLot;

          // 재고 차감
          await this.updateStockLot(
            lot.id,
            lot.available_quantity - usedFromLot
          );
        }
      }

      // 3. 가중평균 원가 계산
      const totalCost = usedLots.reduce((sum, lot) => sum + lot.totalCost, 0);
      const actualUsedQuantity = request.quantity - remainingQuantity;
      const averageUnitCost = actualUsedQuantity > 0 ? totalCost / actualUsedQuantity : 0;

      // 4. 재고 이동 기록 생성
      await this.createInventoryMovement({
        materialId: request.materialId,
        storeId: request.storeId,
        movementType: request.reason,
        quantity: actualUsedQuantity,
        totalCost,
        usedLots,
        transactionId,
        referenceId: request.referenceId,
        notes: request.notes
      });

      return {
        success: remainingQuantity === 0,
        usedLots,
        totalCost,
        averageUnitCost,
        shortageQuantity: remainingQuantity,
        transactionId
      };
    } catch (error) {
      console.error('Error processing outbound:', error);
      throw error;
    }
  }

  /**
   * 입고 처리
   * @param request 입고 요청 정보
   * @returns 입고 처리 결과
   */
  async processInbound(request: InboundRequest): Promise<{
    success: boolean;
    lotId: string;
    lotNumber: string;
  }> {
    try {
      const lotNumber = request.lotNumber || this.generateLotNumber();
      const receivedDate = request.receivedDate || new Date().toISOString().split('T')[0];

      const newLot: Partial<InventoryLot> = {
        material_id: request.materialId,
        store_id: request.storeId,
        lot_number: lotNumber,
        received_date: receivedDate,
        expiry_date: request.expiryDate,
        received_quantity: request.quantity,
        available_quantity: request.quantity,
        unit_cost: {
          amount: request.unitCost,
          currency: 'KRW'
        },
        supplier_info: request.supplierInfo,
        status: LotStatus.ACTIVE
      };

      const { data, error } = await this.supabase
        .from('inventory_lots')
        .insert(newLot)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create inventory lot: ${error.message}`);
      }

      // 재고 이동 기록 생성
      await this.createInventoryMovement({
        materialId: request.materialId,
        storeId: request.storeId,
        movementType: 'purchase',
        quantity: request.quantity,
        totalCost: request.quantity * request.unitCost,
        usedLots: [{
          lotId: data.id,
          quantity: request.quantity,
          unitCost: request.unitCost,
          totalCost: request.quantity * request.unitCost,
          lotNumber,
          receivedDate
        }],
        transactionId: this.generateTransactionId()
      });

      return {
        success: true,
        lotId: data.id,
        lotNumber
      };
    } catch (error) {
      console.error('Error processing inbound:', error);
      throw error;
    }
  }

  /**
   * 재고 조정 처리
   * @param lotId 로트 ID
   * @param newQuantity 새로운 수량
   * @param reason 조정 사유
   * @returns 조정 결과
   */
  async adjustStock(request: {
    lotId: string;
    adjustmentQuantity: number;
    reason: string;
    adjustedBy: string;
  }): Promise<{
    success: boolean;
    oldQuantity?: number;
    newQuantity?: number;
    adjustmentQuantity?: number;
    error?: string;
  }> {
    try {
      // 현재 로트 정보 조회
      const { data: currentLot, error: fetchError } = await this.supabase
        .from('inventory_lots')
        .select('*')
        .eq('id', request.lotId)
        .single();

      if (fetchError || !currentLot) {
        return {
          success: false,
          error: 'Lot not found'
        };
      }

      const oldQuantity = currentLot.available_quantity;
      const newQuantity = oldQuantity + request.adjustmentQuantity;

      // 수량 업데이트
      const { error: updateError } = await this.supabase
        .from('inventory_lots')
        .update({ available_quantity: newQuantity })
        .eq('id', request.lotId);

      if (updateError) {
        return {
          success: false,
          error: `Failed to update stock: ${updateError.message}`
        };
      }

      // 조정 기록 생성
      await this.supabase
        .from('inventory_adjustments')
        .insert({
          item_id: currentLot.material_id,
          lot_id: request.lotId,
          old_quantity: oldQuantity,
          new_quantity: newQuantity,
          adjustment_quantity: request.adjustmentQuantity,
          reason: request.reason,
          adjusted_by: request.adjustedBy,
          notes: `Stock adjustment for lot ${currentLot.lot_number}`
        });

      return {
        success: true,
        oldQuantity,
        newQuantity,
        adjustmentQuantity: request.adjustmentQuantity
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * 재고 요약 정보 조회
   * @param materialId 원재료 ID
   * @param storeId 매장 ID
   * @returns 재고 요약
   */
  async getStockSummary(
    materialId: string,
    storeId: string
  ): Promise<{
    totalQuantity: number;
    totalValue: number;
    averageUnitCost: number;
    lotCount: number;
    oldestLot: InventoryLot;
  }> {
    const { data: lots, error } = await this.supabase
      .from('inventory_lots')
      .select('*')
      .eq('material_id', materialId)
      .eq('store_id', storeId)
      .eq('status', LotStatus.ACTIVE)
      .gt('available_quantity', 0)
      .order('received_date', { ascending: true });

    if (error || !lots || lots.length === 0) {
      return {
        totalQuantity: 0,
        totalValue: 0,
        averageUnitCost: 0,
        lotCount: 0,
        oldestLot: null as any
      };
    }

    const totalQuantity = lots.reduce((sum, lot) => sum + lot.available_quantity, 0);
    const totalValue = lots.reduce(
      (sum, lot) => sum + lot.available_quantity * lot.unit_cost.amount,
      0
    );
    const averageUnitCost = totalQuantity > 0 ? Math.round((totalValue / totalQuantity) * 100) / 100 : 0;

    return {
      totalQuantity,
      totalValue,
      averageUnitCost,
      lotCount: lots.length,
      oldestLot: lots[0]
    };
  }

  /**
   * 유통기한 임박 로트 조회
   * @param storeId 매장 ID
   * @param daysAhead 조회할 일수
   * @param currentDate 기준 날짜
   * @returns 유통기한 임박 로트 목록
   */
  async getExpiringLots(
    storeId: string,
    daysAhead: number,
    currentDate?: string
  ): Promise<ExpiryAlert[]> {
    const baseDate = currentDate || new Date().toISOString().split('T')[0];
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() + daysAhead);

    const { data: lots, error } = await this.supabase
      .from('inventory_lots')
      .select(`
        *,
        raw_materials!inner(name)
      `)
      .eq('store_id', storeId)
      .eq('status', LotStatus.ACTIVE)
      .gt('available_quantity', 0)
      .not('expiry_date', 'is', null)
      .lte('expiry_date', targetDate.toISOString().split('T')[0])
      .order('expiry_date', { ascending: true });

    if (error || !lots) {
      return [];
    }

    return lots.map(lot => {
      const expiryDate = new Date(lot.expiry_date!);
      const currentDateObj = new Date(baseDate);
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - currentDateObj.getTime()) / (1000 * 60 * 60 * 24)
      );

      let alertLevel: 'warning' | 'critical' | 'expired';
      let suggestedAction: 'use_first' | 'discount' | 'dispose';

      if (daysUntilExpiry < 0) {
        alertLevel = 'expired';
        suggestedAction = 'dispose';
      } else if (daysUntilExpiry <= 3) {
        alertLevel = 'critical';
        suggestedAction = 'discount';
      } else {
        alertLevel = 'warning';
        suggestedAction = 'use_first';
      }

      return {
        lotId: lot.id,
        materialId: lot.material_id,
        materialName: lot.raw_materials.name,
        lotNumber: lot.lot_number,
        expiryDate: lot.expiry_date!,
        daysUntilExpiry,
        availableQuantity: lot.available_quantity,
        alertLevel,
        suggestedAction
      };
    });
  }

  /**
   * FIFO 순서로 재고 로트 조회
   * @param materialId 원재료 ID
   * @param storeId 매장 ID
   * @returns FIFO 순서의 재고 로트 목록
   */
  private async getStockLotsByFIFO(
    materialId: string,
    storeId: string
  ): Promise<InventoryLot[]> {
    const { data, error } = await this.supabase
      .from('inventory_lots')
      .select('*')
      .eq('material_id', materialId)
      .eq('store_id', storeId)
      .eq('status', LotStatus.ACTIVE)
      .gt('available_quantity', 0)
      .order('received_date', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch stock lots: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 재고 로트 수량 업데이트
   * @param lotId 로트 ID
   * @param newQuantity 새로운 수량
   */
  private async updateStockLot(lotId: string, newQuantity: number): Promise<void> {
    const status = newQuantity <= 0 ? LotStatus.DEPLETED : LotStatus.ACTIVE;
    
    const { error } = await this.supabase
      .from('inventory_lots')
      .update({
        available_quantity: Math.max(0, newQuantity),
        status
      })
      .eq('id', lotId);

    if (error) {
      throw new Error(`Failed to update stock lot: ${error.message}`);
    }
  }

  /**
   * 재고 이동 기록 생성
   * @param movement 재고 이동 정보
   */
  private async createInventoryMovement(movement: {
    materialId: string;
    storeId: string;
    movementType: string;
    quantity: number;
    totalCost: number;
    usedLots: UsedLot[];
    transactionId: string;
    referenceId?: string;
    notes?: string;
  }): Promise<void> {
    const { error } = await this.supabase
      .from('inventory_movements')
      .insert({
        item_id: movement.materialId,
        store_id: movement.storeId,
        movement_type: movement.movementType,
        quantity: movement.quantity,
        unit_cost: {
          amount: movement.totalCost / movement.quantity,
          currency: 'KRW'
        },
        total_cost: {
          amount: movement.totalCost,
          currency: 'KRW'
        },
        transaction_id: movement.transactionId,
        reference_id: movement.referenceId,
        notes: movement.notes,
        lot_details: movement.usedLots
      });

    if (error) {
      console.error('Failed to create inventory movement:', error);
      // 이동 기록 실패는 전체 트랜잭션을 실패시키지 않음 (로깅만)
    }
  }

  /**
   * 트랜잭션 ID 생성
   * @returns 고유한 트랜잭션 ID
   */
  private generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN-${timestamp}-${random}`;
  }

  /**
   * 로트 번호 자동 생성
   * @returns 자동 생성된 로트 번호
   */
  private generateLotNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, '');
    return `LOT-${dateStr}-${timeStr}`;
  }
}
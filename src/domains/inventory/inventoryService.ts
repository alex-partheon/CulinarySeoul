// TASK-006: 재고 관리 도메인 서비스
// FIFO 엔진을 활용한 종합 재고 관리 시스템

import { SupabaseClient } from '@supabase/supabase-js';
import { FIFOInventoryEngine } from './fifoEngine';
import {
  InventoryLot,
  InboundRequest,
  OutboundRequest,
  OutboundResult,
  StockAdjustmentRequest,
  InventoryAlert,
  InventoryReport,
  CategorySummary,
  InventoryTurnoverAnalysis,
  WasteDisposal,
  ExpiryAlert,
  SafetyStockAlert,
  LotStatus,
  AlertType,
  MovementType,
  AdjustmentReason,
  WasteReason,
  AnalysisPeriod,
  Money
} from './types';

/**
 * 재고 관리 도메인 서비스
 * FIFO 엔진을 기반으로 한 종합적인 재고 관리 기능 제공
 */
export class InventoryService {
  private fifoEngine: FIFOInventoryEngine;

  constructor(private supabase: SupabaseClient) {
    this.fifoEngine = new FIFOInventoryEngine(supabase);
  }

  /**
   * 원재료 입고 처리
   * @param request 입고 요청 정보
   * @returns 입고 처리 결과
   */
  async processInbound(request: InboundRequest): Promise<{
    success: boolean;
    lotId: string;
    lotNumber: string;
    message: string;
  }> {
    try {
      // 입고 전 유효성 검사
      await this.validateInboundRequest(request);

      // FIFO 엔진으로 입고 처리
      const result = await this.fifoEngine.processInbound(request);

      // 입고 완료 후 알림 생성
      await this.createInboundAlert(request, result.lotId);

      return {
        ...result,
        message: `${request.quantity}${await this.getMaterialUnit(request.materialId)} 입고가 완료되었습니다. (로트: ${result.lotNumber})`
      };
    } catch (error) {
      console.error('Error processing inbound:', error);
      throw error;
    }
  }

  /**
   * 원재료 출고 처리
   * @param request 출고 요청 정보
   * @returns 출고 처리 결과
   */
  async processOutbound(request: OutboundRequest): Promise<OutboundResult & {
    message: string;
  }> {
    try {
      // 출고 전 유효성 검사
      await this.validateOutboundRequest(request);

      // FIFO 엔진으로 출고 처리
      const result = await this.fifoEngine.processOutbound(request);

      // 출고 완료 후 알림 처리
      await this.handlePostOutboundAlerts(request, result);

      const unit = await this.getMaterialUnit(request.materialId);
      let message: string;

      if (result.success) {
        message = `${request.quantity}${unit} 출고가 완료되었습니다. (평균 단가: ₩${result.averageUnitCost.toLocaleString()})`;
      } else {
        message = `부분 출고 완료: ${request.quantity - result.shortageQuantity}${unit} 출고, ${result.shortageQuantity}${unit} 부족`;
      }

      return {
        ...result,
        message
      };
    } catch (error) {
      console.error('Error processing outbound:', error);
      throw error;
    }
  }

  /**
   * 재고 조정 처리
   * @param request 재고 조정 요청
   * @returns 조정 결과
   */
  async adjustStock(request: StockAdjustmentRequest): Promise<{
    success: boolean;
    adjustments: {
      lotId: string;
      oldQuantity: number;
      newQuantity: number;
      adjustmentQuantity: number;
    }[];
    message: string;
  }> {
    try {
      const adjustments = [];
      
      for (const adjustment of request.adjustments) {
        const result = await this.fifoEngine.adjustStock(
          adjustment.lotId,
          adjustment.newQuantity,
          request.reason
        );
        
        adjustments.push({
          lotId: adjustment.lotId,
          oldQuantity: result.oldQuantity,
          newQuantity: result.newQuantity,
          adjustmentQuantity: result.adjustmentQuantity
        });
      }

      // 조정 완료 알림 생성
      await this.createAdjustmentAlert(request, adjustments);

      return {
        success: true,
        adjustments,
        message: `${adjustments.length}개 로트의 재고 조정이 완료되었습니다.`
      };
    } catch (error) {
      console.error('Error adjusting stock:', error);
      throw error;
    }
  }

  /**
   * 매장별 재고 현황 조회
   * @param storeId 매장 ID
   * @param materialId 원재료 ID (선택사항)
   * @returns 재고 현황
   */
  async getInventoryStatus(storeId: string, materialId?: string): Promise<{
    totalValue: number;
    totalItems: number;
    lowStockItems: number;
    expiringItems: number;
    materials: {
      materialId: string;
      materialName: string;
      totalQuantity: number;
      totalValue: number;
      averageUnitCost: number;
      lotCount: number;
      oldestLotDate: string;
      status: 'normal' | 'low' | 'critical' | 'out_of_stock';
    }[];
  }> {
    try {
      let query = this.supabase
        .from('inventory_lots')
        .select(`
          material_id,
          available_quantity,
          unit_cost,
          received_date,
          expiry_date,
          raw_materials!inner(
            id,
            name,
            unit,
            minimum_stock_level,
            reorder_point
          )
        `)
        .eq('store_id', storeId)
        .eq('status', LotStatus.ACTIVE)
        .gt('available_quantity', 0);

      if (materialId) {
        query = query.eq('material_id', materialId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`재고 현황 조회 실패: ${error.message}`);
      }

      // 원재료별 재고 집계
      const materialMap = new Map<string, {
        materialId: string;
        materialName: string;
        unit: string;
        minimumStockLevel: number;
        reorderPoint: number;
        totalQuantity: number;
        totalValue: number;
        lotCount: number;
        oldestLotDate: string;
      }>();

      (data || []).forEach(lot => {
        const materialId = lot.material_id;
        const material = lot.raw_materials;
        
        if (!materialMap.has(materialId)) {
          materialMap.set(materialId, {
            materialId,
            materialName: material.name,
            unit: material.unit,
            minimumStockLevel: material.minimum_stock_level,
            reorderPoint: material.reorder_point,
            totalQuantity: 0,
            totalValue: 0,
            lotCount: 0,
            oldestLotDate: lot.received_date
          });
        }

        const materialInfo = materialMap.get(materialId)!;
        materialInfo.totalQuantity += lot.available_quantity;
        materialInfo.totalValue += lot.available_quantity * lot.unit_cost.amount;
        materialInfo.lotCount += 1;
        
        if (lot.received_date < materialInfo.oldestLotDate) {
          materialInfo.oldestLotDate = lot.received_date;
        }
      });

      // 상태 판정 및 통계 계산
      const materials = Array.from(materialMap.values()).map(material => {
        const averageUnitCost = material.totalQuantity > 0 
          ? Math.round((material.totalValue / material.totalQuantity) * 100) / 100 
          : 0;

        let status: 'normal' | 'low' | 'critical' | 'out_of_stock';
        if (material.totalQuantity === 0) {
          status = 'out_of_stock';
        } else if (material.totalQuantity <= material.minimumStockLevel) {
          status = 'critical';
        } else if (material.totalQuantity <= material.reorderPoint) {
          status = 'low';
        } else {
          status = 'normal';
        }

        return {
          materialId: material.materialId,
          materialName: material.materialName,
          totalQuantity: material.totalQuantity,
          totalValue: material.totalValue,
          averageUnitCost,
          lotCount: material.lotCount,
          oldestLotDate: material.oldestLotDate,
          status
        };
      });

      const totalValue = materials.reduce((sum, m) => sum + m.totalValue, 0);
      const totalItems = materials.length;
      const lowStockItems = materials.filter(m => m.status === 'low' || m.status === 'critical').length;
      
      // 유통기한 임박 아이템 수 계산
      const expiringItems = await this.getExpiringItemsCount(storeId, 7);

      return {
        totalValue,
        totalItems,
        lowStockItems,
        expiringItems,
        materials: materials.sort((a, b) => a.materialName.localeCompare(b.materialName))
      };
    } catch (error) {
      console.error('Error getting inventory status:', error);
      throw error;
    }
  }

  /**
   * 유통기한 임박 재고 조회
   * @param storeId 매장 ID
   * @param daysAhead 조회할 일수 (기본: 7일)
   * @returns 유통기한 임박 재고 목록
   */
  async getExpiringStock(storeId: string, daysAhead: number = 7): Promise<ExpiryAlert[]> {
    try {
      return await this.fifoEngine.getExpiringLots(storeId, daysAhead);
    } catch (error) {
      console.error('Error getting expiring stock:', error);
      throw error;
    }
  }

  /**
   * 재고 알림 목록 조회
   * @param storeId 매장 ID
   * @param alertType 알림 유형 (선택사항)
   * @param unreadOnly 미해결 알림만 조회 여부
   * @returns 알림 목록
   */
  async getInventoryAlerts(
    storeId: string,
    alertType?: AlertType,
    unreadOnly: boolean = true
  ): Promise<InventoryAlert[]> {
    try {
      let query = this.supabase
        .from('inventory_alerts')
        .select(`
          *,
          raw_materials(name),
          inventory_lots(lot_number)
        `)
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (alertType) {
        query = query.eq('alert_type', alertType);
      }

      if (unreadOnly) {
        query = query.eq('is_resolved', false);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`재고 알림 조회 실패: ${error.message}`);
      }

      return (data || []).map(alert => ({
        id: alert.id,
        storeId: alert.store_id,
        materialId: alert.material_id,
        materialName: alert.raw_materials?.name,
        lotId: alert.lot_id,
        lotNumber: alert.inventory_lots?.lot_number,
        alertType: alert.alert_type as AlertType,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        actionRequired: alert.action_required,
        isResolved: alert.is_resolved,
        resolvedBy: alert.resolved_by,
        resolvedAt: alert.resolved_at,
        createdAt: alert.created_at
      }));
    } catch (error) {
      console.error('Error getting inventory alerts:', error);
      throw error;
    }
  }

  /**
   * 재고 알림 해결 처리
   * @param alertId 알림 ID
   * @param userId 해결한 사용자 ID
   * @returns 해결 성공 여부
   */
  async resolveAlert(alertId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('inventory_alerts')
        .update({
          is_resolved: true,
          resolved_by: userId,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) {
        throw new Error(`알림 해결 처리 실패: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }
  }

  /**
   * 폐기 처리
   * @param disposal 폐기 정보
   * @returns 폐기 처리 결과
   */
  async processWasteDisposal(disposal: Omit<WasteDisposal, 'id' | 'createdAt'>): Promise<{
    success: boolean;
    disposalId: string;
    message: string;
  }> {
    try {
      // 폐기 기록 생성
      const { data, error } = await this.supabase
        .from('waste_disposals')
        .insert({
          material_id: disposal.materialId,
          store_id: disposal.storeId,
          lot_id: disposal.lotId,
          quantity: disposal.quantity,
          waste_reason: disposal.wasteReason,
          disposal_method: disposal.disposalMethod,
          cost_impact: disposal.costImpact,
          environmental_impact: disposal.environmentalImpact,
          disposed_by: disposal.disposedBy,
          disposal_date: disposal.disposalDate,
          notes: disposal.notes
        })
        .select()
        .single();

      if (error) {
        throw new Error(`폐기 처리 실패: ${error.message}`);
      }

      // 해당 로트의 재고 차감
      if (disposal.lotId) {
        await this.fifoEngine.adjustStock(
          disposal.lotId,
          0, // 전량 폐기
          `폐기 처리: ${disposal.wasteReason}`
        );
      }

      const unit = await this.getMaterialUnit(disposal.materialId);
      
      return {
        success: true,
        disposalId: data.id,
        message: `${disposal.quantity}${unit} 폐기 처리가 완료되었습니다.`
      };
    } catch (error) {
      console.error('Error processing waste disposal:', error);
      throw error;
    }
  }

  /**
   * 재고 회전율 분석
   * @param storeId 매장 ID
   * @param period 분석 기간
   * @param materialId 원재료 ID (선택사항)
   * @returns 회전율 분석 결과
   */
  async getInventoryTurnoverAnalysis(
    storeId: string,
    period: AnalysisPeriod,
    materialId?: string
  ): Promise<InventoryTurnoverAnalysis[]> {
    try {
      // 기간 계산
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case AnalysisPeriod.WEEKLY:
          startDate.setDate(endDate.getDate() - 7);
          break;
        case AnalysisPeriod.MONTHLY:
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case AnalysisPeriod.QUARTERLY:
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case AnalysisPeriod.YEARLY:
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // 재고 이동 데이터 조회
      let query = this.supabase
        .from('inventory_movements')
        .select(`
          item_id,
          movement_type,
          quantity,
          total_cost,
          movement_date,
          raw_materials!inner(name, unit)
        `)
        .eq('store_id', storeId)
        .gte('movement_date', startDate.toISOString())
        .lte('movement_date', endDate.toISOString());

      if (materialId) {
        query = query.eq('item_id', materialId);
      }

      const { data: movements, error } = await query;

      if (error) {
        throw new Error(`재고 회전율 분석 실패: ${error.message}`);
      }

      // 원재료별 분석 데이터 집계
      const analysisMap = new Map<string, {
        materialId: string;
        materialName: string;
        unit: string;
        totalInbound: number;
        totalOutbound: number;
        totalInboundCost: number;
        totalOutboundCost: number;
      }>();

      (movements || []).forEach(movement => {
        const materialId = movement.item_id;
        
        if (!analysisMap.has(materialId)) {
          analysisMap.set(materialId, {
            materialId,
            materialName: movement.raw_materials.name,
            unit: movement.raw_materials.unit,
            totalInbound: 0,
            totalOutbound: 0,
            totalInboundCost: 0,
            totalOutboundCost: 0
          });
        }

        const analysis = analysisMap.get(materialId)!;
        
        if (movement.movement_type === 'purchase') {
          analysis.totalInbound += movement.quantity;
          analysis.totalInboundCost += movement.total_cost?.amount || 0;
        } else if (['usage', 'sale'].includes(movement.movement_type)) {
          analysis.totalOutbound += movement.quantity;
          analysis.totalOutboundCost += movement.total_cost?.amount || 0;
        }
      });

      // 현재 재고량 조회
      const currentStockPromises = Array.from(analysisMap.keys()).map(async materialId => {
        const summary = await this.fifoEngine.getStockSummary(materialId, storeId);
        return { materialId, currentStock: summary.totalQuantity, averageUnitCost: summary.averageUnitCost };
      });

      const currentStocks = await Promise.all(currentStockPromises);
      const stockMap = new Map(currentStocks.map(s => [s.materialId, s]));

      // 회전율 계산
      return Array.from(analysisMap.values()).map(analysis => {
        const currentStock = stockMap.get(analysis.materialId)?.currentStock || 0;
        const averageInventory = (analysis.totalInbound + currentStock) / 2;
        const turnoverRatio = averageInventory > 0 ? analysis.totalOutbound / averageInventory : 0;
        const daysSalesInventory = turnoverRatio > 0 ? 365 / turnoverRatio : 0;

        return {
          materialId: analysis.materialId,
          materialName: analysis.materialName,
          unit: analysis.unit,
          period,
          totalInbound: analysis.totalInbound,
          totalOutbound: analysis.totalOutbound,
          currentStock,
          averageInventory,
          turnoverRatio: Math.round(turnoverRatio * 100) / 100,
          daysSalesInventory: Math.round(daysSalesInventory),
          totalInboundCost: analysis.totalInboundCost,
          totalOutboundCost: analysis.totalOutboundCost,
          efficiency: turnoverRatio > 4 ? 'high' : turnoverRatio > 2 ? 'medium' : 'low'
        };
      }).sort((a, b) => b.turnoverRatio - a.turnoverRatio);
    } catch (error) {
      console.error('Error getting inventory turnover analysis:', error);
      throw error;
    }
  }

  // Private helper methods

  private async validateInboundRequest(request: InboundRequest): Promise<void> {
    if (request.quantity <= 0) {
      throw new Error('입고 수량은 0보다 커야 합니다.');
    }

    if (request.unitCost <= 0) {
      throw new Error('단가는 0보다 커야 합니다.');
    }

    // 원재료 존재 여부 확인
    const { data: material } = await this.supabase
      .from('raw_materials')
      .select('id')
      .eq('id', request.materialId)
      .eq('is_active', true)
      .single();

    if (!material) {
      throw new Error('존재하지 않는 원재료입니다.');
    }

    // 매장 존재 여부 확인
    const { data: store } = await this.supabase
      .from('stores')
      .select('id')
      .eq('id', request.storeId)
      .single();

    if (!store) {
      throw new Error('존재하지 않는 매장입니다.');
    }
  }

  private async validateOutboundRequest(request: OutboundRequest): Promise<void> {
    if (request.quantity <= 0) {
      throw new Error('출고 수량은 0보다 커야 합니다.');
    }

    // 재고 충분성 확인
    const summary = await this.fifoEngine.getStockSummary(request.materialId, request.storeId);
    if (summary.totalQuantity < request.quantity) {
      const unit = await this.getMaterialUnit(request.materialId);
      throw new Error(`재고 부족: 요청 ${request.quantity}${unit}, 현재 재고 ${summary.totalQuantity}${unit}`);
    }
  }

  private async getMaterialUnit(materialId: string): Promise<string> {
    const { data } = await this.supabase
      .from('raw_materials')
      .select('unit')
      .eq('id', materialId)
      .single();
    
    return data?.unit || '';
  }

  private async getExpiringItemsCount(storeId: string, daysAhead: number): Promise<number> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    const { count } = await this.supabase
      .from('inventory_lots')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('status', LotStatus.ACTIVE)
      .gt('available_quantity', 0)
      .not('expiry_date', 'is', null)
      .lte('expiry_date', targetDate.toISOString().split('T')[0]);

    return count || 0;
  }

  private async createInboundAlert(request: InboundRequest, lotId: string): Promise<void> {
    const materialName = await this.getMaterialName(request.materialId);
    const unit = await this.getMaterialUnit(request.materialId);

    await this.supabase
      .from('inventory_alerts')
      .insert({
        store_id: request.storeId,
        material_id: request.materialId,
        lot_id: lotId,
        alert_type: 'inbound_completed',
        severity: 'low',
        title: `${materialName} 입고 완료`,
        message: `${request.quantity}${unit} 입고가 완료되었습니다.`,
        action_required: false
      });
  }

  private async handlePostOutboundAlerts(request: OutboundRequest, result: OutboundResult): Promise<void> {
    if (!result.success && result.shortageQuantity > 0) {
      const materialName = await this.getMaterialName(request.materialId);
      const unit = await this.getMaterialUnit(request.materialId);

      await this.supabase
        .from('inventory_alerts')
        .insert({
          store_id: request.storeId,
          material_id: request.materialId,
          alert_type: 'shortage',
          severity: 'high',
          title: `${materialName} 재고 부족`,
          message: `출고 요청 ${request.quantity}${unit} 중 ${result.shortageQuantity}${unit} 부족`,
          action_required: true
        });
    }
  }

  private async createAdjustmentAlert(
    request: StockAdjustmentRequest,
    adjustments: { lotId: string; adjustmentQuantity: number }[]
  ): Promise<void> {
    const totalAdjustment = adjustments.reduce((sum, adj) => sum + Math.abs(adj.adjustmentQuantity), 0);
    
    if (totalAdjustment > 0) {
      await this.supabase
        .from('inventory_alerts')
        .insert({
          store_id: request.storeId,
          alert_type: 'adjustment_completed',
          severity: 'medium',
          title: '재고 조정 완료',
          message: `${adjustments.length}개 로트의 재고 조정이 완료되었습니다. (사유: ${request.reason})`,
          action_required: false
        });
    }
  }

  private async getMaterialName(materialId: string): Promise<string> {
    const { data } = await this.supabase
      .from('raw_materials')
      .select('name')
      .eq('id', materialId)
      .single();
    
    return data?.name || '알 수 없는 원재료';
  }
}
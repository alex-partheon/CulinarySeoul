// TASK-006: FIFO 기반 원재료 관리 시스템 API 라우터
// RESTful API 엔드포인트 제공

import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import {
  RawMaterialService,
  InventoryService,
  CreateRawMaterialDto,
  UpdateRawMaterialDto,
  InboundRequest,
  OutboundRequest,
  StockAdjustmentRequest,
  InventoryFilter,
  AnalysisPeriod,
  WasteDisposal
} from '../domains/inventory';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, param, query } from 'express-validator';

const router = Router();
const rawMaterialService = new RawMaterialService(supabase);
const inventoryService = new InventoryService(supabase);

// =============================================================================
// 원재료 마스터 관리 API
// =============================================================================

/**
 * 원재료 목록 조회
 * GET /api/inventory/raw-materials
 */
router.get('/raw-materials', 
  authenticateToken,
  [
    query('category').optional().isString(),
    query('searchTerm').optional().isString(),
    query('unit').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sortBy').optional().isIn(['name', 'category', 'created_at']),
    query('sortOrder').optional().isIn(['asc', 'desc'])
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const filter: InventoryFilter = {
        category: req.query.category as any,
        searchTerm: req.query.searchTerm as string,
        unit: req.query.unit as any,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 50,
        sortBy: req.query.sortBy as any || 'name',
        sortOrder: req.query.sortOrder as any || 'asc'
      };

      const result = await rawMaterialService.getRawMaterials(filter);
      
      res.json({
        success: true,
        data: result,
        pagination: {
          page: filter.page,
          limit: filter.limit,
          totalCount: result.totalCount,
          hasMore: result.hasMore
        }
      });
    } catch (error) {
      console.error('Error getting raw materials:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '원재료 목록 조회 실패'
      });
    }
  }
);

/**
 * 원재료 단일 조회
 * GET /api/inventory/raw-materials/:id
 */
router.get('/raw-materials/:id',
  authenticateToken,
  [param('id').isUUID()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const material = await rawMaterialService.getRawMaterialById(req.params.id);
      
      if (!material) {
        return res.status(404).json({
          success: false,
          error: '원재료를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: material
      });
    } catch (error) {
      console.error('Error getting raw material:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '원재료 조회 실패'
      });
    }
  }
);

/**
 * 원재료 등록
 * POST /api/inventory/raw-materials
 */
router.post('/raw-materials',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    body('name').notEmpty().withMessage('원재료명은 필수입니다'),
    body('category').isIn(['meat', 'seafood', 'vegetable', 'fruit', 'dairy', 'grain', 'spice', 'oil', 'sauce', 'beverage', 'other']).withMessage('유효한 카테고리를 선택해주세요'),
    body('unit').isIn(['kg', 'g', 'L', 'mL', 'ea', 'box', 'pack', 'bottle']).withMessage('유효한 단위를 선택해주세요'),
    body('minimumStockLevel').optional().isFloat({ min: 0 }),
    body('maximumStockLevel').optional().isFloat({ min: 0 }),
    body('reorderPoint').optional().isFloat({ min: 0 }),
    body('standardCost.amount').optional().isFloat({ min: 0 }),
    body('standardCost.currency').optional().isIn(['KRW', 'USD', 'EUR'])
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const materialData: CreateRawMaterialDto = req.body;
      const material = await rawMaterialService.createRawMaterial(materialData);
      
      res.status(201).json({
        success: true,
        data: material,
        message: '원재료가 성공적으로 등록되었습니다.'
      });
    } catch (error) {
      console.error('Error creating raw material:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '원재료 등록 실패'
      });
    }
  }
);

/**
 * 원재료 수정
 * PUT /api/inventory/raw-materials/:id
 */
router.put('/raw-materials/:id',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id').isUUID(),
    body('name').optional().notEmpty(),
    body('category').optional().isIn(['meat', 'seafood', 'vegetable', 'fruit', 'dairy', 'grain', 'spice', 'oil', 'sauce', 'beverage', 'other']),
    body('unit').optional().isIn(['kg', 'g', 'L', 'mL', 'ea', 'box', 'pack', 'bottle']),
    body('minimumStockLevel').optional().isFloat({ min: 0 }),
    body('maximumStockLevel').optional().isFloat({ min: 0 }),
    body('reorderPoint').optional().isFloat({ min: 0 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const updateData: UpdateRawMaterialDto = req.body;
      const material = await rawMaterialService.updateRawMaterial(req.params.id, updateData);
      
      res.json({
        success: true,
        data: material,
        message: '원재료 정보가 성공적으로 수정되었습니다.'
      });
    } catch (error) {
      console.error('Error updating raw material:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '원재료 수정 실패'
      });
    }
  }
);

/**
 * 원재료 삭제
 * DELETE /api/inventory/raw-materials/:id
 */
router.delete('/raw-materials/:id',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [param('id').isUUID()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      await rawMaterialService.deleteRawMaterial(req.params.id);
      
      res.json({
        success: true,
        message: '원재료가 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      console.error('Error deleting raw material:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '원재료 삭제 실패'
      });
    }
  }
);

/**
 * 카테고리별 원재료 통계
 * GET /api/inventory/raw-materials/stats/by-category
 */
router.get('/raw-materials/stats/by-category',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const stats = await rawMaterialService.getMaterialCountByCategory();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting category stats:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '카테고리 통계 조회 실패'
      });
    }
  }
);

/**
 * 재주문 필요 원재료 조회
 * GET /api/inventory/raw-materials/reorder/:storeId
 */
router.get('/raw-materials/reorder/:storeId',
  authenticateToken,
  [param('storeId').isUUID()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const reorderList = await rawMaterialService.getMaterialsNeedingReorder(req.params.storeId);
      
      res.json({
        success: true,
        data: reorderList
      });
    } catch (error) {
      console.error('Error getting reorder list:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '재주문 목록 조회 실패'
      });
    }
  }
);

// =============================================================================
// 재고 관리 API (FIFO 기반)
// =============================================================================

/**
 * 입고 처리
 * POST /api/inventory/inbound
 */
router.post('/inbound',
  authenticateToken,
  requireRole(['admin', 'manager', 'staff']),
  [
    body('materialId').isUUID().withMessage('유효한 원재료 ID가 필요합니다'),
    body('storeId').isUUID().withMessage('유효한 매장 ID가 필요합니다'),
    body('quantity').isFloat({ gt: 0 }).withMessage('수량은 0보다 커야 합니다'),
    body('unitCost').isFloat({ gt: 0 }).withMessage('단가는 0보다 커야 합니다'),
    body('receivedDate').optional().isISO8601(),
    body('expiryDate').optional().isISO8601(),
    body('lotNumber').optional().isString(),
    body('supplierInfo.name').optional().isString(),
    body('supplierInfo.contact').optional().isString()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const inboundRequest: InboundRequest = req.body;
      const result = await inventoryService.processInbound(inboundRequest);
      
      res.status(201).json({
        success: true,
        data: result,
        message: result.message
      });
    } catch (error) {
      console.error('Error processing inbound:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '입고 처리 실패'
      });
    }
  }
);

/**
 * 출고 처리
 * POST /api/inventory/outbound
 */
router.post('/outbound',
  authenticateToken,
  requireRole(['admin', 'manager', 'staff']),
  [
    body('materialId').isUUID().withMessage('유효한 원재료 ID가 필요합니다'),
    body('storeId').isUUID().withMessage('유효한 매장 ID가 필요합니다'),
    body('quantity').isFloat({ gt: 0 }).withMessage('수량은 0보다 커야 합니다'),
    body('reason').isIn(['usage', 'sale', 'transfer', 'waste', 'adjustment']).withMessage('유효한 출고 사유를 선택해주세요'),
    body('referenceId').optional().isString(),
    body('notes').optional().isString()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const outboundRequest: OutboundRequest = req.body;
      const result = await inventoryService.processOutbound(outboundRequest);
      
      res.json({
        success: true,
        data: result,
        message: result.message
      });
    } catch (error) {
      console.error('Error processing outbound:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '출고 처리 실패'
      });
    }
  }
);

/**
 * 재고 조정
 * POST /api/inventory/adjust
 */
router.post('/adjust',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    body('storeId').isUUID().withMessage('유효한 매장 ID가 필요합니다'),
    body('reason').isIn(['count_discrepancy', 'damage', 'expiry', 'theft', 'system_error', 'other']).withMessage('유효한 조정 사유를 선택해주세요'),
    body('adjustments').isArray({ min: 1 }).withMessage('조정할 로트가 최소 1개 필요합니다'),
    body('adjustments.*.lotId').isUUID(),
    body('adjustments.*.newQuantity').isFloat({ min: 0 }),
    body('notes').optional().isString()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const adjustmentRequest: StockAdjustmentRequest = req.body;
      const result = await inventoryService.adjustStock(adjustmentRequest);
      
      res.json({
        success: true,
        data: result,
        message: result.message
      });
    } catch (error) {
      console.error('Error adjusting stock:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '재고 조정 실패'
      });
    }
  }
);

/**
 * 매장별 재고 현황 조회
 * GET /api/inventory/status/:storeId
 */
router.get('/status/:storeId',
  authenticateToken,
  [
    param('storeId').isUUID(),
    query('materialId').optional().isUUID()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const status = await inventoryService.getInventoryStatus(
        req.params.storeId,
        req.query.materialId as string
      );
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('Error getting inventory status:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '재고 현황 조회 실패'
      });
    }
  }
);

/**
 * 유통기한 임박 재고 조회
 * GET /api/inventory/expiring/:storeId
 */
router.get('/expiring/:storeId',
  authenticateToken,
  [
    param('storeId').isUUID(),
    query('daysAhead').optional().isInt({ min: 1, max: 30 })
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const daysAhead = parseInt(req.query.daysAhead as string) || 7;
      const expiringStock = await inventoryService.getExpiringStock(req.params.storeId, daysAhead);
      
      res.json({
        success: true,
        data: expiringStock
      });
    } catch (error) {
      console.error('Error getting expiring stock:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '유통기한 임박 재고 조회 실패'
      });
    }
  }
);

/**
 * 재고 알림 조회
 * GET /api/inventory/alerts/:storeId
 */
router.get('/alerts/:storeId',
  authenticateToken,
  [
    param('storeId').isUUID(),
    query('alertType').optional().isIn(['low_stock', 'expiry_warning', 'expired', 'overstock', 'shortage', 'inbound_completed', 'adjustment_completed']),
    query('unreadOnly').optional().isBoolean()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const alerts = await inventoryService.getInventoryAlerts(
        req.params.storeId,
        req.query.alertType as any,
        req.query.unreadOnly === 'true'
      );
      
      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      console.error('Error getting inventory alerts:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '재고 알림 조회 실패'
      });
    }
  }
);

/**
 * 재고 알림 해결
 * PUT /api/inventory/alerts/:alertId/resolve
 */
router.put('/alerts/:alertId/resolve',
  authenticateToken,
  [param('alertId').isUUID()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '사용자 인증이 필요합니다.'
        });
      }

      await inventoryService.resolveAlert(req.params.alertId, userId);
      
      res.json({
        success: true,
        message: '알림이 해결되었습니다.'
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '알림 해결 실패'
      });
    }
  }
);

/**
 * 폐기 처리
 * POST /api/inventory/waste-disposal
 */
router.post('/waste-disposal',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    body('materialId').isUUID().withMessage('유효한 원재료 ID가 필요합니다'),
    body('storeId').isUUID().withMessage('유효한 매장 ID가 필요합니다'),
    body('lotId').optional().isUUID(),
    body('quantity').isFloat({ gt: 0 }).withMessage('폐기 수량은 0보다 커야 합니다'),
    body('wasteReason').isIn(['expired', 'damaged', 'contaminated', 'overstock', 'quality_issue', 'other']).withMessage('유효한 폐기 사유를 선택해주세요'),
    body('disposalMethod').optional().isIn(['trash', 'compost', 'recycle', 'return_supplier', 'other']),
    body('costImpact.amount').optional().isFloat({ min: 0 }),
    body('notes').optional().isString()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: '사용자 인증이 필요합니다.'
        });
      }

      const disposalData = {
        ...req.body,
        disposedBy: userId,
        disposalDate: new Date().toISOString()
      };

      const result = await inventoryService.processWasteDisposal(disposalData);
      
      res.status(201).json({
        success: true,
        data: result,
        message: result.message
      });
    } catch (error) {
      console.error('Error processing waste disposal:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : '폐기 처리 실패'
      });
    }
  }
);

/**
 * 재고 회전율 분석
 * GET /api/inventory/analysis/turnover/:storeId
 */
router.get('/analysis/turnover/:storeId',
  authenticateToken,
  [
    param('storeId').isUUID(),
    query('period').isIn(['weekly', 'monthly', 'quarterly', 'yearly']).withMessage('유효한 분석 기간을 선택해주세요'),
    query('materialId').optional().isUUID()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const period = req.query.period as AnalysisPeriod;
      const analysis = await inventoryService.getInventoryTurnoverAnalysis(
        req.params.storeId,
        period,
        req.query.materialId as string
      );
      
      res.json({
        success: true,
        data: analysis,
        meta: {
          period,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error getting turnover analysis:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '회전율 분석 실패'
      });
    }
  }
);

export default router;
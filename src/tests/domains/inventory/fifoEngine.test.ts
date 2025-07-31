import { FIFOInventoryEngine } from '../../../domains/inventory/fifoEngine';

describe('FIFOInventoryEngine', () => {
  let fifoEngine: FIFOInventoryEngine;
  let mockSupabaseClient: any;

  beforeEach(() => {
    // Create a comprehensive mock for all Supabase operations
    const createMockChain = () => {
      const chain = {
        select: jest.fn(),
        eq: jest.fn(),
        order: jest.fn(),
        single: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        gt: jest.fn(),
        not: jest.fn(),
        lte: jest.fn(),
        gte: jest.fn(),
        lt: jest.fn(),
        from: jest.fn()
      };
      
      // Make all methods return the chain itself for chaining
      (Object.keys(chain) as Array<keyof typeof chain>).forEach(key => {
        chain[key].mockReturnValue(chain);
      });
      
      return chain;
    };

    mockSupabaseClient = {
      from: jest.fn(() => createMockChain())
    };

    // Directly pass the mocked client to the constructor
    fifoEngine = new FIFOInventoryEngine(mockSupabaseClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processOutbound', () => {
    it('should process outbound request and update stock lots', async () => {
      const mockLots = [
        {
          id: 'lot1',
          material_id: 'material1',
          available_quantity: 100,
          unit_cost: 10.00,
          received_date: '2024-01-01'
        }
      ];

      // Mock the chain for getting lots
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockLots, error: null })
      };
      
      // Chain the eq calls properly
      selectChain.eq.mockReturnValueOnce(selectChain);
      selectChain.eq.mockReturnValueOnce(selectChain);
      selectChain.order.mockReturnValueOnce(selectChain);
      
      // Mock the chain for updating lot
      const updateChain = mockSupabaseClient.from();
      updateChain.update.mockReturnThis();
      updateChain.eq.mockResolvedValueOnce({ data: [{ id: 'lot1' }], error: null });
      
      // Mock the chain for inserting movement record
      const insertChain = mockSupabaseClient.from();
      insertChain.insert.mockResolvedValueOnce({ data: [{ id: 'record1' }], error: null });

      mockSupabaseClient.from
        .mockReturnValueOnce(selectChain)
        .mockReturnValueOnce(updateChain)
        .mockReturnValueOnce(insertChain);

      const request = {
        materialId: 'material1',
        quantity: 50,
        storeId: 'store1',
        reason: 'sale' as any,
        referenceId: 'order1'
      };

      const result = await fifoEngine.processOutbound(request);

      expect(result.success).toBe(true);
      expect(result.shortageQuantity).toBe(0);
      expect(result.usedLots.reduce((sum, lot) => sum + lot.quantity, 0)).toBe(50);
      expect(result.usedLots).toHaveLength(1);
      expect(result.usedLots[0].lotId).toBe('lot1');
      expect(result.usedLots[0].quantity).toBe(50);
    });

    it('should maintain FIFO order', async () => {
      const mockLots = [
        {
          id: 'lot1',
          material_id: 'material1',
          available_quantity: 30,
          unit_cost: 10.00,
          received_date: '2024-01-01'
        },
        {
          id: 'lot2',
          material_id: 'material1',
          available_quantity: 50,
          unit_cost: 12.00,
          received_date: '2024-01-02'
        }
      ];

      // Mock the chain for getting lots
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockLots, error: null })
      };
      
      // Chain the eq calls properly
      selectChain.eq.mockReturnValueOnce(selectChain);
      selectChain.eq.mockReturnValueOnce(selectChain);
      selectChain.order.mockReturnValueOnce(selectChain);
      
      // Mock chains for updates and inserts
      const updateChain1 = mockSupabaseClient.from();
      updateChain1.update.mockReturnThis();
      updateChain1.eq.mockResolvedValueOnce({ data: [{ id: 'lot1' }], error: null });
      
      const insertChain1 = mockSupabaseClient.from();
      insertChain1.insert.mockResolvedValueOnce({ data: [{ id: 'record1' }], error: null });
      
      const updateChain2 = mockSupabaseClient.from();
      updateChain2.update.mockReturnThis();
      updateChain2.eq.mockResolvedValueOnce({ data: [{ id: 'lot2' }], error: null });
      
      const insertChain2 = mockSupabaseClient.from();
      insertChain2.insert.mockResolvedValueOnce({ data: [{ id: 'record2' }], error: null });

      mockSupabaseClient.from
        .mockReturnValueOnce(selectChain)
        .mockReturnValueOnce(updateChain1)
        .mockReturnValueOnce(insertChain1)
        .mockReturnValueOnce(updateChain2)
        .mockReturnValueOnce(insertChain2);

      const request = {
        materialId: 'material1',
        quantity: 60,
        storeId: 'store1',
        reason: 'sale' as any,
        referenceId: 'order1'
      };

      const result = await fifoEngine.processOutbound(request);

      expect(result.success).toBe(true);
      expect(result.shortageQuantity).toBe(0);
      expect(result.usedLots.reduce((sum, lot) => sum + lot.quantity, 0)).toBe(60);
      expect(result.usedLots).toHaveLength(2);
      expect(result.usedLots[0].lotId).toBe('lot1');
      expect(result.usedLots[0].quantity).toBe(30);
      expect(result.usedLots[1].lotId).toBe('lot2');
      expect(result.usedLots[1].quantity).toBe(30);
    });
  });

  describe('processInbound', () => {
    it('should create new lot', async () => {
      const mockLot = {
        id: 'lot1',
        material_id: 'material1',
        lot_number: 'LOT001',
        quantity: 100,
        available_quantity: 100,
        unit_cost: 10.00,
        received_date: '2024-01-01'
      };

      // Mock the chain for creating lot
      const lotChain = mockSupabaseClient.from();
      lotChain.insert.mockReturnThis();
      lotChain.select.mockReturnThis();
      lotChain.single.mockResolvedValueOnce({ data: mockLot, error: null });
      
      // Mock the chain for creating movement record
      const movementChain = mockSupabaseClient.from();
      movementChain.insert.mockResolvedValueOnce({ data: [{ id: 'record1' }], error: null });

      mockSupabaseClient.from
        .mockReturnValueOnce(lotChain)
        .mockReturnValueOnce(movementChain);

      const request = {
        materialId: 'material1',
        storeId: 'store1',
        quantity: 100,
        unitCost: 10.00,
        receivedDate: '2024-01-01',
        lotNumber: 'LOT001',
        supplierInfo: {
          supplier_name: 'Test Supplier'
        }
      };

      const result = await fifoEngine.processInbound(request);

      expect(result.success).toBe(true);
      expect(result.lotId).toBe('lot1');
      expect(result.lotNumber).toBe('LOT001');
    });

    it('should auto-generate lot number', async () => {
      const mockLot = {
        id: 'lot2',
        material_id: 'material1',
        lot_number: 'AUTO-20240101-001',
        quantity: 50,
        available_quantity: 50,
        unit_cost: 12.00,
        received_date: '2024-01-01'
      };

      // Mock the chain for creating lot
      const lotChain = mockSupabaseClient.from();
      lotChain.insert.mockReturnThis();
      lotChain.select.mockReturnThis();
      lotChain.single.mockResolvedValueOnce({ data: mockLot, error: null });
      
      // Mock the chain for creating movement record
      const movementChain = mockSupabaseClient.from();
      movementChain.insert.mockResolvedValueOnce({ data: [{ id: 'record2' }], error: null });

      mockSupabaseClient.from
        .mockReturnValueOnce(lotChain)
        .mockReturnValueOnce(movementChain);

      const request = {
        materialId: 'material1',
        storeId: 'store1',
        quantity: 50,
        unitCost: 12.00,
        receivedDate: '2024-01-01',
        supplierInfo: {
          supplier_name: 'Test Supplier'
        }
        // No lotNumber provided
      };

      const result = await fifoEngine.processInbound(request);

      expect(result.success).toBe(true);
      expect(result.lotId).toBe('lot2');
      expect(result.lotNumber).toMatch(/^LOT-\d{8}-\d{6}$/);
    });
  });

  describe('adjustStock', () => {
    it('should adjust stock quantity', async () => {
      const mockLot = {
        id: 'lot1',
        available_quantity: 100
      };

      // Mock the chain for getting lot
      const selectChain = mockSupabaseClient.from();
      selectChain.select.mockReturnThis();
      selectChain.eq.mockReturnThis();
      selectChain.single.mockResolvedValueOnce({ data: mockLot, error: null });
      
      // Mock the chain for updating lot
      const updateChain = mockSupabaseClient.from();
      updateChain.update.mockReturnThis();
      updateChain.eq.mockResolvedValueOnce({ data: [{ id: 'lot1' }], error: null });
      
      // Mock the chain for creating adjustment record
      const insertChain = mockSupabaseClient.from();
      insertChain.insert.mockResolvedValueOnce({ data: [{ id: 'record1' }], error: null });

      mockSupabaseClient.from
        .mockReturnValueOnce(selectChain)
        .mockReturnValueOnce(updateChain)
        .mockReturnValueOnce(insertChain);

      const request = {
        lotId: 'lot1',
        adjustmentQuantity: 10,
        reason: 'damage',
        adjustedBy: 'user1'
      };

      const result = await fifoEngine.adjustStock(request);

      expect(result.success).toBe(true);
      expect(result.oldQuantity).toBe(100);
      expect(result.newQuantity).toBe(110);
      expect(result.adjustmentQuantity).toBe(10);
    });

    it('should handle lot not found', async () => {
      // Mock the chain for getting lot (not found)
      const selectChain = mockSupabaseClient.from();
      selectChain.select.mockReturnThis();
      selectChain.eq.mockReturnThis();
      selectChain.single.mockResolvedValueOnce({ data: null, error: { message: 'Lot not found' } });

      mockSupabaseClient.from.mockReturnValueOnce(selectChain);

      const request = {
        lotId: 'nonexistent',
        adjustmentQuantity: 10,
        reason: 'damage',
        adjustedBy: 'user1'
      };

      const result = await fifoEngine.adjustStock(request);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Lot not found');
    });
  });

  describe('getStockSummary', () => {
    it('should return current stock summary for material', async () => {
      const mockLots = [
        {
          id: 'lot1',
          material_id: 'material1',
          available_quantity: 50,
          unit_cost: { amount: 10.00, currency: 'KRW' },
          received_date: '2024-01-01'
        },
        {
          id: 'lot2',
          material_id: 'material1',
          available_quantity: 30,
          unit_cost: { amount: 12.00, currency: 'KRW' },
          received_date: '2024-01-02'
        }
      ];

      // Mock the chain for getting lots
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockLots, error: null })
      };
      
      // Chain the eq calls properly
      mockChain.eq.mockReturnValueOnce(mockChain);
      mockChain.eq.mockReturnValueOnce(mockChain);
      mockChain.eq.mockReturnValueOnce(mockChain);
      
      mockSupabaseClient.from.mockReturnValueOnce(mockChain);

      const result = await fifoEngine.getStockSummary('material1', 'store1');

      expect(result.totalQuantity).toBe(80);
      expect(result.totalValue).toBe(860); // (50 * 10) + (30 * 12)
      expect(result.lotCount).toBe(2);
    });
  });

  describe('getExpiringLots', () => {
    it('should return lots expiring within specified days', async () => {
      const mockLots = [
        {
          id: 'lot1',
          material_id: 'material1',
          lot_number: 'LOT001',
          available_quantity: 50,
          unit_cost: 10.00,
          expiry_date: '2024-12-31',
          raw_materials: { name: 'Test Material 1' }
        },
        {
          id: 'lot2',
          material_id: 'material1',
          lot_number: 'LOT002',
          available_quantity: 30,
          unit_cost: 12.00,
          expiry_date: '2024-11-30',
          raw_materials: { name: 'Test Material 1' }
        }
      ];

      // Mock the chain for getting expiring lots
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockLots, error: null })
      };
      
      // Chain the eq calls properly
      mockChain.eq.mockReturnValueOnce(mockChain);
      mockChain.eq.mockReturnValueOnce(mockChain);
      
      mockSupabaseClient.from.mockReturnValueOnce(mockChain);

      const result = await fifoEngine.getExpiringLots('store1', 30);

      expect(result).toHaveLength(2);
      expect(result[0].lotId).toBe('lot1');
      expect(result[0].materialName).toBe('Test Material 1');
      expect(result[1].lotId).toBe('lot2');
    });
  });
});
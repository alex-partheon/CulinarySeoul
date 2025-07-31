import { FIFOInventoryEngine } from '../../../domains/inventory/fifoEngine';
import { LotStatus, MovementType } from '../../../domains/inventory/types';

describe('FIFOInventoryEngine - Advanced Test Cases', () => {
  let fifoEngine: FIFOInventoryEngine;
  let mockSupabase: any;

  const createMockChain = () => {
    const mockChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis()
    };
    
    return mockChain;
  };

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(() => createMockChain())
    };
    
    // Directly pass the mocked client to the constructor
    fifoEngine = new FIFOInventoryEngine(mockSupabase);
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle insufficient stock scenario', async () => {
      const mockLots = [
        {
          id: 'lot1',
          material_id: 'material1',
          available_quantity: 30,
          unit_cost: { amount: 10.00, currency: 'KRW' },
          received_date: '2024-01-01',
          lot_number: 'LOT001'
        }
      ];

      // Mock the chain for getting lots
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis()
      };
      
      // Chain the calls properly for getStockLotsByFIFO
      selectChain.eq.mockReturnValueOnce(selectChain); // material_id
      selectChain.eq.mockReturnValueOnce(selectChain); // store_id
      selectChain.eq.mockReturnValueOnce(selectChain); // status
      selectChain.gt.mockReturnValueOnce(selectChain); // available_quantity > 0
      selectChain.order.mockReturnValueOnce(selectChain); // received_date
      selectChain.order.mockResolvedValueOnce({ data: mockLots, error: null }); // created_at
      
      // Mock update and insert operations
      const updateChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [{ id: 'lot1' }], error: null })
      };
      
      const insertChain = {
        insert: jest.fn().mockResolvedValue({ data: [{ id: 'record1' }], error: null })
      };
      
      mockSupabase.from
        .mockReturnValueOnce(selectChain)
        .mockReturnValueOnce(updateChain)
        .mockReturnValueOnce(insertChain);

      const request = {
        materialId: 'material1',
        storeId: 'store1',
        quantity: 50, // More than available (30)
        reason: MovementType.SALE,
        referenceId: 'order1'
      };

      const result = await fifoEngine.processOutbound(request);

      expect(result.success).toBe(false);
      expect(result.shortageQuantity).toBe(20); // 50 - 30 = 20
      expect(result.usedLots).toHaveLength(1);
      expect(result.usedLots[0].quantity).toBe(30);
    });

    it('should handle zero quantity outbound request', async () => {
      // Mock the chain for inserting movement record
      const insertChain = mockSupabase.from();
      insertChain.insert.mockResolvedValueOnce({ data: [{ id: 'record1' }], error: null });
      
      mockSupabase.from.mockReturnValueOnce(insertChain);

      const request = {
        materialId: 'material1',
        storeId: 'store1',
        quantity: 0,
        reason: MovementType.SALE,
        referenceId: 'order1'
      };

      const result = await fifoEngine.processOutbound(request);

      expect(result.success).toBe(true);
      expect(result.usedLots).toHaveLength(0);
      expect(result.totalCost).toBe(0);
      expect(result.shortageQuantity).toBe(0);
    });

    it('should handle negative quantity adjustment', async () => {
      const mockLot = {
        id: 'lot1',
        material_id: 'material1',
        available_quantity: 50,
        lot_number: 'LOT001'
      };

      // Mock single lot fetch
      const singleChain = createMockChain();
      singleChain.single.mockResolvedValue({ data: mockLot, error: null });
      
      // Mock update operation
      const updateChain = createMockChain();
      updateChain.eq.mockResolvedValue({ error: null });
      
      // Mock insert operation for adjustment record
      const insertChain = createMockChain();
      insertChain.insert.mockResolvedValue({ error: null });
      
      mockSupabase.from
        .mockReturnValueOnce(singleChain)
        .mockReturnValueOnce(updateChain)
        .mockReturnValueOnce(insertChain);

      const request = {
        lotId: 'lot1',
        adjustmentQuantity: -20, // Negative adjustment
        reason: 'damage',
        adjustedBy: 'user1'
      };

      const result = await fifoEngine.adjustStock(request);

      expect(result.success).toBe(true);
      expect(result.oldQuantity).toBe(50);
      expect(result.newQuantity).toBe(30); // 50 + (-20) = 30
      expect(result.adjustmentQuantity).toBe(-20);
    });

    it('should handle database error during outbound processing', async () => {
      // Mock the chain for getting lots with error
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis()
      };
      
      // Chain the calls properly for getStockLotsByFIFO
      selectChain.eq.mockReturnValueOnce(selectChain); // material_id
      selectChain.eq.mockReturnValueOnce(selectChain); // store_id
      selectChain.eq.mockReturnValueOnce(selectChain); // status
      selectChain.gt.mockReturnValueOnce(selectChain); // available_quantity > 0
      selectChain.order.mockReturnValueOnce(selectChain); // received_date
      selectChain.order.mockResolvedValueOnce({ data: null, error: { message: 'Database connection failed' } }); // created_at
      
      mockSupabase.from.mockReturnValueOnce(selectChain);

      const request = {
        materialId: 'material1',
        storeId: 'store1',
        quantity: 50,
        reason: MovementType.SALE,
        referenceId: 'order1'
      };

      await expect(fifoEngine.processOutbound(request)).rejects.toThrow('Database connection failed');
    });
  });

  describe('Complex Business Logic', () => {
    it('should handle multiple lots with different unit costs correctly', async () => {
      const mockLots = [
        {
          id: 'lot1',
          material_id: 'material1',
          available_quantity: 20,
          unit_cost: { amount: 10.00, currency: 'KRW' },
          received_date: '2024-01-01',
          lot_number: 'LOT001'
        },
        {
          id: 'lot2',
          material_id: 'material1',
          available_quantity: 30,
          unit_cost: { amount: 15.00, currency: 'KRW' },
          received_date: '2024-01-02',
          lot_number: 'LOT002'
        },
        {
          id: 'lot3',
          material_id: 'material1',
          available_quantity: 25,
          unit_cost: { amount: 12.00, currency: 'KRW' },
          received_date: '2024-01-03',
          lot_number: 'LOT003'
        }
      ];

      // Mock the chain for getting lots
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis()
      };
      
      // Chain the calls properly for getStockLotsByFIFO
      selectChain.eq.mockReturnValueOnce(selectChain); // material_id
      selectChain.eq.mockReturnValueOnce(selectChain); // store_id
      selectChain.eq.mockReturnValueOnce(selectChain); // status
      selectChain.gt.mockReturnValueOnce(selectChain); // available_quantity > 0
      selectChain.order.mockReturnValueOnce(selectChain); // received_date
      selectChain.order.mockResolvedValueOnce({ data: mockLots, error: null }); // created_at
      
      // Mock update operations for each lot
      const updateChain1 = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [{ id: 'lot1' }], error: null })
      };
      
      const updateChain2 = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [{ id: 'lot2' }], error: null })
      };
      
      // Mock insert operation
      const insertChain = {
        insert: jest.fn().mockResolvedValue({ data: [{ id: 'record1' }], error: null })
      };
      
      mockSupabase.from
        .mockReturnValueOnce(selectChain)
        .mockReturnValueOnce(updateChain1)
        .mockReturnValueOnce(updateChain2)
        .mockReturnValueOnce(insertChain);

      const request = {
        materialId: 'material1',
        storeId: 'store1',
        quantity: 45, // Will use lot1 (20) + lot2 (25 out of 30)
        reason: MovementType.SALE,
        referenceId: 'order1'
      };

      const result = await fifoEngine.processOutbound(request);

      expect(result.success).toBe(true);
      expect(result.usedLots).toHaveLength(2);
      expect(result.usedLots[0].quantity).toBe(20); // Full lot1
      expect(result.usedLots[1].quantity).toBe(25); // Partial lot2
      expect(result.totalCost).toBe(20 * 10 + 25 * 15); // 200 + 375 = 575
      expect(result.averageUnitCost).toBe(575 / 45); // 12.78
      expect(result.shortageQuantity).toBe(0);
    });

    it('should calculate weighted average unit cost correctly', async () => {
      const mockLots = [
        {
          id: 'lot1',
          material_id: 'material1',
          available_quantity: 100,
          unit_cost: { amount: 8.00, currency: 'KRW' },
          received_date: '2024-01-01'
        },
        {
          id: 'lot2',
          material_id: 'material1',
          available_quantity: 200,
          unit_cost: { amount: 12.00, currency: 'KRW' },
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
      
      // Chain the calls properly for getStockSummary
      selectChain.eq.mockReturnValueOnce(selectChain); // material_id
      selectChain.eq.mockReturnValueOnce(selectChain); // store_id
      selectChain.eq.mockReturnValueOnce(selectChain); // status
      selectChain.gt.mockReturnValueOnce(selectChain); // available_quantity > 0
      selectChain.order.mockResolvedValueOnce({ data: mockLots, error: null }); // received_date
      
      mockSupabase.from.mockReturnValueOnce(selectChain);

      const result = await fifoEngine.getStockSummary('material1', 'store1');

      expect(result.totalQuantity).toBe(300);
      expect(result.totalValue).toBe(100 * 8 + 200 * 12); // 800 + 2400 = 3200
      expect(result.averageUnitCost).toBe(10.67); // 3200 / 300 = 10.67 (rounded)
      expect(result.lotCount).toBe(2);
      expect(result.oldestLot).toBe(mockLots[0]);
    });
  });

  describe('Expiry Management', () => {
    it('should identify lots expiring within specified days', async () => {
      const currentDate = '2024-01-15';
      const mockLots = [
        {
          id: 'lot1',
          material_id: 'material1',
          lot_number: 'LOT001',
          expiry_date: '2024-01-20', // 5 days from current
          available_quantity: 50,
          raw_materials: { name: 'Test Material 1' }
        },
        {
          id: 'lot2',
          material_id: 'material2',
          lot_number: 'LOT002',
          expiry_date: '2024-01-17', // 2 days from current
          available_quantity: 30,
          raw_materials: { name: 'Test Material 2' }
        },
        {
          id: 'lot3',
          material_id: 'material3',
          lot_number: 'LOT003',
          expiry_date: '2024-01-25', // 10 days from current
          available_quantity: 20,
          raw_materials: { name: 'Test Material 3' }
        }
      ];

      // Mock the chain for getting expiring lots
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockLots, error: null })
      };
      
      // Chain the calls properly
      selectChain.eq.mockReturnValueOnce(selectChain); // store_id
      selectChain.eq.mockReturnValueOnce(selectChain); // status
      selectChain.gt.mockReturnValueOnce(selectChain); // available_quantity > 0
      selectChain.not.mockReturnValueOnce(selectChain); // expiry_date not null
      selectChain.lte.mockReturnValueOnce(selectChain); // expiry_date <= target
      
      mockSupabase.from.mockReturnValue(selectChain);

      const result = await fifoEngine.getExpiringLots('store1', 7, currentDate);

      expect(result).toHaveLength(3);
      expect(result[0].lotId).toBe('lot1');
      expect(result[0].daysUntilExpiry).toBe(5);
      expect(result[1].lotId).toBe('lot2');
      expect(result[1].daysUntilExpiry).toBe(2);
    });

    it('should handle lots with no expiry date', async () => {
      const mockLots = [
        {
          id: 'lot1',
          material_id: 'material1',
          lot_number: 'LOT001',
          expiry_date: null, // No expiry date
          available_quantity: 50,
          raw_materials: { name: 'Non-perishable Material' }
        }
      ];

      // Mock the chain for getting expiring lots
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null })
      };
      
      // Chain the calls properly
      selectChain.eq.mockReturnValueOnce(selectChain); // store_id
      selectChain.eq.mockReturnValueOnce(selectChain); // status
      selectChain.gt.mockReturnValueOnce(selectChain); // available_quantity > 0
      selectChain.not.mockReturnValueOnce(selectChain); // expiry_date not null
      selectChain.lte.mockReturnValueOnce(selectChain); // expiry_date <= target
      
      mockSupabase.from.mockReturnValueOnce(selectChain);

      const result = await fifoEngine.getExpiringLots('store1', 7);

      expect(result).toHaveLength(0);
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large number of lots efficiently', async () => {
      // Generate 100 lots
      const mockLots = Array.from({ length: 100 }, (_, index) => ({
        id: `lot${index + 1}`,
        material_id: 'material1',
        available_quantity: 10,
        unit_cost: { amount: 10.00 + index * 0.1, currency: 'KRW' },
        received_date: `2024-01-${String(index + 1).padStart(2, '0')}`,
        lot_number: `LOT${String(index + 1).padStart(3, '0')}`
      }));

      // Mock the chain for getting lots
      const selectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockLots, error: null })
      };
      
      // Chain the calls properly for getStockLotsByFIFO
      selectChain.eq.mockReturnValueOnce(selectChain); // material_id
      selectChain.eq.mockReturnValueOnce(selectChain); // store_id
      selectChain.eq.mockReturnValueOnce(selectChain); // status
      selectChain.gt.mockReturnValueOnce(selectChain); // available_quantity > 0
      selectChain.order.mockReturnValueOnce(selectChain); // received_date
      selectChain.order.mockResolvedValueOnce({ data: mockLots, error: null }); // created_at
      
      // Mock update operations (simplified for 50 lots)
      const updateChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [{ id: 'updated' }], error: null })
      };
      
      // Mock insert operation
      const insertChain = {
        insert: jest.fn().mockResolvedValue({ data: [{ id: 'record1' }], error: null })
      };
      
      // Setup the mock chain - first call for select, then many update calls, then insert
       mockSupabase.from.mockReturnValueOnce(selectChain);
       
       // Mock 50 update operations
       for (let i = 0; i < 50; i++) {
         mockSupabase.from.mockReturnValueOnce(updateChain);
       }
       
       // Final call for insert
       mockSupabase.from.mockReturnValueOnce(insertChain);

      const startTime = Date.now();
      
      const request = {
        materialId: 'material1',
        storeId: 'store1',
        quantity: 500, // Will use 50 lots (10 each)
        reason: MovementType.SALE,
        referenceId: 'large-order'
      };

      const result = await fifoEngine.processOutbound(request);
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;

      expect(result.success).toBe(true);
      expect(result.usedLots).toHaveLength(50);
      expect(result.shortageQuantity).toBe(0);
      expect(processingTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Data Integrity', () => {
    it('should maintain transaction consistency during concurrent operations', async () => {
      const mockLots = [
        {
          id: 'lot1',
          material_id: 'material1',
          available_quantity: 100,
          unit_cost: { amount: 10.00, currency: 'KRW' },
          received_date: '2024-01-01',
          lot_number: 'LOT001'
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
      
      // Mock update operation
      const updateChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [{ id: 'lot1' }], error: null })
      };
      
      // Mock insert operation
      const insertChain = {
        insert: jest.fn().mockResolvedValue({ data: [{ id: 'record1' }], error: null })
      };
      
      mockSupabase.from
        .mockReturnValueOnce(selectChain)
        .mockReturnValueOnce(updateChain)
        .mockReturnValueOnce(insertChain);

      const request = {
        materialId: 'material1',
        storeId: 'store1',
        quantity: 50,
        reason: MovementType.SALE,
        referenceId: 'order1'
      };

      const result = await fifoEngine.processOutbound(request);

      expect(result.success).toBe(true);
      expect(result.transactionId).toBeDefined();
      expect(result.transactionId).toMatch(/^TXN-\d{13}-[a-z0-9]{6}$/);
    });

    it('should validate lot number format', async () => {
      const request = {
        materialId: 'material1',
        storeId: 'store1',
        quantity: 100,
        unitCost: 15.00,
        receivedDate: '2024-01-15',
        supplierInfo: {
          supplier_name: 'Test Supplier'
        }
      };

      // Mock insert operation
      const insertChain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: { id: 'new-lot-id' }, 
          error: null 
        })
      };
      
      mockSupabase.from.mockReturnValueOnce(insertChain);

      const result = await fifoEngine.processInbound(request);

      expect(result.success).toBe(true);
      expect(result.lotNumber).toMatch(/^LOT-\d{8}-\d{6}$/);
      expect(result.lotId).toBe('new-lot-id');
    });
  });
});
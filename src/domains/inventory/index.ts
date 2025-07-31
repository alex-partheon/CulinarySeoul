// TASK-006: FIFO 기반 원재료 관리 시스템 - 도메인 인덱스
// 모든 inventory 도메인 컴포넌트를 통합 export

// 타입 정의
export * from './types';

// 도메인 서비스
export { RawMaterialService } from './rawMaterialService';
export { InventoryService } from './inventoryService';

// FIFO 엔진
export { FIFOInventoryEngine } from './fifoEngine';

// 기존 서비스 (호환성 유지)
export { InventoryItemService } from './inventoryItemService';
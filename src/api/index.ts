// TASK-006: API 라우터 통합 인덱스
// 모든 API 엔드포인트를 통합하여 관리

import { Router } from 'express';
import inventoryRouter from './inventory';

const router = Router();

// API 버전 정보
router.get('/', (req, res) => {
  res.json({
    name: 'CulinarySeoul API',
    version: '1.0.0',
    description: 'FIFO 기반 원재료 관리 시스템 API',
    endpoints: {
      inventory: '/api/inventory',
      health: '/api/health'
    }
  });
});

// 헬스 체크 엔드포인트
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 재고 관리 API 라우터 등록
router.use('/inventory', inventoryRouter);

export default router;
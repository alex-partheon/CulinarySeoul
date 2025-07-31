# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the CulinarySeoul ERP system - a React Router 7 based dual-dashboard ERP system with brand separation support. The project aims to build a comprehensive multi-brand management system with eventual brand independence capabilities.

**Key System Features**:
- **culinaryseoul.com/dashboard**: Company integrated dashboard (managing all brands)
- **cafe-millab.com/dashboard**: Brand independent dashboard (brand-specific operations)
- **Hybrid Permission System**: Users can have both company and brand access
- **FIFO Inventory Tracking**: First-In-First-Out inventory cost tracking
- **Complete Brand Separation Support**: Automated brand independence system

## Language & Documentation Standards

**모든 문서는 한글로 작성되고 관리됩니다** (All documentation is written and managed in Korean):

- Task descriptions and updates in Korean
- User interface text in Korean
- Documentation files in Korean
- Code comments can be in English for technical clarity
- API documentation in Korean

## Task Management Workflow

**중요**: Tasks는 `/Users/alex/Dev/CulinarySeoul/docs/TASK.md`에서 관리되며, task 처리 완료 시 즉시 업데이트해야 합니다.

### Task Processing Rules:
1. Read current tasks from `docs/TASK.md`
2. Update task completion status immediately upon finishing work
3. Mark completed items with ✅ 
4. Document any implementation changes or notes
5. Update progress tracking in the task file

### Reference Documentation:
- `docs/TASK.md` - 40주 개발 계획 및 상세 태스크 (Primary task reference)
- `docs/PRD.md` - Product requirements (if available)
- `docs/requirements.md` - System requirements (if available)

## Architecture & Structure

**Current State**: Basic Vite + React 19 setup (starting template)
**Target Architecture**: React Router 7 Framework Mode with dual-dashboard ERP system

### Planned Major Components:
- **Dual Dashboard System**: Company and brand dashboards with different access patterns
- **Hybrid Permission System**: Complex user access control supporting both company and brand roles
- **FIFO Inventory Engine**: Advanced inventory tracking with first-in-first-out cost calculation
- **Brand Separation Engine**: Automated system for creating independent brand systems
- **Supabase Integration**: PostgreSQL + Auth + Realtime + Edge Functions
- **Payment Integration**: 토스페이먼츠 (TossPayments) API integration

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally  
npm run preview

# Run ESLint
npm run lint
```

## Planned Technology Stack

### Frontend (Target)
- **React 19** + **TypeScript** 
- **React Router 7** (Framework Mode)
- **Tailwind CSS v4** + **Shadcn/ui**
- **Zustand** (상태 관리)
- **React Hook Form** (폼 관리) 
- **Recharts** (데이터 시각화)

### Backend (Target)
- **Supabase** (PostgreSQL + Auth + Realtime + Edge Functions)
- **Redis** (캐싱 및 세션 관리)
- **Google Gemini** (AI 최적화)

### External Integrations (Target)
- **토스페이먼츠** (결제 시스템)
- **Resend** (이메일 발송)

## Development Guidelines

- **Korean-First**: All user-facing content and documentation in Korean
- **Task-Driven**: Always reference and update TASK.md for development progress
- **Architecture-Ready**: Build with dual-dashboard and brand separation in mind
- **Modern React**: Use React 19 patterns and concurrent features
- **Type Safety**: Plan migration to TypeScript for production system
- **Component-Driven**: Build reusable components following Shadcn/ui patterns

## Current Development Phase

This is currently a template project. Major development follows the 40-week plan outlined in `docs/TASK.md`, starting with:

1. **Phase 1 (Week 1-10)**: 기반 구조 및 이중 대시보드 구축
2. **Phase 2 (Week 11-24)**: FIFO 재고 관리 및 핵심 기능 개발  
3. **Phase 3 (Week 25-34)**: 브랜드 분리 시스템 및 고급 기능
4. **Phase 4 (Week 35-40)**: 테스트, 최적화 및 배포
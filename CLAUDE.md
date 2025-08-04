# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CulinarySeoul ERP is a React + TypeScript dual-dashboard system designed for multi-brand restaurant management with eventual brand separation capabilities. The system supports both company-wide management and brand-specific operations through a sophisticated hybrid permission system.

**Key Features**:
- **Dual Dashboard Architecture**: Separate company (`/company`) and brand (`/brand`) dashboards
- **Hybrid Permission System**: Users can have access to both company and brand dashboards simultaneously
- **Domain-Driven Design**: Organized into company, brand, and store domains
- **Supabase Integration**: Authentication, database, and real-time features
- **Security-First**: Comprehensive permission management and security testing

## Language & Documentation Standards

**모든 문서는 한글로 작성되고 관리됩니다** (All documentation is written and managed in Korean):
- Task descriptions and UI text in Korean
- Code comments can be in English for technical clarity
- All user-facing content in Korean

## Development Commands

```bash
# Start development server (port may vary - check terminal output)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview

# Testing
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
npm run test:security     # Run security-specific tests (SecurityTestSuite.test.ts)

# Security
npm run security:scan     # Run npm audit + security tests
npm run security:report   # Generate coverage + audit report

# Utilities
npm run create-test-account # Create test accounts for development
```

## Architecture & Technology Stack

### Frontend Architecture
- **React 19** with **TypeScript**
- **React Router 7** with nested routing for company/brand separation
  - ⚠️ **Important**: React Router v7 merged `react-router-dom` into `react-router`. Use `import { Link, useLocation } from 'react-router'`
- **Tailwind CSS v4** with **Radix UI** components
  - Using new Tailwind v4 syntax: `@import "tailwindcss"` and `@theme` directive
- **React Hot Toast** for notifications
- **Domain-Driven Design** structure

### Key Dependencies
- `@supabase/supabase-js` - Database and auth client
- `@clerk/clerk-react` - Authentication and user management (primary auth system)
- `@radix-ui/*` - Accessible UI primitives (avatar, dialog, dropdown-menu, etc.)
- `react-router` v7.7.1 - Routing system (no separate react-router-dom)
- `react-hot-toast` - Toast notifications
- `lucide-react` - Icons
- `class-variance-authority` - Component variants
- `tailwind-merge` - Tailwind class merging
- `recharts` - Chart components for analytics
- `@tanstack/react-query` - Server state management and caching

### Vite Configuration
- Path alias configured: `@/` → `./src/`
- React plugin for Fast Refresh
- ESM module system

## Authentication & Permissions

### Authentication System
- **Clerk Auth** as primary authentication system (email/password, social login)
- **Supabase** for database operations and additional services
- **AuthContext** and **ClerkAuthContext** for global auth state
- **Hybrid Permission System** supporting both company and brand access
- **Protected Routes** with role-based access

### Permission Architecture
- **UserPermissions**: Defines what dashboards a user can access
- **DashboardSession**: Tracks current dashboard context
- **PermissionService**: Manages permission logic and caching (singleton pattern)
- **PermissionGuard**: Component-level permission checking

## Domain Architecture

### Domain Structure
Each domain follows a consistent pattern:
- `types.ts` - TypeScript interfaces and types
- `*Service.ts` - Business logic and data access
- `index.ts` - Public API exports

### Current Domains
1. **Company**: Top-level organization management
2. **Brand**: Brand-specific operations (밀랍 etc.)
3. **Store**: Individual store management (성수점 etc.)
4. **User**: User and permission management
5. **Inventory**: Stock and product management with FIFO engine (89.89% test coverage)
6. **Analytics**: Business analytics including profitability analysis
7. **Order**: Order processing and fulfillment
8. **Payments**: Payment integration (Toss Payments)

## Routing System

### Route Structure
- `/` - Root redirect to company dashboard
- `/login` - Authentication page
- `/style-guide` - Component showcase and design system
- `/company/*` - Company dashboard and sub-pages
- `/brand/*` - Brand dashboard and sub-pages
- Protected routes with permission checks

## Task Management

**중요**: Tasks are managed in `docs/TASK.md` with detailed 40-week development plan.

### Current Status
- ✅ **TASK-001**: Basic architecture and dual dashboard routing
- ✅ **TASK-002**: Hybrid permission system implementation  
- ✅ **TASK-003**: Company-brand-store data model implementation
- ✅ **TASK-004**: Company dashboard UI implementation (completed)
- ✅ **TASK-006**: FIFO 재고 관리 시스템 구현 (89.89% test coverage achieved)
- 🚧 **TASK-008**: 매출관리 시스템 (UI scaffolding completed, implementation pending)
- ✅ **TASK-009**: 실시간 재고 현황 대시보드 구현 (mostly completed)

### Task Processing Rules
1. Read current tasks from `docs/TASK.md`
2. Update completion status immediately upon finishing work
3. Mark completed items with ✅
4. Document implementation changes and notes
5. Update progress in both TASK.md and CLAUDE.md

## Testing Strategy

### Test Structure
- **Unit Tests**: Component and service testing with Jest + Testing Library
- **Security Tests**: Permission and access control testing
- **Integration Tests**: Domain service integration
- **Coverage**: Target 90%+ for security-critical code

### Test Configuration
- Jest with TypeScript support via ts-jest
- jsdom environment for React component testing
- CSS modules mocked with identity-obj-proxy

## Development Environment

### Configuration
- **Vite**: Build tool with path aliases (`@/` → `./src/`)
- **TypeScript**: Strict mode enabled
- **ESLint**: React hooks and refresh plugins
- **PostCSS**: Tailwind CSS v4 processing

### Development Guidelines
- **Korean-First**: All user-facing content in Korean
- **Component-Driven**: Build reusable Radix UI components
- **Security-First**: Test permissions and validate inputs
- **Type-Safe**: Use TypeScript throughout

## Common Issues & Solutions

### Port Conflicts
Development server typically runs on port 5173, but may use 5174+ if occupied. Check terminal output for actual port.

### React Router v7 Migration
If you see "Right side of assignment cannot be destructured" errors:
- Change all imports from `react-router-dom` to `react-router`
- React Router v7 consolidated all exports into the main package

### Tailwind CSS v4
- Uses new import syntax: `@import "tailwindcss"`
- CSS variables defined with `@theme` directive
- Simplified config file (no theme extend needed)

### Test Environment
- Jest configured with TypeScript and ESM support
- `ts-jest` preset with `useESM: true`
- Path alias `@/` mapped to `src/` directory
- Security-critical files have higher coverage thresholds (90%+)
- Use `npm run test:security` for permission-related tests

### Clerk Authentication
- Primary authentication system using `@clerk/clerk-react`
- Development setup requires Clerk publishable key in environment
- Webhook endpoints for user management in `/src/api/clerk-webhooks.ts`
- User onboarding flow in `/src/pages/auth/ClerkOnboarding.tsx`

## Important Implementation Details

### Current Architecture Status
- **FIFO Inventory Engine**: Fully implemented with comprehensive test suite (19 tests, 89.89% coverage)
- **Profitability Analytics**: Advanced analytics system with cost optimization features
- **Brand Digital Marketing**: Google Analytics and Instagram API integration framework
- **Comprehensive UI Components**: Extensive Radix UI-based component library
- **Real-time Features**: Supabase real-time subscriptions for inventory updates

### Key Architectural Patterns
- **Domain-Driven Design**: Clear separation of business domains in `/src/domains/`
- **Component-Driven UI**: Reusable components in `/src/components/ui/`
- **Service Layer Pattern**: Business logic encapsulated in service classes
- **Context Providers**: React contexts for auth, theme, and data scope
- **Hook-Based State**: Custom hooks for complex state management

### Testing Architecture
- **Unit Tests**: Domain logic and utility functions
- **Integration Tests**: Service interactions and data flow
- **Security Tests**: Permission system and auth flows (SecurityTestSuite)
- **Advanced Scenarios**: Complex business logic edge cases
- **Coverage Thresholds**: Higher requirements for security-critical code

### File Organization
- `/src/components/` - UI components organized by domain
- `/src/domains/` - Business logic and data models
- `/src/pages/` - Route components with nested structure
- `/src/contexts/` - React context providers
- `/src/hooks/` - Custom React hooks
- `/src/services/` - Shared service layer
- `/src/tests/` - Test files mirroring domain structure

## Security Considerations

- **RLS Policies**: Database-level security for data isolation
- **Permission Validation**: Client and server-side permission checks
- **Session Management**: Secure session handling with expiration
- **Audit Logging**: Track permission changes and access
- **Input Validation**: Validate all user inputs and API calls
- **Clerk Integration**: Enterprise-grade authentication with webhook support
# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
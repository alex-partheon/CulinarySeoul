# 테스트 계정 관리

## 슈퍼 관리자 계정

### 김광일 (대표이사)
- **이메일**: alex@culinaryseoul.com
- **비밀번호**: rlarhkdlf3!@
- **이름**: 김광일
- **직급**: 대표이사
- **역할**: super_admin
- **권한**: 모든 시스템 접근 및 관리 권한
- **생성일**: 2025-01-27
- **상태**: 활성
- **Clerk 계정**: ✅ 생성 완료

## 회사 관리자 계정

### 박영희 (운영이사)
- **이메일**: company.admin@culinaryseoul.com
- **비밀번호**: CompanyAdmin123!@
- **이름**: 박영희
- **직급**: 운영이사
- **역할**: company_admin
- **권한**: 회사 대시보드 전체 접근, 브랜드 관리, 사용자 관리
- **생성일**: 2025-01-04- **상태**: 활성
- **Clerk 계정**: ✅ 생성 완료

### 이민수 (데이터 분석가)
- **이메일**: company.analyst@culinaryseoul.com
- **비밀번호**: DataAnalyst123!@
- **이름**: 이민수
- **직급**: 데이터 분석가
- **역할**: company_general_admin
- **권한**: 회사 대시보드 읽기 전용, 리포트 조회, 데이터 분석
- **생성일**: 2025-01-04
- **상태**: 활성
- **Clerk 계정**: 생성 필요

## 브랜드 관리자 계정

### 김민지 (밀라브 브랜드 대표)
- **이메일**: brand.millab@culinaryseoul.com
- **비밀번호**: BrandAdmin123!@
- **이름**: 김민지
- **직급**: 브랜드 대표
- **역할**: brand_manager
- **브랜드**: 밀라브 (Millab)
- **권한**: 브랜드 대시보드 전체 접근, 매장 관리, 브랜드 직원 관리
- **생성일**: 2025-01-04
- **상태**: 활성
- **Clerk 계정**: 생성 필요

### 정수현 (카페베네 브랜드 매니저)
- **이메일**: brand.cafebene@culinaryseoul.com
- **비밀번호**: BrandManager123!@
- **이름**: 정수현
- **직급**: 브랜드 매니저
- **역할**: brand_manager
- **브랜드**: 카페베네 (Cafe Bene)
- **권한**: 브랜드 대시보드 제한적 접근, 매장 모니터링
- **생성일**: 2025-01-04
- **상태**: 활성
- **Clerk 계정**: 생성 필요

## 매장 관리자 계정

### 최지훈 (강남점 매장장)
- **이메일**: store.gangnam@culinaryseoul.com
- **비밀번호**: StoreManager123!@
- **이름**: 최지훈
- **직급**: 매장장
- **역할**: store_manager
- **매장**: 밀라브 강남점
- **권한**: 매장 대시보드 전체 접근, 매장 직원 관리, 재고 관리
- **생성일**: 2025-01-04
- **상태**: 활성
- **Clerk 계정**: 생성 필요

### 한소영 (홍대점 매장장)
- **이메일**: store.hongdae@culinaryseoul.com
- **비밀번호**: StoreManager123!@
- **이름**: 한소영
- **직급**: 매장장
- **역할**: store_manager
- **매장**: 카페베네 홍대점
- **권한**: 매장 대시보드 전체 접근, 매장 직원 관리, 재고 관리
- **생성일**: 2025-01-04
- **상태**: 활성
- **Clerk 계정**: 생성 필요

## 일반 직원 계정

### 김태현 (강남점 바리스타)
- **이메일**: staff.gangnam@culinaryseoul.com
- **비밀번호**: StaffUser123!@
- **이름**: 김태현
- **직급**: 바리스타
- **역할**: employee
- **매장**: 밀라브 강남점
- **권한**: 매장 대시보드 읽기 전용, POS 시스템 접근
- **생성일**: 2025-01-04
- **상태**: 활성
- **Clerk 계정**: 생성 필요

### 이서연 (홍대점 서빙)
- **이메일**: staff.hongdae@culinaryseoul.com
- **비밀번호**: StaffUser123!@
- **이름**: 이서연
- **직급**: 서빙
- **역할**: employee
- **매장**: 카페베네 홍대점
- **권한**: 매장 대시보드 읽기 전용, 주문 관리 시스템 접근
- **생성일**: 2025-01-04
- **상태**: 활성
- **Clerk 계정**: 생성 필요




## 권한 설명

### Super Admin 권한 (super_admin)
- 모든 회사 및 브랜드 대시보드 접근
- 사용자 관리 (생성, 수정, 삭제)
- 권한 관리 및 할당
- 시스템 설정 변경
- 감사 로그 조회
- 모든 데이터 접근 및 수정
- 브랜드 생성/삭제 권한

### Company Admin 권한 (company_admin)
- 회사 대시보드 전체 접근
- 모든 브랜드/매장 데이터 조회 및 관리
- 브랜드 관리 (생성 제외)
- 사용자 관리 (회사 내 사용자)
- 권한 할당 (제한적)
- 리포트 생성 및 조회

### Company General Admin 권한 (company_general_admin)
- 회사 대시보드 읽기 전용 접근
- 모든 브랜드/매장 데이터 조회 (수정 불가)
- 리포트 조회 및 데이터 분석
- 대시보드 및 차트 접근
- 데이터 내보내기 권한

### Brand Manager 권한 (brand_manager)
- 해당 브랜드 대시보드 전체 접근
- 브랜드 내 모든 매장 관리
- 브랜드 직원 관리
- 브랜드별 재고 및 매출 관리
- 브랜드 마케팅 및 프로모션 관리
- 브랜드 설정 변경

### Store Manager 권한 (store_manager)
- 해당 매장 대시보드 전체 접근
- 매장 직원 관리
- 매장 재고 관리
- 매장 매출 및 주문 관리
- POS 시스템 관리
- 매장 운영 관리

### Employee 권한 (employee)
- 해당 매장 대시보드 읽기 전용 접근
- POS 시스템 사용 권한
- 주문 관리 시스템 접근
- 기본적인 재고 조회
- 개인 근무 스케줄 조회

## 보안 정책

1. **비밀번호 정책**
   - 최소 8자 이상
   - 대소문자, 숫자, 특수문자 포함
   - 정기적 변경 권장 (90일)

2. **접근 제어**
   - 2FA 인증 권장
   - IP 화이트리스트 적용 가능
   - 세션 타임아웃: 8시간

3. **감사 추적**
   - 모든 관리자 활동 로깅
   - 권한 변경 이력 추적
   - 로그인/로그아웃 기록

## 테스트 시나리오

### 1. 로그인 테스트
- [ ] 정상 로그인 (모든 계정)
- [ ] 잘못된 비밀번호
- [ ] 존재하지 않는 계정
- [ ] 세션 만료 처리
- [ ] Clerk 인증 플로우 테스트

### 2. 권한별 접근 테스트

#### Super Admin (alex@culinaryseoul.com)
- [ ] 회사 대시보드 전체 접근
- [ ] 브랜드 대시보드 전체 접근
- [ ] 매장 대시보드 전체 접근
- [ ] 사용자 관리 기능
- [ ] 권한 할당 기능
- [ ] 시스템 설정 변경

#### Company Admin (company.admin@culinaryseoul.com)
- [ ] 회사 대시보드 접근
- [ ] 모든 브랜드 데이터 조회/관리
- [ ] 사용자 관리 (회사 내)
- [ ] 브랜드 관리 (생성 제외)
- [ ] 리포트 생성

#### Company General Admin (company.analyst@culinaryseoul.com)
- [ ] 회사 대시보드 읽기 전용
- [ ] 데이터 분석 기능
- [ ] 리포트 조회
- [ ] 수정 권한 차단 확인

#### Brand Manager (brand.millab@culinaryseoul.com)
- [ ] 밀라브 브랜드 대시보드 접근
- [ ] 밀라브 매장들 관리
- [ ] 다른 브랜드 접근 차단
- [ ] 브랜드 직원 관리
- [ ] 브랜드 설정 변경

#### Store Manager (store.gangnam@culinaryseoul.com)
- [ ] 강남점 매장 대시보드 접근
- [ ] 다른 매장 접근 차단
- [ ] 매장 직원 관리
- [ ] POS 시스템 관리
- [ ] 매장 재고 관리

#### Employee (staff.gangnam@culinaryseoul.com)
- [ ] 강남점 읽기 전용 접근
- [ ] POS 시스템 사용
- [ ] 관리 기능 접근 차단
- [ ] 개인 스케줄 조회

### 3. 보안 테스트
- [ ] SQL 인젝션 방지
- [ ] XSS 공격 방지
- [ ] CSRF 토큰 검증
- [ ] 권한 우회 시도 차단
- [ ] 세션 하이재킹 방지
- [ ] 브루트 포스 공격 방지

### 4. 데이터 스코프 테스트
- [ ] 회사 레벨 데이터 접근
- [ ] 브랜드별 데이터 필터링
- [ ] 매장별 데이터 격리
- [ ] 크로스 브랜드 접근 차단
- [ ] 크로스 매장 접근 차단

## Clerk 계정 생성 가이드

### 1. Clerk Dashboard 접근
- URL: https://dashboard.clerk.com/
- 프로젝트: CulinarySeoul
- 환경: Development

### 2. 계정 생성 순서
1. **alex@culinaryseoul.com** (✅ 완료)
   - 이미 생성된 슈퍼 관리자 계정
   - publicMetadata에 role: 'super_admin' 설정

2. **company.admin@culinaryseoul.com**
   - Users > Create user
   - Email: company.admin@culinaryseoul.com
   - Password: CompanyAdmin123!@
   - First name: 박영희
   - Last name: (운영이사)
   - publicMetadata: `{"role": "company_admin", "companyName": "컬리너리서울", "department": "운영"}`

3. **company.analyst@culinaryseoul.com**
   - publicMetadata: `{"role": "company_general_admin", "companyName": "컬리너리서울", "department": "데이터분석"}`

4. **brand.millab@culinaryseoul.com**
   - publicMetadata: `{"role": "brand_manager", "brandId": "millab", "brandName": "밀라브"}`

5. **brand.cafebene@culinaryseoul.com**
   - publicMetadata: `{"role": "brand_manager", "brandId": "cafebene", "brandName": "카페베네"}`

6. **store.gangnam@culinaryseoul.com**
   - publicMetadata: `{"role": "store_manager", "storeId": "gangnam", "storeName": "강남점", "brandId": "millab"}`

7. **store.hongdae@culinaryseoul.com**
   - publicMetadata: `{"role": "store_manager", "storeId": "hongdae", "storeName": "홍대점", "brandId": "cafebene"}`

8. **staff.gangnam@culinaryseoul.com**
   - publicMetadata: `{"role": "employee", "storeId": "gangnam", "storeName": "강남점", "brandId": "millab", "position": "바리스타"}`

9. **staff.hongdae@culinaryseoul.com**
   - publicMetadata: `{"role": "employee", "storeId": "hongdae", "storeName": "홍대점", "brandId": "cafebene", "position": "서빙"}`

### 3. 권한 동기화
- 각 계정 생성 후 Supabase users 테이블에 자동 동기화
- ClerkAuthContext의 syncClerkUserProfileToSupabase 함수 실행
- 권한 정보는 publicMetadata에서 추출하여 설정

## 주의사항

⚠️ **보안 주의사항**
- 이 계정들은 테스트 목적으로만 사용
- 프로덕션 환경에서는 별도의 보안 정책 적용
- 비밀번호는 정기적으로 변경
- 불필요한 권한은 즉시 회수
- Clerk publicMetadata는 클라이언트에서 읽기 가능하므로 민감한 정보 저장 금지

⚠️ **개발 환경 주의사항**
- Development 환경에서만 테스트 계정 사용
- Production 환경에는 실제 사용자 계정만 생성
- 테스트 완료 후 불필요한 계정은 삭제

## 업데이트 이력

- 2025-01-27: 초기 슈퍼 관리자 계정 생성 (김광일)
- 2025-01-04: 권한별 테스트 계정 8개 추가 및 Clerk 통합 가이드 작성
- 2025-01-04: 테스트 시나리오 확장 및 데이터 스코프 테스트 추가- 2025-01-04: Clerk API를 통한 테스트 계정 9개 생성 완료 (자동화 스크립트 포함)
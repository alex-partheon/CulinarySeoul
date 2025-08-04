# 테스트 계정 로그인 및 권한 검증 가이드

## 테스트 계정 목록

### 1. 김광일 (대표이사) - Super Admin
- **이메일**: alex@culinaryseoul.com
- **비밀번호**: rlarhkdlf3!@
- **역할**: super_admin
- **예상 접근 권한**: 모든 시스템 접근 및 관리 권한
- **테스트 URL**: http://localhost:3000/sign-in

### 2. 박영희 (운영이사) - Company Admin
- **이메일**: company.admin@culinaryseoul.com
- **비밀번호**: CompanyAdmin123!@
- **역할**: company_admin
- **예상 접근 권한**: 회사 전체 데이터 접근, 브랜드/매장 관리

### 3. 이민수 (데이터분석가) - Company General Admin
- **이메일**: company.analyst@culinaryseoul.com
- **비밀번호**: CompanyAnalyst123!@
- **역할**: company_general_admin
- **예상 접근 권한**: 회사 전체 데이터 조회, 분석 도구 접근

### 4. 최수진 (밀라브 브랜드매니저) - Brand Manager
- **이메일**: brand.millab@culinaryseoul.com
- **비밀번호**: BrandMillab123!@
- **역할**: brand_manager
- **브랜드**: 밀라브 (millab)
- **예상 접근 권한**: 밀라브 브랜드 데이터만 접근

### 5. 정현우 (카페베네 브랜드매니저) - Brand Manager
- **이메일**: brand.cafebene@culinaryseoul.com
- **비밀번호**: BrandCafebene123!@
- **역할**: brand_manager
- **브랜드**: 카페베네 (cafebene)
- **예상 접근 권한**: 카페베네 브랜드 데이터만 접근

### 6. 김지영 (강남점 매니저) - Store Manager
- **이메일**: store.gangnam@culinaryseoul.com
- **비밀번호**: StoreGangnam123!@
- **역할**: store_manager
- **매장**: 강남점 (밀라브)
- **예상 접근 권한**: 강남점 데이터만 접근

### 7. 이상호 (홍대점 매니저) - Store Manager
- **이메일**: store.hongdae@culinaryseoul.com
- **비밀번호**: StoreHongdae123!@
- **역할**: store_manager
- **매장**: 홍대점 (카페베네)
- **예상 접근 권한**: 홍대점 데이터만 접근

### 8. 박민지 (강남점 바리스타) - Employee
- **이메일**: staff.gangnam@culinaryseoul.com
- **비밀번호**: StaffGangnam123!@
- **역할**: employee
- **매장**: 강남점 (밀라브)
- **예상 접근 권한**: 강남점 기본 기능만 접근

### 9. 조은별 (홍대점 서빙) - Employee
- **이메일**: staff.hongdae@culinaryseoul.com
- **비밀번호**: StaffHongdae123!@
- **역할**: employee
- **매장**: 홍대점 (카페베네)
- **예상 접근 권한**: 홍대점 기본 기능만 접근

## 테스트 시나리오

### 1. 로그인 테스트
- [ ] 각 계정으로 http://localhost:3000/sign-in 에서 로그인 성공 확인
- [ ] 로그인 후 대시보드 접근 확인
- [ ] 사용자 정보 표시 확인

### 2. 권한 검증 테스트
- [ ] Super Admin: 모든 메뉴 접근 가능
- [ ] Company Admin: 회사 전체 데이터 접근 가능
- [ ] Brand Manager: 해당 브랜드 데이터만 접근 가능
- [ ] Store Manager: 해당 매장 데이터만 접근 가능
- [ ] Employee: 기본 기능만 접근 가능

### 3. 데이터 스코프 테스트
- [ ] 브랜드별 데이터 격리 확인
- [ ] 매장별 데이터 격리 확인
- [ ] 권한 없는 데이터 접근 차단 확인

### 4. 보안 테스트
- [ ] URL 직접 접근 시 권한 검증
- [ ] API 엔드포인트 권한 검증
- [ ] 권한 우회 시도 차단 확인

## 테스트 결과 기록

### 로그인 테스트 결과
- [ ] 김광일 (alex@culinaryseoul.com)
- [ ] 박영희 (company.admin@culinaryseoul.com)
- [ ] 이민수 (company.analyst@culinaryseoul.com)
- [ ] 최수진 (brand.millab@culinaryseoul.com)
- [ ] 정현우 (brand.cafebene@culinaryseoul.com)
- [ ] 김지영 (store.gangnam@culinaryseoul.com)
- [ ] 이상호 (store.hongdae@culinaryseoul.com)
- [ ] 박민지 (staff.gangnam@culinaryseoul.com)
- [ ] 조은별 (staff.hongdae@culinaryseoul.com)

### 권한 검증 결과
- [ ] Super Admin 권한 확인
- [ ] Company Admin 권한 확인
- [ ] Brand Manager 권한 확인
- [ ] Store Manager 권한 확인
- [ ] Employee 권한 확인

### 데이터 스코프 결과
- [ ] 브랜드별 데이터 격리
- [ ] 매장별 데이터 격리

### 보안 테스트 결과
- [ ] 권한 우회 차단
- [ ] URL 직접 접근 차단
- [ ] API 권한 검증
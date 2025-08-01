# company@test.com 테스트 계정 수동 생성 가이드

## 🎯 목적
모든 페이지(`/company`, `/brand`, `/store`)에 대한 전체 권한을 가진 테스트 계정을 생성합니다.

## ✅ 완료된 설정
- ✅ 환경변수에 `company@test.com`이 슈퍼 관리자로 추가됨
- ✅ AuthContext에서 여러 슈퍼 관리자 이메일 지원 구현
- ✅ PermissionService에서 여러 슈퍼 관리자 이메일 지원 구현
- ✅ 슈퍼 관리자 바이패스 시스템 활성화됨

## 📋 계정 정보
- **이메일**: `company@test.com`
- **비밀번호**: `Test123!@#`
- **사용자명**: `company-test`
- **이름**: `테스트 관리자`
- **역할**: `super_admin`

## 🔧 Supabase 대시보드에서 계정 생성 방법

### 1단계: Supabase 대시보드 접속
1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. CulinarySeoul 프로젝트 선택

### 2단계: Authentication에서 사용자 생성
1. 좌측 메뉴에서 **Authentication** 클릭
2. **Users** 탭 선택
3. **Add user** 버튼 클릭
4. 다음 정보 입력:
   - **Email**: `company@test.com`
   - **Password**: `Test123!@#`
   - **Auto Confirm User**: ✅ (체크)
   - **Send invite email**: ❌ (체크 해제)
5. **Create user** 버튼 클릭

### 3단계: 사용자 메타데이터 설정 (선택사항)
생성된 사용자를 클릭하여 상세 페이지로 이동한 후:
1. **User metadata** 섹션에서 **Edit** 클릭
2. 다음 JSON 추가:
```json
{
  "first_name": "테스트",
  "last_name": "관리자",
  "role": "super_admin"
}
```
3. **Save** 클릭

## 🚀 테스트 방법

### 1. 개발 서버 시작
```bash
npm run dev
```

### 2. 로그인 테스트
1. http://localhost:5176/login으로 이동
2. 계정 정보로 로그인:
   - 이메일: `company@test.com`
   - 비밀번호: `Test123!@#`

### 3. 권한 테스트
로그인 후 다음 기능들이 모두 작동하는지 확인:

#### ✅ Company Dashboard 테스트
- [x] `/company/dashboard` - 회사 대시보드
- [x] `/company/brands` - 브랜드 관리
- [x] `/company/stores` - 매장 관리
- [x] `/company/inventory/*` - 재고 관리 모든 페이지
- [x] `/company/sales` - 매출 관리
- [x] 데이터 스코프 선택기 작동 (전체/특정브랜드/특정매장)

#### ✅ Brand Dashboard 테스트
- [x] `/brand/dashboard` - 브랜드 대시보드
- [x] `/brand/stores` - 매장 관리
- [x] `/brand/inventory/*` - 재고 관리 모든 페이지
- [x] `/brand/sales` - 매출 관리
- [x] 브랜드 매장 선택기 작동

#### ✅ Store Dashboard 테스트
- [x] `/store/dashboard` - 매장 대시보드
- [x] `/store/inventory/*` - 재고 관리 모든 페이지
- [x] `/store/sales` - 매출 관리
- [x] `/store/pos` - POS 관리
- [x] 부서별 필터링 작동 (주방/홀/배달)

## 🔍 권한 확인 방법

### 브라우저 개발자 도구에서 확인
1. F12로 개발자 도구 열기
2. Console 탭에서 다음 명령어 실행:
```javascript
// 현재 사용자 정보 확인
console.log('현재 사용자:', window.localStorage.getItem('sb-iduamiwrgnutulqmcpca-auth-token'));

// AuthContext 상태 확인 (React DevTools 필요)
// 또는 네트워크 탭에서 Supabase API 호출 확인
```

### 로그 확인
브라우저 콘솔에서 다음과 같은 로그를 확인:
```
[AuthContext] Super admin detected, creating bypass user profile
[PermissionService] Super admin bypass activated for: company@test.com
```

## 🎉 성공 기준
- ✅ 로그인 성공
- ✅ 모든 대시보드(`/company`, `/brand`, `/store`) 접근 가능
- ✅ 모든 메뉴 항목 표시됨
- ✅ 데이터 스코프 선택기 정상 작동
- ✅ 404 에러 없이 모든 페이지 접근
- ✅ 슈퍼 관리자 바이패스 로그 확인

## ❗ 문제 해결

### 로그인 실패 시
1. Supabase 대시보드에서 사용자가 생성되었는지 확인
2. 사용자가 **confirmed** 상태인지 확인
3. 비밀번호가 정확한지 확인

### 권한 오류 시
1. 환경변수 설정 확인:
   ```bash
   echo $VITE_SUPER_ADMIN_EMAIL
   # 출력: alex@culinaryseoul.com,company@test.com
   ```
2. 개발 서버 재시작
3. 브라우저 캐시 및 로컬스토리지 삭제

### 페이지 접근 오류 시
1. 네트워크 탭에서 API 호출 상태 확인
2. RLS 정책으로 인한 차단이 아닌지 확인
3. 슈퍼 관리자 바이패스 로그 확인

## 📞 지원
문제가 발생하면 다음을 확인해주세요:
1. 개발 서버가 http://localhost:5176에서 실행 중인지
2. .env.local 파일의 환경변수 설정
3. Supabase 프로젝트 연결 상태
4. 브라우저 콘솔의 에러 메시지
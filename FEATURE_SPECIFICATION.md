# 중대재해 관리 시스템 기능 정의서

## 📋 문서 정보
- **프로젝트명**: 중대재해 관리 시스템 (Critical Disaster Management System)
- **작성일**: 2026-01-30
- **버전**: 1.0
- **기술 스택**: Hono + TypeScript + Cloudflare Pages
- **GitHub**: https://github.com/jjjjnate-dotcom/anjen-bogeon-dashboard

---

## 🎯 시스템 개요

### 목적
중대재해처벌법에 따른 사업장 안전보건 관리 의무 이행을 효율적으로 관리하고 모니터링하기 위한 통합 관리 시스템

### 주요 목표
- 본사-교육원-사업장 간 3단계 관리 체계 구축
- 안전보건 의무 이행 현황 실시간 모니터링
- 이행조치 등록 및 승인 프로세스 자동화
- 통계 및 분석을 통한 의사결정 지원

---

## 👥 사용자 유형 및 권한

### 1. 교육원 관리자 (한국공동주택관리 교육원)
- **권한**: 최상위 관리자
- **접근 페이지**: `/admin` (한공원 대시보드)
- **주요 역할**:
  - 계약 사업장 모니터링 및 관리
  - 본사 및 사업장 현황 통합 조회
  - 시스템 사용 현황 분석
  - 사고사례 및 공지사항 관리

### 2. 본사 관리자
- **권한**: 본사 단위 관리자
- **접근 페이지**: `/headquarters` (본사 대시보드)
- **주요 역할**:
  - 소속 사업장 안전보건 이행 관리
  - 이행조치 승인 및 점검
  - 사업장별 통계 및 분석
  - 근로자 현황 관리

### 3. 사업장 담당자
- **권한**: 사업장 단위 실무자
- **접근 페이지**: `/site` (사업장 대시보드)
- **주요 역할**:
  - 안전보건 이행조치 등록
  - 교육 및 훈련 실시 기록
  - 위험성 평가 실시 및 등록
  - 사고사례 조회

---

## 🏗️ 시스템 구조

### 페이지 구성
```
/                      # 메인 랜딩 페이지
├── /login             # 로그인 페이지
├── /admin             # 한공원(교육원) 대시보드
├── /headquarters      # 본사 대시보드
└── /site              # 사업장 대시보드
```

### API 구조
```
/api/auth/login        # 로그인 인증
/api/admin/*          # 교육원 관리 API
/api/headquarters/*   # 본사 관리 API
/api/site/*           # 사업장 관리 API
```

---

## 📱 주요 기능 명세

## 1. 인증 및 권한 관리

### 1.1 로그인 (`/login`)
**기능 설명**: 사용자 인증 및 역할 기반 접근 제어

**화면 구성**:
- 이메일 입력 필드
- 비밀번호 입력 필드
- 로그인 버튼
- 아이디/비밀번호 찾기 링크

**API 엔드포인트**:
```
POST /api/auth/login
Request Body:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "success": boolean,
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "admin" | "headquarters" | "site",
    "organization": "string"
  }
}
```

**테스트 계정**:
- 교육원 관리자: `admin@education.com` / `password123`
- 본사 담당자: `hong@murim.com` / `password123`
- 사업장 담당자: `lee@murim.com` / `password123`

**처리 로직**:
1. 이메일/비밀번호 검증
2. JWT 토큰 발급
3. 사용자 역할에 따른 리다이렉션
   - `admin` → `/admin`
   - `headquarters` → `/headquarters`
   - `site` → `/site`

---

## 2. 교육원(한공원) 대시보드 (`/admin`)

### 2.1 계약 사업장 모니터링
**기능 설명**: 전체 계약 사업장의 안전보건 이행 현황을 실시간으로 모니터링

**화면 구성**:
- **상단 헤더**:
  - 본사명: 한국공동주택관리
  - 사업장코드: 교육원
  - 담당자명
  - 총 사업장 수 배지
  - 기간 선택 (2025년 상반기/하반기)

- **좌측 사이드바** (너비: 260px):
  - 사용자 정보 박스
  - 메뉴 항목:
    1. 계약 사업장 정보 관리
    2. 계약 사업장 직원 정보 관리
    3. 이용 관리
    4. 계정 및 권한 관리

- **메인 컨텐츠**:
  - **계약사업장 모니터링 테이블**:
    | 컬럼명 | 설명 |
    |--------|------|
    | NO | 순번 |
    | 계약 사업장 | 사업장명 |
    | 등록 근로자수 | 총 근로자 수 |
    | 안전/보건 투수 | 이행 완료 건수 |
    | 이용횟수 | 세부 이용 내역 |
    | - 안전/보건 투수 | 안전보건 이행 횟수 |
    | - 교육 투수 | 교육 실시 횟수 |
    | - 위험성평가 | 위험성평가 실시 횟수 |
    | - 종사/협의 청취 | 근로자 의견청취 횟수 |
    | - 안전보건관리규정 | 관리규정 등록/수정 횟수 |
    | - 신규채용 | 신규채용 교육 횟수 |
    | 상태 | 이용중/미사용 |

- **우측 패널** (너비: 320px):
  1. **계약 사업장 상시 근로자 등록 현황**:
     - 구역별/등록/승인 통계
     - 합계 표시
  
  2. **계약 사업장 구분 등록 현황**:
     - 직영사업장/도급협력사업장 통계

- **하단 섹션** (2단 그리드):
  1. **시스템 문의** (좌측):
     - 문의 내역 목록
     - M 배지 (긴급 표시)
     - 코드/내용/상태 표시
  
  2. **사업장 등록 현황** (우측):
     - 최근 등록/수정 내역
     - 계약사업장명/등록사업장명/등록일/상태

**API 엔드포인트**:
```
GET /api/admin/dashboard
Response:
{
  "totalSites": number,
  "period": "2025년 상반기",
  "sites": [
    {
      "id": string,
      "name": string,
      "workers": number,
      "safetyHealth": number,
      "usage": {
        "safetyHealth": number,
        "education": number,
        "riskAssessment": number,
        "consultation": number,
        "regulation": number,
        "newHire": number
      },
      "status": "이용중" | "미사용"
    }
  ],
  "workerStats": {
    "total": number,
    "registered": number,
    "approved": number
  },
  "siteTypeStats": {
    "direct": number,
    "contract": number
  },
  "systemInquiries": [...],
  "recentRegistrations": [...]
}
```

### 2.2 계약 사업장 관리
**기능 설명**: 계약 사업장 정보 등록, 수정, 삭제

**주요 기능**:
- 사업장 기본정보 등록
- 사업장 코드 자동 생성
- 본사-사업장 연결 관리
- 담당자 정보 관리
- 계약 기간 관리

**데이터 구조**:
```typescript
interface Site {
  id: string;
  code: string; // 사업장 코드 (예: S001)
  name: string; // 사업장명
  headquarters: string; // 소속 본사
  address: string;
  phone: string;
  manager: {
    name: string;
    email: string;
    phone: string;
  };
  contract: {
    startDate: Date;
    endDate: Date;
  };
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.3 직원 정보 관리
**기능 설명**: 계약 사업장 직원 정보 통합 관리

**주요 기능**:
- 직원 등록/수정/삭제
- 사업장별 근로자 배치
- 직영/도급/협력 구분 관리
- 직원 현황 통계

### 2.4 이용 관리
**기능 설명**: 시스템 이용 현황 모니터링

**주요 기능**:
- 사업장별 로그인 이력
- 기능별 사용 통계
- 이행조치 등록 현황
- 월별/분기별 이용 분석

---

## 3. 본사 대시보드 (`/headquarters`)

### 3.1 안전보건 이행 관리
**기능 설명**: 소속 사업장의 안전보건 의무 이행 현황을 종합 관리

**화면 구성**:
- **상단 탭** (5개, max-width: 1300px):
  1. 이행 요청 등록 관리
  2. 사업장 안전보건이행 점검관리
  3. 종합 안전보건관리 규정
  4. 위험성 평가
  5. 신규채용 정보등록

- **기간 선택기**:
  - 2025년 상반기/하반기 선택
  - 필터 보기 버튼

- **좌측 사이드바** (너비: 260px):
  - 본사 정보 박스
  - 메뉴 항목:
    1. 사업장 정보 관리
    2. 사업장 관리
    3. 사업장 등록
    4. 직원 정보 관리
    5. 직원 관리
    6. 직원 등록
    7. 이용 관리
    8. 사고사례 관리
    9. 안전보건조치 관리
    10. 공지 관리
    11. 문자 발송
    12. 계정 및 권한 관리
    13. 관리자 계정관리
    14. 권한 관리

- **메인 컨텐츠**:
  - **이행관리 차트 섹션** (차트 라벨: 150px, 보기 버튼: 70px):
    1. 안전/보건 이행관리
    2. 교육/훈련 이행관리
    3. 위험성평가 이행관리
    4. 종사자의견청취 이행관리
    5. 안전보건관리규정 이행관리
    6. 신규채용교육 이행관리
    7. 산업재해 현황관리
    
    각 차트 구성:
    - 파란색: 완료 (%)
    - 빨간색: 미완료 (%)
    - 검은색: 등록안됨 (%)
    - 보기 버튼 (상세 조회)

- **우측 패널** (너비: 250px):
  1. **사업장 상시 근로자 현황**:
     - 구역: 전0
     - 근무인원: 51
     - 직영인원: 1,500
     - 도급/협력인원: 6,000
  
  2. **사업장 구분 현황**:
     - 구역: 전0
     - 직영사업장: 120
     - 도급/협력 사업장: 380

- **하단 테이블** (max-width: 1300px):
  - **사업장 정보 변동/요청 현황**:
    | NO | 사업장 | 등록일 | 구분 | 종류 |
    |----|--------|--------|------|------|
    | 1  | 0000 아파트 | 2025.01.01 | 안전보건관리규정 | 변경 완료 |
    | ... | ... | ... | ... | ... |

- **알림 카드** (3개, 전체 너비 활용):
  1. 사고사례 전파
  2. 안전보건자료
  3. 공지사항

**API 엔드포인트**:
```
GET /api/headquarters/dashboard
Query Parameters:
- period: "2025-h1" | "2025-h2"

Response:
{
  "headquarters": {
    "name": string,
    "code": string,
    "manager": string
  },
  "compliance": [
    {
      "category": "안전/보건 이행관리",
      "completed": number, // %
      "incomplete": number, // %
      "notRegistered": number // %
    },
    ...
  ],
  "workerStats": {
    "zone": "전0",
    "working": 51,
    "direct": 1500,
    "contract": 6000
  },
  "siteStats": {
    "zone": "전0",
    "direct": 120,
    "contract": 380
  },
  "changeRequests": [...],
  "notifications": {
    "accidents": [...],
    "materials": [...],
    "announcements": [...]
  }
}
```

### 3.2 이행조치 승인 관리
**기능 설명**: 사업장에서 등록한 이행조치 내역을 검토하고 승인

**주요 기능**:
- 이행조치 목록 조회
- 이행조치 상세 내용 확인
- 첨부 파일 다운로드
- 승인/반려 처리
- 반려 시 사유 작성

**데이터 구조**:
```typescript
interface ComplianceAction {
  id: string;
  siteId: string;
  siteName: string;
  category: "safety" | "education" | "risk" | "consultation" | "regulation" | "newHire";
  title: string;
  content: string;
  files: {
    id: string;
    name: string;
    url: string;
    size: number;
  }[];
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectionReason?: string;
}
```

### 3.3 사업장 정보 관리
**기능 설명**: 소속 사업장 정보 등록 및 수정

**주요 기능**:
- 사업장 등록
- 사업장 정보 수정
- 사업장 삭제
- 사업장 현황 조회

### 3.4 직원 관리
**기능 설명**: 소속 사업장 직원 정보 관리

**주요 기능**:
- 직원 등록
- 직원 정보 수정
- 사업장 배치
- 직원 현황 통계

### 3.5 사고사례 관리
**기능 설명**: 산업재해 및 사고사례 등록 및 공유

**주요 기능**:
- 사고사례 등록
- 사고 유형 분류
- 재발방지 대책 작성
- 사고사례 전파

---

## 4. 사업장 대시보드 (`/site`)

### 4.1 6개 이행조치 등록 박스
**기능 설명**: 중대재해처벌법 의무 이행 사항을 6개 박스로 구성하여 관리

**화면 구성**:
- **상단 헤더**:
  - 사업장명
  - 사업장코드
  - 담당자명
  - 기간 선택

- **좌측 사이드바** (너비: 260px):
  - 사업장 정보 박스
  - 메뉴 항목:
    1. 사업장 정보 관리
    2. 직원 정보 관리
    3. 이행조치 등록
    4. 이행조치 확인
    5. 사고사례 조회
    6. 공지사항

- **6개 등록 박스 그리드** (3열 2행, 전체 너비 활용):
  
  #### 박스 1: 안전보건관리 이행 등록
  - **상태**: 등록완료 / 미등록
  - **버튼**: 등록하기 (파란색) / 확인 (노란색)
  - **내용**: 조치사항 내용에 관한 데이터 작업
  
  #### 박스 2: 교육/훈련 이행 등록
  - **상태**: 등록완료 / 미등록
  - **버튼**: 등록하기 (파란색) / 확인 (노란색)
  - **내용**: 교육 실시 일자, 참석자, 교육 내용
  
  #### 박스 3: 위험성 평가 등록
  - **상태**: 등록완료 / 미등록
  - **버튼**: 등록하기 (파란색) / 확인 (노란색)
  - **내용**: 위험성 평가 결과 및 개선 조치
  
  #### 박스 4: 종사자 의견청취 등록
  - **상태**: 등록완료 / 미등록
  - **버튼**: 등록하기 (파란색) / 확인 (노란색)
  - **내용**: 안전보건에 관한 근로자 의견 청취 결과
  
  #### 박스 5: 안전보건관리규정 등록
  - **상태**: 등록완료 / 미등록
  - **버튼**: 등록하기 (파란색) / 확인 (노란색)
  - **내용**: 안전보건관리규정 파일 업로드
  
  #### 박스 6: 신규채용자 이행등록
  - **상태**: 등록완료 / 미등록
  - **버튼**: 등록하기 (파란색) / 확인 (노란색)
  - **내용**: 신규채용자 안전교육 실시 내역

- **하단 알림 섹션** (3열, 전체 너비 활용):
  1. 사고사례
  2. 안전보건자료
  3. 공지사항

**API 엔드포인트**:
```
GET /api/site/dashboard
Response:
{
  "site": {
    "name": string,
    "code": string,
    "manager": string
  },
  "registrations": [
    {
      "id": string,
      "category": "safety" | "education" | "risk" | "consultation" | "regulation" | "newHire",
      "title": string,
      "status": "completed" | "not_registered",
      "lastUpdated": Date
    }
  ],
  "notifications": {
    "accidents": [...],
    "materials": [...],
    "announcements": [...]
  }
}
```

### 4.2 이행조치 등록
**기능 설명**: 각 이행조치 항목별 상세 정보 및 파일 업로드

**화면 구성** (공통):
- 제목 입력
- 내용 입력 (에디터)
- 실시 일자 선택
- 참석자 입력
- 파일 첨부 (다중 업로드)
- 저장 버튼
- 본사 승인 요청 버튼

**파일 업로드**:
- 지원 형식: PDF, JPG, PNG, DOCX, XLSX
- 최대 파일 크기: 10MB per file
- 최대 파일 개수: 5개
- Cloudflare R2 Storage 사용

**API 엔드포인트**:
```
POST /api/site/compliance/create
Request Body:
{
  "category": string,
  "title": string,
  "content": string,
  "date": Date,
  "participants": string[],
  "files": File[]
}

Response:
{
  "success": boolean,
  "id": string,
  "message": string
}

POST /api/site/compliance/submit-approval
Request Body:
{
  "id": string
}

Response:
{
  "success": boolean,
  "message": "승인 요청이 전송되었습니다."
}
```

### 4.3 이행조치 확인
**기능 설명**: 등록한 이행조치 목록 조회 및 승인 상태 확인

**화면 구성**:
- 필터:
  - 카테고리별 필터
  - 상태별 필터 (대기중/승인/반려)
  - 기간 필터

- 목록 테이블:
  | NO | 카테고리 | 제목 | 등록일 | 승인상태 | 보기 |
  |----|----------|------|--------|----------|------|
  | 1  | 안전보건관리 | ... | 2025.01.15 | 승인 | 버튼 |

- 상세 모달:
  - 제목/내용 표시
  - 첨부파일 다운로드
  - 승인/반려 상태
  - 반려 사유 (반려 시)

### 4.4 통계 및 분석
**기능 설명**: 사업장별 이행 현황 통계

**주요 지표**:
- 월별 이행률
- 카테고리별 이행 현황
- 승인/반려 통계
- 연간 이행 추이

---

## 5. 공통 기능

### 5.1 알림 시스템
**기능 설명**: 중요 이벤트 발생 시 실시간 알림

**알림 유형**:
- 이행조치 승인/반려
- 신규 공지사항
- 사고사례 등록
- 시스템 점검 안내

### 5.2 파일 관리
**기능 설명**: Cloudflare R2를 이용한 파일 업로드/다운로드

**주요 기능**:
- 파일 업로드
- 파일 다운로드
- 파일 미리보기 (이미지/PDF)
- 파일 삭제

**API 엔드포인트**:
```
POST /api/files/upload
Request: multipart/form-data

Response:
{
  "success": boolean,
  "file": {
    "id": string,
    "name": string,
    "url": string,
    "size": number
  }
}

GET /api/files/download/:fileId
Response: File stream
```

### 5.3 검색 기능
**기능 설명**: 전체 데이터 통합 검색

**검색 대상**:
- 사업장명
- 이행조치 제목/내용
- 사고사례
- 공지사항

---

## 📊 데이터베이스 스키마

### Users (사용자)
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT CHECK(role IN ('admin', 'headquarters', 'site')) NOT NULL,
  organization_id TEXT,
  status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Organizations (조직 - 본사/사업장)
```sql
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('headquarters', 'site')) NOT NULL,
  parent_id TEXT, -- 본사 ID (사업장인 경우)
  address TEXT,
  phone TEXT,
  manager_name TEXT,
  manager_email TEXT,
  manager_phone TEXT,
  contract_start_date DATE,
  contract_end_date DATE,
  status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES organizations(id)
);

CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organizations_parent ON organizations(parent_id);
```

### Workers (근로자)
```sql
CREATE TABLE workers (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  employment_type TEXT CHECK(employment_type IN ('direct', 'contract', 'partner')),
  hire_date DATE,
  phone TEXT,
  email TEXT,
  status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_workers_org ON workers(organization_id);
CREATE INDEX idx_workers_type ON workers(employment_type);
```

### Compliance_Actions (이행조치)
```sql
CREATE TABLE compliance_actions (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  category TEXT CHECK(category IN ('safety', 'education', 'risk', 'consultation', 'regulation', 'newHire')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  action_date DATE,
  participants TEXT, -- JSON array
  status TEXT CHECK(status IN ('draft', 'submitted', 'approved', 'rejected')) DEFAULT 'draft',
  submitted_at DATETIME,
  submitted_by TEXT,
  approved_at DATETIME,
  approved_by TEXT,
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES organizations(id),
  FOREIGN KEY (submitted_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE INDEX idx_compliance_site ON compliance_actions(site_id);
CREATE INDEX idx_compliance_category ON compliance_actions(category);
CREATE INDEX idx_compliance_status ON compliance_actions(status);
```

### Files (첨부파일)
```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  reference_type TEXT CHECK(reference_type IN ('compliance', 'accident', 'notice')) NOT NULL,
  reference_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  storage_path TEXT NOT NULL, -- R2 Storage path
  uploaded_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE INDEX idx_files_reference ON files(reference_type, reference_id);
```

### Accidents (사고사례)
```sql
CREATE TABLE accidents (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  accident_date DATE NOT NULL,
  accident_type TEXT,
  severity TEXT CHECK(severity IN ('minor', 'major', 'critical')),
  casualties INTEGER DEFAULT 0,
  prevention_measures TEXT,
  status TEXT CHECK(status IN ('reported', 'investigating', 'closed')) DEFAULT 'reported',
  reported_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES organizations(id),
  FOREIGN KEY (reported_by) REFERENCES users(id)
);

CREATE INDEX idx_accidents_site ON accidents(site_id);
CREATE INDEX idx_accidents_date ON accidents(accident_date);
```

### Notices (공지사항)
```sql
CREATE TABLE notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_type TEXT CHECK(target_type IN ('all', 'headquarters', 'site')),
  target_id TEXT, -- NULL이면 전체
  priority TEXT CHECK(priority IN ('normal', 'important', 'urgent')) DEFAULT 'normal',
  published_at DATETIME,
  expires_at DATETIME,
  views INTEGER DEFAULT 0,
  author_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE INDEX idx_notices_target ON notices(target_type, target_id);
CREATE INDEX idx_notices_published ON notices(published_at);
```

### System_Logs (시스템 로그)
```sql
CREATE TABLE system_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  details TEXT, -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_logs_user ON system_logs(user_id);
CREATE INDEX idx_logs_action ON system_logs(action);
CREATE INDEX idx_logs_created ON system_logs(created_at);
```

---

## 🔒 보안 요구사항

### 인증
- JWT 기반 토큰 인증
- 토큰 만료 시간: 8시간
- Refresh Token: 30일

### 권한
- 역할 기반 접근 제어 (RBAC)
- 페이지별 권한 검증
- API 엔드포인트별 권한 검증

### 데이터 보호
- 비밀번호 bcrypt 해싱
- HTTPS 통신 (Cloudflare)
- SQL Injection 방지
- XSS 방지

---

## 📈 성능 요구사항

### 응답 시간
- 페이지 로드: < 2초
- API 응답: < 500ms
- 파일 업로드: < 5초 (10MB 기준)

### 동시 사용자
- 최대 동시 접속: 100명
- 데이터베이스 연결: 10개 pool

### 파일 처리
- 최대 파일 크기: 10MB
- 최대 동시 업로드: 5개
- 지원 형식: PDF, JPG, PNG, DOCX, XLSX

---

## 🚀 배포 환경

### 플랫폼
- **서비스**: Cloudflare Pages
- **런타임**: Cloudflare Workers
- **데이터베이스**: Cloudflare D1 (SQLite)
- **스토리지**: Cloudflare R2

### 환경 변수
```bash
# JWT
JWT_SECRET=your-secret-key

# Database
D1_DATABASE=webapp-production

# R2 Storage
R2_BUCKET=webapp-files
R2_PUBLIC_URL=https://files.your-domain.com

# Email (선택)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
```

---

## 📝 개발 우선순위

### Phase 1: 필수 기능 (현재 완료)
- ✅ 로그인 페이지
- ✅ 교육원 대시보드 UI
- ✅ 본사 대시보드 UI
- ✅ 사업장 대시보드 UI
- ✅ 레이아웃 및 스타일링

### Phase 2: 데이터 연동 (진행 예정)
- ⏳ Cloudflare D1 데이터베이스 설정
- ⏳ 테이블 마이그레이션
- ⏳ API 엔드포인트 구현
- ⏳ 실제 데이터 연동

### Phase 3: 이행조치 등록 (진행 예정)
- ⏳ 이행조치 등록 화면
- ⏳ Cloudflare R2 파일 업로드
- ⏳ 이행조치 상세 화면
- ⏳ 승인/반려 기능

### Phase 4: 추가 기능 (진행 예정)
- ⏳ 사고사례 관리
- ⏳ 공지사항 관리
- ⏳ 통계 및 리포트
- ⏳ 알림 시스템

### Phase 5: 배포 (진행 예정)
- ⏳ Cloudflare Pages 배포
- ⏳ 도메인 연결
- ⏳ SSL 인증서 설정
- ⏳ 성능 최적화

---

## 📞 문의 및 지원

### GitHub Repository
- https://github.com/jjjjnate-dotcom/anjen-bogeon-dashboard

### 데모 사이트
- https://3000-itc876uk7sg4b9txgvs7l-c81df28e.sandbox.novita.ai

### 페이지 접근
- 메인: `/`
- 로그인: `/login`
- 교육원: `/admin`
- 본사: `/headquarters`
- 사업장: `/site`

---

## 📋 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 1.0 | 2026-01-30 | 초안 작성 | System |

---

**문서 끝**

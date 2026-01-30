# 중대재해 관리 시스템 기능 정의서

## 📋 문서 정보
- **프로젝트명**: 중대재해 관리 시스템 (안전보건 대시보드)
- **Repository**: anjen-bogeon-dashboard
- **GitHub**: https://github.com/jjjjnate-dotcom/anjen-bogeon-dashboard
- **작성일**: 2026-01-30
- **버전**: 1.0.0
- **상태**: 🚧 UI 구현 완료, 데이터 연동 진행 예정

---

## 🎯 시스템 개요

### 프로젝트 목적
중대재해처벌법 대응을 위한 **교육원-본사-사업장** 3계층 구조의 안전보건 관리 통합 시스템

### 핵심 목표
1. **계층별 권한 관리**: 교육원(관리자) → 본사 → 사업장 3단계 역할 구분
2. **이행조치 체계화**: 6개 필수 이행조치 항목의 등록-승인-모니터링 자동화
3. **실시간 모니터링**: 사업장별 안전보건 이행률 실시간 추적
4. **데이터 기반 의사결정**: 통계 차트 및 프로그레스바를 통한 현황 파악

### 기술 스택
```
Frontend: Hono JSX + Vanilla CSS
Backend: Hono (Cloudflare Workers)
Database: Cloudflare D1 (SQLite)
Storage: Cloudflare R2 (파일 업로드용, 구현 예정)
Deployment: Cloudflare Pages
```

---

## 🏗️ 시스템 아키텍처

### 계층 구조
```
┌─────────────────────────────────────────┐
│  교육원 (한공원) - 관리자               │
│  • 전체 계약사업장 모니터링              │
│  • 본사 및 사업장 통합 현황 조회         │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼───────┐   ┌───────▼───────┐
│   본사 A      │   │   본사 B      │
│  • 소속 사업장 │   │  • 소속 사업장 │
│    관리       │   │    관리       │
└───────┬───────┘   └───────┬───────┘
        │                   │
    ┌───┴───┐           ┌───┴───┐
    │       │           │       │
┌───▼──┐ ┌──▼───┐   ┌──▼───┐ ┌──▼───┐
│사업장1│ │사업장2│   │사업장3│ │사업장4│
│이행등록│ │이행등록│   │이행등록│ │이행등록│
└──────┘ └──────┘   └──────┘ └──────┘
```

### 페이지 구조
```
/                           # 메인 랜딩 페이지 (3개 대시보드 선택)
├── /admin                  # 교육원(한공원) 대시보드
├── /headquarters           # 본사 대시보드
├── /site                   # 사업장 대시보드
└── /login                  # 로그인 페이지 (구현 예정)
```

### API 구조 (구현 예정)
```
/api/auth/
├── POST /login            # 로그인
├── POST /logout           # 로그아웃
└── GET  /session          # 세션 확인

/api/admin/
├── GET  /dashboard        # 교육원 대시보드 데이터
├── GET  /sites            # 계약사업장 목록
└── GET  /statistics       # 통합 통계

/api/headquarters/
├── GET  /dashboard        # 본사 대시보드 데이터
├── GET  /compliance       # 이행관리 차트 데이터
└── POST /approval         # 이행조치 승인/반려

/api/site/
├── GET  /dashboard        # 사업장 대시보드 데이터
├── POST /compliance       # 이행조치 등록
└── GET  /compliance/:id   # 이행조치 상세
```

---

## 👥 사용자 권한 및 역할

### 1. 교육원 관리자 (Admin)
- **접근 페이지**: `/admin`
- **역할**: 시스템 최고 관리자, 전체 모니터링
- **권한**:
  - ✅ 모든 계약사업장 현황 조회
  - ✅ 본사 및 사업장 통계 확인
  - ✅ 이행조치 완료율 모니터링
  - ✅ 사업장 등록/수정/삭제
  - ✅ 시스템 문의 및 등록 현황 관리

### 2. 본사 담당자 (Headquarters)
- **접근 페이지**: `/headquarters`
- **역할**: 소속 사업장 관리 및 승인
- **권한**:
  - ✅ 소속 사업장 이행조치 모니터링
  - ✅ 이행조치 승인/반려 처리
  - ✅ 사업장 근로자 현황 관리
  - ✅ 사고사례 및 공지사항 등록
  - ✅ 통계 및 분석 조회

### 3. 사업장 담당자 (Site)
- **접근 페이지**: `/site`
- **역할**: 이행조치 등록 및 관리
- **권한**:
  - ✅ 6개 이행조치 항목 등록
  - ✅ 첨부파일 업로드 (구현 예정)
  - ✅ 이행조치 상태 확인
  - ✅ 사고사례 및 공지사항 조회

---

## 📱 페이지별 상세 기능

## 1. 메인 랜딩 페이지 (`/`)

### 기능 설명
3가지 권한별 대시보드를 선택할 수 있는 진입 페이지

### UI 구성
```
┌─────────────────────────────────────────┐
│  중대재해 관리 시스템                    │
│  데모 버전 - 대시보드를 선택해주세요     │
├─────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │ 🏢  │  │ 🏗️  │  │ 🏘️  │          │
│  │한공원│  │ 본사 │  │사업장│          │
│  │      │  │      │  │      │          │
│  └──────┘  └──────┘  └──────┘          │
└─────────────────────────────────────────┘
```

### 화면 요소
1. **대시보드 선택 카드 (3개)**:
   - 한공원(교육원): 전체 사업장 모니터링
   - 본사: 소속 사업장 관리
   - 사업장: 이행조치 등록

2. **데모 안내 박스**:
   - 현재 구현 상태 안내
   - 로그인 없이 자유 탐색 가능

3. **구현 완료 기능 리스트**:
   - PPT 기반 UI 완벽 재현
   - 권한별 대시보드 분리
   - 데이터베이스 스키마 구축
   - 반응형 디자인

### 스타일
- 중앙 정렬 레이아웃
- 카드 기반 네비게이션
- 호버 효과 및 애니메이션

---

## 2. 교육원(한공원) 대시보드 (`/admin`)

### 기능 설명
전체 계약사업장의 이행조치 현황을 통합 모니터링하는 관리자 대시보드

### 화면 구성

#### 좌측 사이드바 (260px 고정)
```
┌──────────────────────┐
│ 본 사명: 한국공동주택관리 │
│ 사업장코드: 교육원        │
│ 담당: 홍길동             │
│ 최종접속일자: 2024-12-31 │
├──────────────────────┤
│ • 계약 사업장 정보 관리   │
│ • 계약 사업장 직원 정보   │
│ • 이용 관리              │
│ • 계정 및 권한 관리       │
└──────────────────────┘
```

#### 상단 헤더
- **좌측**: 본사명(노란색), 사업장코드, 담당자명
- **우측**: 
  - "총 사업장: 10개" 배지 (노란색)
  - "2025년 상반기" 배지 (네이비)

#### 메인 컨텐츠 영역

##### 1) 계약사업장 모니터링 테이블
| NO | 계약 사업장 | 등록 근로자수 | 안전/보건 투수 | 이용횟수 (6개 컬럼) | 상태 |
|----|------------|--------------|---------------|-------------------|------|
| 1  | 무림공동주택 | 100 | 완료 | 완료/완료/완료/완료/완료/완료 | 이용중 |
| 2  | 조은별공동주택 | 100 | - | -/-/-/-/-/- | 미사용 |
| ... | ... | ... | ... | ... | ... |

**이용횟수 세부 컬럼**:
1. 안전/보건 투수
2. 교육 투수
3. 위험성평가
4. 종사/협의 청취
5. 안전보건관리규정
6. 신규채용

#### 우측 패널 (320px 고정)

##### 1) 계약 사업장 상시 근로자 등록 현황
| 구역 | 등록 | 승인 |
|------|------|------|
| 전0  | 320  | -    |

##### 2) 계약 사업장 구분 등록 현황
| 구역 | 구분 | 등록 | 승인 |
|------|------|------|------|
| 전0  | 직영사업장 | 120 | - |
| 전0  | 도급/협력 | 380 | - |

#### 하단 섹션 (2단 그리드)

##### 좌측: 시스템 문의
| M | 코드 | 내용 | 상태 |
|---|------|------|------|
| M | 0000 아파트 | 당일 등록 요청 | 대기 |
| M | 0001 아파트 | 수정 완료 요청 | 완료 |
| M | 0002 아파트 | 사업자명 오류 | 확인 |
| M | 0003 아파트 | 계약 종료 | 종료 |

- **M 배지**: 긴급 문의 표시 (빨간색)

##### 우측: 사업장 등록 현황
| 계약사업장 명 | 등록사업장 명 | 등록일 | 상태 |
|--------------|--------------|--------|------|
| 무림 아파트 | 0000 아파트 | 2025.01.01 | 등록 완료 |
| 무림 아파트 | 0001 아파트 | 2025.01.02 | 변경 완료 |
| ... | ... | ... | ... |

### API 엔드포인트 (구현 예정)
```typescript
GET /api/admin/dashboard
Response: {
  totalSites: 10,
  period: "2025년 상반기",
  sites: [
    {
      id: "1",
      name: "무림공동주택",
      workers: 100,
      safetyHealth: "완료",
      usage: {
        safetyHealth: "완료",
        education: "완료",
        risk: "완료",
        consultation: "완료",
        regulation: "완료",
        newHire: "완료"
      },
      status: "이용중"
    },
    ...
  ],
  workerStats: {
    registered: 320,
    approved: 0
  },
  siteTypeStats: {
    direct: { registered: 120, approved: 0 },
    contract: { registered: 380, approved: 0 }
  },
  systemInquiries: [...],
  siteRegistrations: [...]
}
```

### 레이아웃 특징
- **좌우 분할**: 테이블(flex: 1) + 우측 패널(320px 고정)
- **간격**: 20px gap
- **하단 2단 그리드**: 시스템 문의 + 사업장 등록 현황

---

## 3. 본사 대시보드 (`/headquarters`)

### 기능 설명
소속 사업장의 안전보건 이행 현황을 관리하고 승인하는 본사 담당자 대시보드

### 화면 구성

#### 좌측 사이드바 (260px 고정)
```
┌──────────────────────┐
│ 본 사명: 문화휴양지      │
│ 사업장코드: 본사         │
│ 담당: 김철수            │
│ 최종접속일자: 2024-12-31│
├──────────────────────┤
│ • 사업장 정보 관리       │
│ • 사업장 관리           │
│ • 사업장 등록           │
│ • 직원 정보 관리        │
│ • 직원 관리             │
│ • 직원 등록             │
│ • 이용 관리             │
│ • 사고사례 관리         │
│ • 안전보건조치 관리     │
│ • 공지 관리             │
│ • 문자 발송             │
│ • 계정 및 권한 관리     │
│ • 관리자 계정관리       │
│ • 권한 관리             │
└──────────────────────┘
```

#### 상단 탭 (5개, max-width: 1300px)
```
┌────────┬────────┬────────┬────────┬────────┐
│ 이행요청│사업장안전│종합안전│위험성평│신규채용│
│등록관리│보건이행 │보건관리│가      │정보등록│
│        │점검관리 │규정    │        │        │
└────────┴────────┴────────┴────────┴────────┘
```
- **색상**: 핑크, 오렌지, 그린, 틸, 블루
- **크기**: 패딩 12px 16px, 폰트 13px, 최소너비 160px

#### 기간 선택기
```
2025년 상반기 ▼  [필터 보기]
```

#### 메인 컨텐츠: 이행관리 차트 섹션

##### 7개 이행관리 프로그레스 차트
각 차트 구성:
```
┌────────────────────────────────────────────────────────────┐
│ [라벨 150px] [━━━━━━━━━━━━━━━━━━━━━━━━━] [보기 70px]     │
│ 안전/보건      ████████████░░░░░░░░░░░░░░░        보기     │
│ 이행관리       40%    20%        30%                       │
└────────────────────────────────────────────────────────────┘
```

**7개 카테고리**:
1. **안전/보건 이행관리**: 파란색 40% / 빨간색 20% / 검정 30%
2. **교육/훈련 이행관리**: 파란색 35% / 빨간색 15% / 검정 40%
3. **위험성평가 이행관리**: 파란색 45% / 빨간색 10% / 검정 35%
4. **종사자의견청취 이행관리**: 파란색 30% / 빨간색 25% / 검정 25%
5. **안전보건관리규정 이행관리**: 파란색 50% / 빨간색 15% / 검정 25%
6. **신규채용교육 이행관리**: 파란색 40% / 빨간색 20% / 검정 30%
7. **산업재해 현황관리**: 파란색 35% / 빨간색 15% / 검정 40%

**색상 의미**:
- 🔵 파란색: 완료 (%)
- 🔴 빨간색: 미완료 (%)
- ⚫ 검정색: 등록안됨 (%)

#### 우측 패널 (250px 고정)

##### 1) 사업장 상시 근로자 현황
```
┌──────────────────┐
│ 구역: 전0         │
│ 근무인원: 51      │
│ 직영인원: 1,500   │
│ 도급/협력: 6,000  │
└──────────────────┘
```
- **배경**: 노란색 (#fef3c7)

##### 2) 사업장 구분 현황
```
┌──────────────────┐
│ 구역: 전0         │
│ 직영사업장: 120   │
│ 도급/협력: 380    │
└──────────────────┘
```
- **배경**: 노란색 (#fef3c7)

#### 하단 테이블 (max-width: 1300px)

##### 사업장 정보 변동/요청 현황
| NO | 사업장 | 등록일 | 구분 | 종류 |
|----|--------|--------|------|------|
| 1  | 0000 아파트 | 2025.01.01 | 안전보건관리규정 | 변경 완료 |
| 2  | 0001 아파트 | 2025.01.02 | 위험성평가 | 신규 등록 |
| 3  | 0002 아파트 | 2025.01.03 | 교육/훈련 | 수정 요청 |
| 4  | 0003 아파트 | 2025.01.04 | 신규채용 | 승인 완료 |

#### 하단 알림 카드 (3개)
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ 사고사례  │ │안전보건자료│ │ 공지사항  │
│ 전파      │ │          │ │          │
│ 5건       │ │ 12건     │ │ 8건      │
└──────────┘ └──────────┘ └──────────┘
```

### API 엔드포인트 (구현 예정)
```typescript
GET /api/headquarters/dashboard?period=2025-h1
Response: {
  headquarters: {
    name: "문화휴양지",
    code: "본사",
    manager: "김철수"
  },
  compliance: [
    {
      category: "안전/보건 이행관리",
      completed: 40,
      incomplete: 20,
      notRegistered: 30
    },
    ...
  ],
  workerStats: {
    zone: "전0",
    working: 51,
    direct: 1500,
    contract: 6000
  },
  siteStats: {
    zone: "전0",
    direct: 120,
    contract: 380
  },
  changeRequests: [...],
  notifications: {
    accidents: 5,
    materials: 12,
    announcements: 8
  }
}
```

### 레이아웃 특징
- **상단 탭**: 1300px 최대 너비, 5개 탭 버튼
- **좌우 분할**: 차트 영역(flex: 1) + 우측 패널(250px 고정)
- **차트 그리드**: 라벨 150px / 차트 바 flex: 1 / 보기 버튼 70px
- **간격**: 차트 행 간격 12px, 패딩 10px 0
- **하단 테이블**: 1300px 최대 너비, 패딩/폰트 확대

---

## 4. 사업장 대시보드 (`/site`)

### 기능 설명
사업장 담당자가 6개 이행조치 항목을 등록하고 관리하는 대시보드

### 화면 구성

#### 좌측 사이드바 (260px 고정)
```
┌──────────────────────┐
│ 사업장명: 무림 아파트  │
│ 사업장코드: S001      │
│ 담당: 이영희          │
│ 최종접속일자: 2025-01-30│
├──────────────────────┤
│ • 사업장 정보 관리     │
│ • 직원 정보 관리       │
│ • 이행조치 등록        │
│ • 이행조치 확인        │
│ • 사고사례 조회        │
│ • 공지사항            │
└──────────────────────┘
```

#### 상단 헤더
- **좌측**: 사업장명(노란색), 담당자명
- **우측**: "2025년 상반기" 선택

#### 메인 컨텐츠: 6개 등록 박스 그리드 (3열 2행, 전체 너비 활용)

##### 박스 레이아웃 구조
```
┌──────────────┬──────────────┬──────────────┐
│   박스 1     │   박스 2     │   박스 3     │
├──────────────┼──────────────┼──────────────┤
│   박스 4     │   박스 5     │   박스 6     │
└──────────────┴──────────────┴──────────────┘
```

##### 각 박스 공통 구조
```
┌──────────────────────────────────────┐
│ [카테고리명]                          │
│                                      │
│ 상태: [등록완료] / [미등록]           │
│                                      │
│ 조치사항 내용에 관한 데이터 작업      │
│                                      │
│ [등록하기] [확인]                     │
└──────────────────────────────────────┘
```

##### 6개 이행조치 박스 상세

**박스 1: 안전보건관리 이행 등록**
- **배경**: 녹색 (#8fbc8f)
- **상태**: 등록완료
- **버튼**: 
  - [등록하기] (파란색)
  - [확인] (노란색)

**박스 2: 교육/훈련 이행 등록**
- **배경**: 녹색 (#8fbc8f)
- **상태**: 등록완료
- **버튼**: 
  - [등록하기] (파란색)
  - [확인] (노란색)

**박스 3: 위험성 평가 등록**
- **배경**: 녹색 (#8fbc8f)
- **상태**: 미등록
- **버튼**: 
  - [등록하기] (파란색)
  - [확인] (노란색)

**박스 4: 종사자 의견청취 등록**
- **배경**: 녹색 (#8fbc8f)
- **상태**: 등록완료
- **버튼**: 
  - [등록하기] (파란색)
  - [확인] (노란색)

**박스 5: 안전보건관리규정 등록**
- **배경**: 녹색 (#8fbc8f)
- **상태**: 등록완료
- **버튼**: 
  - [등록하기] (파란색)
  - [확인] (노란색)

**박스 6: 신규채용자 이행등록**
- **배경**: 녹색 (#8fbc8f)
- **상태**: 미등록
- **버튼**: 
  - [등록하기] (파란색)
  - [확인] (노란색)

#### 하단 알림 섹션 (3열, 전체 너비 활용)

##### 1) 사고사례
```
┌──────────────────┐
│ 🔴 사고사례       │
│                  │
│ • 아파트 화재    │
│ • 추락 사고      │
│ • 협착 사고      │
└──────────────────┘
```

##### 2) 안전보건자료
```
┌──────────────────┐
│ 📄 안전보건자료   │
│                  │
│ • 안전 매뉴얼    │
│ • 작업 지침서    │
│ • 점검 체크리스트│
└──────────────────┘
```

##### 3) 공지사항
```
┌──────────────────┐
│ 📢 공지사항       │
│                  │
│ • 시스템 점검    │
│ • 신규 기능 안내 │
│ • 교육 일정      │
└──────────────────┘
```

### API 엔드포인트 (구현 예정)
```typescript
GET /api/site/dashboard
Response: {
  site: {
    name: "무림 아파트",
    code: "S001",
    manager: "이영희"
  },
  registrations: [
    {
      id: "1",
      category: "safety",
      title: "안전보건관리 이행 등록",
      status: "completed",
      lastUpdated: "2025-01-25"
    },
    {
      id: "2",
      category: "education",
      title: "교육/훈련 이행 등록",
      status: "completed",
      lastUpdated: "2025-01-26"
    },
    {
      id: "3",
      category: "risk",
      title: "위험성 평가 등록",
      status: "not_registered",
      lastUpdated: null
    },
    ...
  ],
  notifications: {
    accidents: [
      { id: "1", title: "아파트 화재", date: "2025-01-20" },
      ...
    ],
    materials: [
      { id: "1", title: "안전 매뉴얼", date: "2025-01-15" },
      ...
    ],
    announcements: [
      { id: "1", title: "시스템 점검", date: "2025-01-30" },
      ...
    ]
  }
}
```

### 레이아웃 특징
- **6박스 그리드**: `grid-template-columns: repeat(3, 1fr)`
- **간격**: 20px gap
- **전체 너비**: 100% (max-width 제한 없음)
- **박스 본문**: 180px 최소 높이, flex 세로 배치
- **하단 알림**: 3개 카드, 전체 너비 활용

---

## 📊 데이터베이스 설계

### 테이블 목록 (15개)
```sql
1. organizations          -- 조직 (교육원, 본사, 사업장)
2. users                  -- 사용자 계정
3. employees              -- 직원 정보
4. vendors                -- 협력업체
5. compliance_categories  -- 이행 카테고리 (6개)
6. compliance_items       -- 이행 항목
7. compliance_requests    -- 이행 요청
8. compliance_records     -- 이행 기록
9. education_records      -- 교육 기록
10. accident_cases        -- 사고사례
11. notices               -- 공지사항
12. attachments           -- 첨부파일
13. system_logs           -- 시스템 로그
14. statistics            -- 통계 데이터
15. permissions           -- 권한 관리
```

### 핵심 테이블 스키마

#### 1. organizations (조직)
```sql
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  parent_id TEXT,                          -- 상위 조직 ID
  type TEXT CHECK(type IN ('admin', 'headquarters', 'site')),
  code TEXT UNIQUE NOT NULL,               -- 조직 코드
  name TEXT NOT NULL,                      -- 조직명
  manager_name TEXT,                       -- 담당자명
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'active',            -- active/inactive
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES organizations(id)
);
```

#### 2. users (사용자)
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'headquarters', 'site')),
  phone TEXT,
  last_login DATETIME,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

#### 3. employees (직원)
```sql
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  position TEXT,                           -- 직위
  department TEXT,                         -- 부서
  employment_type TEXT CHECK(employment_type IN ('direct', 'contract')),
  hire_date DATE,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
```

#### 4. compliance_categories (이행 카테고리)
```sql
CREATE TABLE compliance_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,                      -- 카테고리명
  description TEXT,
  order_index INTEGER,                     -- 정렬 순서
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6개 카테고리 데이터
INSERT INTO compliance_categories (id, name, order_index) VALUES
  ('safety', '안전보건관리 이행', 1),
  ('education', '교육/훈련 이행', 2),
  ('risk', '위험성 평가', 3),
  ('consultation', '종사자 의견청취', 4),
  ('regulation', '안전보건관리규정', 5),
  ('newHire', '신규채용자 이행', 6);
```

#### 5. compliance_records (이행 기록)
```sql
CREATE TABLE compliance_records (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,                   -- 사업장 ID
  category_id TEXT NOT NULL,               -- 카테고리 ID
  title TEXT NOT NULL,
  content TEXT,
  action_date DATE,                        -- 실시 일자
  participants TEXT,                       -- 참석자 (JSON)
  status TEXT CHECK(status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_at DATETIME,
  submitted_by TEXT,
  approved_at DATETIME,
  approved_by TEXT,
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES organizations(id),
  FOREIGN KEY (category_id) REFERENCES compliance_categories(id),
  FOREIGN KEY (submitted_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

#### 6. attachments (첨부파일)
```sql
CREATE TABLE attachments (
  id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL,                 -- 이행기록 ID
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  storage_path TEXT NOT NULL,              -- R2 Storage 경로
  uploaded_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (record_id) REFERENCES compliance_records(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
```

#### 7. accident_cases (사고사례)
```sql
CREATE TABLE accident_cases (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  accident_date DATE NOT NULL,
  accident_type TEXT,                      -- 사고 유형
  severity TEXT CHECK(severity IN ('minor', 'major', 'critical')),
  casualties INTEGER DEFAULT 0,            -- 사상자 수
  prevention_measures TEXT,                -- 재발방지 대책
  status TEXT DEFAULT 'reported',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES organizations(id)
);
```

#### 8. notices (공지사항)
```sql
CREATE TABLE notices (
  id TEXT PRIMARY KEY,
  organization_id TEXT,                    -- NULL이면 전체 공지
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT CHECK(priority IN ('normal', 'important', 'urgent')),
  published_at DATETIME,
  expires_at DATETIME,
  views INTEGER DEFAULT 0,
  author_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 관계도
```
organizations (1) ──< (N) users
organizations (1) ──< (N) employees
organizations (1) ──< (N) compliance_records
compliance_categories (1) ──< (N) compliance_records
compliance_records (1) ──< (N) attachments
organizations (1) ──< (N) accident_cases
organizations (1) ──< (N) notices
```

---

## 🎨 디자인 시스템

### 색상 팔레트

#### 공통
- **헤더 배경**: #000000 (검정)
- **사이드바 배경**: #f7fafc (연한 회색)
- **사용자 정보 박스**: #4a5568 (다크 그레이)
- **텍스트 강조**: #ffd700 (노란색)

#### 본사 대시보드
- **탭 버튼**:
  - 핑크: #ed64a6
  - 오렌지: #ed8936
  - 그린: #48bb78
  - 틸: #38b2ac
  - 블루: #4299e1
- **정보 박스**: #fef3c7 (연한 노란색)
- **프로그레스 바**:
  - 완료(파란색): #3b82f6
  - 미완료(빨간색): #ef4444
  - 등록안됨(검정): #1a1a1a

#### 사업장 대시보드
- **메인 박스**: #8fbc8f (녹색)
- **등록하기 버튼**: #3b82f6 (파란색)
- **확인 버튼**: #fbbf24 (노란색)
- **알림 배지**: #dc2626 (빨간색)

### 타이포그래피
```css
/* 헤더 */
h1: font-size: 24px, font-weight: 700
h2: font-size: 20px, font-weight: 600
h3: font-size: 16px, font-weight: 700
h4: font-size: 14px, font-weight: 700

/* 본문 */
body: font-size: 14px, line-height: 1.6
small: font-size: 12px

/* 테이블 */
th: font-size: 13px-14px, font-weight: 600
td: font-size: 12px-13px
```

### 레이아웃 가이드
```css
/* 사이드바 */
width: 260px (고정)

/* 헤더 */
height: 50px (고정)

/* 간격 */
padding: 15px-20px
gap: 15px-20px
margin: 15px-20px

/* 테두리 */
border-radius: 6px-8px
border-width: 1px-2px

/* 그림자 */
box-shadow: 0 1px 3px rgba(0,0,0,0.1)
```

---

## 🚀 구현 현황

### ✅ 완료된 기능

#### UI/UX (100% 완료)
- ✅ 메인 랜딩 페이지
- ✅ 교육원(한공원) 대시보드 UI
- ✅ 본사 대시보드 UI
- ✅ 사업장 대시보드 UI
- ✅ 좌측 사이드바 (3개 페이지 통일)
- ✅ 반응형 레이아웃
- ✅ PPT 디자인 100% 재현
- ✅ 프로그레스 바 및 차트 구현
- ✅ 6개 등록 박스 그리드

#### 프로젝트 설정
- ✅ Hono 프레임워크 설정
- ✅ TypeScript 설정
- ✅ Vite 빌드 설정
- ✅ PM2 개발 서버 설정
- ✅ Wrangler 설정 (Cloudflare)
- ✅ Git 버전 관리
- ✅ GitHub Repository 연동

#### 데이터베이스
- ✅ 15개 테이블 스키마 설계
- ✅ 마이그레이션 파일 작성 (구현 예정)
- ✅ 시드 데이터 준비 (구현 예정)

### ⏳ 진행 예정 기능

#### Phase 1: 인증 및 권한 (우선순위 높음)
- ⏳ 로그인 페이지 UI
- ⏳ JWT 기반 인증 구현
- ⏳ 세션 관리
- ⏳ 권한별 라우팅 가드
- ⏳ 로그아웃 기능

#### Phase 2: 데이터 연동 (우선순위 높음)
- ⏳ Cloudflare D1 데이터베이스 생성
- ⏳ 마이그레이션 실행
- ⏳ 시드 데이터 삽입
- ⏳ API 엔드포인트 구현
  - `/api/admin/dashboard`
  - `/api/headquarters/dashboard`
  - `/api/site/dashboard`
- ⏳ 실제 데이터와 UI 연동

#### Phase 3: 이행조치 등록 (우선순위 높음)
- ⏳ 이행조치 등록 화면 구현
- ⏳ 폼 유효성 검증
- ⏳ Cloudflare R2 파일 업로드
- ⏳ 이행조치 제출 API
- ⏳ 이행조치 상세 보기
- ⏳ 이행조치 수정/삭제

#### Phase 4: 승인 프로세스 (우선순위 중간)
- ⏳ 이행조치 승인 화면 (본사)
- ⏳ 승인/반려 처리
- ⏳ 반려 사유 입력
- ⏳ 승인 상태 실시간 업데이트

#### Phase 5: 추가 기능 (우선순위 중간)
- ⏳ 사고사례 관리 화면
- ⏳ 공지사항 관리 화면
- ⏳ 사업장 등록 화면
- ⏳ 직원 관리 화면
- ⏳ 통계 및 리포트

#### Phase 6: 알림 시스템 (우선순위 낮음)
- ⏳ 실시간 알림 (폴링)
- ⏳ 이메일 발송
- ⏳ SMS 발송 (선택)

#### Phase 7: 배포 (마지막 단계)
- ⏳ Cloudflare Pages 배포
- ⏳ 프로덕션 D1 Database 설정
- ⏳ 환경변수 설정
- ⏳ 도메인 연결
- ⏳ SSL 인증서 설정

---

## 🔒 보안 요구사항

### 인증 및 권한
- JWT 기반 토큰 인증
- 토큰 만료 시간: 8시간
- Refresh Token: 30일
- 역할 기반 접근 제어 (RBAC)
- 페이지별 권한 검증

### 데이터 보호
- 비밀번호 bcrypt 해싱 (rounds: 10)
- HTTPS 통신 강제 (Cloudflare)
- SQL Injection 방지 (Prepared Statements)
- XSS 방지 (Input Sanitization)
- CSRF 토큰 검증

### 파일 업로드
- 허용 확장자 제한: PDF, JPG, PNG, DOCX, XLSX
- 파일 크기 제한: 10MB per file
- 파일명 검증 및 UUID 변환
- 바이러스 스캔 (선택)

---

## 📈 성능 요구사항

### 응답 시간
- 페이지 로드: < 2초
- API 응답: < 500ms
- 파일 업로드: < 5초 (10MB 기준)
- 데이터베이스 쿼리: < 100ms

### 동시 사용자
- 최대 동시 접속: 100명
- 데이터베이스 커넥션 풀: 10개

### 캐싱
- 정적 파일: Cloudflare CDN 캐싱
- API 응답: 5분 캐싱 (대시보드 통계)
- 브라우저 캐싱: 1시간

---

## 🛠️ 개발 환경

### 필수 요구사항
```
Node.js: >= 18.0.0
npm: >= 9.0.0
Git: >= 2.30.0
```

### 로컬 개발 설정
```bash
# 1. Repository 클론
git clone https://github.com/jjjjnate-dotcom/anjen-bogeon-dashboard.git
cd anjen-bogeon-dashboard

# 2. 의존성 설치
npm install

# 3. 데이터베이스 설정 (구현 예정)
npm run db:migrate:local
npm run db:seed

# 4. 빌드
npm run build

# 5. 개발 서버 시작
pm2 start ecosystem.config.cjs

# 6. 브라우저 접속
curl http://localhost:3000
```

### 유용한 명령어
```bash
# 개발 서버 관리
pm2 list                   # PM2 프로세스 목록
pm2 logs webapp --nostream # 로그 확인
pm2 restart webapp         # 서버 재시작
pm2 stop webapp            # 서버 중지
pm2 delete webapp          # PM2에서 제거

# 데이터베이스 (구현 예정)
npm run db:migrate:local   # 마이그레이션 실행
npm run db:seed            # 시드 데이터 삽입
npm run db:reset           # DB 초기화

# 빌드 및 배포
npm run build              # 프로덕션 빌드
npm run deploy             # Cloudflare Pages 배포 (구현 예정)

# 포트 관리
npm run clean-port         # 3000번 포트 정리
```

---

## 📁 프로젝트 구조

```
webapp/
├── src/
│   ├── index.tsx              # 메인 애플리케이션 (라우트)
│   └── renderer.tsx           # HTML 렌더러 (JSX → HTML)
├── public/
│   └── static/
│       └── style.css          # 전역 스타일시트 (2800+ 줄)
├── migrations/                # DB 마이그레이션 (구현 예정)
│   └── 0001_initial_schema.sql
├── dist/                      # 빌드 산출물
│   ├── _worker.js
│   └── _routes.json
├── .wrangler/                 # Wrangler 로컬 개발 데이터
│   └── state/v3/d1/           # 로컬 SQLite DB
├── .git/                      # Git 버전 관리
├── .gitignore
├── ecosystem.config.cjs       # PM2 설정
├── package.json               # 의존성 및 스크립트
├── tsconfig.json              # TypeScript 설정
├── vite.config.ts             # Vite 빌드 설정
├── wrangler.jsonc             # Cloudflare 설정
├── README.md                  # 프로젝트 README
└── FEATURE_SPECIFICATION.md   # 이 문서
```

---

## 📄 API 명세 (구현 예정)

### 인증 API
```typescript
// 로그인
POST /api/auth/login
Request: { email: string, password: string }
Response: { 
  success: boolean,
  token: string,
  user: { id, name, role, organization }
}

// 로그아웃
POST /api/auth/logout
Headers: Authorization: Bearer {token}
Response: { success: boolean }

// 세션 확인
GET /api/auth/session
Headers: Authorization: Bearer {token}
Response: { user: {...} }
```

### 교육원(Admin) API
```typescript
// 대시보드 데이터
GET /api/admin/dashboard?period=2025-h1
Headers: Authorization: Bearer {token}
Response: {
  totalSites: number,
  sites: Array<Site>,
  workerStats: {...},
  siteTypeStats: {...},
  systemInquiries: [...],
  siteRegistrations: [...]
}

// 계약사업장 목록
GET /api/admin/sites?page=1&limit=10
Headers: Authorization: Bearer {token}
Response: {
  sites: Array<Site>,
  total: number,
  page: number,
  totalPages: number
}
```

### 본사(Headquarters) API
```typescript
// 대시보드 데이터
GET /api/headquarters/dashboard?period=2025-h1
Headers: Authorization: Bearer {token}
Response: {
  headquarters: {...},
  compliance: Array<ComplianceChart>,
  workerStats: {...},
  siteStats: {...},
  changeRequests: [...],
  notifications: {...}
}

// 이행조치 승인
POST /api/headquarters/compliance/:id/approve
Headers: Authorization: Bearer {token}
Request: { approved: boolean, reason?: string }
Response: { success: boolean, message: string }
```

### 사업장(Site) API
```typescript
// 대시보드 데이터
GET /api/site/dashboard
Headers: Authorization: Bearer {token}
Response: {
  site: {...},
  registrations: Array<Registration>,
  notifications: {...}
}

// 이행조치 등록
POST /api/site/compliance
Headers: Authorization: Bearer {token}
Request: FormData {
  category: string,
  title: string,
  content: string,
  actionDate: Date,
  participants: string,
  files: File[]
}
Response: { success: boolean, id: string }

// 이행조치 상세
GET /api/site/compliance/:id
Headers: Authorization: Bearer {token}
Response: {
  id: string,
  category: string,
  title: string,
  content: string,
  status: string,
  files: Array<File>,
  ...
}
```

---

## 🎯 다음 단계 (우선순위별)

### 🔴 High Priority (최우선)
1. **Cloudflare D1 데이터베이스 설정**
   - D1 데이터베이스 생성
   - 마이그레이션 파일 작성 및 실행
   - 시드 데이터 삽입

2. **API 엔드포인트 구현**
   - 대시보드 데이터 API (3개 페이지)
   - 실제 데이터와 UI 연동

3. **이행조치 등록 화면**
   - 등록 폼 UI 구현
   - 파일 업로드 기능 (Cloudflare R2)
   - 제출 API 연동

### 🟡 Medium Priority (중요)
4. **인증 시스템 구현**
   - 로그인 페이지 UI
   - JWT 인증 로직
   - 권한별 라우팅 가드

5. **승인 프로세스**
   - 승인/반려 화면 (본사)
   - 승인 상태 업데이트

6. **추가 관리 화면**
   - 사업장 등록 화면
   - 직원 관리 화면
   - 사고사례 관리 화면

### 🟢 Low Priority (추가 기능)
7. **알림 시스템**
   - 실시간 알림 폴링
   - 이메일 발송

8. **통계 및 리포트**
   - 엑셀 다운로드
   - PDF 리포트 생성

9. **Cloudflare Pages 배포**
   - 프로덕션 환경 설정
   - 도메인 연결

---

## 📞 문의 및 지원

### GitHub Repository
- **URL**: https://github.com/jjjjnate-dotcom/anjen-bogeon-dashboard
- **Issues**: GitHub Issues를 통해 문의

### 데모 사이트
- **URL**: https://3000-itc876uk7sg4b9txgvs7l-c81df28e.sandbox.novita.ai
- **접근 경로**:
  - 메인: `/`
  - 교육원: `/admin`
  - 본사: `/headquarters`
  - 사업장: `/site`

### 기술 스택 문서
- [Hono 공식 문서](https://hono.dev/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)

---

## 📋 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 1.0.0 | 2026-01-30 | 기능 정의서 작성 (실제 구현 기반) | System |
| 0.1.0 | 2025-01-13 | UI 구현 완료, README 작성 | System |

---

**문서 끝**

*이 문서는 실제 GitHub Repository의 구현 내용을 기반으로 작성되었습니다.*

# 중대재해 관리 시스템 (데모 버전)

중대재해 처벌법 대응을 위한 안전보건관리 시스템입니다.

## 🎯 프로젝트 개요

이 시스템은 **교육원(한공원) → 본사 → 사업장**의 3계층 구조로 안전보건 이행조치를 체계적으로 관리합니다.

## 🌐 데모 접속 정보

### 메인 랜딩 페이지
```
https://3000-itc876uk7sg4b9txgvs7l-c81df28e.sandbox.novita.ai
```

### 3가지 대시보드

#### 1. 한공원 (교육원) 대시보드
- **URL**: `/admin`
- **역할**: 전체 계약사업장 모니터링
- **주요 기능**:
  - 계약사업장 현황 및 통계
  - 이행조치 완료율 모니터링
  - 사업장별 이행 상태 확인
  - 신규 사업장 등록 관리

#### 2. 본사 대시보드
- **URL**: `/headquarters`
- **역할**: 소속 사업장 관리
- **주요 기능**:
  - 7개 이행관리 카테고리 프로그레스 차트
  - 사업장 상시 근로자 현황
  - 이행 요청 등록 및 관리
  - 사고사례/공지사항 관리

#### 3. 사업장 대시보드
- **URL**: `/site`
- **역할**: 이행조치 등록
- **주요 기능**:
  - 안전보건관리 이행 등록
  - 교육/훈련 이행 등록
  - 위험성 평가 등록
  - 신규채용자 이행 등록

## ✨ 구현 완료 기능

### UI/UX
- ✅ PPT 기반 UI 100% 재현
- ✅ 권한별 대시보드 완전 분리
- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)
- ✅ 실시간 통계 차트 및 프로그레스바

### 기술 스택
- **프레임워크**: Hono (Cloudflare Workers)
- **데이터베이스**: Cloudflare D1 (SQLite)
- **스타일링**: Vanilla CSS
- **배포**: Cloudflare Pages (예정)

### 데이터베이스
- ✅ 15개 테이블 스키마 설계
- ✅ 조직 계층 구조 (교육원-본사-사업장)
- ✅ 이행조치 관리 (카테고리, 항목, 요청, 기록)
- ✅ 직원/협력업체 관리
- ✅ 교육 기록 및 공지사항

## 📊 데이터 구조

### 주요 테이블
```
organizations (조직)
├── users (사용자)
├── employees (직원)
├── vendors (협력업체)
└── compliance_records (이행기록)

compliance_categories (이행 카테고리)
├── compliance_items (이행 항목)
└── compliance_requests (이행 요청)

education_records (교육 기록)
notices (공지사항/사고사례)
```

## 🚀 로컬 개발

### 필수 요구사항
- Node.js 18+
- npm

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 데이터베이스 마이그레이션
npm run db:migrate:local

# 시드 데이터 삽입
npm run db:seed

# 빌드
npm run build

# 개발 서버 시작 (PM2)
pm2 start ecosystem.config.cjs

# 서버 확인
curl http://localhost:3000
```

### 유용한 명령어
```bash
# 데이터베이스 리셋
npm run db:reset

# PM2 상태 확인
pm2 list

# 로그 확인
pm2 logs webapp --nostream

# 서버 재시작
pm2 restart webapp

# 포트 3000 정리
npm run clean-port
```

## 📁 프로젝트 구조

```
webapp/
├── src/
│   ├── index.tsx          # 메인 라우트 (랜딩, 대시보드)
│   └── renderer.tsx       # HTML 렌더러
├── public/
│   └── static/
│       └── style.css      # 전역 스타일
├── migrations/
│   └── 0001_initial_schema.sql  # DB 스키마
├── seed.sql               # 테스트 데이터
├── ecosystem.config.cjs   # PM2 설정
├── wrangler.jsonc         # Cloudflare 설정
└── package.json
```

## 🎨 디자인 시스템

### 색상 팔레트

#### 본사 대시보드
- 헤더: `#000000` (검정)
- 사이드바: `#4a5568` (다크그레이)
- 탭 버튼: 핑크(`#ed64a6`), 오렌지(`#ed8936`), 그린(`#48bb78`), 틸(`#38b2ac`), 블루(`#4299e1`)
- 정보 박스: `#fef3c7` (노란색)

#### 사업장 대시보드
- 헤더: `#000000` + 노란색 텍스트(`#ffd700`)
- 메뉴 버튼: 네이비(`#1e40af`)
- 메인 박스: 녹색(`#10b981`)
- 알림 카드: 빨간색(`#dc2626`)

## 📝 향후 개발 계획

### Phase 1: 인증 및 권한
- [ ] 로그인/로그아웃 기능
- [ ] 세션 관리
- [ ] 권한별 접근 제어
- [ ] 휴대폰 인증 (SMS)

### Phase 2: 상세 기능
- [ ] 사업장 등록 폼
- [ ] 이행조치 등록 화면 (파일 업로드)
- [ ] 이행조치 확인/반려/승인 화면
- [ ] 공지사항 상세 페이지
- [ ] 사고사례 관리

### Phase 3: 파일 관리
- [ ] Cloudflare R2 연동
- [ ] 이미지/문서 업로드
- [ ] 파일 미리보기
- [ ] 첨부파일 다운로드

### Phase 4: 알림
- [ ] 실시간 알림 (폴링)
- [ ] 이메일 발송
- [ ] SMS 발송
- [ ] 팝업 알림

### Phase 5: 통계 및 리포트
- [ ] 실시간 통계 대시보드
- [ ] 이행률 차트
- [ ] Excel 다운로드
- [ ] PDF 리포트 생성

### Phase 6: 배포
- [ ] Cloudflare Pages 배포
- [ ] 프로덕션 D1 Database 생성
- [ ] 환경변수 설정
- [ ] 커스텀 도메인 연결

## 🔧 기술 상세

### Cloudflare D1 (로컬 개발)
```bash
# 마이그레이션 적용
npx wrangler d1 migrations apply webapp-production --local

# SQL 쿼리 실행
npx wrangler d1 execute webapp-production --local --command="SELECT * FROM users"

# 파일 실행
npx wrangler d1 execute webapp-production --local --file=./seed.sql
```

### PM2 관리
```bash
# 시작
pm2 start ecosystem.config.cjs

# 중지
pm2 stop webapp

# 재시작
pm2 restart webapp

# 삭제
pm2 delete webapp

# 전체 삭제
pm2 delete all
```

## 📄 라이선스

이 프로젝트는 데모 목적으로 제작되었습니다.

## 👥 문의

프로젝트 관련 문의사항이 있으시면 GitHub Issues를 통해 연락주세요.

---

**마지막 업데이트**: 2025-01-13  
**버전**: 0.1.0 (데모)  
**상태**: 🚧 개발 중

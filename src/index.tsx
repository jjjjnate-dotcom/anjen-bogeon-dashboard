import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// 정적 파일 제공
app.use('/static/*', serveStatic({ root: './public' }))

// 렌더러 미들웨어
app.use(renderer)

// 메인 랜딩 페이지 (3개 대시보드 선택)
app.get('/', (c) => {
  return c.render(
    <div class="landing-page">
      <div class="landing-container">
        <div class="landing-header">
          <h1>중대재해 관리 시스템</h1>
          <p class="landing-subtitle">데모 버전 - 대시보드를 선택해주세요</p>
        </div>
        
        <div class="dashboard-cards">
          <a href="/admin" class="dashboard-card card-admin">
            <div class="card-icon">🏢</div>
            <h2>한공원 (교육원)</h2>
            <p>전체 사업장 모니터링</p>
            <ul class="card-features">
              <li>• 계약사업장 현황</li>
              <li>• 이행조치 통계</li>
              <li>• 실시간 모니터링</li>
            </ul>
            <div class="card-footer">
              <span class="badge-role">관리자</span>
            </div>
          </a>
          
          <a href="/headquarters" class="dashboard-card card-hq">
            <div class="card-icon">🏗️</div>
            <h2>본사 대시보드</h2>
            <p>소속 사업장 관리</p>
            <ul class="card-features">
              <li>• 사업장 이행 관리</li>
              <li>• 이행 요청 등록</li>
              <li>• 직원/업체 관리</li>
            </ul>
            <div class="card-footer">
              <span class="badge-role">본사 담당자</span>
            </div>
          </a>
          
          <a href="/site" class="dashboard-card card-site">
            <div class="card-icon">🏘️</div>
            <h2>사업장 대시보드</h2>
            <p>이행조치 등록</p>
            <ul class="card-features">
              <li>• 안전보건 이행 등록</li>
              <li>• 교육/훈련 관리</li>
              <li>• 위험성 평가</li>
            </ul>
            <div class="card-footer">
              <span class="badge-role">사업장 담당자</span>
            </div>
          </a>
        </div>
        
        <div class="landing-info">
          <div class="info-box">
            <h3>📌 데모 안내</h3>
            <p>현재 3가지 권한별 대시보드를 자유롭게 탐색할 수 있습니다.</p>
            <p>로그인 기능은 추후 연동될 예정입니다.</p>
          </div>
          
          <div class="info-box">
            <h3>🎯 구현 완료 기능</h3>
            <ul>
              <li>✅ PPT 기반 UI 완벽 재현</li>
              <li>✅ 권한별 대시보드 분리</li>
              <li>✅ 데이터베이스 스키마 구축</li>
              <li>✅ 반응형 디자인</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
})

// 교육원(관리자) 대시보드
app.get('/admin', (c) => {
  return c.render(
    <div class="dashboard admin-dashboard">
      {/* 좌측 사이드바 - 통일된 스타일 */}
      <nav class="common-sidebar">
        <div class="user-info-box">
          <p class="business-name">본 사명 : 한국공동주택관리</p>
          <p class="site-name">사업장코드 : 교육원</p>
          <p class="manager-name">담 당 : 홍길동 ●</p>
          <p class="last-login">최종접속일시 : 2024-12-31</p>
        </div>
        
        <div class="menu-btn-list">
          <button class="menu-btn green">기본정보 설정</button>
          <button class="menu-btn white">계약 사업장 관리</button>
          <button class="menu-btn white">계약 사업장 등록</button>
          <button class="menu-btn green">협력사 정보 관리</button>
          <button class="menu-btn white">사고사례 관리</button>
          <button class="menu-btn white">안전보건자료 관리</button>
          <button class="menu-btn green">계정 관리</button>
          <button class="menu-btn white">권한 관리</button>
        </div>
      </nav>
      
      {/* 메인 컨텐츠 */}
      <main class="main-content-admin">
        {/* 상단 헤더 */}
        <header class="header-admin">
          <div class="header-left">
            <div class="office-info">
              <span>본사 명 : 한국공동주택관리</span>
              <span>사업장코드 : 교육원</span>
              <span>담 당 : 홍길동</span>
            </div>
          </div>
          <div class="period-badge">2025년 상반기</div>
        </header>
        
        {/* 계약사업장 모니터링 테이블 */}
        <div class="monitoring-section">
          <h3>계약사업장 모니터링</h3>
          <table class="monitoring-table">
            <thead>
              <tr>
                <th rowspan="2">NO</th>
                <th rowspan="2">계약 사업장</th>
                <th rowspan="2">등록<br/>근로자수</th>
                <th rowspan="2">안전/보건<br/>투수</th>
                <th colspan="6" class="highlight-orange">이용횟수</th>
                <th rowspan="2">상태</th>
              </tr>
              <tr>
                <th class="highlight-orange">안전/보건<br/>투수</th>
                <th class="highlight-blue">교육 투수</th>
                <th class="highlight-red">위험성평가</th>
                <th class="highlight-yellow">종사/협의<br/>청취</th>
                <th class="highlight-purple">안전보건관<br/>리규정</th>
                <th class="highlight-blue">신규채용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td class="site-name">무림공동주택</td>
                <td>100</td>
                <td>완료</td>
                <td>완료</td>
                <td>완료</td>
                <td>완료</td>
                <td>완료</td>
                <td>완료</td>
                <td>완료</td>
                <td class="status-active">이용중</td>
              </tr>
              <tr>
                <td>2</td>
                <td class="site-name">조은별공동주택</td>
                <td>100</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="status-active">이용중</td>
              </tr>
              <tr>
                <td>3</td>
                <td class="site-name">서울명공동주택</td>
                <td>100</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="status-active">이용중</td>
              </tr>
              <tr>
                <td>4</td>
                <td class="site-name">경기공동주택</td>
                <td>100</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="status-active">이용중</td>
              </tr>
              <tr>
                <td>5</td>
                <td class="site-name">충북시공동주택</td>
                <td>100</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="status-active">이용중</td>
              </tr>
              <tr>
                <td>6</td>
                <td class="site-name">충남</td>
                <td>100</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="status-active">이용중</td>
              </tr>
              <tr>
                <td>7</td>
                <td class="site-name">서귀포</td>
                <td>100</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="status-inactive">미사용</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* 우측 사이드 패널 */}
        <div class="right-panel">
          {/* 계약 사업장 상세 신규 구분 등록 현황 */}
          <div class="panel-box">
            <h4>계약 사업장 상세 신규 구분 등록 현황</h4>
            <div class="stats-grid-panel">
              <div class="stat-row">
                <span class="stat-label">등록</span>
                <span class="stat-value">$20</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">토지사용료</span>
                <span class="stat-value">$1</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">토지사용료</span>
                <span class="stat-value">1,500</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">구공유토지</span>
                <span class="stat-value">6,000</span>
              </div>
            </div>
          </div>
          
          {/* 계약 사업장 구분 등록 현황 */}
          <div class="panel-box">
            <h4>계약 사업장 구분 등록 현황</h4>
            <div class="stats-grid-panel">
              <div class="stat-row">
                <span class="stat-label">등록</span>
                <span class="stat-value">$20</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">구분</span>
                <span class="stat-value"></span>
              </div>
              <div class="stat-row">
                <span class="stat-label">구매사업장</span>
                <span class="stat-value">120</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">구공유사업장</span>
                <span class="stat-value">380</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 하단 알림 섹션 */}
        <div class="alerts-section">
          <div class="alert-box">
            <h4><span class="badge-m">M</span> 사업장 문의</h4>
            <div class="alert-item">
              0000 아파트 오늘등록 요청<span class="alert-date">당일 대기</span>
            </div>
            <div class="alert-item">
              수정 확정 요청<span class="alert-date">당일 대기</span>
            </div>
            <div class="alert-item">
              사업자명 오등록 오류<span class="alert-date">당일 대기</span>
            </div>
            <div class="alert-item">
              사업자명 오등록 오류<span class="alert-date">당일 대기</span>
            </div>
            <div class="alert-item">
              사업자명 오등록 오류<span class="alert-date">수정 보안</span>
            </div>
          </div>
          
          <div class="alert-box">
            <h4>사업장 등록 현황</h4>
            <table style="width:100%; font-size:11px; border-collapse: collapse;">
              <thead>
                <tr style="background:#f3f4f6">
                  <th style="padding:8px; border:1px solid #e5e7eb">계약사업장 명</th>
                  <th style="padding:8px; border:1px solid #e5e7eb">등록사업장명</th>
                  <th style="padding:8px; border:1px solid #e5e7eb">등록일</th>
                  <th style="padding:8px; border:1px solid #e5e7eb">상태</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:6px; border:1px solid #e5e7eb">무림 아파트</td>
                  <td style="padding:6px; border:1px solid #e5e7eb">0000아파트 오류</td>
                  <td style="padding:6px; border:1px solid #e5e7eb">2025/01/01</td>
                  <td style="padding:6px; border:1px solid #e5e7eb">등록</td>
                </tr>
                <tr>
                  <td style="padding:6px; border:1px solid #e5e7eb">우리경리</td>
                  <td style="padding:6px; border:1px solid #e5e7eb">0000아파트 오류</td>
                  <td style="padding:6px; border:1px solid #e5e7eb">2025/01/01</td>
                  <td style="padding:6px; border:1px solid #e5e7eb">상담</td>
                </tr>
                <tr>
                  <td style="padding:6px; border:1px solid #e5e7eb">사무사주업</td>
                  <td style="padding:6px; border:1px solid #e5e7eb"></td>
                  <td style="padding:6px; border:1px solid #e5e7eb"></td>
                  <td style="padding:6px; border:1px solid #e5e7eb"></td>
                </tr>
                <tr>
                  <td style="padding:6px; border:1px solid #e5e7eb">경기공주업</td>
                  <td style="padding:6px; border:1px solid #e5e7eb"></td>
                  <td style="padding:6px; border:1px solid #e5e7eb"></td>
                  <td style="padding:6px; border:1px solid #e5e7eb"></td>
                </tr>
                <tr>
                  <td style="padding:6px; border:1px solid #e5e7eb">충남</td>
                  <td style="padding:6px; border:1px solid #e5e7eb"></td>
                  <td style="padding:6px; border:1px solid #e5e7eb"></td>
                  <td style="padding:6px; border:1px solid #e5e7eb"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
})

// 본사 대시보드
app.get('/headquarters', (c) => {
  return c.render(
    <div class="dashboard hq-dashboard">
      {/* 좌측 사이드바 - 통일된 스타일 */}
      <nav class="common-sidebar">
        <div class="user-info-box">
          <p class="business-name">본 사명 : 무림공동주택</p>
          <p class="site-name">사업장코드 : 본사</p>
          <p class="manager-name">담 당 : 김철수 ●</p>
          <p class="last-login">최종접속일자 : 2024-12-31</p>
        </div>
        
        <div class="menu-btn-list">
          <button class="menu-btn green">기본정보 설정</button>
          <button class="menu-btn white">사업장 관리</button>
          <button class="menu-btn white">사업장 등록</button>
          <button class="menu-btn green">협력사 정보 관리</button>
          <button class="menu-btn white">직원 관리</button>
          <button class="menu-btn white">직원 등록</button>
          <button class="menu-btn green">계정 관리</button>
          <button class="menu-btn white">권한 관리</button>
        </div>
      </nav>
      
      {/* 메인 컨텐츠 */}
      <main class="main-content-hq">
        {/* 상단 탭 버튼 */}
        <div class="top-tabs">
          <button class="tab-btn tab-pink active">이행 요청 등록 관리</button>
          <button class="tab-btn tab-orange">사업장 안전보건이행 점검관리</button>
          <button class="tab-btn tab-green">종합 안전보건관리 규정</button>
          <button class="tab-btn tab-teal">위험성 평가</button>
          <button class="tab-btn tab-blue">신규채용 정보등록</button>
        </div>
        
        {/* 기간 선택 */}
        <div class="period-selector">
          <span>2025년 상반기</span>
          <button class="btn-filter">필터 보기 ▼</button>
        </div>
        
        {/* 이행관리 차트 영역 */}
        <div class="compliance-chart-section">
          <div class="chart-row">
            <div class="chart-label">안전/보건 이행관리</div>
            <div class="chart-bars">
              <div class="bar-group">
                <div class="bar bar-blue" style="width: 40%"></div>
                <div class="bar bar-red" style="width: 20%"></div>
                <div class="bar bar-black" style="width: 30%"></div>
              </div>
            </div>
            <button class="btn-detail">보기</button>
          </div>
          
          <div class="chart-row">
            <div class="chart-label">교육/훈련 이행관리</div>
            <div class="chart-bars">
              <div class="bar-group">
                <div class="bar bar-blue" style="width: 35%"></div>
                <div class="bar bar-red" style="width: 15%"></div>
                <div class="bar bar-black" style="width: 40%"></div>
              </div>
            </div>
            <button class="btn-detail">보기</button>
          </div>
          
          <div class="chart-row">
            <div class="chart-label">위험성평가 이행관리</div>
            <div class="chart-bars">
              <div class="bar-group">
                <div class="bar bar-blue" style="width: 45%"></div>
                <div class="bar bar-red" style="width: 10%"></div>
                <div class="bar bar-black" style="width: 35%"></div>
              </div>
            </div>
            <button class="btn-detail">보기</button>
          </div>
          
          <div class="chart-row">
            <div class="chart-label">종사자의견청취 이행관리</div>
            <div class="chart-bars">
              <div class="bar-group">
                <div class="bar bar-blue" style="width: 30%"></div>
                <div class="bar bar-red" style="width: 25%"></div>
                <div class="bar bar-black" style="width: 25%"></div>
              </div>
            </div>
            <button class="btn-detail">보기</button>
          </div>
          
          <div class="chart-row">
            <div class="chart-label">용역/도급 안전조치 이행관리</div>
            <div class="chart-bars">
              <div class="bar-group">
                <div class="bar bar-blue" style="width: 50%"></div>
                <div class="bar bar-red" style="width: 5%"></div>
                <div class="bar bar-black" style="width: 35%"></div>
              </div>
            </div>
            <button class="btn-detail">보기</button>
          </div>
          
          <div class="chart-row">
            <div class="chart-label">안전보건관리조치 등록관리</div>
            <div class="chart-bars">
              <div class="bar-group">
                <div class="bar bar-blue" style="width: 40%"></div>
                <div class="bar bar-red" style="width: 20%"></div>
                <div class="bar bar-black" style="width: 30%"></div>
              </div>
            </div>
            <button class="btn-detail">보기</button>
          </div>
          
          <div class="chart-row">
            <div class="chart-label">신규채용정보등록 관리</div>
            <div class="chart-bars">
              <div class="bar-group">
                <div class="bar bar-blue" style="width: 25%"></div>
                <div class="bar bar-red" style="width: 30%"></div>
                <div class="bar bar-black" style="width: 35%"></div>
              </div>
            </div>
            <button class="btn-detail">보기</button>
          </div>
          
          {/* 범례 */}
          <div class="chart-legend">
            <span><span class="legend-dot blue"></span> 등록</span>
            <span><span class="legend-dot red"></span> 등록대기</span>
            <span><span class="legend-dot black"></span> 등록완료</span>
          </div>
        </div>
        
        {/* 사업장 상시 근로자 현황 & 구분 현황 */}
        <div class="info-tables">
          <div class="info-table-left">
            <h4>사업장 상시 근로자 현황</h4>
            <table class="info-table">
              <thead>
                <tr>
                  <th>구역</th>
                  <th colspan="3">상시근로자</th>
                </tr>
                <tr>
                  <th></th>
                  <th>근무인원</th>
                  <th>직영인원</th>
                  <th>도급/협력인원</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>전0</td>
                  <td>51</td>
                  <td>1,500</td>
                  <td>6,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="info-table-right">
            <h4>사업장 구분 현황</h4>
            <table class="info-table">
              <thead>
                <tr>
                  <th>구역</th>
                  <th colspan="2">구분</th>
                </tr>
                <tr>
                  <th></th>
                  <th>직영사업장</th>
                  <th>도급/협력 사업장</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>전0</td>
                  <td>120</td>
                  <td>380</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 사업장 정보 목록 */}
        <div class="site-list-section">
          <h4>사업장 정보 변동 / 요청 현황</h4>
          <table class="site-list-table">
            <thead>
              <tr>
                <th>NO</th>
                <th>사업장</th>
                <th>등록일</th>
                <th>구분</th>
                <th>종류</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>0000 아파트</td>
                <td>2025.01.01</td>
                <td>안전보건관리규정 변경</td>
                <td>변경 완료</td>
              </tr>
              <tr>
                <td>2</td>
                <td>0000 아파트</td>
                <td>2025.01.01</td>
                <td>근무/ 종업 대상 등록</td>
                <td>변경 완료</td>
              </tr>
              <tr>
                <td>3</td>
                <td>0000 아파트</td>
                <td>2025.01.01</td>
                <td>변경 절차완료</td>
                <td>산업 완료</td>
              </tr>
              <tr>
                <td>4</td>
                <td>0000 아파트</td>
                <td>2025.01.01</td>
                <td>연구개발 의뢰완료</td>
                <td>산업 완료</td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">1 2 3</div>
        </div>
        
        {/* 하단 알림 카드 3개 */}
        <div class="notification-cards">
          <div class="noti-card">
            <div class="noti-header">
              <h4>사고사례 전파</h4>
              <button class="btn-more">더보기 +</button>
            </div>
            <div class="noti-item">
              <span class="badge-new-red">N</span>
              <span>[산업안전보건관리단] 재해사고 보수 전파 문의망 사고</span>
            </div>
            <div class="noti-item">
              <span class="badge-new-red">N</span>
              <span>[산업안전보건관리단] 재해사고 보수 전파 문의망 사고</span>
            </div>
            <div class="noti-item">
              <span class="badge-new-red">N</span>
              <span>[산업안전보건관리단] 재해사고 보수 전파 문의망 사고</span>
            </div>
          </div>
          
          <div class="noti-card">
            <div class="noti-header">
              <h4>안전보건자료</h4>
              <button class="btn-more">더보기 +</button>
            </div>
            <div class="noti-item">
              <span class="badge-new-red">N</span>
              <span>[산업안전보건관리단] 재해사고 보수 전파 문의망 사고</span>
            </div>
            <div class="noti-item">
              <span class="badge-new-red">N</span>
              <span>[산업안전보건관리단] 재해사고 보수 전파 문의망 사고</span>
            </div>
            <div class="noti-item">
              <span class="badge-new-red">N</span>
              <span>[산업안전보건관리단] 재해사고 보수 전파 문의망 사고</span>
            </div>
          </div>
          
          <div class="noti-card">
            <div class="noti-header">
              <h4>공지사항</h4>
              <button class="btn-more">더보기 +</button>
            </div>
            <div class="noti-item">
              <span class="badge-new-red">N</span>
              <span>[산업안전보건관리단] 재해사고 보수 전파 문의망 사고</span>
            </div>
            <div class="noti-item">
              <span class="badge-new-red">N</span>
              <span>[산업안전보건관리단] 재해사고 보수 전파 문의망 사고</span>
            </div>
            <div class="noti-item">
              <span class="badge-new-red">N</span>
              <span>[산업안전보건관리단] 재해사고 보수 전파 문의망 사고</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
})

// 사업장 대시보드 (6박스 버전)
app.get('/site', (c) => {
  return c.render(
    <div class="dashboard site-dashboard">
      {/* 헤더 */}
      <header class="site-header">
        <div class="site-header-left">
          <span class="site-logo">중대재해관리시스템</span>
        </div>
        <div class="site-header-right">
          <select class="period-dropdown">
            <option value="2024-1">2024 상반기</option>
            <option value="2024-2">2024 하반기</option>
            <option value="2025-1" selected>2025 상반기</option>
          </select>
        </div>
      </header>
      
      {/* 좌측 사이드바 - 통일된 스타일 + 파란색 박스 6개 */}
      <nav class="common-sidebar">
        <div class="user-info-box">
          <p class="business-name">본 사명 : 무림공동주택</p>
          <p class="site-name">사업장명 : 전세토마 아파트</p>
          <p class="manager-name">담 당 : 김철수 ●</p>
          <p class="last-login">최근접속일자 : 2024-12-31</p>
        </div>
        
        {/* 파란색 버튼 그리드 (2x3) - 사업장 전용 */}
        <div class="blue-menu-grid">
          <button class="blue-menu-btn">법과교육<br/>시스템</button>
          <button class="blue-menu-btn">아파트 정리</button>
          <button class="blue-menu-btn">한국공동주택<br/>교육진흥원</button>
          <button class="blue-menu-btn">전자안전<br/>시스템</button>
          <button class="blue-menu-btn">재고표</button>
          <button class="blue-menu-btn">위험성평가 담당자<br/>교육 시스템</button>
        </div>
        
        <div class="menu-btn-list">
          <button class="menu-btn green">기본정보 설정</button>
          <button class="menu-btn white">사무장 정보 관리</button>
          <button class="menu-btn white">직원 정보 등록</button>
          <button class="menu-btn green">협력사 정보 관리</button>
          <button class="menu-btn white">협력사 정보</button>
          <button class="menu-btn white">협력사 정보등록</button>
          <button class="menu-btn green">계정 관리</button>
          <button class="menu-btn white">계정정보 권한관리</button>
        </div>
      </nav>
      
      {/* 메인 컨텐츠 */}
      <main class="main-content-site">
        {/* 6개 등록 박스 그리드 */}
        <div class="six-boxes-grid">
          {/* 박스 1 */}
          <div class="register-box">
            <div class="register-box-header">
              안전보건관리 이행 등록
              <button class="arrow-btn">▶</button>
            </div>
            <div class="register-box-body">
              <div class="status-label">이행 등록 현황</div>
              <button class="btn-register blue">등록완료</button>
              <div class="confirm-section">
                <p class="confirm-text">조치사항 내용에 관한데이터 작업</p>
                <button class="btn-confirm">확인</button>
              </div>
            </div>
          </div>
          
          {/* 박스 2 */}
          <div class="register-box">
            <div class="register-box-header">
              교육/훈련 이행 등록
              <button class="arrow-btn">▶</button>
            </div>
            <div class="register-box-body">
              <div class="status-label">이행 등록 현황</div>
              <button class="btn-register blue">등록완료</button>
              <div class="confirm-section">
                <p class="confirm-text">조치사항 내용에 관한데이터 작업</p>
                <button class="btn-confirm">확인</button>
              </div>
            </div>
          </div>
          
          {/* 박스 3 */}
          <div class="register-box">
            <div class="register-box-header">
              위험성 평가 등록
              <button class="arrow-btn">▶</button>
            </div>
            <div class="register-box-body">
              <div class="status-label">이행 등록 현황</div>
              <button class="btn-register gray">미등록</button>
              <div class="confirm-section">
                <p class="confirm-text">조치사항 내용에 관한데이터 작업</p>
                <button class="btn-confirm">확인</button>
              </div>
            </div>
          </div>
          
          {/* 박스 4 */}
          <div class="register-box">
            <div class="register-box-header" style="font-size: 13px; line-height: 1.3;">
              1. 중사자안전성 등록<br/>2. 용역/도급 안전관리이행 등록
              <button class="arrow-btn">▶</button>
            </div>
            <div class="register-box-body">
              <div class="status-label">이행 등록 현황</div>
              <button class="btn-register yellow">승인완료</button>
              <div class="sub-section">
                <div class="sub-section-header">
                  조치사항 내용에 관한데이터 작업
                </div>
                <button class="btn-confirm">확인</button>
              </div>
            </div>
          </div>
          
          {/* 박스 5 */}
          <div class="register-box">
            <div class="register-box-header">
              안전보건관리규정 등록
              <button class="arrow-btn">▶</button>
            </div>
            <div class="register-box-body">
              <div class="status-label">이행 등록 현황</div>
              <button class="btn-register blue">등록완료</button>
              <div class="confirm-section">
                <p class="confirm-text">조치사항 내용에 관한데이터 작업</p>
                <button class="btn-confirm">확인</button>
              </div>
            </div>
          </div>
          
          {/* 박스 6 */}
          <div class="register-box">
            <div class="register-box-header">
              신고체용자 이행등록
              <button class="arrow-btn">▶</button>
            </div>
            <div class="register-box-body">
              <div class="status-label">이행 등록 현황</div>
              <button class="btn-register gray">미등록</button>
              <div class="confirm-section">
                <p class="confirm-text">조치사항 내용에 관한데이터 작업</p>
                <button class="btn-confirm">확인</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 하단 3개 알림 박스 */}
        <div class="bottom-notifications">
          <div class="notification-box">
            <div class="notification-header">
              <div class="notification-title">
                <span class="badge-red-n">N</span>
                <span>사고사례</span>
              </div>
              <button class="btn-more-notification">더보기 +</button>
            </div>
            <div class="notification-item">
              <span class="item-badge">N</span>
              <span>[산업안전보건법령] 계획서요청 발생 전파 및 혈어사고</span>
            </div>
            <div class="notification-item">
              <span class="item-badge">N</span>
              <span>[산업안전보건법령] 계획서요청 발생 전파 및 혈어사고</span>
            </div>
            <div class="notification-item">
              <span class="item-badge">N</span>
              <span>[산업안전보건법령] 계획서요청 발생 전파 및 혈어사고</span>
            </div>
          </div>
          
          <div class="notification-box">
            <div class="notification-header">
              <div class="notification-title">
                <span class="badge-red-n">N</span>
                <span>안전보건자료</span>
              </div>
              <button class="btn-more-notification">더보기 +</button>
            </div>
            <div class="notification-item">
              <span class="item-badge">N</span>
              <span>[산업안전보건법령] 계획서요청 발생 전파 및 혈어사고</span>
            </div>
            <div class="notification-item">
              <span class="item-badge">N</span>
              <span>[산업안전보건법령] 계획서요청 발생 전파 및 혈어사고</span>
            </div>
            <div class="notification-item">
              <span class="item-badge">N</span>
              <span>[산업안전보건법령] 계획서요청 발생 전파 및 혈어사고</span>
            </div>
          </div>
          
          <div class="notification-box">
            <div class="notification-header">
              <div class="notification-title">
                <span class="badge-red-n">N</span>
                <span>공지사항</span>
              </div>
              <button class="btn-more-notification">더보기 +</button>
            </div>
            <div class="notification-item">
              <span class="item-badge">N</span>
              <span>[산업안전보건법령] 계획서요청 발생 전파 및 혈어사고</span>
            </div>
            <div class="notification-item">
              <span class="item-badge">N</span>
              <span>[산업안전보건법령] 계획서요청 발생 전파 및 혈어사고</span>
            </div>
            <div class="notification-item">
              <span class="item-badge">N</span>
              <span>[산업안전보건법령] 계획서요청 발생 전파 및 혈어사고</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
})

// API 라우트: 로그인
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json()
  
  // TODO: 실제 DB 조회 및 비밀번호 검증
  // 임시 데이터
  const users = {
    'admin@education.com': { id: 1, name: '교육원관리자', role: 'admin', organization_id: 1 },
    'hong@murim.com': { id: 2, name: '홍길동', role: 'headquarters', organization_id: 2 },
    'lee@murim.com': { id: 4, name: '이영희', role: 'site', organization_id: 4 }
  }
  
  const user = users[email]
  
  if (user && password === 'password123') {
    return c.json({ success: true, user })
  }
  
  return c.json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다' })
})

export default app

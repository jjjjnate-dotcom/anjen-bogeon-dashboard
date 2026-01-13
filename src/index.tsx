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

// 로그인 페이지
app.get('/', (c) => {
  return c.render(
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <h1>중 대 재 해 관 리 시스템</h1>
        </div>
        
        <div class="login-form">
          <div class="input-group">
            <label>아이디</label>
            <input type="text" name="username" placeholder="아이디를 입력하세요" />
          </div>
          
          <div class="input-group">
            <label>비밀번호</label>
            <input type="password" name="password" placeholder="비밀번호를 입력하세요" />
          </div>
          
          <button class="btn-login" onclick="login()">로그인</button>
          
          <div class="login-links">
            <span>로그인 정보를 분실하셨습니까?</span>
            <a href="/find-id">아이디 찾기</a> / <a href="/find-password">비밀번호 찾기</a>
          </div>
          
          <div class="login-footer">
            <a href="/terms">가입관련문의</a> ∥ 
            <a href="/terms">서비스이용약관</a> ∥ 
            <a href="/privacy">개인정보처리방침</a>
          </div>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          function login() {
            const username = document.querySelector('input[name="username"]').value;
            const password = document.querySelector('input[name="password"]').value;
            
            if (!username || !password) {
              alert('아이디와 비밀번호를 입력해주세요');
              return;
            }
            
            // TODO: 실제 로그인 API 호출
            // 임시로 role에 따라 페이지 이동
            fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: username, password: password })
            })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = data.user.role === 'admin' ? '/admin' : 
                                      data.user.role === 'headquarters' ? '/headquarters' : '/site';
              } else {
                alert(data.message || '로그인에 실패했습니다');
              }
            })
            .catch(err => {
              console.error(err);
              alert('로그인 중 오류가 발생했습니다');
            });
          }
          
          // Enter 키로 로그인
          document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
              login();
            }
          });
        `
      }} />
    </div>
  )
})

// 교육원(관리자) 대시보드
app.get('/admin', (c) => {
  return c.render(
    <div class="dashboard admin-dashboard">
      <nav class="sidebar">
        <div class="logo">중대재해 관리시스템</div>
        <div class="user-info">
          <p>교육원 관리자</p>
          <p class="user-name">홍길동</p>
        </div>
        <ul class="menu">
          <li class="active"><a href="/admin">메인</a></li>
          <li><a href="/admin/organizations">계약사업장 관리</a></li>
          <li><a href="/admin/compliance">이행조치 현황</a></li>
          <li><a href="/admin/notices">사고사례 관리</a></li>
          <li><a href="/admin/messages">문자발송 관리</a></li>
          <li><a href="/admin/users">계정 및 권한 관리</a></li>
        </ul>
      </nav>
      
      <main class="main-content">
        <h2>계약사업장 모니터링</h2>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3>계약 사업장 현황</h3>
            <div class="stat-number">8<span class="unit">개</span></div>
            <p>전체 계약 사업장</p>
          </div>
          
          <div class="stat-card">
            <h3>이행 완료율</h3>
            <div class="stat-number">75<span class="unit">%</span></div>
            <p>2025년 상반기</p>
          </div>
          
          <div class="stat-card">
            <h3>직영 근로자</h3>
            <div class="stat-number">127<span class="unit">명</span></div>
          </div>
          
          <div class="stat-card">
            <h3>도급 근로자</h3>
            <div class="stat-number">243<span class="unit">명</span></div>
          </div>
        </div>
        
        <div class="section">
          <h3>계약 사업장 목록</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>본사명</th>
                <th>사업장 수</th>
                <th>직영 근로자</th>
                <th>도급 근로자</th>
                <th>이행률</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>무림개발</td>
                <td>3개</td>
                <td>45명</td>
                <td>85명</td>
                <td><span class="badge badge-success">85%</span></td>
                <td><button class="btn-sm" onclick="viewDetail(2)">보기</button></td>
              </tr>
              <tr>
                <td>ABC건설</td>
                <td>2개</td>
                <td>32명</td>
                <td>58명</td>
                <td><span class="badge badge-warning">65%</span></td>
                <td><button class="btn-sm" onclick="viewDetail(3)">보기</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h3>사업장 등록 현황 <small class="text-muted">실시간 변동</small></h3>
          <div class="recent-activities">
            <div class="activity-item">
              <span class="badge badge-new">신규</span>
              <span>무림하우징 3단지</span>
              <span class="time">2시간 전</span>
            </div>
            <div class="activity-item">
              <span class="badge badge-update">수정</span>
              <span>ABC아파트 B동</span>
              <span class="time">5시간 전</span>
            </div>
          </div>
        </div>
      </main>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          function viewDetail(orgId) {
            window.location.href = '/admin/organizations/' + orgId;
          }
        `
      }} />
    </div>
  )
})

// 본사 대시보드
app.get('/headquarters', (c) => {
  return c.render(
    <div class="dashboard hq-dashboard">
      <nav class="sidebar">
        <div class="logo">중대재해 관리시스템</div>
        <div class="user-info">
          <p>무림개발 본사</p>
          <p class="user-name">홍길동</p>
        </div>
        <ul class="menu">
          <li class="active"><a href="/headquarters">메인</a></li>
          <li><a href="/headquarters/sites">사업장 정보</a></li>
          <li><a href="/headquarters/compliance">이행조치 관리</a></li>
          <li><a href="/headquarters/requests">이행요청 관리</a></li>
          <li><a href="/headquarters/employees">신규채용 정보</a></li>
          <li><a href="/headquarters/notices">사고사례 관리</a></li>
        </ul>
      </nav>
      
      <main class="main-content">
        <h2>사업장 정보 현황</h2>
        
        {/* 팝업 알림 */}
        <div class="popup-alert">
          <div class="popup-content">
            <h3>📢 신규 등록 요청</h3>
            <p>무림하우징 2단지에서 직원 정보가 등록되었습니다.</p>
            <button onclick="closePopup()">확인</button>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3>관리 사업장</h3>
            <div class="stat-number">3<span class="unit">개</span></div>
          </div>
          
          <div class="stat-card">
            <h3>직영 근로자</h3>
            <div class="stat-number">45<span class="unit">명</span></div>
          </div>
          
          <div class="stat-card">
            <h3>도급 근로자</h3>
            <div class="stat-number">85<span class="unit">명</span></div>
          </div>
          
          <div class="stat-card warning">
            <h3>이행 대기</h3>
            <div class="stat-number">5<span class="unit">건</span></div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-header">
            <h3>사업장 이행 등록 현황</h3>
            <button class="btn-primary" onclick="createRequest()">이행 요청 등록</button>
          </div>
          
          <table class="data-table">
            <thead>
              <tr>
                <th>사업장명</th>
                <th>담당자</th>
                <th>상시근로자</th>
                <th>안전보건</th>
                <th>교육/훈련</th>
                <th>위험성평가</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>무림하우징 1단지</td>
                <td>이영희</td>
                <td>15/25</td>
                <td><span class="badge badge-success">완료</span></td>
                <td><span class="badge badge-warning">등록대기</span></td>
                <td><span class="badge badge-success">완료</span></td>
                <td><button class="btn-sm" onclick="viewSite(4)">보기</button></td>
              </tr>
              <tr>
                <td>무림하우징 2단지</td>
                <td>박민수</td>
                <td>12/20</td>
                <td><span class="badge badge-danger">미등록</span></td>
                <td><span class="badge badge-danger">미등록</span></td>
                <td><span class="badge badge-warning">등록대기</span></td>
                <td><button class="btn-sm" onclick="viewSite(5)">보기</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          function closePopup() {
            document.querySelector('.popup-alert').style.display = 'none';
          }
          
          function createRequest() {
            window.location.href = '/headquarters/requests/create';
          }
          
          function viewSite(siteId) {
            window.location.href = '/headquarters/sites/' + siteId;
          }
        `
      }} />
    </div>
  )
})

// 사업장 대시보드
app.get('/site', (c) => {
  return c.render(
    <div class="dashboard site-dashboard">
      <nav class="sidebar">
        <div class="logo">중대재해 관리시스템</div>
        <div class="user-info">
          <p>무림하우징 1단지</p>
          <p class="user-name">이영희</p>
        </div>
        <ul class="menu">
          <li class="active"><a href="/site">메인</a></li>
          <li><a href="/site/info">사업장 정보</a></li>
          <li><a href="/site/employees">직원 정보</a></li>
          <li><a href="/site/vendors">업체 정보</a></li>
          <li><a href="/site/compliance">이행조치 등록</a></li>
          <li><a href="/site/education">교육/훈련 관리</a></li>
          <li><a href="/site/notices">사고사례</a></li>
        </ul>
      </nav>
      
      <main class="main-content">
        <h2>2025년 상반기 이행조치 현황</h2>
        
        {/* 팝업 알림 */}
        <div class="popup-alert show">
          <div class="popup-content">
            <h3>📢 이행 요청</h3>
            <p><strong>2025년 상반기 안전보건 이행 사항 등록 요청</strong></p>
            <p>매년 [반기] 정기적으로 안전,보건 이행 점검을 실시 하고 있습니다.<br/>
            개별 현장담당자 께서는 요청기간 안전보건 이행 사항을 등록해 주시기 바랍니다.</p>
            <p class="deadline">기한: 2025년 6월 30일</p>
            <button onclick="goToCompliance()">이행조치 등록하기</button>
            <button onclick="closePopup()" class="btn-secondary">나중에</button>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3>직영 근로자</h3>
            <div class="stat-number">15<span class="unit">명</span></div>
          </div>
          
          <div class="stat-card">
            <h3>도급 근로자</h3>
            <div class="stat-number">25<span class="unit">명</span></div>
          </div>
          
          <div class="stat-card success">
            <h3>이행 완료</h3>
            <div class="stat-number">8<span class="unit">건</span></div>
          </div>
          
          <div class="stat-card warning">
            <h3>이행 대기</h3>
            <div class="stat-number">3<span class="unit">건</span></div>
          </div>
        </div>
        
        <div class="section">
          <h3>이행조치 등록 현황 <small>(2025년 상반기)</small></h3>
          
          <div class="compliance-grid">
            <div class="compliance-category">
              <h4>안전/보건 이행관리</h4>
              <div class="compliance-items">
                <div class="compliance-item completed">
                  <span class="item-name">작업중지권 게시 이행</span>
                  <span class="badge badge-success">등록완료</span>
                  <button class="btn-sm" onclick="viewItem(1)">보기</button>
                </div>
                <div class="compliance-item pending">
                  <span class="item-name">MSDS 게시 이행</span>
                  <span class="badge badge-warning">등록대기</span>
                  <button class="btn-sm btn-primary" onclick="registerItem(2)">등록</button>
                </div>
                <div class="compliance-item rejected">
                  <span class="item-name">법령의 요지 게시 이행</span>
                  <span class="badge badge-danger">조치반려</span>
                  <button class="btn-sm btn-warning" onclick="viewItem(3)">수정</button>
                </div>
                <div class="compliance-item">
                  <span class="item-name">안전보건관리규정 게시</span>
                  <span class="badge badge-secondary">미등록</span>
                  <button class="btn-sm btn-primary" onclick="registerItem(4)">등록</button>
                </div>
              </div>
            </div>
            
            <div class="compliance-category">
              <h4>교육/훈련 이행관리</h4>
              <div class="compliance-items">
                <div class="compliance-item completed">
                  <span class="item-name">산업안전보건교육</span>
                  <span class="badge badge-success">등록완료</span>
                  <button class="btn-sm" onclick="viewItem(11)">보기</button>
                </div>
                <div class="compliance-item">
                  <span class="item-name">관리감독자 교육</span>
                  <span class="badge badge-secondary">미등록</span>
                  <button class="btn-sm btn-primary" onclick="registerItem(12)">등록</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h3>최근 공지사항 <span class="badge badge-new">N</span></h3>
          <div class="notice-list">
            <div class="notice-item">
              <span class="badge badge-new">신규</span>
              <a href="/site/notices/1">[산업안전보건관리단] 화재사고 사례 전파</a>
              <span class="date">2025-01-10</span>
            </div>
          </div>
        </div>
      </main>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          function closePopup() {
            document.querySelector('.popup-alert').classList.remove('show');
          }
          
          function goToCompliance() {
            window.location.href = '/site/compliance';
          }
          
          function viewItem(itemId) {
            window.location.href = '/site/compliance/' + itemId;
          }
          
          function registerItem(itemId) {
            window.location.href = '/site/compliance/' + itemId + '/register';
          }
        `
      }} />
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

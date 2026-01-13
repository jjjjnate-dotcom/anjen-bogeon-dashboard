-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK(role IN ('admin', 'headquarters', 'site')),
  organization_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 조직 테이블 (본사/사업장)
CREATE TABLE IF NOT EXISTS organizations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('education_center', 'headquarters', 'site')),
  parent_id INTEGER,
  address TEXT,
  manager_name TEXT,
  manager_phone TEXT,
  manager_email TEXT,
  contract_start_date DATE,
  contract_end_date DATE,
  direct_employees INTEGER DEFAULT 0,
  contract_employees INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES organizations(id)
);

-- 직원 정보 테이블
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  position TEXT,
  gender TEXT CHECK(gender IN ('male', 'female')),
  phone TEXT,
  email TEXT,
  hire_date DATE,
  designation_type TEXT CHECK(designation_type IN ('safety_manager', 'health_manager', 'supervisor', 'general_manager')),
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- 협력업체 테이블
CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  representative_name TEXT,
  representative_phone TEXT,
  manager_name TEXT,
  manager_phone TEXT,
  resident_count INTEGER DEFAULT 0,
  contract_start_date DATE,
  contract_end_date DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- 이행 기간 테이블 (반기별 관리)
CREATE TABLE IF NOT EXISTS compliance_periods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  period TEXT NOT NULL CHECK(period IN ('first_half', 'second_half')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'closed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(year, period)
);

-- 이행 항목 카테고리
CREATE TABLE IF NOT EXISTS compliance_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  frequency TEXT CHECK(frequency IN ('semi_annual', 'annual')),
  order_index INTEGER DEFAULT 0
);

-- 이행 항목
CREATE TABLE IF NOT EXISTS compliance_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  required_file INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES compliance_categories(id)
);

-- 이행 요청
CREATE TABLE IF NOT EXISTS compliance_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  period_id INTEGER NOT NULL,
  requester_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  request_type TEXT CHECK(request_type IN ('regular', 'irregular', 'individual')),
  target_date DATE,
  send_sms INTEGER DEFAULT 0,
  send_email INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (period_id) REFERENCES compliance_periods(id),
  FOREIGN KEY (requester_id) REFERENCES users(id)
);

-- 이행 요청 대상 (어떤 사업장에 요청했는지)
CREATE TABLE IF NOT EXISTS compliance_request_targets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  organization_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'submitted', 'rejected', 'completed')),
  FOREIGN KEY (request_id) REFERENCES compliance_requests(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- 이행 기록 (사업장이 등록한 이행 내용)
CREATE TABLE IF NOT EXISTS compliance_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_target_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  organization_id INTEGER NOT NULL,
  submitter_id INTEGER NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'submitted', 'rejected', 'approved')),
  rejection_reason TEXT,
  submitted_at DATETIME,
  reviewed_at DATETIME,
  reviewer_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_target_id) REFERENCES compliance_request_targets(id),
  FOREIGN KEY (item_id) REFERENCES compliance_items(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (submitter_id) REFERENCES users(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- 첨부 파일
CREATE TABLE IF NOT EXISTS attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  record_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (record_id) REFERENCES compliance_records(id)
);

-- 교육 기록
CREATE TABLE IF NOT EXISTS education_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  period_id INTEGER NOT NULL,
  education_type TEXT NOT NULL,
  education_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'registered', 'confirmed', 'completed')),
  completion_date DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (period_id) REFERENCES compliance_periods(id)
);

-- 공지사항/사고사례
CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('notice', 'accident', 'safety_material')),
  title TEXT NOT NULL,
  content TEXT,
  author_id INTEGER NOT NULL,
  is_new INTEGER DEFAULT 1,
  view_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 공지사항 첨부파일
CREATE TABLE IF NOT EXISTS notice_attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  notice_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notice_id) REFERENCES notices(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_organizations_parent ON organizations(parent_id);
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(type);
CREATE INDEX IF NOT EXISTS idx_employees_organization ON employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_compliance_records_organization ON compliance_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_compliance_records_status ON compliance_records(status);
CREATE INDEX IF NOT EXISTS idx_compliance_request_targets_organization ON compliance_request_targets(organization_id);

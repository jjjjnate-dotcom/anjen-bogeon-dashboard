-- 교육원 (최상위 조직) 생성
INSERT INTO organizations (id, name, type, parent_id, status) VALUES 
  (1, '한공원 교육원', 'education_center', NULL, 'active');

-- 본사 생성 (교육원 산하)
INSERT INTO organizations (id, name, type, parent_id, address, manager_name, manager_phone, manager_email, status) VALUES 
  (2, '무림개발 본사', 'headquarters', 1, '서울시 강남구', '홍길동', '010-1234-5678', 'hong@murim.com', 'active'),
  (3, 'ABC건설 본사', 'headquarters', 1, '서울시 서초구', '김철수', '010-2345-6789', 'kim@abc.com', 'active');

-- 사업장 생성 (본사 산하)
INSERT INTO organizations (id, name, type, parent_id, address, manager_name, manager_phone, manager_email, contract_start_date, contract_end_date, direct_employees, contract_employees, status) VALUES 
  (4, '무림하우징 1단지', 'site', 2, '경기도 성남시', '이영희', '010-3456-7890', 'lee@murim.com', '2024-01-01', '2025-12-31', 15, 25, 'active'),
  (5, '무림하우징 2단지', 'site', 2, '경기도 용인시', '박민수', '010-4567-8901', 'park@murim.com', '2024-01-01', '2025-12-31', 12, 20, 'active'),
  (6, 'ABC아파트 A동', 'site', 3, '서울시 송파구', '최지훈', '010-5678-9012', 'choi@abc.com', '2024-01-01', '2025-12-31', 10, 18, 'active');

-- 사용자 생성 (비밀번호: password123)
-- 교육원 관리자
INSERT INTO users (id, email, password, name, phone, role, organization_id) VALUES 
  (1, 'admin@education.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '교육원관리자', '010-0000-0001', 'admin', 1);

-- 본사 담당자
INSERT INTO users (id, email, password, name, phone, role, organization_id) VALUES 
  (2, 'hong@murim.com', 'password123', '홍길동', '010-1234-5678', 'headquarters', 2),
  (3, 'kim@abc.com', 'password123', '김철수', '010-2345-6789', 'headquarters', 3);

-- 사업장 담당자
INSERT INTO users (id, email, password, name, phone, role, organization_id) VALUES 
  (4, 'lee@murim.com', 'password123', '이영희', '010-3456-7890', 'site', 4),
  (5, 'park@murim.com', 'password123', '박민수', '010-4567-8901', 'site', 5),
  (6, 'choi@abc.com', 'password123', '최지훈', '010-5678-9012', 'site', 6);

-- 이행 카테고리 생성
INSERT INTO compliance_categories (id, name, code, description, frequency, order_index) VALUES 
  (1, '안전보건 이행관리', 'SAFETY_HEALTH', '안전보건관리 관련 이행 사항', 'semi_annual', 1),
  (2, '교육/훈련 이행관리', 'EDUCATION', '교육 및 훈련 관련 이행 사항', 'semi_annual', 2),
  (3, '위험성평가 이행관리', 'RISK_ASSESSMENT', '위험성 평가 관련 이행 사항', 'annual', 3),
  (4, '종사자의견청취 이행관리', 'EMPLOYEE_OPINION', '종사자 의견청취 관련 이행 사항', 'semi_annual', 4),
  (5, '용역/도급 안전관리 이행관리', 'CONTRACTOR_SAFETY', '용역/도급 안전관리 관련 이행 사항', 'semi_annual', 5);

-- 이행 항목 생성 (안전보건)
INSERT INTO compliance_items (category_id, name, code, description, required_file, order_index) VALUES 
  (1, '작업중지권 게시 이행', 'SAFETY_001', '작업중지권 게시 이행 보고', 1, 1),
  (1, 'MSDS 게시 이행', 'SAFETY_002', 'MSDS 게시 확인 및 교육 대장', 1, 2),
  (1, '법령의 요지 게시 이행', 'SAFETY_003', '법령의 요지 게시 이행 결과 보고', 1, 3),
  (1, '안전보건관리규정 게시 이행', 'SAFETY_004', '안전보건관리규정 게시 이행 결과 보고', 1, 4),
  (1, '휴게시설 현황 점검 이행', 'SAFETY_005', '휴게시설 현황 대장', 1, 5),
  (1, '안전보건 표지 설치, 부착 이행', 'SAFETY_006', '안전보건 표지 설치 현황 대장', 1, 6),
  (1, '보호구 지급대장', 'SAFETY_007', '보호구 지급대장 작성 및 제출', 1, 7),
  (1, '작업장 점검 확인대장', 'SAFETY_008', '작업장 점검 확인대장 작성', 1, 8),
  (1, '적격품 확인 대장', 'SAFETY_009', '적격품 확인 대장 작성', 1, 9),
  (1, '유해, 위험 확인 대장', 'SAFETY_010', '유해, 위험 확인 대장 작성', 1, 10),
  (1, '작업시작 전 점검 대장', 'SAFETY_011', '작업시작 전 점검 대장 작성', 1, 11);

-- 이행 항목 생성 (교육/훈련)
INSERT INTO compliance_items (category_id, name, code, description, required_file, order_index) VALUES 
  (2, '산업안전보건교육', 'EDU_001', '산업안전보건교육 실시', 1, 1),
  (2, '관리감독자 교육', 'EDU_002', '관리감독자 안전보건교육', 1, 2),
  (2, 'MSDS 교육', 'EDU_003', 'MSDS 취급 및 관리 교육', 1, 3),
  (2, '위험성평가 주지 교육', 'EDU_004', '위험성평가 결과 주지 교육', 1, 4),
  (2, '작업복, 보호구 점검 및 착용교육', 'EDU_005', '작업복, 보호구 착용교육', 1, 5),
  (2, '위험작업시 안전수칙 교육', 'EDU_006', '위험작업시 안전수칙 교육', 1, 6),
  (2, '비상대응 메뉴얼 훈련/교육', 'EDU_007', '비상대응 메뉴얼 훈련', 1, 7),
  (2, '성희롱 예방교육', 'EDU_008', '성희롱 예방교육 (법정)', 1, 8),
  (2, '장애인 인식개선교육', 'EDU_009', '장애인 인식개선교육 (법정)', 1, 9),
  (2, '개인정보보호교육', 'EDU_010', '개인정보보호교육 (법정)', 1, 10);

-- 이행 기간 생성 (2025년)
INSERT INTO compliance_periods (year, period, start_date, end_date, status) VALUES 
  (2025, 'first_half', '2025-01-01', '2025-06-30', 'active'),
  (2025, 'second_half', '2025-07-01', '2025-12-31', 'active');

-- 테스트용 이행 요청 생성
INSERT INTO compliance_requests (period_id, requester_id, title, content, request_type, target_date, send_sms, send_email) VALUES 
  (1, 2, '2025년 상반기 안전보건 이행 사항 등록 요청', '매년 [반기] 정기적으로 안전,보건 이행 점검을 실시 하고 있습니다. 개별 현장담당자 께서는 요청기간 안전보건 이행 사항을 등록해 주시기 바랍니다.', 'regular', '2025-06-30', 1, 1);

-- 이행 요청 대상 설정 (무림개발 본사의 모든 사업장)
INSERT INTO compliance_request_targets (request_id, organization_id, status) VALUES 
  (1, 4, 'pending'),
  (1, 5, 'pending');

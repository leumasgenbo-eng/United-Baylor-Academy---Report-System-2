-- United Baylor Academy Report System Database Schema
-- Created: December 9, 2025

-- ============================================================================
-- GLOBAL SETTINGS TABLE
-- ============================================================================
CREATE TABLE global_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  school_name VARCHAR(255) NOT NULL,
  exam_title VARCHAR(255),
  mock_series VARCHAR(255),
  mock_announcement TEXT,
  mock_deadline VARCHAR(255),
  term_info VARCHAR(255),
  academic_year VARCHAR(50),
  next_term_begin VARCHAR(255),
  attendance_total VARCHAR(50),
  start_date VARCHAR(255),
  end_date VARCHAR(255),
  head_teacher_name VARCHAR(255),
  report_date VARCHAR(255),
  school_contact VARCHAR(255),
  school_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- STAFF/FACILITATOR TABLES
-- ============================================================================
CREATE TABLE staff_members (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role ENUM('Class Teacher', 'Subject Teacher', 'Both') NOT NULL,
  status ENUM('Full Time', 'Part Time') NOT NULL,
  contact VARCHAR(255),
  qualification VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE staff_subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  staff_id VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff_members(id) ON DELETE CASCADE,
  UNIQUE KEY unique_staff_subject (staff_id, subject)
);

CREATE TABLE facilitator_stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  facilitator_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  student_count INT DEFAULT 0,
  total_grade_value INT DEFAULT 0,
  performance_percentage DECIMAL(5, 2),
  average_grade_value DECIMAL(5, 2),
  performance_grade VARCHAR(5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_facilitator_subject (facilitator_name, subject)
);

CREATE TABLE facilitator_grade_distribution (
  id INT PRIMARY KEY AUTO_INCREMENT,
  facilitator_stat_id INT NOT NULL,
  grade VARCHAR(5) NOT NULL,
  count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (facilitator_stat_id) REFERENCES facilitator_stats(id) ON DELETE CASCADE,
  UNIQUE KEY unique_stat_grade (facilitator_stat_id, grade)
);

-- ============================================================================
-- STUDENT TABLES
-- ============================================================================
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT UNIQUE,
  name VARCHAR(255) NOT NULL,
  department ENUM('Daycare', 'Nursery', 'Kindergarten', 'Lower Basic School', 'Upper Basic School', 'Junior High School') NOT NULL,
  class_name VARCHAR(50),
  gender ENUM('Male', 'Female'),
  date_of_birth VARCHAR(255),
  guardian VARCHAR(255),
  contact VARCHAR(255),
  address TEXT,
  
  -- Daycare Specifics
  age VARCHAR(50),
  promoted_to VARCHAR(50),
  conduct VARCHAR(255),
  interest TEXT,
  
  -- General Academic Info
  attendance VARCHAR(50),
  overall_remark TEXT,
  final_remark TEXT,
  recommendation TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_department (department),
  INDEX idx_class (class_name)
);

-- ============================================================================
-- STUDENT SCORES TABLES
-- ============================================================================
CREATE TABLE student_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  score DECIMAL(5, 2),
  total_score DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_subject (student_id, subject)
);

CREATE TABLE student_score_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  section_a DECIMAL(5, 2),
  section_b DECIMAL(5, 2),
  total DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_subject_detail (student_id, subject)
);

CREATE TABLE subject_remarks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  remark TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_subject_remark (student_id, subject)
);

-- ============================================================================
-- COMPUTED/PROCESSED STUDENT DATA TABLES
-- ============================================================================
CREATE TABLE processed_students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  total_score DECIMAL(8, 2),
  best_six_aggregate DECIMAL(8, 2),
  overall_remark TEXT,
  recommendation TEXT,
  weakness_analysis TEXT,
  category VARCHAR(100),
  rank INT,
  attendance VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_processed_student (student_id)
);

CREATE TABLE computed_subject_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  processed_student_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  score DECIMAL(5, 2),
  grade VARCHAR(5),
  grade_value INT,
  remark TEXT,
  facilitator VARCHAR(255),
  z_score DECIMAL(10, 4),
  is_core_subject BOOLEAN DEFAULT FALSE,
  is_best_six BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (processed_student_id) REFERENCES processed_students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_computed_subject (processed_student_id, subject)
);

-- ============================================================================
-- DAYCARE SPECIFIC TABLES
-- ============================================================================
CREATE TABLE daycare_skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  skill_name VARCHAR(255) NOT NULL,
  rating ENUM('D', 'A', 'A+'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_skill (student_id, skill_name)
);

-- ============================================================================
-- CLASS STATISTICS TABLE
-- ============================================================================
CREATE TABLE class_statistics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  department ENUM('Daycare', 'Nursery', 'Kindergarten', 'Lower Basic School', 'Upper Basic School', 'Junior High School') NOT NULL,
  class_name VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  mean_score DECIMAL(8, 4),
  std_dev DECIMAL(8, 4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_class_subject (department, class_name, subject)
);

-- ============================================================================
-- SUBJECT CONFIGURATION TABLE
-- ============================================================================
CREATE TABLE subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  department ENUM('Daycare', 'Nursery', 'Kindergarten', 'Lower Basic School', 'Upper Basic School', 'Junior High School') NOT NULL,
  is_core BOOLEAN DEFAULT FALSE,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_subject_dept (name, department)
);

CREATE TABLE subject_facilitators (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject VARCHAR(255) NOT NULL,
  facilitator_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_subject_facilitator (subject, facilitator_name),
  FOREIGN KEY (subject) REFERENCES subjects(name) ON DELETE CASCADE
);

-- ============================================================================
-- GRADING SYSTEM TABLE
-- ============================================================================
CREATE TABLE grading_system (
  id INT PRIMARY KEY AUTO_INCREMENT,
  grade_code VARCHAR(5) NOT NULL UNIQUE,
  grade_name VARCHAR(100),
  description TEXT,
  min_score DECIMAL(5, 2),
  max_score DECIMAL(5, 2),
  grade_value INT,
  remark TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_grade (grade_code)
);

-- ============================================================================
-- DEVELOPMENTAL INDICATORS TABLE (Daycare)
-- ============================================================================
CREATE TABLE developmental_indicators (
  id INT PRIMARY KEY AUTO_INCREMENT,
  indicator_name VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- SCHOOL CLASSES/SECTIONS TABLE
-- ============================================================================
CREATE TABLE school_classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_code VARCHAR(50) NOT NULL UNIQUE,
  class_name VARCHAR(255),
  department ENUM('Daycare', 'Nursery', 'Kindergarten', 'Lower Basic School', 'Upper Basic School', 'Junior High School') NOT NULL,
  capacity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- AUDIT/ACTIVITY LOG TABLE
-- ============================================================================
CREATE TABLE activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INT,
  user_id VARCHAR(255),
  old_values JSON,
  new_values JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEX OPTIMIZATION
-- ============================================================================
CREATE INDEX idx_student_department_class ON students(department, class_name);
CREATE INDEX idx_student_scores_subject ON student_scores(subject);
CREATE INDEX idx_processed_student_rank ON processed_students(rank);
CREATE INDEX idx_facilitator_stats_subject ON facilitator_stats(subject);
CREATE INDEX idx_class_stats_subject ON class_statistics(subject);
CREATE INDEX idx_activity_logs_date ON activity_logs(created_at);

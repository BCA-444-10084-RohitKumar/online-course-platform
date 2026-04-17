-- ============================================================
--  EduVerse — Online Course Selling Platform
--  MySQL Schema + Sample Data
--  Run: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS course_platform
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE course_platform;

-- ─────────────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id       BIGINT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(100)  NOT NULL,
  email    VARCHAR(150)  NOT NULL UNIQUE,
  password VARCHAR(255)  NOT NULL,
  phone    VARCHAR(15),
  role     ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────
-- COURSES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  price       DOUBLE       NOT NULL,
  video_url   TEXT,
  image_url   TEXT,
  instructor  VARCHAR(100),
  category    VARCHAR(60),
  duration    INT COMMENT 'Duration in hours'
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────
-- PAYMENT ORDERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_orders (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100),
  email       VARCHAR(150),
  phone       VARCHAR(15),
  course_name VARCHAR(200),
  amount      DOUBLE,
  order_id    VARCHAR(100) UNIQUE,
  payment_id  VARCHAR(100),
  status      VARCHAR(20)  DEFAULT 'PENDING',
  course_id   BIGINT,
  user_id     BIGINT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_id  (order_id),
  INDEX idx_user_id   (user_id),
  INDEX idx_status    (status)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────
-- USER_COURSES  (purchased access)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_courses (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT NOT NULL,
  course_id     BIGINT NOT NULL,
  purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_course (user_id, course_id),
  INDEX idx_uc_user (user_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────
-- ENROLLMENTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT   NOT NULL,
  course_id   BIGINT   NOT NULL,
  enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_enrollment (user_id, course_id)
) ENGINE=InnoDB;

-- ═════════════════════════════════════════════════════════════
-- SAMPLE DATA
-- ═════════════════════════════════════════════════════════════

-- Admin user  (password: admin123  →  BCrypt hash)
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin',
 'admin@eduverse.com',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCjkgfPLFMRn0y7nFCJo1GW',
 '9000000000',
 'ADMIN');

-- Sample student (password: user123)
INSERT INTO users (name, email, password, phone, role) VALUES
('Rahul Sharma',
 'rahul@example.com',
 '$2a$12$eImiTXuWVxfM37uY4JANjQe5rEzTbMsOEPaFKChE1QWvlgpiYBkVS',
 '9876543210',
 'USER');

-- Sample courses
INSERT INTO courses (title, description, price, video_url, image_url, instructor, category, duration) VALUES

('Full Stack React & Spring Boot',
 'Build complete production-grade web applications with React.js on the frontend and Spring Boot on the backend. Covers REST APIs, JWT auth, MySQL, Razorpay integration and cloud deployment.',
 4999,
 'https://www.youtube.com/embed/SqcY0GlETPk',
 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
 'Rahul Verma',
 'Web Development',
 40),

('Python for Data Science & ML',
 'Master Python, Pandas, NumPy, Matplotlib, Scikit-Learn and TensorFlow. Build real machine learning models from scratch with hands-on projects on real-world datasets.',
 3499,
 'https://www.youtube.com/embed/LHBE0uDTQOI',
 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80',
 'Priya Patel',
 'Data Science',
 35),

('AWS Cloud Practitioner Complete',
 'Ace the AWS Cloud Practitioner certification with this comprehensive course. Covers IAM, EC2, S3, RDS, Lambda, CloudFormation and all core AWS services with hands-on labs.',
 5999,
 'https://www.youtube.com/embed/3hLmDS179YE',
 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
 'Amit Kumar',
 'Cloud Computing',
 30),

('Java DSA Masterclass',
 'Deep dive into Data Structures and Algorithms using Java. Covers arrays, linked lists, trees, graphs, dynamic programming and sorting algorithms with 200+ LeetCode problems solved step by step.',
 2999,
 'https://www.youtube.com/embed/RBSGKlAvoiM',
 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80',
 'Vikram Singh',
 'Programming',
 50),

('UI/UX Design with Figma',
 'Learn professional UI/UX design from scratch using Figma. Covers wireframing, prototyping, design systems, user research and building a portfolio of real projects employers love.',
 2499,
 'https://www.youtube.com/embed/FTFaQWZBqQ8',
 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
 'Neha Agarwal',
 'Design',
 25),

('DevOps with Docker & Kubernetes',
 'Become a DevOps engineer with this complete course on containerisation, CI/CD pipelines, Kubernetes orchestration, Helm charts, monitoring with Prometheus and GitOps workflows.',
 5499,
 'https://www.youtube.com/embed/PziYflu8cB8',
 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80',
 'Saurav Mehta',
 'DevOps',
 45);

-- Grant sample student access to course 1
INSERT INTO user_courses (user_id, course_id) VALUES (2, 1);
INSERT INTO enrollments  (user_id, course_id) VALUES (2, 1);

-- Sample payment record
INSERT INTO payment_orders
  (name, email, phone, course_name, amount, order_id, payment_id, status, course_id, user_id)
VALUES
  ('Rahul Sharma','rahul@example.com','9876543210',
   'Full Stack React & Spring Boot', 4999,
   'order_sample001','pay_sample001','PAID', 1, 2);

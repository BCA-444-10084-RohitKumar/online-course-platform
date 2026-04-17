Online Course Platform
A full-stack web application for selling and managing online courses.
Tech Stack: React.js + Spring Boot 4.x + MySQL + JWT + Razorpay + Spring Mail

 Project Structure
CourseSellingPlatform/
├── backend/          → Spring Boot REST API (Port 8080)
├── frontend/         → React + Vite (Port 5173)
└── database/
    └── schema.sql    → MySQL schema + sample data
 Quick Start
Prerequisites
Java 17+
Maven 3.6+
Node.js 18+
MySQL 8.0+
 Step 1 — Database Setup
# Login to MySQL
mysql -u root -p

# Run the schema
source /path/to/online-course-Platform/database/schema.sql

# Or directly:
mysql -u root -p < database/schema.sql
Default admin credentials seeded in DB:

Email: admin@gmail.com
Password: admin123
Default student credentials:

Email: rahul@example.com
Password: user123
Step 2 — Backend Setup
2a. Configure application.properties
Edit backend/src/main/resources/application.properties:

# MySQL (change password!)
spring.datasource.url=jdbc:mysql://localhost:3306/course_platform?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=My SQL Password

# Razorpay Test Keys (get from https://dashboard.razorpay.com)
razorpay.key.id=rzp_test_XXXXXXXXXX
razorpay.key.secret=XXXXXXXXXXXXXXXX

# Gmail (use App Password, not account password)
# Enable: Google Account → Security → 2FA → App Passwords
spring.mail.username=your_email@gmail.com
spring.mail.password=_App_password
2b. Run Spring Boot
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
Backend runs at: http://localhost:8080
 Step 3 — Frontend Setup
3a. Configure environment
Create frontend/.env:

VITE_RAZORPAY_KEY=rzp_test_YOUR_KEY_ID_HERE
3b. Install & run
cd frontend
npm install
npm run dev
Frontend runs at: http://localhost:5173

 Login Credentials
Role	Email	Password
Admin	admin@eduverse.com	admin123
User	rahul@example.com	user123
 API Endpoints
Method	Endpoint	Access	Description
POST	/api/auth/signup	Public	Register user
POST	/api/auth/login	Public	User login → JWT
POST	/api/admin/auth/login	Public	Admin login → JWT
GET	/api/courses	Public	List all courses
GET	/api/courses/{id}	Public	Get course by ID
GET	/api/access/courses?email=	USER	Get user's purchased courses
POST	/api/payment/create-order	AUTH	Create Razorpay order
POST	/api/payment/update-order	AUTH	Update payment status
GET	/api/admin/dashboard	ADMIN	Dashboard stats
POST	/api/admin/course	ADMIN	Add course
PUT	/api/admin/course/{id}	ADMIN	Update course
DELETE	/api/admin/course/{id}	ADMIN	Delete course
GET	/api/admin/students	ADMIN	All users
GET	/api/admin/transactions	ADMIN	All payments
GET	/api/admin/enrollments	ADMIN	All enrollments
 Razorpay Test Payment
Use these test card details in Razorpay checkout:

Field	Value
Card Number	4111 1111 1111 1111
Expiry	Any future date
CVV	Any 3 digits
OTP	1234 (test)
 Email Setup (Gmail)
Go to Google Account → Security → 2-Step Verification → Enable
Go to App Passwords → Generate for "Mail"
Use the 16-character password in application.properties
 Security Notes
JWT tokens expire in 24 hours
Passwords hashed with BCrypt (strength 12)
/api/admin/** → ADMIN role only (verified server-side)
/api/access/** → USER role only
CORS restricted to http://localhost:5173
Build for Production
Backend
cd backend
mvn clean package -DskipTests
java -jar target/PaymentGateway-0.0.1-SNAPSHOT.jar
Frontend
cd frontend
npm run build
# Output in frontend/dist/
 Troubleshooting
Problem	Solution
CORS error	Ensure backend is running on port 8080
401 Unauthorized	Check JWT token in localStorage
Razorpay not loading	Add <script> tag for Razorpay in index.html
Email not sending	Use Gmail App Password, not account password
DB connection error	Check MySQL is running, password is correct
Port 8080 in use	Change server.port in application.properties

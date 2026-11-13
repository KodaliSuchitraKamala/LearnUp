# 🚀 LearnUp LMS - Backend (Spring Boot + MySQL)

Backend for LearnUp LMS - Full Stack Learning Management System.
Handles Users, Courses, Enrollments, Follows, File Uploads (Video/PDF from Laptop) and Live Meet links.

## ✨ Features
- **Users:** Register / Login as STUDENT or INSTRUCTOR - saved in one `users` table with real MySQL ID
- **Courses:** Create, Update, Delete, Search - with Videos, Documents, Live Meet per course
- **Enrollments:** Student Enroll -> Saved in MySQL -> Instructor Dashboard updates live
- **Follows:** Student Follow Instructor -> Saved in MySQL
- **File Upload:** Instructor uploads Video / PDF from Laptop - No size limit - Saved in `backend/uploads/` with original file name
- **Live Meet:** Instructor adds Google Meet link + Title + Time per course - Student clicks Join

## 🛠️ Tech Stack
- **Java 17** + **Spring Boot 3.5.5**
- **Spring Data JPA + Hibernate**
- **MySQL 8.0** - Database `learnup`
- **Maven** - Build tool
- **REST API** - JSON

## 📁 Project Structure
```
LearnUp
├── backend/
│   ├── src/main/java/com/learnup/
│   │   ├── LearnupApplication.java
│   │   ├── config/
│   │   │   └── WebConfig.java          # Serves /uploads/** + CORS
│   │   ├── controller/
│   │   │   ├── CourseController.java   # GET/POST/PUT/DELETE /api/courses + Search
│   │   │   ├── UserController.java     # GET/POST /api/users + Register/Login
│   │   │   ├── EnrollmentController.java # /api/enrollments
│   │   │   ├── FollowController.java   # /api/follows
│   │   │   └── UploadController.java   # POST /api/upload - File from Laptop
│   │   ├── model/
│   │   │   ├── Course.java             # courses table
│   │   │   ├── User.java               # users table
│   │   │   ├── Enrollment.java         # enrollments table
│   │   │   └── Follow.java             # follows table
│   │   └── repository/
│   │   │   ├── CourseRepository.java
│   │   │   ├── UserRepository.java
│   │   │   ├── EnrollmentRepository.java
│   │   │   └── FollowRepository.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── uploads/                        # Uploaded Videos / PDFs (auto-created)
│   ├── .gitattributes
│   ├── .gitignore
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── .mvn/
│   ├── README.md
│   └── pom.xml
├── frontend/
└── README.md
```

## 🗄️ Database Tables (MySQL - `learnup`)

### 1. `users` - One table for Instructor + Student
| Column | Type | Note |
| --- | --- | --- |
| id | BIGINT PK AI | Real MySQL ID |
| name | VARCHAR | Full Name |
| email | VARCHAR UNIQUE | Login email |
| password | VARCHAR | Plain (demo) |
| role | VARCHAR | STUDENT / INSTRUCTOR |

```sql
SELECT id, name, email, role FROM users;
SELECT role, COUNT(*) FROM users GROUP BY role;
```

### 2. courses
| Column | Type | Note |
| --- | --- | --- |
| id | BIGINT PK AI | |
| title, instructor, category | VARCHAR | |
| price | DOUBLE | |
| image, description, duration | VARCHAR | |
| videos | VARCHAR(2000) | JSON: [{"title":"Intro","url":"/uploads/...","fileName":"React-Intro.mp4"}] |
| documents | VARCHAR(2000) | JSON: [{"title":"Notes","url":"/uploads/...","fileName":"Week1-Notes.pdf"}] | 
| meet_link | VARCHAR | Google Meet Link |
| live_class_title | VARCHAR | Ex: Doubt Session |
| live_class_at | VARCHAR | DateTime |

### 3. enrollments
| Column | Type | 
| --- | --- |
| id | BIGINT PK AI | 
| course_id, course_title, price | |
| student_name, student_email, instructor_name | |

### 4. follows
| Column | Type | 
| --- | --- |
| id | BIGINT PK AI | 
| instructor_name, student_name, student_email | |

## ▶️ How to Run
### 1. Create Database(MySQL Terminal)
```sql
CREATE DATABASE learnup;
CREATE USER 'learnup'@'localhost' IDENTIFIED BY 'learnup123';
GRANT ALL PRIVILEGES ON learnup.* TO 'learnup'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Check application.properties
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/learnup?createDatabaseIfNotExist=true
spring.datasource.username=learnup
spring.datasource.password=learnup123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.servlet.multipart.max-file-size=-1
spring.servlet.multipart.max-request-size=-1
```
>ddl-auto=update auto-creates users, courses, enrollments, follows tables. No manual SQL needed.

### 3. Run Backend
```bash
cd backend
./mvnw spring-boot:run
# OR
mvn spring-boot:run
# Runs on http://localhost:8080
```
You should see:
```javascript
Tomcat started on port 8080
Hibernate: create table users ...
```

## 🔌 API Endpoints
### Users
| Method | Endpoints | Body | Use | 
| --- | --- | --- | --- |
| GET | /api/users | - | All Users (Student + Instructor) |
| GET | /api/users/role/STUDENT | - | Only Students|
| GET | /api/users/role/INSTRUCTOR | - | Only Instructors|
| POST | /api/users/register | {name, email, password, role} | Register - returns user with ID |
| POST | /api/users/login | {email, password} | Login |
| DELETE | /api/users/{id} | - | Delete user |

### Courses
| Method | Endpoint | Body |
| --- | --- | --- | 
| GET | /api/courses | All courses |
| GET | /api/courses/search?keyword=React | Search by title/instuctor | 
| POST | /api/courses | Create course |
| PUT | /api/courses/{id} | Update - Edit / Videos / Docs / Meet |
| DELETE | /api/courses/{id} | Delete course |

### Enrollments & Follows
| Method | Endpoint |
| --- | --- | 
| GET / POST | /api/enrollments |
| GET / POST / DELETE | /api/follows |

### File Upload - Video / PDF from Laptop
| Method | Endpoint | Body |
| --- | --- | --- | 
| POST | /api/upload | FormData: file-No size limit |

**Response:**
```JSON
{
  "fileName": "React-Intro.mp4",
  "url": "/uploads/123456_React-Intro.mp4",
  "size": "5242880"
}
```
**Access file:**
http://localhost:8080/uploads/

## 🧪 Test with SQL
```SQL
USE learnup;
SHOW TABLES;
-- Should show: courses, enrollments, follows, users

SELECT id, name, email, role FROM users;
SELECT id, title, instructor, price, meet_link FROM courses;
SELECT * FROM enrollments;
SELECT * FROM follows;

-- Join - Instructor + Their Courses
SELECT u.id, u.name, u.role, c.title FROM users u
LEFT JOIN courses c ON c.instructor = u.name
WHERE u.role = 'INSTRUCTOR';

-- Join - Student + Enrolled Courses
SELECT u.id, u.name, e.course_title, e.price FROM users u
LEFT JOIN enrollments e ON e.student_email = u.email
WHERE u.role = 'STUDENT';
```

## 👩‍💻 Author
Kodali Suchitra Kamala - ExcelR Full Stack Project - Nov 2026
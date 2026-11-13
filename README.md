# 🎓 LearnUp LMS - Full Stack Learning Management System

**LearnUp** is a complete Full Stack Learning Platform built for Excelr Full Stack Project.
Students learn with real instructor-uploaded videos, download PDFs, join Live Classes on Google Meet, and earn certificates.
Instructors publish courses, upload videos/PDFs from their laptop, start Live Meet, and track students, followers & earnings in real-time.

**Built by:** Kodali Suchitra Kamala | **Excelr Full Stack Project** | **Nov 2026**
**Demo:** Instructor: `kodalisuchitrakamala@gmail.com` / Student: `student@test.com`

---

## ✨ Key Features

### 👩‍🎓 For Students
- 🔍 **Browse & Search** - Search by Title / Instructor / Category + Filter: All / Live / Video
- 🎥 **Watch Instructor Videos** - Plays MP4 uploaded from Instructor's laptop (with original file name) + YouTube / Drive support
- 📄 **Download Study Materials** - PDFs / PPTs / Notes uploaded by Instructor
- 🔴 **Join Live Class** - One click Join Google Meet per course - Interact with Instructor
- 🛒 **Enroll** - Enroll in 1 click -> Saved to MySQL -> Shows in My Learning
- 👤 **Follow Instructor** - Follow / Unfollow -> Instructor followers update live
- 📈 **Progress Tracking** - Mark videos as Complete -> Progress % in My Learning
- 🏆 **Certificate** - Complete 100% -> Download Certificate PNG with Name + Course + Certificate ID

### 🧑‍🏫 For Instructors
- 📊 **Dashboard** - My Courses, Total Students, Total Followers, Total Earnings (live from MySQL)
- ➕ **Add New Course** - Only Title, Category, Price, Description, Image -> Publish in 30 seconds
- 🎥 **Upload Video from Laptop** - Per course Manage -> Choose video -> No size limit -> Keeps original name `React-Intro.mp4`
- 📄 **Upload Document / PDF from Laptop** - Per course Manage -> Choose PDF -> Ex: `Week1-Notes.pdf`
- ✏️ **Edit Course** - Edit Title, Price, Description, Category, Image any time
- 🔴 **Start Live Meet** - Paste Google Meet link + Title + Time per course -> Student sees Join button
- 👀 **Track Students** - See who Enrolled & who Followed you

### 🎨 Common
- 🔐 **Auth** - Register / Login as Student or Instructor - One `users` table, MySQL ID for every user
- 🌗 **Dark / Light Mode** - Toggle in Navbar
- 📱 **Responsive** - Mobile / Tablet / Desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite, React Router DOM, Bootstrap 5, CSS Variables (Dark/Light) |
| Backend | Java 17, Spring Boot 3.5.5, Spring Data JPA + Hibernate |
| Database | MySQL 8.0 - Database `learnup` - Tables: `users`, `courses`, `enrollments`, `follows` |
| File Storage | Local `backend/uploads/` - Videos / PDFs from Laptop - No size limit |
| Live Class | Google Meet (link per course) |
| Tools | Maven, VS Code, Git/GitHub, Postman |

---

## 📁 Project Structure
```
LearnUp
├── frontend/
├── backend/
└── README.md
```

---

## ▶️ How to Run - 3 Steps

### 1. Database (MySQL)
```sql
CREATE DATABASE learnup;
CREATE USER 'learnup'@'localhost' IDENTIFIED BY 'learnup123';
GRANT ALL PRIVILEGES ON learnup.* TO 'learnup'@'localhost';
FLUSH PRIVILEGES;
```
>Tables users, courses, enrollments, follows auto-created by Hibernate (ddl-auto=update). No manual SQL needed.

### 2. Backend - Port 8080
```bash
cd backend
./mvnw spring-boot:run
# OR mvn spring-boot:run
# http://localhost:8080
```

### 3. Frontend - Port 5173
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```
Open http://localhost:5173 -> Register -> Start Learning.

## 🗄️ Database Design
### users - One table for Instructor + Student
```sql
id BIGINT PK AI | name VARCHAR | email VARCHAR UNIQUE | password VARCHAR | role VARCHAR -- STUDENT / INSTRUCTOR
```
```sql
SELECT id, name, email, role FROM users;
SELECT role, COUNT(*) AS total FROM users GROUP BY role;
```
### courses
```sql
id | title | instructor | category | price | image | description | duration
videos VARCHAR(2000)    -- JSON: [{"title":"Intro","url":"/uploads/...","fileName":"React-Intro.mp4"}]
documents VARCHAR(2000) -- JSON: [{"title":"Notes","url":"/uploads/...","fileName":"Week1-Notes.pdf"}]
meet_link VARCHAR       -- Google Meet link per course
live_class_title VARCHAR | live_class_at VARCHAR
```
### enrollments & follows
```sql
enrollments: id | course_id | course_title | price | student_name | student_email | instructor_name
follows:     id | instructor_name | student_name | student_email
```
### Joins - For Viva
```sql
-- Instructor + Their Courses
SELECT u.id, u.name, c.title FROM users u
LEFT JOIN courses c ON c.instructor = u.name WHERE u.role = 'INSTRUCTOR';

-- Student + Enrolled Courses
SELECT u.id, u.name, e.course_title, e.price FROM users u
LEFT JOIN enrollments e ON e.student_email = u.email WHERE u.role = 'STUDENT';
```

## 🔌 API Endpoints (Backend)
| Method | Endpoint | Use |
| --- | --- | --- |
| GET | /api/users | All Users |
| GET | /api/users/role/STUDENT / INSTRUCTOR | Filter by Role |
| POST | /api/users/register | Register -> Returns user with MySQL ID |
| POST | /api/users/login | Login |
| GET | /api/courses | All Courses |
| GET | /api/courses/search?keyword=React | Search |
| POST | /api/courses | Create Course |
| PUT | /api/courses/{id} | Update - Videos / Docs / Edit / Meet |
| DELETE | /api/courses/{id} | Delete Course |
| GET / POST | /api/enrollments | Enroll / List |
| GET / POST / DELETE | /api/follows |  Follow / Unfollow / List |
| POST | /api/upload | Upload Video/PDF from Laptop - FormData: file - No size limit |

**Upload Response**
```json
{ "fileName": "React-Intro.mp4", "url": "/uploads/123456_React-Intro.mp4" }
```

## 🎥 How Laptop Upload Works
```javascript
Instructor (Manage Course) -> Choose Video from Laptop (React-Intro.mp4)
  -> POST /api/upload -> Saved in backend/uploads/ -> Returns /uploads/...
  -> PUT /api/courses/{id} -> Saved as JSON in MySQL courses.videos
Student (Course Detail) -> Sees 📁 React-Intro.mp4 -> Clicks ▶️ Watch -> Plays in Player
```
Same for PDF: Week1-Notes.pdf -> Student sees Download / View.

## 🔴 How Live Meet Works
```javascript
Instructor: meet.google.com -> New Meeting -> Copy link
  -> Manage Course -> 🔴 Start Live Meet -> Paste link + Title + Time -> Save
Student: Course Detail -> Sees 🔴 Live Class - Doubt Session • 2026-11-14 18:00
  -> Click [📹 Join Google Meet] -> Opens Meet in new tab
```

## 🏆 How Certificate Works
```javascript
Student marks all videos Complete -> Progress = 100%
  -> 🏆 Congratulations Card -> Download Certificate
  -> Canvas PNG 1400x900: Name (cursive) + Course + Instructor + Date + ID LULMS-{id}-{random}
```

## 👩‍💻 AuthorKodali Suchitra Kamala
ExcelR Full Stack Development - Project: LearnUp LMS - Nov 2026
GitHub: [[Add your GitHub link](https://github.com/KodaliSuchitraKamala/LearnUp)]

## 📄 License
This project is for educational purposes - Excelr Full Stack Project.
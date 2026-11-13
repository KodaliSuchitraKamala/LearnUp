# 🎨 LearnUp LMS - Frontend (React + Vite)

Frontend for LearnUp LMS - Full Stack Learning Management System.
Students browse, enroll, follow, learn with instructor-uploaded videos, download PDFs, join Live Meet and get certificates.
Instructors publish courses, upload videos/PDFs from laptop, start Live Meet, and track students, followers & earnings.

## ✨ Features

### 👩‍🎓 Student
- **Browse Courses** - Search by Title / Instructor / Category + Filter: All / Live / Video
- **Course Detail** - View instructor-uploaded Videos (with original file name), Documents/PDFs, Live Meet card
- **Enroll** - One click Enroll -> Saved to MySQL -> Goes to My Learning
- **Follow Instructor** - Follow / Unfollow -> Instructor Followers +1 in real-time
- **Course Player** - Watch instructor-uploaded MP4 / YouTube / Drive video, Mark as Complete, Progress %
- **Certificate** - Complete 100% -> Download Certificate (Canvas PNG) with Name + Course + ID
- **Study Materials** - Download PDFs uploaded by instructor from laptop

### 🧑‍🏫 Instructor
- **Dashboard** - My Courses, Total Students, Followers, Earnings (live from MySQL)
- **Add New Course** - Only Title, Category, Price, Description, Image -> Publish in 30 sec
- **Manage Per Course** (in My Published Courses - no confusion):
    - 🎥 **Upload Video** - Choose video from Laptop - Keeps original name - No size limit - Ex: `React-Intro.mp4`
    - 📄 **Upload Document / PDF** - Choose PDF/PPT/Notes from Laptop - Ex: `Week1-Notes.pdf`
    - ✏️ **Edit Course** - Title, Category, Price, Description, Image
    - 🔴 **Start Live Meet** - Paste Google Meet link + Title + Time - Student sees Join button
- **Recent Followers & Enrollments** - Shows who enrolled / followed from MySQL

### 🎨 Common
- **Auth** - Register / Login as Student or Instructor - User ID from MySQL `users` table
- **Dark / Light Mode** - Toggle in Navbar
- **Responsive** - Mobile / Tablet / Desktop

## 🛠️ Tech Stack
- **React 18 + Vite** - Fast frontend
- **React Router DOM** - Routing
- **Bootstrap 5** - UI + Cards + Modals
- **CSS Variables** - Dark/Light Theme (`--bg`, `--card-bg`, `--text`)
- **Fetch API** - Calls Backend REST API via Vite Proxy
- **localStorage** - Backup for Enroll / Progress / User (Backend MySQL is primary)

## 📁 Project Structure
```
LearnUp
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx             # Routes + Navbar + Theme            
│   │   ├── index.css              # Theme variables, Dark/Light
│   │   ├── data/
│   │   │   ├── courses.js              # Static demo courses (fallback)
│   │   ├── pages/
│   │   │   ├── CourseDetail.jsx              # Detail + Videos (fileName) + Docs + Live Meet + Certificate
│   │   │   ├── CourseList.jsx              # All Courses + Search + Filter + Live Badge
│   │   │   ├── CoursePlayer.jsx              # Video Player - Plays Laptop MP4 / YouTube / Drive
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── InstructorDashboard.jsx              # Add Course (simple) + Manage per course: Video/Doc/Edit/Live
│   │   │   ├── Login.jsx              # Login -> POST /api/users/login (MySQL first, local fallback)
│   │   │   ├── Register.jsx              # Register -> POST /api/users/register (MySQL ID)
│   │   │   ├── StudentDashboard.jsx              # My Learning, Progress, Certificate
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Shows Name + Role + Logout
│   │   └── main.jsx
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js              # Proxy: /api -> 8080, /uploads -> 8080
│   └── README.md
├── backend/
└── README.md
```


## ▶️ How to Run

### 1. Install
```bash
cd frontend
npm install
```

### 2. Run Frontend (Backend must be running first)
```bash
npm run dev
# Runs on http://localhost:5173
```

### 3. Run Backend (in another terminal)
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```
>Frontend talks to Backend via Proxy - no CORS issue. See vite.config.js:
```js
server: {
  proxy: {
    "/api": "http://localhost:8080",
    "/uploads": "http://localhost:8080"
  }
}
```

## 🔌 API Used (from Frontend)
| Page | API Call |
| --- | --- |
| Register | POST /api/users/register -> {name, email, password, role} -> Returns user with MySQL id |
| Login | POST /api/users/login -> {email, password} -> Checks MySQL first |
| CourseList / Detail / Player | GET /api/courses |
| Search |GET /api/courses/search?keyword=React (frontend also filters locally) |
| Instructor Add | POST /api/courses |
| Instructor Manage | PUT /api/courses/{id} -> Save Videos / Docs / Edit / Meet |
| Instructor Delete | DELETE /api/courses/{id} |
| Student Enroll | POST /api/enrollments |
| Student Follow | POST /api/follows / DELETE /api/follows|
| Upload Video/PDF | POST /api/upload -> FormData: file -> Returns {fileName, url} |

## 🎥 How Instructor Upload Works (Laptop -> Student)
1. **Instructor:** In My Published Courses -> Click **Manage** on one course -> **🎥 Upload Video** tab
2. Click **Choose Video from Laptop** -> Pick React-Intro.mp4 from laptop
3. File uploads to POST /api/upload -> Backend saves in backend/uploads/ -> Returns /uploads/
4. Instructor clicks **Save Videos** -> PUT /api/courses/{id} -> Saves JSON in MySQL:
```json
[{ "title": "Introduction", "url": "http://localhost:8080/uploads/123456_React-Intro.mp4", "fileName": "React-Intro.mp4" }]
```
5. **Student:** Opens Course Detail -> Sees 📁 React-Intro.mp4 + **▶️ Watch** -> Clicks -> Video plays in Player / New Tab
6. Same flow for **📄 Documents:** Week1-Notes.pdf -> Student sees **Download / View**
**No size limit:** Backend has spring.servlet.multipart.max-file-size=-1

## 🔴 How Live Meet Works
1. Instructor goes to **meet.google.com** -> New Meeting -> Copy link
2. In Manage -> **🔴 Start Live Meet** -> Paste https://meet.google.com/abc-def-ghi + Title Doubt Session + Time -> Save
3. Student sees in Course Detail + Course List + Player:
```javascript
🔴 Live Class - Doubt Session • 2026-11-14 18:00
[📹 Join Google Meet Live Class]
```
4. Click -> Opens Meet in new tab -> Interact directly with instructor (camera/mic)

## 📄 How Certificate Works
- Student marks all videos as Complete in Player / Detail -> Progress = 100%
- Card appears: 🏆 Congratulations {name}!
- Click **Download Certificate** -> Canvas generates 1400x900 PNG with:
    - LearnUp LMS, CERTIFICATE OF COMPLETION, Student Name (cursive), Course Title, Instructor, Date, Certificate ID LULMS-{courseId}-{random}
- File downloads as LearnUp_{Course}_Certificate_{Name}.png

## Theme
- Light / Dark toggle in Navbar - Uses CSS variables in index.css
- var(--bg), var(--card-bg), var(--text), var(--muted), var(--border), var(--primary)

## Author
Kodali Suchitra Kamala - ExcelR Full Stack Project - Nov 2026
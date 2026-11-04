import { useState, useDebugValue, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CourseList from "./pages/CourseList";
import CourseDetail from "./pages/CourseDetail";
import CoursePlayer from "./pages/CoursePlayer";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Route Component for Instructor
function InstructorProtectedRoute({ children }) {
  const userRole = localStorage.getItem("userRole");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return (
      <div className="container mt-5 text-center">
        <h3 style={{color: "var(--text)"}}>Please Login First</h3>
        <Link to="/login" className="btn btn-primary mt-3">Go to Login</Link>
      </div>
    );
  }

  if (userRole !== "instructor") {
    return (
      <div className="container mt-5 text-center">
        <h2 style={{color: "var(--text)"}}>⛔ Access Denied</h2>
        <p style={{color: "var(--muted)"}}>Only Instructors can access this page</p>
        <p>Your role: <b>{userRole}</b></p>
        <Link to="/register" className="btn btn-warning mt-3">Register as Instructor</Link>
        <br />
        <Link to="/courses" className="btn btn-outline-secondary mt-2">Browse as Student</Link>
      </div>
    );
  }

  return children;
}

// Protected Route for Student
function StudentProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div style={{backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh", transition: "0.3s"}}>
      <Router>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Video Player */}
          <Route path="/player/:id" element={<StudentProtectedRoute><CoursePlayer /></StudentProtectedRoute>} />

          {/* Student Only - My Learning */}
          <Route path="/student" element={<StudentProtectedRoute><StudentDashboard /></StudentProtectedRoute>} />

          {/* Instructor Only */}
          <Route path="/instructor" element={<InstructorProtectedRoute><InstructorDashboard /></InstructorProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
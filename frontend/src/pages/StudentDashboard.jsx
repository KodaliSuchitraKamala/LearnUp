import { useNavigate } from "react-router-dom";
import { courses } from "../data/courses";
import { useEffect, useState } from "react";

function StudentDashboard() {
    const navigate = useNavigate()
    
    const [myCourses, setMyCourses] = useState([])

    useEffect(() => {
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]")
        // if no enrolled, show dummy 3 for now
        if(enrolled.length === 0) {
            setMyCourses([
                { title: "Java Full Stack", progress: 60, color: "#2563eb" },
                { title: "React Basics", progress: 80, color: "#16a34a" },
                { title: "Spring Boot", progress: 30, color: "#ea580c" }
            ])
        } else {
            setMyCourses(enrolled.map(c => ({...c, name: c.title, color: "#2563eb"})))
        }
    }, [])

    return (
        <div style={{minHeight: "100vh", background: "#f8fafc", padding: "20px"}}>
            <div style={{maxWidth: "1100px", margin: "0 auto"}}>

                {/* Header */}
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "16px 20px", borderRadius: "12px", border: "1px solid #e2e8f0"}}>
                    <div>
                        <h1 style={{fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0}}>Student Dashboard</h1>
                        <p style={{color: "#64748b", margin: "4px 0 0 0", fontSize: "14px"}}>Welcome! Continue Your Learning Journey.</p>
                    </div>
                    <button onClick={() => navigate("/")} style={{padding: "8px 18px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px"}}>Logout</button>
                </div>

                {/* NEW BUTTON */}
                <div style={{margin: "20px 0", textAlign: "left"}}>
                    <button onClick={() => navigate("/courses")} style={{background: "#2563eb", color: "white", padding: "12px 24px", borderRadius: "10px", border: "none", fontWeight: "800", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)"}}>🔍 Explore All Courses</button>
                </div>

                {/* Progress Cards */}
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px"}}>
                    {myCourses.map((course, i) => (
                        <div key={i} style={{background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0"}}>
                            <h3 style={{fontSize: "16px", fontWeight: "700", margin: "0 0 8px 0", color: "#0f172a"}}>{course.name}</h3>
                            <p style={{fontSize: "13px", color: "#64748b", margin: "0 0 12px 0"}}>Progress: {course.progress}%</p>
                            <div style={{width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "20px", overflow: "hidden"}}>
                                <div style={{width: `${course.progress}%`, height: "100%", background: course.color, borderRadius: "20px"}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard
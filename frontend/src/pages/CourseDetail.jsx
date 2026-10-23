import { useParams, useNavigate } from "react-router-dom";
import { courses } from "../data/courses";
import { useState, useEffect } from "react";

function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const course = courses.find(c => c.id === parseInt(id))
    const [isEnrolled, setIsEnrolled] = useState(false)

    useEffect(() => {
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]")
        if (enrolled.find(c => c.id === parseInt(id))) setIsEnrolled(true)
    }, [id])

    if (!course) return <p>Course not found</p>

    const handleEnroll = () => {
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]")
        if (!enrolled.find(c => c.id === course.id)) {
            enrolled.push({ ...course, progress: 0, enrolledAt: new Date().toISOString() })
            localStorage.setItem("enrolledCourses", JSON.stringify(enrolled))
        }
        navigate("/student")
    }

    return (
        <div style={{minHeight: "100vh", background: "#f8fafc", padding: "20px"}}>
            <div style={{maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px"}}>

                {/* Left */}
                <div style={{background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px"}}>
                    <button onClick={() => navigate("/courses")} style={{marginBottom: "16px", padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", cursor: "pointer"}}>← Back</button>
                    <h1 style={{fontSize: "26px", fontWeight: "800", margin: "0 0 8px 0", color: "#0f172a"}}>{course.title}</h1>
                    <p style={{color: "#64748b", fontSize: "14px"}}>By {course.instructor} • {course.category} • {course.level}</p>
                    <img src={course.image} alt="" style={{width: "100%", height: "300px", objectFit: "cover", borderRadius: "12px", margin: "16px 0"}} />
                    <h3 style={{fontWeight: "700", color: "#0f172a"}}>About this Course</h3>
                    <p style={{color: "#334155", lineHeight: "1.6"}}>{course.description}</p>

                    <h3 style={{fontWeight: "700", marginTop: "20px", color: "#0f172a"}}>What you'll learn</h3>
                    <ul style={{paddingLeft: "18px"}}>
                        {course.whatYouLearn.map((item, i) => (
                            <li key={i} style={{marginBottom: "6px", color: "#475569"}}>✅ {item}</li>
                        ))}
                    </ul>
                </div>

                {/* Right Card */}
                <div style={{background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "20px", height: "fit-content", position: "sticky", top: "20px"}}>
                    <h2 style={{fontSize: "28px", fontWeight: "800", margin: 0, color: "#0f172a"}}>{course.price}</h2>
                    <p style={{color: "#64748b", fontSize: "13px"}}>⭐ {course.rating} ({course.students} students) • {course.duration}</p>

                    {isEnrolled ? (
                        <button onClick={() => navigate("/student")} style={{width: "100%", marginTop: "16px", background: "#16a34a", color: "white", padding: "12px", borderRadius: "10px", border: "none", fontWeight: "800", cursor: "pointer"}}>Go to My Learning →</button>
                    ) : (
                        <button onClick={handleEnroll} style={{width: "100%", marginTop: "16px", background: "#2563eb", color: "white", padding: "12px", borderRadius: "10px", border: "none", fontWeight: "800", cursor: "pointer"}}>Enroll Now</button>
                    )}

                    <p style={{fontSize: "12px", color: "#64748b", marginTop: "12px", textAlign: "center"}}>30-Day Money-back Guarantee</p>
                </div>
            </div>
        </div>
    )
}

export default CourseDetail;
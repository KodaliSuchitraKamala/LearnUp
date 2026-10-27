import { useParams, useNavigate } from "react-router-dom";
import { courses } from "../data/courses";
import { useState, useEffect } from "react";

function CourseDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const course = courses.find(c => c.id === parseInt(id))
    const lessons = ["Introduction & Setup", "Core Concepts", "Hands-On Project", "Advanced Topics", "Final Project + Deploy"]
    const [checkedLessons, setCheckedLessons] = useState([])
    const [isEnrolled, setIsEnrolled] = useState(false)

    useEffect(() => {
        const enrolled = JSON. parse(localStorage.getItem("enrolledCourses") || "[]")
        if (enrolled.find(c => c.id === parseInt(id))) setIsEnrolled(true)
        const saved = JSON.parse(localStorage.getItem(`progress-${id}`) || "[]")
        setCheckedLessons(saved)
    }, [id])

    if (!course) return <p style={{padding: "20px"}}>Course not found</p>

    const handleEnroll = () => {
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourse") || "[]")
        if (!enrolled.find(c => c.id === course.id)) {
            enrolled.push({...course, progress: 0, enrolledAt: new Date().toISOString() })
            localStorage.setItem("enrolledCourses", JSON.stringify(enrolled))
        }
        setIsEnrolled(true)
        navigate("/student")
    }

    const toggleLesson = (lesson) => {
        let saved = [...checkedLessons]
        if (saved.includes(lesson)) saved = saved.filter(l => l !== lesson)
        else saved.push(lesson)
        setCheckedLessons(saved)
        localStorage.setItem(`progress-${id}`, JSON.stringify(saved))

        // update enrolled progress
        let enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]")
        enrolled = enrolled.map(c => c.id === parseInt(id) ? { ...c, progress: Math.round((saved.length / lessons.length) * 100) } : c)
        localStorage.setItem("enrolledCourses", JSON.stringify(enrolled))
    }

    const progressPercent = Math. round((checkedLessons.length / lessons.length) * 100)

    return (
        <div style={{minHeight: "100vh", background: "#f8fafc", padding: "20px"}}>
            <div style={{maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px"}}>
                <div style={{background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px"}}>
                    <button onClick={() => navigate("/courses")} style={{marginBottom: "16px", padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", cursor: "pointer"}}>← Back to Courses</button>
                    <h1 style={{fontSize: "26px", fontWeight: "800", margin: "0 0 8px 0", color: "#0f172a"}}>{course.title}</h1>
                    <p style={{color: "#64748b", fontSize: "14px"}}>By {course.instructor} • {course.category} • {course.level}</p>
                    <img src={course.image} alt=""style={{width: "100%", height: "280px", objectFit: "cover", borderRadius: "12px", margin: "16px 0"}} />

                    <h3 style={{color: "#0f172a"}}>About this course</h3>
                    <p style={{color: "#334155", lineHeight: "1.6"}}>{course.description}</p>

                    <h3 style={{marginTop: "20px", color: "#0f172a"}}>What you'll learn</h3>
                    <ul>{course.whatYouLearn.map((i, idx) => <li key={idx} style={{marginBottom: "6px", color: "#475569"}}>✅ {i}</li>)}</ul>

                    <h3 style={{marginTop: "24px", color: "#0f172a"}}>Course Content - {checkedLessons.length}/{lessons.length} completed ({progressPercent}%)</h3>
                    <div style={{background: "#e2e8f0", height: "8px", borderRadius: "10px", marginBottom: "12px"}}>
                        <div style={{width: `${progressPercent}%`, background: "#2563eb", height: "8px", borderRadius: "10px", transition: "0.3s"}}></div>
                    </div>
                    {lessons.map(l => (
                        <div key={l} style={{display: "flex", gap: "10px", padding: "10px", border: "1px solid #e2e8f0", marginBottom: "8px", borderRadius: "10px"}}>
                            <input type="checkbox" checked={checkedLessons.includes(l)} onChange={() => toggleLesson(l)} />
                            <span style={{fontSize: "14px"}}>{l}</span>
                        </div>
                    ))}

                    {progressPercent === 100 && (
                        <div style={{background: "#dcfce7", border: "1px solid #16a34a", padding: "18px", borderRadius: "12px", marginTop: "20px", textAlign: "center"}}>
                            <h2 style={{margin: 0}}>🎉 Certificate Unlocked!</h2>
                            <p>You completed {course.title}</p>
                            <button onClick={() => window.print()} style={{background: "#16a34a", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: "700", cursor: "pointer"}}>Download Certificate</button>
                        </div>
                    )}
                </div>

                <div style={{background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "20px", height: "fit-content", position: "sticky", top: "20px"}}>
                    <h2 style={{fontSize: "28px", fontWeight: "800", margin: 0, color: "#0f172a"}}>{course.price}</h2>
                    <p style={{color: "#64748b", fontSize: "13px"}}>⭐ {course.rating} ({course.students} students) • {course.duration}</p>
                    {isEnrolled ? (
                        <button onClick={() => navigate("/student")} style={{width: "100%", marginTop: "16px", background: "#16a34a", color: "white", padding: "12px", borderRadius: "10px", border: "none", fontWeight: "800", cursor: "pointer"}}>Go to My Learning →</button>
                    ) : (
                        <button onClick={handleEnroll} style={{width: "100%", marginTop: "16px", background: "#2563eb", color: "white", padding: "12px", borderRadius: "10px", border: "none", fontWeight: "800", cursor: "pointer"}}>Enroll Now</button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CourseDetail
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { courses as staticCourses } from "../data/courses";

export default function CourseDetail() {
    const { id } = useParams(); const navigate = useNavigate();
    const [isEnrolled, setIsEnrolled] = useState(false); 
    const [completed, setCompleted] = useState([]); 
    const [course, setCourse] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [isFollowing, setIsFollowing] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    useEffect(() => { 
        let isMounted = true; 
        fetch(`/api/courses`).then(res => res.json()).then(data => { 
            if (!isMounted) return; 
            const custom = JSON.parse(localStorage.getItem("customCourses") || "[]"); 
            const backend = Array.isArray(data) ? data : []; 
            const merged = [...staticCourses, ...custom, ...backend]; 
            const deduped = [...new Map(merged.map(c => [String(c.id), c])).values()]; 
            const found = deduped.find(c => String(c.id) === String(id)); 
            setCourse(found || null); 
            setLoading(false); 
        }).catch(() => { 
            const custom = JSON.parse(localStorage.getItem("customCourses") || "[]"); 
            const found = [...staticCourses, ...custom].find(c => String(c.id) === String(id)); 
            setCourse(found || null); 
            setLoading(false); 
        }); 
        return () => { isMounted = false; }; 
    }, [id]);
    useEffect(() => { 
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]"); 
        setIsEnrolled(enrolled.some(e => String(e.id || e) === String(id))); 
        setCompleted(JSON.parse(localStorage.getItem(`progress_${id}`) || "[]")); 
        const follows = JSON.parse(localStorage.getItem("followedInstructors") || "[]"); 
        setIsFollowing(follows.includes(course?.instructor)); 
    }, [id, course?.instructor]);
    if (loading && !course) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div><p className="mt-2 text-muted">Loading course...</p></div>;
    if (!course) return <div className="container mt-5 text-center"><h3>Course not found</h3><Link to="/courses" className="btn btn-primary mt-3">Back</Link></div>;

    let videos = course.videos; 
    if (typeof videos === "string") { 
        try { 
            videos = JSON.parse(videos); 
        } catch { 
            videos = videos.split(","); 
        } 
    } 
    if (!Array.isArray(videos) || videos.length === 0) videos = [{ title: "Introduction", url: "", fileName: "" }];
    videos = videos.map((v, i) => typeof v === "string" ? { title: v, url: "", fileName: "" } : { title: v.title || `Lesson ${i + 1}`, url: v.url || v.videoUrl || "", fileName: v.fileName || "" });
    let docs = course.documents; 
    if (typeof docs === "string") { 
        try { 
            docs = JSON.parse(docs); 
        } catch { 
            docs = []; 
        } 
    } 
    if (!Array.isArray(docs)) docs = [];
    docs = docs.map((d, i) => typeof d === "string" ? { title: d, url: "", fileName: "" } : { title: d.title || `Document ${i + 1}`, url: d.url || "", fileName: d.fileName || "" });

    const handleEnroll = async () => { 
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]"); 
        if (enrolled.find(e => String(e.id || e) === String(course.id))) return; 
        enrolled.push(course); 
        localStorage.setItem("enrolledCourses", JSON.stringify(enrolled)); 
        try { 
            await fetch("/api/enrollments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId: Number(course.id), courseTitle: course.title, price: Number(course.price) || 0, studentName: user.name || "Student", studentEmail: user.email || "", instructorName: course.instructor || "" }) }); 
        } catch {} 
        const all = JSON.parse(localStorage.getItem("allEnrollments") || "[]"); 
        all.push({ courseId: String(course.id), courseTitle: course.title, price: Number(course.price) || 0, studentName: user.name || "Student", studentEmail: user.email || "", instructorName: course.instructor || "" }); 
        localStorage.setItem("allEnrollments", JSON.stringify(all)); 
        window.dispatchEvent(new Event("enrollmentUpdated")); 
        setIsEnrolled(true); 
        navigate("/student"); 
    };
    const handleFollow = async () => { 
        const follows = JSON.parse(localStorage.getItem("followedInstructors") || "[]"); 
        let updated; 
        if (isFollowing) { 
            updated = follows.filter(f => f !== course.instructor); 
            try { 
                await fetch(`/api/follows?instructorName=${encodeURIComponent(course.instructor)}&studentEmail=${encodeURIComponent(user.email || "")}`, { method: "DELETE" }); 
            } catch {} 
        } else { 
            updated = [...follows, course.instructor]; 
            try { 
                await fetch("/api/follows", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ instructorName: course.instructor, studentName: user.name || "Student", studentEmail: user.email || "" }) 
            }); 
            } catch {} 
        } 
        localStorage.setItem("followedInstructors", JSON.stringify(updated)); 
        setIsFollowing(!isFollowing); 
        window.dispatchEvent(new Event("followUpdated")); 
    };
    const toggleVideo = (idx) => { 
        const n = completed.includes(idx) ? completed.filter(i => i !== idx) : [...completed, idx]; 
        setCompleted(n); 
        localStorage.setItem(`progress_${id}`, JSON.stringify(n)); 
    };
    const percent = Math.round((completed.length / videos.length) * 100);
    const downloadCertificate = () => { 
        const canvas = document.createElement("canvas"); 
        canvas.width = 1400; 
        canvas.height = 900; 
        const ctx = canvas.getContext("2d"); 
        if (!ctx) return; 
        const grad = ctx.createLinearGradient(0, 0, 0, 900); 
        grad.addColorStop(0, "#fffef5"); 
        grad.addColorStop(1, "#e6f0ff"); 
        ctx.fillStyle = grad; 
        ctx.fillRect(0, 0, 1400, 900); 
        ctx.strokeStyle = "#c9a86a"; 
        ctx.lineWidth = 12; 
        ctx.strokeRect(20, 20, 1360, 860); 
        ctx.strokeStyle = "#1e40af"; 
        ctx.lineWidth = 6; 
        ctx.strokeRect(40, 40, 1320, 820); 
        ctx.font = "80px Arial"; 
        ctx.textAlign = "center"; 
        ctx.fillText("🏆", 700, 130); 
        ctx.fillStyle = "#1e3a8a"; 
        ctx.font = "bold 32px serif"; 
        ctx.fillText("LearnUp LMS", 700, 185); 
        ctx.fillStyle = "#b45309"; 
        ctx.font = "bold 48px serif"; 
        ctx.fillText("CERTIFICATE OF COMPLETION", 700, 260); 
        ctx.fillStyle = "#1e3a8a"; 
        ctx.font = "28px serif"; 
        ctx.fillText("This is to certify that", 700, 320); 
        ctx.fillStyle = "#92400e"; 
        ctx.font = "italic bold 52px 'Brush Script MT', cursive"; 
        ctx.fillText(user.name || "Student", 700, 400); 
        ctx.strokeStyle = "#c9a86a"; 
        ctx.lineWidth = 1; 
        ctx.beginPath(); 
        ctx.moveTo(300, 415); 
        ctx.lineTo(1100, 415); 
        ctx.stroke(); 
        ctx.fillStyle = "#1e3a8a"; 
        ctx.font = "26px serif"; 
        ctx.fillText("has successfully completed the course", 700, 460); 
        ctx.font = "bold 52px serif";
        ctx.fillText(course.title, 700, 530); 
        ctx.beginPath(); 
        ctx.arc(700, 700, 95, 0, Math.PI * 2); 
        ctx.fillStyle = "#fde68a"; 
        ctx.fill(); 
        ctx.lineWidth = 3; 
        ctx.strokeStyle = "#78350f"; 
        ctx.stroke(); 
        ctx.fillStyle = "#78350f"; 
        ctx.font = "bold 14px sans-serif"; 
        ctx.fillText("VERIFIED", 700, 710); 
        ctx.fillStyle = "#1e3a8a"; 
        ctx.font = "18px serif"; 
        ctx.fillText("INSTRUCTOR", 330, 775); 
        ctx.font = "16px serif"; 
        ctx.fillText(course.instructor, 330, 800); 
        ctx.font = "16px sans-serif"; 
        ctx.textAlign = "left"; 
        ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 80, 858); 
        ctx.textAlign = "center"; 
        ctx.fillText(`Certificate ID: LULMS-${course.id}-${Date.now().toString().slice(-6)}`, 700, 858); 
        const link = document.createElement("a"); 
        link.download = `LearnUp_${course.title}_Certificate_${user.name}.png`; 
        link.href = canvas.toDataURL("image/png"); 
        link.click(); 
    };

    return (
        <div className="container mt-4 pb-5">
            <Link to="/courses" className="btn btn-outline-secondary btn-sm mb-3">← Back to Courses</Link>
            <div className="row">
                <div className="col-md-8">
                    <img src={course.image} style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "16px" }} alt="" />
                    <h2 className="fw-bold mt-3">{course.title}</h2>
                    <p className="text-muted">By {course.instructor} | {course.category}</p>
                    <button onClick={handleFollow} className={`btn btn-sm ${isFollowing ? "btn-success" : "btn-outline-primary"} mb-3`}>{isFollowing ? "✅ Following" : "+ Follow Instructor"}</button>
                    <p>{course.description}</p>
                    {course.meetLink && (
                        <div className="card p-3 mt-3 border-danger border-2" style={{ background: "#fff5f5" }}>
                            <h5>🔴 Live Class - Interact Directly with Instructor</h5>
                            <p className="mb-1"><b>{course.liveClassTitle || "Live Doubt Session"}</b></p>
                            <p className="small text-muted mb-2">📅 {course.liveClassAt || "Check schedule"} • Instructor: {course.instructor}</p>
                            <a href={course.meetLink} target="_blank" rel="noreferrer" className="btn btn-danger fw-bold">📹 Join Google Meet Live Class</a>
                            <small className="d-block mt-2 text-muted">Join from Meet - Ask doubts live, camera/mic on.</small>
                        </div>
                    )}
                    {/* VIDEOS - Shows File Name from Laptop */}
                    <div className="card p-3 mt-3">
                        <h5>Course Content - {completed.length}/{videos.length} completed - {percent}%</h5>
                        <div className="progress mb-3" style={{ height: "10px" }}>
                            <div className="progress-bar" style={{ width: `${percent}%` }}></div>
                        </div>
                        {videos.map((v, idx) => (
                            <div key={idx} className="d-flex justify-content-between py-2 border-bottom flex-wrap">
                                <div>
                                    <input type="checkbox" checked={completed.includes(idx)} onChange={() => toggleVideo(idx)} className="me-2" />
                                    {idx + 1}. {v.title} {v.fileName && <span className="badge bg-secondary ms-1">📁 {v.fileName}</span>} {v.url && <span className="badge bg-success ms-1">🎥 Video</span>}
                                </div>
                                <div className="d-flex gap-2">
                                    {v.url && (
                                        <a href={v.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-danger">
                                            ▶️ Watch
                                        </a>
                                    )}
                                    <Link to={`/player/${course.id}`} className="btn btn-sm btn-outline-primary">
                                        Open Player
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* DOCUMENTS - Shows File Name from Laptop */}
                    {docs.length > 0 && (
                        <div className="card p-3 mt-3">
                            <h5>📄 Study Materials / PDFs - Uploaded by Instructor</h5>
                            {docs.map((d, i) => (
                                <div key={i} className="d-flex justify-content-between py-2 border-bottom flex-wrap">
                                    <span>📄 {d.title} {d.fileName && <span className="badge bg-secondary ms-1">{d.fileName}</span>}</span>
                                    <a href={d.url} target="_blank" rel="noreferrer" download={d.fileName} className="btn btn-sm btn-outline-primary">
                                        Download / View ↗
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                    {percent === 100 && (
                        <div className="card mt-4 p-4 text-center border-warning border-3 shadow" style={{ background: "linear-gradient(135deg, #fffbe6, #eef4ff)" }}>
                            <h1>🏆</h1>
                            <h3 className="fw-bold">Congratulations {user.name}!</h3>
                            <p>You completed <b>{course.title}</b></p>
                            <div className="mt-2 d-flex justify-content-center gap-3 flex-wrap">
                                <button onClick={downloadCertificate} className="btn btn-warning fw-bold px-4 py-2">
                                    📥 Download Certificate
                                </button>
                                <Link to={`/player/${course.id}`} className="btn btn-outline-primary px-4 py-2">
                                    ▶️ Rewatch
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-md-4"><div className="card p-4 shadow-sm"><h3>₹{course.price}</h3>{!isEnrolled ? <button onClick={handleEnroll} className="btn btn-primary w-100 fw-bold">Enroll Now</button> : <button onClick={() => navigate("/student")} className="btn btn-success w-100 fw-bold">✅ Go to My Learning</button>}<hr /><ul className="small"><li>📹 {videos.length} videos (From Instructor Laptop)</li><li>📄 {docs.length} Documents / PDFs</li><li>🔴 Live Meet Class</li><li>🏆 Certificate</li><li>♾️ Lifetime Access</li></ul>{course.meetLink && <a href={course.meetLink} target="_blank" rel="noreferrer" className="btn btn-outline-danger w-100 mt-2">📹 Join Live Meet</a>}</div></div>
            </div>
        </div>
    );
}
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { courses as staticCourses } from "../data/courses";

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [completed, setCompleted] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Fetch from Backend + localStorage + statice - same as CourseList
    useEffect(() => {
        let isMounted = true; 
        // Always fetch backend - this is where Completed React lives
        fetch(`/api/courses`)
            .then(res => res.json())
            .then(data => {
                if (!isMounted) return;
                const custom = JSON.parse(localStorage.getItem("customCourses") || "[]");
                const backend = Array.isArray(data) ? data : [];
                const merged = [...staticCourses, ...custom, ...backend];
                const deduped = [...new Map(merged.map(c => [String(c.id), c])).values()];
                const found = deduped.find(c => String(c.id) === String(id));
                if (found) setCourse(found);
                else setCourse(null);
                setLoading(false);
            })
            .catch(() => {
                if (!isMounted) return;
                const custom = JSON.parse(localStorage.getItem("customCourses") || "[]");
                const found = [...staticCourses, ...custom].find(c => String(c.id) === String(id));
                if (found) setCourse(found);
                setLoading(false)
            });
        return () => { isMounted = false; };
    }, [id]);

    useEffect(() => {
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
        const isExist = enrolled.some(e => String(e.id || e) === String(id));
        setIsEnrolled(isExist);
        setCompleted(JSON.parse(localStorage.getItem(`progress_${id}`) || "[]"));
    }, [id]);

    if (loading && !course) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Loading course...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mt-5 text-center">
                <h3>Course not found</h3>
                <Link to="/courses" className="btn btn-primary mt-3">Back</Link>
            </div>
        );
    }

    // Backend may send videos as string, handle both
    let videos = course.videos;
    if (typeof videos === "string") {
        try {
            videos = JSON.parse(videos);
        } catch {
            videos = videos.split(",");
        }
    }
    if (!Array.isArray(videos) || videos.length === 0) {
        videos = ["Introduction", "Core Concepts", "Pratical", "Project"];
    }

    const handleEnroll = async () => {
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
        if (enrolled.find(e => String(e.id || e) === String(course.id))) return;
        enrolled.push(course);
        localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));

        // 1. Save to BACKEND - so ANY instructor browser can see it
        try {
            await fetch("/api/enrollments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId: Number(course.id), courseTitle: course.title, price: Number(course.price) || 0, studentName: user.name || "Student", studentEmail: user.email || "", instructorName: course.instructor || "" }) });
        } catch {}

        // 2. Keep localStorage as backup
        const all = JSON.parse(localStorage.getItem("allEnrollments") || "[]");
        all.push({ courseId: String(course.id), courseTitle: course.title, price: Number(course.price) || 0, studentName: user.name || "Student", studentEmail: user.email || "", instructorName: course.instructor || "" });
        localStorage.setItem("allEnrollments", JSON.stringify(all));
        window.dispatchEvent(new Event("enrollmentUpdated"));
        setIsEnrolled(true);
        navigate("/student");
    };

    const toggleVideo = (idx) => {
        const newCompleted = completed.includes(idx) ? completed.filter(i => i !== idx) : [...completed, idx];
        setCompleted(newCompleted);
        localStorage.setItem(`progress_${id}`, JSON.stringify(newCompleted));
    };

    const percent = Math.round((completed.length / videos.length) * 100);

    const downloadCertificate = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1400;
        canvas.height = 900;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Background Gradent
        const grad = ctx.createLinearGradient(0, 0, 0, 900);
        grad.addColorStop(0, "#fffef5");
        grad.addColorStop(1, "#e6f0ff");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1400, 900);

        // Outer Gold Border
        ctx.strokeStyle = "#c9a86a";
        ctx.lineWidth = 12;
        ctx.strokeRect(20, 20, 1360, 860);

        // Inner Blue Border
        ctx.strokeStyle = "#1e40af";
        ctx.lineWidth = 6;
        ctx.strokeRect(40, 40, 1320, 820);

        // Inner Gold Thin
        ctx.strokeStyle = "#c9a86a";
        ctx.lineWidth = 2;
        ctx.strokeRect(55, 55, 1290, 790);

        // Trophy
        ctx.font = "80px Arial";
        ctx.textAlign = "center";
        ctx.fillText("🏆", 700, 130);

        // LearnUp LMS
        ctx.fillStyle = "#1e3a8a";
        ctx.font = "bold 32px serif";
        ctx.fillText("LearnUp LMS", 700, 185);

        // Title Gold
        ctx.fillStyle = "#b45309";
        ctx.font = "bold 48px serif";
        ctx.fillText("CERTIFICATE OF COMPLETION", 700, 260);

        // Subtitle
        ctx.fillStyle = "#1e3a8a";
        ctx.font = "28px serif";
        ctx.fillText("This is to certify that", 700, 320);

        // Student Name GOld Cursive
        ctx.fillStyle = "#92400e";
        ctx.font = "italic bold 52px 'Brush Script MT', cursive";
        ctx.fillText(user.name || localStorage.getItem("userName") || "Student", 700, 400);

        // Line under name
        ctx.strokeStyle = "#c9a86a";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(300, 415);
        ctx.lineTo(1100, 415);
        ctx.stroke();

        // Course
        ctx.fillStyle = "#1e3a8a";
        ctx.font = "26px serif";
        ctx.fillText("has successfully completed the course", 700, 460);
        ctx.font = "bold 52px serif";
        ctx.fillText(course.title, 700, 530);

        // Gold Seal
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
        ctx.font = "bold 12px sans-serif";
        ctx.fillText("LEARNUP", 700, 730);

        // Signatures
        ctx.strokeStyle = "#c9a86a";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(180, 750);
        ctx.lineTo(480, 750);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(920, 750);
        ctx.lineTo(1220, 750);
        ctx.stroke();

        ctx.fillStyle = "#1e3a8a";
        ctx.font = "18px serif";
        ctx.textAlign = "center";
        ctx.fillText("INSTRUCTOR", 330, 775);
        ctx.font = "16px serif";
        ctx.fillText(course.instructor, 330, 800);

        ctx.font = "bold 18px serif";
        ctx.fillText("LEARNUP", 1070, 775);
        ctx.font = "14px serif";
        ctx.fillText("Director / Authorized", 1070, 800);

        // Footer
        ctx.font = "16px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 80, 858);
        ctx.textAlign = "center";
        ctx.fillText(`Certificate ID: LULMS-${course.id}-${Date.now().toString().slice(-6)}`, 700, 858);
        ctx.textAlign = "right";
        ctx.fillText("verifiable at learnup.com/verify", 1320, 858);

        // Download
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `LearnUp_${course.title}_Certificate_${user.name}.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <div className="container mt-4 pb-5">
            <Link to="/courses" className="btn btn-outline-secondary btn-sm mb-3">← Back to Courses</Link>                
            <div className="row">
                <div className="col-md-8">
                    <img src={course.image} style={{width: "100%", height: "300px", objectFit: "cover", borderRadius: "16px"}} alt="" />
                    <h2 className="fw-bold mt-3">{course.title}</h2>
                    <p className="text-muted">By {course.instructor} | {course.category} | {course.duration}</p>
                    <p>{course.description}</p>

                    <div className="card p-3 mt-3">
                        <h5>Course Content - {completed.length}/{videos.length} completed - {percent}%</h5>
                        <div className="progress mb-3" style={{height: "10px"}}>
                            <div className="progress-bar" style={{width: `${percent}%`}}></div>
                        </div>
                        {videos.map((v, idx) => (
                            <div key={idx} className="d-flex justify-content-between py-2">
                                <div>
                                    <input type="checkbox" checked={completed.includes(idx)} onChange={() => toggleVideo(idx)} className="me-2" />
                                    {idx + 1}. {v}
                                </div>
                                <small className="text-muted">10 min</small>
                            </div>
                        ))}
                    </div>

                    {percent === 100 && (
                        <div className="card mt-4 p-4 text-center border-warning border-3 shadow" style={{background: "linear-gradient(135deg, #fffbe6, #eef4ff)"}}>
                            <h1>🏆</h1>
                            <h3 className="fw-bold">Congratulations {user.name}!</h3>
                            <p>You completed <b>{course.title}</b></p>
                            <div className="mt-2 d-flex justify-content-center gap-3 flex-wrap">
                                <button onClick={downloadCertificate} className="btn btn-warning fw-bold px-4 py-2">📥 Download Certificate</button>
                                <Link to={`/player/${course.id}`} className="btn btn-outline-primary px-4 py-2">▶️ Rewatch</Link>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-md-4">
                    <div className="card p-4 shadow-sm">
                        <h3>₹{course.price}</h3>
                        {!isEnrolled ? (
                            <button onClick={handleEnroll} className="btn btn-primary w-100 fw-bold">Enroll Now</button>
                        ) : (
                            <button onClick={() => navigate("/student")} className="btn btn-success w-100 fw-bold">✅ Go to My Learning</button>
                        )}
                        <hr />
                        <ul className="small">
                            <li>📹 {videos.length} videos</li>
                            <li>🏆 Certificate</li>
                            <li>♾️ Lifetime Acces</li>
                            <li>▶️ Full HD Videos</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
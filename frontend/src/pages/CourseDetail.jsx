import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const defaultCourses = [
    { id: 1, title: "React JS", category: "Development", price: "Free", instructor: "John Doe", description: "Learn React from scratch with hooks and projects.", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400", videos: ["Intro to React", "Components & Props", "State & Hooks", "Routing", "Final Project"] },
    { id: 2, title: "Python Mastrey", category: "Python", price: "1499", instructor: "Jane Doe", description: "Master Python with real projects.", image: "https://unsplash.com/photo-1526379095098-d400fd0bf935?w=400", videos: ["Python Basics", "Data Types", "Functions", "OOPs", "Projext"] },
    { id: 3, title: "UI/UX Design", category: "Design", price: "999", instructor: "Alex", description: "Design beautiful apps.", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400", videos: ["Design Thinking", "Fign=ma Basics", "Wireframes", "Prototyping", "Portfolio"] },
    { id: 4, title: "MERN Stack", category: "Full Stack", price: "Free", instructor: "Kodali Suchitra", description: "Build real-time platforms end-to-end. MERN + Auth + Deployment.", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400", videos: ["MERN Intro", "MongoDB + Express", "React Frontend", "Auth & JWT", "Deployment"] },
];

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [completed, setCompleted] = useState([]);
    const certificateRef = useRef(null);

    // Get all courses (default + instructor added)
    const customCourses = JSON.parse(localStorage.getItem("customCourses") || "[]");
    const allCourses = [...defaultCourses, ...customCourses];
    const course = allCourses.find(c => String(c.id) === String(id));

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = localStorage.getItem("userRole");

    useEffect(() => {
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
        setIsEnrolled(enrolled.some(e => String(e.id) === String(id) || String(e) === String(id)));

        const followers = JSON.parse(localStorage.getItem("followers") || "[]");
        setIsFollowing(followers.includes(user.name));

        const progress = JSON.parse(localStorage.getItem(`progress_${id}`) || "[]");
        setCompleted(progress);
    }, [id, user.name]);

    if (!course) return (
        <div className="container mt-5 text-center">
            <h3>Course not found</h3>
            <Link to="/courses" className="btn btn-primary mt-3">Back to Courses</Link>
        </div>
    );

    // For 0/0 - ensure video exist
    const videos = course.videos && course.videos.length > 0 ? course.videos : ["Introduction", "Core Concepts", "Practical Session", "Project"];

    const handleEnroll = () => {
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
        if (!enrolled.find(e => String(e.id) === String(course.id))) {
            enrolled.push(course);
            localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
            setIsEnrolled(true);
            alert("✅ Enrolled! Check My Learning");
        }
    };

    const handleFollow = () => {
        const followers = JSON.parse(localStorage.getItem("followers") || "[]");
        if (!followers.includes(user.name)) {
            localStorage.setItem("followers", JSON.stringify([...followers, user.name || "Student"]));
            setIsFollowing(true);
            alert(`❤️ Following ${course.instructor}!`);
        }
    };

    const toggleVideo = (idx) => {
        let newCompleted;
        if (completed.includes(idx)) {
            newCompleted = completed.filter(i => i !== idx);
        } else {
            newCompleted = [...completed, idx];
        }
        setCompleted(newCompleted);
        localStorage.setItem(`progress_${id}`, JSON.stringify(newCompleted));
    };

    const percent = videos.length > 0 ? Math.round((completed.length / videos.length) * 100) : 0;

    // Certificate Download Logic
    const downloadCertificate = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 700;
        const ctx = canvas.getContext("2d");

        // Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1000, 700);
        ctx.strokeStyle = "#0d6efd";
        ctx.lineWidth = 10;
        ctx.strokeRect(15, 15, 970, 670);

        // Title
        ctx.fillStyle = "#0d6efd";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Certificate of Completion", 500, 120);

        ctx.fillStyle = "#333";
        ctx.font = "22px Arial";
        ctx.fillText("This certificate is proudly presented to", 500, 200);

        ctx.fillStyle = "#000";
        ctx.font = "bold 40px Arial";
        ctx.fillText(user.name || "Student", 500, 270);

        ctx.fillStyle = "#555";
        ctx.font = "22px Arial";
        ctx.fillText(`has successfully completed the course`, 500, 330);

        ctx.fillStyle = "#0d6efd";
        ctx.font = "bold 32px Arial";
        crx.fillText(course.title, 500, 380);

        ctx.fillStyle = "#333";
        ctx.font = "18px Arial";
        ctx.fillText(`Instructor: ${course.instructor} | Date: ${new Date().toLocaleDateString()}`, 500, 430);
        ctx.fillText(`LearnUp LMS`, 500, 600);
        ctx.fillText("🏆 Verified Certificate", 500, 640);

        const link = document.createElement("a");
        link.download = `${course.title}_Certificate_${user.name}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="container mt-4 pb-5">
            <Link to="/courses" className="btn btn-outline-secondary btn-sm mb-3">← Back to Courses</Link>
            <div className="row">
                <div className="col-md-8">
                    <img src={course.image} style={{width: "120px", borderRadius: "10px"}} alt="" />
                    <p className="mt-2 small" style={{color: "var(--muted)"}}>{course.category}</p>
                    <h1 className="fw-bold" style={{color: "var(--text)"}}>{course.title}</h1>
                    <p style={{color: "var(--muted)"}}>By {course.instructor} | {course.category}</p>
                    <p style={{color: "var(--text)"}}>{course.description}</p>

                    {userRole === "student" && !isFollowing && (
                        <button onClick={handleFollow} className="btn btn-outline-warning btn-sm mb-3">❤️ Follow Instructor ({course.instructor})</button>
                    )}
                    {isFollowing && <span className="badge bg-warning text-dark mb-3">✓ Following {course.instructor}</span>}

                    <div className="card p-3 mt-3" style={{background: "var(--card-bg)"}}>
                        <h5 style={{color: "var(--text)"}}>Course Content - {completed.length}/{videos.length} completed</h5>
                        <p className="small">{percent}% Completed</p>
                        <div className="progress mb-3" style={{height: "10px"}}>
                            <div className="progress-bar" style={{width: `${percent}%`}}></div>
                        </div>
                        {videos.map((v, idx) => (
                            <div key={idx} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                <div>
                                    <input type="checkbox" checked={completed.includes(idx)} onChange={() => toggleVideo(idx)} className="me-2" />
                                    <span style={{color: "var(--text)"}}>{idx + 1}. {v}</span>
                                </div>
                                <small style={{color: "var(--muted)"}}>10m in</small>
                            </div>
                        ))}
                    </div>

                    {/* Certificate Card - Shows only when 100% */}
                    {percent === 100 && (
                        <div className="card mt-4 p-4 text-center shadow-lg" style={{background: "linear-gradient(135deg, #fffbe6, #ffffff)", border: "3px solid #ffc107"}}>
                            <h1>🏆</h1>
                            <h3 className="fw-bold">Congratulations {user.name}!</h3>
                            <p>You have completed <b>{course.title}</b></p>

                            <div ref={certificateRef} className="border border-primary p-4 mt-3 bg-white" style={{borderWidth: "3px !important", borderStyle: "dashed"}}>
                                <h2 className="text-primary fw-bold">Certificate of Completion</h2>
                                <p className="mt-3">This certificate is proudly presented to</p>
                                <h2 className="fw-bold">{user.name}</h2>
                                <p>has successfully completed</p>
                                <h3 className="text-primary">{course.title}</h3>
                                <p className="small">Instructor: {course.instructor} | Date: {new Date().toLocaleDateString()}</p>
                                <p className="small mt-3">LearnUp LMS</p>
                            </div>

                            <button onClick={downloadCertificate} className="btnbtn-warning fw-bold mt-4 px-5 py-2">📥 Download Certificate</button>
                            <p className="small text-success mt-2">Certificate will download as PNG - Ready to add in Project Report!</p>
                        </div>
                    )}
                </div>

                <div className="col-md-4">
                    <div className="card p-4" style={{background: "var(--card-bg)"}}>
                        <h2>{course.price === "Free" ? "Free" : `₹${course.price}`}</h2>
                        <p className="small" style={{color: "var(--text)"}}><s>₹2999</s> 50% off</p>
                        {!isEnrolled ? (
                            <button onClick={handleEnroll} className="btn btn-primary w-100 fw-bold">Enroll Now</button>
                        ) : (
                            <>
                                <button onClick={() => navigate("/student")} className="btn btn-success w-100 fw-bold">✅ Go to My Learning</button>
                                <p className="small text-success text-center mt-2">You are enrolled in this course</p>
                            </>
                        )}
                        <hr />
                        <h6>This course includes:</h6>
                        <ul className="small">
                            <li>📹 {videos.length} on-demand videos</li>
                            <li>📄 Articles & Resources</li>
                            <li>🏆 Certificate of Completion</li>
                            <li>♾️ Lifetime Access</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
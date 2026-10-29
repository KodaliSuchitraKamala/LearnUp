import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { courses } from "../data/courses";

export default function CourseDetail() {
    const { id } = useParams();

    // Get all courses (default + custom added by instructor)
    const customCourses = JSON.parse(localStorage.getItem("customCourses") || "[]");
    const allCourses = [...courses, ...customCourses];
    const course = allCourses.find(c => String(c.id) === String(id));

    // Progress state
    const [completed, setCompleted] = useState(() => {
        return JSON.parse(localStorage.getItem(`progress_${id}`) || "[]");
    });

    // Check if enrolled
    const enrollerCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
    const isEnrolled = enrollerCourses.map(String).includes(String(id));

    // Enroll Function
    const handleEnroll = () => {
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
        const idStr = String(id);
        // Avoid duplicate
        if (!enrolled.map(String).includes(idStr)) {
            enrolled.push(idStr);
            localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
            alert("✅ Enrolled Successfully! Check My Learning");
            window.location.href = "/student";
        } else {
            window.location.href = "/student";
        }
    };

    // Toggle video checkbox
    const toggleCheck = (index) => {
        let newCompleted;
        if (completed.includes(index)) {
            newCompleted = completed.filter(i => i !== index);
        } else {
            newCompleted = [...completed, index];
        }
        setCompleted(newCompleted);
        localStorage.setItem(`progress_${id}`, JSON.stringify(newCompleted));
    };

    if (!course) {
        return (
            <div className="container mt-5 text-center">
                <h3 style={{color: "var(--text)"}}>Course not found</h3>
                <Link to="/courses" className="btn btn-primary mt-3">Back to Courses</Link>
            </div>
        );
    }
    
    const totalVideos = course.videos?.length || 0;
    const progressPercent = totalVideos > 0 ? Math.round((completed.length / totalVideos) * 100) : 0;
    const isCompleted = progressPercent === 100;

    return (
        <div className="container mt-4 pb-5">
            <Link to="/courses" className="btn btn-sm btn-outline-secondary mb-3">← Back to Courses</Link>

            <div className="row">
                {/* Left Side */}
                <div className="col-md-8">
                    <img src={courses.image} className="w-100 rounded-4 shadow-sm" style={{height: "320px", objectFit: "cover"}} alt={course.title} />

                    <h2 className="mt-3 fw-bold" style={{color: "var(--text)"}}>{course.title}</h2>
                    <p style={{color: "var(--muted)"}}>By {course.instructor || course.author} | {course.category}</p>
                    <p style={{color: "var(--text)"}}>{course.description}</p>

                    <div className="card p-3 mt-4">
                        <h5 style={{color: "var(--text)"}}>Course Content - {completed.length}/{totalVideos} completed</h5>

                        <div className="d-flex justify-content-between mb-2">
                            <small style={{color: "var(--muted)"}}>{progressPercent}% Completed</small>
                            <small style={{color: "var(--muted)"}}>{completed.length}/{totalVideos}</small>
                        </div>

                        <div className="progress mb-3" style={{height: "20px"}}>
                            <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{width: `${progressPercent}%`}}>
                                {progressPercent}%
                            </div>
                        </div>

                        <ul className="list-group">
                            {course.videos?.map((videoTitle, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center" style={{background: "var(--card-bg)", color: "var(--text)", borderColor: "var(--border)"}}>
                                    <span>
                                        <input type="checkbox" checked={completed.includes(index)} onChange={() => toggleCheack(index)} disabled={!isEnrolled} className="form-check-input me-2" />
                                        {index + 1}. {videoTitle}
                                    </span>
                                    {completed.includes(index) && <span className="badge bg-success">✓ Done</span>}
                                </li>
                            ))}
                        </ul>

                        {!isEnrolled && (
                            <div className="alert alert-warning mt-3">
                                ⚠️ Enroll first to track progress
                            </div>
                        )}
                    </div>

                    {/* Certificate - Show when 100% */}
                    {isCompleted && (
                        <div className="card mt-4 p-4 border-success bg-success bg-opacity-10">
                            <div className="text-center">
                                <h3 className="text-success">🎉 Congratulations!</h3>
                                <h5 style={{color: "var(--text)"}}>You completed {course.title}</h5>
                                <p style={{color: "var(--muted)"}}>You are eligible for certificate</p>
                                <div className="p-4 border border-2 border-dashed rounded-3 mt-3" style={{background: "var(--card-bg)"}}>
                                    <h4>CERTIFICATE OF COMPLETION</h4>
                                    <p>This is to certify that</p>
                                    <h5 className="fw-bold text-primary">{course.title}</h5>
                                    <small style={{color: "var(--muted)"}}>Date: {new Date().toLocaleDateString()}</small>
                                </div>
                                <button onClick={() => window.print()} className="btn btn-success mt-3">📜 Download Certificate</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side - Price Card */}
                <div className="col-md-4">
                    <div className="card p-4 shadow-sm sticky-top" style={{top: "90px"}}>
                        <h2 className="fw-bold" style={{color: "var(--text)"}}>{course.price}</h2>
                        <p style={{color: "var(--muted)"}}><s>₹2999</s> 50% off</p>

                        {isEnrolled ? (
                            <>
                                <Link to="/student" className="btn btn-success w-100 fw-bold">✅ Go to My Learning</Link>
                                <p className="text-success small text-center mt-2">You are enrolled in this course</p>
                            </>
                        ) : (
                            <>
                                <button onClick={handleEnroll} className="btn btn-primary w-100 fw-bold">Enroll Now</button>
                                <p className="small text-center mt-2" style={{color: "var(--muted)"}}>30-Day Money Back Guarantee</p>
                            </>
                        )}

                        <hr style={{borderColor: "var(--border)"}} />
                        <h6 style={{color: "var(--text)"}}>This course includes:</h6>
                        <ul className="small" style={{color: "var(--muted)"}}>
                            <li>📹 {totalVideos} on-demand videos</li>
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
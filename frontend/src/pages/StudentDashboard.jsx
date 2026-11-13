import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
    const [myCourses, setMyCourses] = useState([]);
    const [following, setFollowing] = useState(() => JSON.parse(localStorage.getItem("following") || "[]"));
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
        setMyCourses(enrolled);
    }, []);

    const getProgress = (courseId) => {
        const completed = JSON.parse(localStorage.getItem(`progress_${courseId}`) || "[]");
        const course = myCourses.find(c => String(c.id) === String(courseId));
        const total = course?.videos?.length || 4;
        if (total === 0) return 0;
        return Math.round((completed.length / total) * 100);
    };

    const isFollowing = (instructor) => following.some(f => (typeof f === "string" ? f : f.instructor) === instructor);

    const handleFollow = async (instructorName) => {
        const already = following.some(f => (typeof f === "string" ? f : f.instructor) === instructorName);
        // Backend first
        try {
            if (already) await fetch(`/api/follows?instructor=${encodeURIComponent(instructorName)}&studentEmail=${encodeURIComponent(user.email || "")}`, { method: "DELETE" });
            else await fetch("/api/follows", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ instructorName, studentName: user.name || "Student", studentEmail: user.email || "" }) });
        } catch {}
        // Local backup
        let newFollowing;
        if (already) {
            newFollowing = following.filter(f => (typeof f === "string" ? f : f.instructor) !== instructorName);
            localStorage.setItem("followers", JSON.stringify(JSON.parse(localStorage.getItem("followers") || "[]").filter(f => !((f.instructor === instructorName) && ((f.studentName || f.name) === user.name)))));
        } else {
            newFollowing = [...following, { instructor: instructorName }];
            const followers = JSON.parse(localStorage.getItem("followers") || "[]");
            followers.push({ name: user.name, studentName: user.name, instructor: instructorName, studentEmail: user.email || "" });
            localStorage.setItem("followers", JSON.stringify(followers));
        }
        setFollowing(newFollowing);
        localStorage.setItem("following", JSON.stringify(newFollowing));
        window.dispatchEvent(new Event("followUpdated"));
    };

    const handleUnenroll = async (courseId) => {
        if (!window.confirm("Remove this course?")) return;
        const updated = myCourses.filter(c => String(c.id) !== String(courseId));
        setMyCourses(updated);
        localStorage.setItem("enrolledCourses", JSON.stringify(updated));
        localStorage.removeItem(`progress_${courseId}`);
        try { await fetch(`/api/enrollments?courseId=${courseId}&studentEmail=${encodeURIComponent(user.email || "")}`, { method: "DELETE" }); } catch {}
        localStorage.setItem("allEnrollments", JSON.stringify(JSON.parse(localStorage.getItem("allEnrollments") || "[]").filter(e => String(e.courseId || e.id) !== String(courseId))));
        window.dispatchEvent(new Event("enrollmentUpdated"));
    };

    return (
        <div className="container mt-4 pb-5">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <h3 className="fw-bold">My Learning - {myCourses.length} Courses</h3>
                <Link to="/courses" className="btn btn-outline-primary btn-sm">+ Browse More</Link>
            </div>
            {myCourses.length === 0 ? (
                <div className="text-center mt-5 p-5 border rounded" style={{ background: "var(--card-bg)" }}><h1>📚</h1><h5>No Courses Yet</h5><p className="text-muted">Start learning and track your progress here</p><Link to="/courses" className="btn btn-primary mt-2">Browse Courses</Link></div>
            ) : (
                <div className="row mt-4 g-3">
                    {myCourses.map(c => {
                        const prog = getProgress(c.id);
                        return (
                            <div className="col-12 col-sm-6 col-lg-4 mb-2" key={c.id}>
                                <div className="card h-100 shadow-sm">
                                    <div style={{ position: "relative" }}><img src={c.image} style={{ height: 180, width: "100%", objectFit: "cover" }} className="card-img-top" alt={c.title} /><span className="badge bg-dark position-absolute top-0 end-0 m-2">{prog}%</span></div>
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="fw-bold">{c.title}</h6>
                                        <small className="text-muted">By {c.instructor} • {c.category}</small>
                                        <button onClick={() => handleFollow(c.instructor)} className={`btn btn-sm mt-2 ${isFollowing(c.instructor) ? "btn-success" : "btn-outline-primary"}`}>{isFollowing(c.instructor) ? "✅ Following" : `+ Follow ${c.instructor}`}</button>
                                        <div className="mt-3"><div className="d-flex justify-content-between"><small>{prog}% Completed</small><small className="text-muted">{prog === 100 ? "Completed" : "In Progress"}</small></div><div className="progress mt-1" style={{ height: "8px" }}><div className="progress-bar" style={{ width: `${prog}%`, backgroundColor: prog === 100 ? "#198754" : "#0d6efd" }}></div></div></div>
                                        <div className="mt-auto pt-3">
                                            {prog === 100 ? (<><Link to={`/player/${c.id}`} className="btn btn-success btn-sm w-100 mb-2">✅ Completed - Rewatch</Link><Link to={`/courses/${c.id}`} className="btn btn-warning btn-sm w-100">🏆 View Certificate</Link></>) : (<Link to={`/player/${c.id}`} className="btn btn-primary btn-sm w-100">▶️ Continue Learning - {prog}%</Link>)}
                                            <button onClick={() => handleUnenroll(c.id)} className="btn btn-link btn-sm w-100 text-muted mt-1" style={{ fontSize: "12px" }}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
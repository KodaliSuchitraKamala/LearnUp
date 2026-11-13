import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

export default function InstructorDashboard() {
    const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("customCourses") || "[]"));
    const [followers, setFollowers] = useState(() => JSON.parse(localStorage.getItem("followers") || "[]"));
    const [enrolledAll, setEnrolledAll] = useState(() => JSON.parse(localStorage.getItem("enrolledCourses") || "[]"));
    const [allEnrollments, setAllEnrollments] = useState(() => JSON.parse(localStorage.getItem("allEnrollments") || "[]"));
    const [backendEnrollments, setBackendEnrollments] = useState([]);
    const [backendFollowers, setBackendFollowers] = useState([]);
    const [form, setForm] = useState({ title: "", category: "Development", price: "", description: "", image: "https://images.unsplash.com/photo-1516321318423-...?w=400" });
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const refreshData = useCallback(async () => {
        try {
            setEnrolledAll(JSON.parse(localStorage.getItem("enrolledCourses") || "[]"));
            setAllEnrollments(JSON.parse(localStorage.getItem("allEnrollments") || "[]"));
            setFollowers(JSON.parse(localStorage.getItem("followers") || "[]"));
        } catch {}
        // BACKEND - real source, works across browsers/users
        try {
            const eFetched = await fetch("/api/enrollments");
            const eData = await eFetched.json();
            if (Array.isArray(eData)) setBackendEnrollments(eData);
        } catch {}
        try {
            const fFetched = await fetch("/api/follows");
            const fData = await fFetched.json();
            if (Array.isArray(fData)) setBackendFollowers(fData);
        } catch {}
    }, []);

    useEffect(() => {
        async function load() {
            try {
                const fetched = await fetch("/api/courses");
                const data = await fetched.json();
                if (Array.isArray(data) && data.length > 0) {
                    const local = JSON.parse(localStorage.getItem("customCourses") || "[]");
                    const merged = [...data, ...local.filter(l => !data.some(d => String(d.id) === String(l.id)))];
                    setCourses(merged);
                }
            } catch {}
        }
        load();
    }, []);

    useEffect(() => {
        refreshData();
        window.addEventListener("focus", refreshData);
        window.addEventListener("storage", refreshData);
        window.addEventListener("enrollmentUpdated", refreshData);
        window.addEventListener("followUpdated", refreshData);
        const timer = setInterval(refreshData, 2000);
        return () => { window.removeEventListener("focus", refreshData); window.removeEventListener("storage", refreshData); window.removeEventListener("enrollmentUpdated", refreshData); window.removeEventListener("followUpdated", refreshData); clearInterval(timer); };
    }, [refreshData]);

    const myCourses = courses;
    const myCourseIds = new Set(myCourses.map(c => String(c.id)));
    const myInstructorNames = new Set(myCourses.map(c => c.instructor));

    // UNIFIED: backend first, local as fallback - dedupe by courseId + studentEmail
    const unified = [];
    const seen = new Set();
    const pushUnified = (courseId, title, price, studentName, studentEmail) => {
        const id = String(courseId || "");
        if (!id) return;
        const key = `${id}-${studentEmail || studentName || "Student"}`;
        if (seen.has(key)) return;
        seen.add(key);
        unified.push({ id, title, price: Number(price || 0), studentName, studentEmail });
    };
    backendEnrollments.forEach(e => pushUnified(e.courseId, e.courseTitle, e.price, e.studentName, e.studentEmail));
    allEnrollments.forEach(e => pushUnified(e.courseId || e.id, e.courseTitle || e.title, e.price, e.studentName, e.studentEmail));
    enrolledAll.forEach(e => pushUnified(e.id || e.courseId, e.title || e.courseTitle, e.price, e.studentName || user.name, e.studentEmail || ""));

    // FIX: Filter by courseId in MY courses, NOT by instructor name (names are reversed)
    const myEnrolled = unified.filter(e => myCourseIds.has(String(e.id)) || myCourses.some(c => c.title === e.title));
    const totalStudents = myEnrolled.length;
    const totalEarnings = myEnrolled.reduce((sum, c) => sum + (Number(c.price) || 0), 0);
    const getStudentsForCourse = (course) => unified.filter(e => String(e.id) === String(course.id) || e.title === course.title).length;

    // FOLLOWERS: backend follows where instructor is one of MY course instructors OR my name
    const backendMyFollowers = backendFollowers.filter(f => myInstructorNames.has(f.instructorName) || f.instructorName === user.name);
    const totalFollowers = backendMyFollowers.length > 0 ? backendMyFollowers.length : followers.length;
    const displayFollowers = backendMyFollowers.length > 0 ? backendMyFollowers : followers;

    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (!form.title || !form.price) { alert("Enter Title and Price"); return; }
        const newCourse = { title: form.title, category: form.category, price: Number(form.price), description: form.description, image: form.image, instructor: user.name || "Instructor", duration: "4h 30m", videos: JSON.stringify(["Introduction", "Chapter 1 - Basics", "Chapter 2 - Advanced", "Final Project"]) };
        try {
            const fetched = await fetch("/api/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCourse) });
            if (fetched.ok) {
                const saved = await fetched.json();
                const updated = [...courses, saved];
                setCourses(updated);
                localStorage.setItem("customCourses", JSON.stringify(updated));
                alert("Course Added & Saved to MySQL!");
            } else throw new Error("backend failed");
        } catch {
            const localCourse = { ...newCourse, id: Date.now(), videos: ["Introduction", "Chapter 1 - Basics", "Chapter 2 - Advanced", "Final Project"] };
            const updated = [...courses, localCourse];
            setCourses(updated);
            localStorage.setItem("customCourses", JSON.stringify(updated));
            alert("Course Added Successfully! (Saved Locally)");
        }
        setForm({ title: "", category: "Development", price: "", description: "", image: "https://images.unsplash.com/photo-1516321318423-...?w=400" });
    };

    const deleteCourse = async (id) => {
        if (!window.confirm("Delete this course?")) return;
        try { await fetch(`/api/courses/${id}`, { method: "DELETE" }); } catch {}
        const updated = courses.filter(c => String(c.id) !== String(id));
        localStorage.setItem("customCourses", JSON.stringify(updated));
        setCourses(updated);
    };

    return (
        <div className="container mt-4 pb-5">
            <h2 className="fw-bold" style={{ color: "var(--text)" }}>Instructor Dashboard</h2>
            <p style={{ color: "var(--muted)" }}>Welcome back, {user.name} 👋🏻 | Manage your courses and students</p>
            <div className="row g-3 mt-2">
                {[
                    { label: "My Courses", val: myCourses.length, sub: "📚 Total Created", color: "text-primary" },
                    { label: "Total Students", val: totalStudents, sub: "🧑🏻‍🎓 Enrolled", color: "text-success" },
                    { label: "Followers", val: totalFollowers, sub: "❤️ Followers", color: "text-warning" },
                    { label: "Earnings", val: `₹${totalEarnings}`, sub: "💰 This month", color: "text-success" },
                ].map(s => (
                    <div key={s.label} className="col-6 col-md-3"><div className="card p-3 shadow-sm border-0" style={{ background: "var(--card-bg)" }}><h6 style={{ color: "var(--muted)" }}>{s.label}</h6><h2 className="fw-bold" style={{ color: "var(--text)" }}>{s.val}</h2><small className={s.color}>{s.sub}</small></div></div>
                ))}
            </div>
            <div className="row mt-4 g-3">
                <div className="col-12 col-md-5">
                    <div className="card p-4 shadow-sm" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                        <h4 style={{ color: "var(--text)" }}>➕ Add New Course</h4>
                        <form onSubmit={handleAddCourse} className="mt-3">
                            <label className="small fw-bold" style={{ color: "var(--text)" }}>Course Title *</label>
                            <input className="form-control mb-3" placeholder="Ex: Complete React JS 2026" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                            <div className="row"><div className="col-6"><label className="small fw-bold" style={{ color: "var(--text)" }}>Category</label><select className="form-select mb-3" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Development</option><option>Design</option><option>Marketing</option><option>Business</option><option>Python</option></select></div><div className="col-6"><label className="small fw-bold" style={{ color: "var(--text)" }}>Price (₹)</label><input className="form-control mb-3" type="number" placeholder="Ex: 1499" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div></div>
                            <label className="small fw-bold" style={{ color: "var(--text)" }}>Description</label><textarea className="form-control mb-3" rows="3" placeholder="What students will learn..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                            <label className="small fw-bold" style={{ color: "var(--text)" }}>Thumbnail Image URL</label><input className="form-control mb-3" placeholder="https://..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                            <button className="btn btn-primary w-100 fw-bold py-2">🚀 Publish Course</button>
                        </form>
                    </div>
                    <div className="card p-3 mt-3" style={{ background: "var(--card-bg)" }}>
                        <h6 style={{ color: "var(--text)" }}>👥 Recent Followers ({totalFollowers})</h6>
                        {displayFollowers.length === 0 ? <p className="small" style={{ color: "var(--muted)" }}>No followers yet.</p> : displayFollowers.slice(0, 5).map((f, i) => (<div key={i} className="d-flex justify-content-between py-1"><span style={{ color: "var(--text)" }}>{typeof f === "string" ? f : f.studentName || f.name || f.instructor}</span><span className="badge bg-primary">Student</span></div>))}
                    </div>
                    <div className="card p-3 mt-3" style={{ background: "var(--card-bg)" }}>
                        <h6 style={{ color: "var(--text)" }}>🧑🏻‍🎓 Recent Enrollments ({myEnrolled.length})</h6>
                        {myEnrolled.length === 0 ? <p className="small" style={{ color: "var(--muted)" }}>No enrollments yet.</p> : myEnrolled.slice(0, 5).map((en, i) => (<div key={i} className="d-flex justify-content-between py-1"><span style={{ color: "var(--text)" }}>{en.studentName} - {en.title}</span><span className="badge bg-success">₹{en.price}</span></div>))}
                    </div>
                </div>
                <div className="col-12 col-md-7">
                    <div className="card p-4 shadow-sm" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2"><h4 style={{ color: "var(--text)" }}>📚 My Published Courses ({myCourses.length})</h4><Link to="/courses" className="btn btn-sm btn-outline-primary">View as Student</Link></div>
                        {myCourses.length === 0 ? (<div className="text-center py-5"><h1>📪</h1><p style={{ color: "var(--muted)" }}>No courses yet. Add your first course!</p></div>) : (<div className="mt-3">{myCourses.map(course => (<div key={course.id} className="card mb-3 p-2 d-flex flex-row align-items-center flex-wrap" style={{ background: "var(--bg)", borderColor: "var(--border)" }}><img src={course.image} style={{ width: "90px", height: "60px", objectFit: "cover", borderRadius: "10px" }} alt="" /><div className="ms-3 flex-grow-1" style={{ minWidth: "150px" }}><h6 className="mb-1" style={{ color: "var(--text)" }}>{course.title}</h6><small style={{ color: "var(--muted)" }}>{course.category} | ₹{course.price} | 🧑🏻‍🎓 {getStudentsForCourse(course)} students</small></div><div className="d-flex flex-row flex-md-column gap-1 mt-2 mt-md-0"><Link to={`/courses/${course.id}`} className="btn btn-sm btn-outline-primary">View</Link><button onClick={() => deleteCourse(course.id)} className="btn btn-sm btn-outline-danger">Delete</button></div></div>))}</div>)}
                    </div>
                    <div className="alert alert-info mt-3"><b>🔗 Interlinked System:</b> When a student clicks Enroll / Follow, their name appears here (from MySQL).</div>
                </div>
            </div>
        </div>
    );
}
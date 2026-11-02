import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function InstructorDashboard() {
    const [form, setForm] = useState({ title: "", category: "Development", price: "", description: "", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400"});

    const [courses, setCourses] = useState(() => {
        return JSON.parse(localStorage.getItem("customCourses") || "[]");
    });

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const followers = JSON.parse(localStorage.getItem("followers") || "[]");
    const enrolledAll = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");

    // Calculate stats
    const myCourses = courses.filter(c => c.instructor === user.name);
    const totalStudents = enrolledAll.length; // demo
    const totalEarnings = myCourses.reduce((sum, c) => sum + Number(c.price || 0), 0) * 2; // demo calculation

    const handleAddCourse = (e) => {
        e.preventDefault();
        if (!form.title || !form.price) {
            alert("Enter Title and Price");
            return;
        }

        const newCourse = {
            id: Date.now(),
            title: form.title,
            category: form.category,
            price: form.price,
            description: form.description,
            image: form.image,
            instructor: user.name || "Instructor",
            videos: ["Introduction", "Chapter 1 - Basics", "Chapter 2 - Advanced", "Final Project"],
        };

        const updated =[...courses, newCourse];
        localStorage.setItem("customCourses", JSON.stringify(updated));
        setCourses(updated);

        alert("✅ Course Added Successfully! Students can now see it.");
        setForm({ title: "", category: "Development", price: "", description: "", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400" });
    };

    const deleteCourse = (id) => {
        if (!confirm("Delete this course?")) return;
        const updated = courses.filter(c => c.id !== id);
        localStorage.setItem("customCourses", JSON.stringify(updated));
        setCourses(updated);
    };

    return (
        <div className="container mt-4 pb-5">
            <h2 className="fw-bold" style={{color: "var(--text)"}}>Instructor Dashboard</h2>
            <p style={{color: "var(--muted)"}}>Welcome back, {user.name} 👋🏻 | Manage your courses and students</p>

            {/* STATS CARDS - Premium Look */}
            <div className="row g-3 mt-2">
                <div className="col-md-3">
                    <div className="card p-3 shadow-sm border-0" style={{background: "var(--card-bg)"}}>
                        <h6 style={{color: "var(--muted)"}}>My Courses</h6>
                        <h2 className="fw-bold" style={{color: "var(--text)"}}>{myCourses.length}</h2>
                        <small className="text-primary">📚 Total Created</small>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 shadow-sm border-0" style={{background: "var(--card-bg)"}}>
                        <h6 style={{color: "var(--muted)"}}>Total Students</h6>
                        <h2 className="fw-bold" style={{color: "var(--text)"}}>{totalStudents}</h2>
                        <small className="text-success">🧑🏻‍🎓 Enrolled</small>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 shadow-sm border-0" style={{background: "var(--card-bg)"}}>
                        <h6 style={{color: "var(--muted)"}}>Followers</h6>
                        <h2 className="fw-bold" style={{color: "var(--text)"}}>{followers.length}</h2>
                        <small className="text-warning">❤️ Followers</small>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card p-3 shadow-sm border-0" style={{background: "var(--card-bg)"}}>
                        <h6 style={{color: "var(--muted)"}}>Earnings</h6>
                        <h2 className="fw-bold" style={{color: "var(--text)"}}>₹{totalEarnings}</h2>
                        <small className="text-success">💰 This month</small>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                {/* Add Course Form - Improved */}
                <div className="col-md-5">
                    <div className="card p-4 shadow-sm" style={{background: "var(--card-bg)", borderColor: "var(--border)"}}>
                        <h4 style={{color: "var(--text)"}}>➕ Add New Course</h4>
                        <form onSubmit={handleAddCourse} className="mt-3">
                            <label className="small fw-bold" style={{color: "var(--text)"}}>Course Title *</label>
                            <input className="form-control mb-3" placeholder="Ex: Complete React JS 2026" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />

                            <div className="row">
                                <div className="col-6">
                                    <label className="small fw-bold" style={{color: "var(--text)"}}>Category</label>
                                    <select className="form-select mb-3" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                                        <option>Development</option>
                                        <option>Design</option>
                                        <option>Marketing</option>
                                        <option>Business</option>
                                        <option>Python</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <lable className="small fw-bold" style={{color: "var(--text)"}}>Price (₹)</lable>
                                    <input className="form-control mb-3" type="number" placeholder="Ex: 1499" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                                </div>
                            </div>

                            <label className="small fw-bold" style={{color: "var(--text)"}}>Description</label>
                            <textarea className="form-control mb-3" rows="3" placeholder="What students will learn..." value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>

                            <label className="small fw-bold" style={{color: "var(--text)"}}>Thumbnail Image URL</label>
                            <input className="form-control mb-3" placeholder="https://..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />

                            <button className="btn btn-primary w-100 fw-bold py-2">🚀 Publish Course</button>
                            <p className="small text-center mt-2" style={{color: "var(--muted)"}}>Course will appear in Courses page instantly</p>
                        </form>
                    </div>

                    {/* Followers List */}
                    <div className="card p-3 mt-3" style={{background: "var(--card-bg)"}}>
                        <h6 style={{color: "var(--text)"}}>👥 Recent Followers ({followers.length})</h6>
                        {followers.length === 0 ? (
                            <p className="small" style={{color: "var(--muted)"}}>No followers yet. Students will follow you when they like your courses.</p>
                        ): (
                            followers.slice(0, 5).map((f, i) => (
                                <div key={i} className="d-flex justify-content-between py-1">
                                    <span style={{color: "var(--text)"}}>{f}</span>
                                    <span className="badge bg-primary">Student</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* My Courses List */}
                <div className="col-md-7">
                    <div className="card p-4 shadow-sm" style={{background: "var(--card-bg)", borderColor: "var(--border)"}}>
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 style={{color: "var(--text)"}}>📚 My Published Courses ({myCourses.length})</h4>
                            <Link to="/courses" className="btn btn-sm btn-outline-primary">View as Student</Link>
                        </div>

                        {myCourses.length === 0 ? (
                            <div className="text-center py-5">
                                <h1>📪</h1>
                                <p style={{color: "var(--muted)"}}>No courses yet. Add your first course!</p>
                            </div>
                        ) : (
                            <div className="mt-3">
                                {myCourses.map(course => (
                                    <div key={course.id} className="card mb-3 p-2 d-flex flex-row align-items-center" style={{background: "var(--bg)", borderColor: "var(--border)"}}>
                                        <img src={course.image} style={{width: "90px", height: "60px", objectFit: "cover", borderRadius: "10px"}} alt="" />
                                        <div className="ms-3 flex-grow-1">
                                            <h6 className="mb-1" style={{color: "var(--text)"}}>{course.title}</h6>
                                            <small style={{color: "var(--muted)"}}>{course.category} | ₹{course.price} | 🧑🏻‍🎓 {enrolledAll.length} students</small>
                                        </div>
                                        <div className="d-flex flex-column gap-1">
                                            <Link to={`/course/${course.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                                            <button onClick={() => deleteCourse(course.id)} className="btn btn-sm btn-outline-danger">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Interlinked Follow Info */}
                    <div className="alert alert-info mt-3">
                        <b>🔗 Interlinked System:</b> When a student clicks "Follow" on your course, their name appears in your Followers list, Your courses appear in their "My Learning" after they enroll. This is visible only because you are logged in as <b>Instructor</b>.
                    </div>
                </div>
            </div>
        </div>
    );
}
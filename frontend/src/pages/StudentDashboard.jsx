import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
    const [myCourses, setMyCourses] =useState([]);
    
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

    const handleUnenroll = (courseId) => {
        if (window.confirm("Remove this course from My Learning?")) {
            const updated = myCourses.filter(c => String(c.id) !== String(courseId));
            setMyCourses(updated);
            localStorage.setItem("enrolledCourses", JSON.stringify(updated));
            // Also clear progress
            localStorage.removeItem(`progress_${courseId}`);
        }
    };
    
    return (
        <div className="container mt-4 pb-5">
            <div className="d-flex justify-content-between align-items-center">
                <h3 className="fw-bold">My Learning - {myCourses.length} Courses</h3>
                <Link to="/courses" className="btn btn-outline-primary btn-sm">+ Browse More</Link>
            </div>
            
            {myCourses.length === 0 ? (
                <div className="text-center mt-5 p-5 border rounded bg-light">
                    <h1>📚 </h1>
                    <h5>No Courses Yet</h5>
                    <p className="text-muted">Start learning and track your progress here</p>
                    <Link to="/courses" className="btn btn-primary mt-2">Browse Courses</Link>
                </div>
            ) : (
                <div className="row mt-4">
                    {myCourses.map(c => {
                        const prog = getProgress(c.id);
                        return (
                            <div className="col-md-4 mb-4" key={c.id}>
                                <div className="card h-100 shadow-sm">
                                    <div style={{position: "relative"}}>
                                        <img src={c.image} style={{height: 180, objectFit: "cover"}} className="card-img-top" alt="" />
                                        <span className="badge bg-dark position-absolute top-0 end-0 m-2">{prog}%</span>
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="fw-bold">{c.title}</h6>
                                        <small className="text-muted">By {c.instructor} • {c.category}</small>

                                        <div className="mt-3">
                                            <div className="d-flex justify-content-between">
                                                <small>{prog}% Completed</small>
                                                <small className="text-muted">{prog === 100 ? "Completed" : "In Progress"}</small>
                                            </div>
                                            <div className="progress mt-1" style={{height: "8px"}}>
                                                <div className="progress-bar" style={{width: `${prog}%`, backgroundColor: prog === 100 ? "#198754": "#0d6efd"}}></div>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-3">
                                            {prog === 100 ? (
                                                <>
                                                    <Link to={`/player/${c.id}`} className="btn btn-success btn-sm w-100 mb-2">✅ Completed - Rewatch</Link>
                                                    <Link to={`/course/${c.id}`} className="btn btn-warning btn-sm w-100">🏆 View Certificate</Link>
                                                </>
                                            ) : (
                                                <Link to={`/player/${c.id}`} className="btn btn-primary btn-sm w-100">▶️ Continue Learning - {prog}%</Link>
                                            )}
                                            <button onClick={() => handleUnenroll(c.id)} className="btn btn-link btn-sm w-100 text-muted mt-1" style={{fontSize: "12px"}}>Remove</button>
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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courses } from "../data/courses";

export default function StudentDashboard() {
    const [myCourses, setMyCourses] =useState([]);

    useEffect(() => {
        const enrolledIds = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
        console.log("Enrolled: ", enrolledIds);
        const custom = JSON.parse(localStorage.getItem("customCourses") || "[]");
        const all = [...courses, ...custom];
        const filtered = all.filter(c => enrolledIds.includes(String(c.id)) || enrolledIds.includes(c.id));
        setMyCourses(filtered);
    }, []);
    
    return (
        <div className="container mt-4">
            <h3 style={{color: "var(--text)"}}>My Learning</h3>
            {myCourses.length === 0 ? (
                <div className="text-center mt-5">
                    <h5 style={{color: "var(--text)"}}>No courses enrolled yet</h5>
                    <p style={{color: "var(--muted)"}}>Enroll count: {JSON.parse(localStorage.getItem("enrolledCourses") || "[]").length}</p>
                    <Link to="/courses" className="btn btn-primary mt-2">Browse Courses</Link>
                </div>
            ) : (
                <div className="row">
                    {myCourses.map(c => (
                        <div className="col-md-4 mb-3" key={c.id}>
                            <div className="card p-3">
                                <h6>{c.title}</h6>
                                <Link to={`/course/${c.id}`} className="btn btn-sm btn-primary w-100 mt-2">Continue Learning</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
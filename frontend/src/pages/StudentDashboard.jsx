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
        const total = myCourses.find(c => String(c.id) === String(courseId))?.videos?.length || 4;
        return Math.round((completed.length / total) * 100);
    };
    
    return (
        <div className="container mt-4">
            <h3>My Learning - {myCourses.length} Courses</h3>
            {myCourses.length === 0 ? (
                <div className="text-center mt-5">
                    <h5>No Courses Yet</h5>
                    <Link to="/courses" className="btn btn-primary mt-2">Browse Courses</Link>
                </div>
            ) : (
                <div className="row mt-4">
                    {myCourses.map(c => {
                        const prog = getProgress(c.id);
                        return (
                            <div className="col-md-4 mb-4" key={c.id}>
                                <div className="card h-100">
                                    <img src={c.image} style={{height: 180, objectFit: "cover"}} className="card-img-top" alt="" />
                                    <div className="card-body">
                                        <h6 className="fw-bold">{c.title}</h6>
                                        <small className="text-muted">By {c.instructor}</small>
                                        <div className="mt-2">
                                            <small>{prog}% Completed</small>
                                            <div className="progress mb-3" style={{height: "9px"}}>
                                                <div className="progress-bar" style={{width: `${prog}%`}}></div>
                                            </div>
                                        </div>
                                        <Link to={`/courses/${c.id}`} className="btn btn-primary btn-sm w-100 mt-3">{prog === 100 ? "🏆 View Certificate" : "Continue Learning"}</Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
import { Link } from "react-router-dom";
import { courses } from "../data/courses";

export default function CourseList() {
    const custom = JSON.parse(localStorage.getItem("customCourses") || "[]");
    const all = [...courses, ...custom];
    return (
        <div className="container mt-4">
            <h3 className="fw-bold">✨ All Courses</h3>
            <div className="row mt-4">
                {all.map(c => (
                    <div className="col-md-4 mb-4" key={c.id}>
                        <div className="card h-100">
                            <img src={c.image} className="card-img-top rounded-top-4" style={{height: 180, objectFit: "cover"}} alt="" />
                            <div className="card-body">
                                <span className="badge" style={{background: "var(--bg)", color: "var(--primary)", border: "1px solid var(--border)"}}>{c.category}</span>
                                <h6 className="mt-2 fw-bold">{c.title}</h6>
                                <small style={{color: "var(--muted)"}}>By {c.instructor}</small>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <b>₹{c.price}</b>
                                    <Link to={`/courses/${c.id}`} className="btn btn-primary btn-sm">View</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courses as staticCourses } from "../data/courses";

export default function CourseList() {
    const [all, setAll] = useState(staticCourses);

    useEffect(() => {
        async function load() {
            try {
                const fetched = await fetch("/api/courses");
                const data = await fetched.json();
                const custom = JSON.parse(localStorage.getItem("customCourses") || "[]");
                const backend = Array.isArray(data) ? data : [];
                const merged = [...staticCourses, ...custom, ...backend];
                const deduped = [...new Map(merged.map(c => [String(c.id), c])).values()];
                setAll(deduped);
            } catch {
                const custom = JSON.parse(localStorage.getItem("customCourses") || "[]");
                const merged = [...staticCourses, ...custom];
                setAll([...new Map(merged.map(c => [String(c.id), c])).values()]);
            }
        }
        load();
    }, []);

    return (
        <div className="container mt-4 pb-5">
            <h3 className="fw-bold">✨ All Courses</h3>
            <div className="row mt-4">
                {all.map(c => (
                    <div className="col-12 col-sm-6 col-md-4 mb-4" key={c.title}>
                        <div className="card h-100">
                            <img src={c.image} className="card-img-top" style={{height: 180, objectFit: "cover"}} alt="" />
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
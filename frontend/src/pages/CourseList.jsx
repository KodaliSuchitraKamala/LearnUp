import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courses as staticCourses } from "../data/courses";

export default function CourseList() {
    const [all, setAll] = useState(staticCourses);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        async function load() {
            try {
                const fetched = await fetch("/api/courses");
                const data = await fetched.json();
                const custom = JSON.parse(localStorage.getItem("customCourses") || "[]");
                const backend = Array.isArray(data) ? data : [];
                const merged = [...staticCourses, ...custom, ...backend];
                setAll([...new Map(merged.map(c => [String(c.id), c])).values()]);
            } catch {
                const custom = JSON.parse(localStorage.getItem("customCourses") || "[]");
                setAll([...new Map([...staticCourses, ...custom].map(c => [String(c.id), c])).values()]);
            }
        }
        load();
    }, []);

    const filtered = all.filter(c => {
        const matchesSearch = (c.title?.toLowerCase().includes(search.toLowerCase()) || c.instructor?.toLowerCase().includes(search.toLowerCase()) || c.category?.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter = filter === "All" || (filter === "Live" && c.meetLink) || (filter === "Video" && c.videos);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="container mt-4 pb-5">
            <h3 className="fw-bold">✨ All Courses</h3>
            <input className="form-control mt-3" placeholder="🔍 Search by Title, Instructor, Category... Ex: React" value={search} onChange={e => setSearch(e.target.value)} />
            <div className="d-flex gap-2 mt-3 flex-wrap">
                {["All","Live","Video"].map(f => <button key={f} onClick={()=>setFilter(f)} className={`btn btn-sm ${filter===f?"btn-primary":"btn-outline-primary"}`}>{f==="Live"?"🔴 Live Classes":f==="Video"?"🎥 Video Courses":"All"}</button>)}
            </div>
            <p className="text-muted mt-2 small">{filtered.length} courses found {search && `for "${search}"`}</p>
            <div className="row mt-3">
                {filtered.length === 0 ? <div className="text-center py-5"><h1>🔍</h1><p>No courses found for "{search}"</p><button className="btn btn-outline-primary" onClick={()=>setSearch("")}>Clear Search</button></div> :
                filtered.map(c => (
                    <div className="col-12 col-sm-6 col-md-4 mb-4" key={c.id}>
                        <div className="card h-100 shadow-sm">
                            <div style={{position:"relative"}}>
                                <img src={c.image} className="card-img-top" style={{height:180, objectFit:"cover"}} alt="" />
                                {c.meetLink && <span className="badge bg-danger" style={{position:"absolute", top:10, left:10}}>🔴 LIVE CLASS</span>}
                            </div>
                            <div className="card-body">
                                <span className="badge" style={{background:"var(--bg)", color:"var(--primary)", border:"1px solid var(--border)"}}>{c.category}</span>
                                <h6 className="mt-2 fw-bold">{c.title}</h6>
                                <small style={{color:"var(--muted)"}}>By {c.instructor}</small>
                                {c.meetLink && <div className="small mt-1 text-danger fw-bold">📹 Live: {c.liveClassTitle || "Live Session"} {c.liveClassAt ? `• ${c.liveClassAt}` : ""}</div>}
                                <div className="d-flex justify-content-between align-items-center mt-3"><b>₹{c.price}</b><Link to={`/courses/${c.id}`} className="btn btn-primary btn-sm">View</Link></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { courses as staticCourses } from "../data/courses";

export default function CoursePlayer() {
    const { id } = useParams();
    const customCourses = JSON.parse(localStorage.getItem("customCourses") || "[]");
    const allCourses = [...staticCourses, ...customCourses];

    const [completed, setCompleted] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(0);
    const [showVideo, setShowVideo] = useState(false);

    const [course, setCourse] = useState(null);
    useEffect(() => {
        async function load() {
            try {
                const fetched = await fetch("/api/courses");
                const data = await fetched.json();
                const custom = JSON.parse(localStorage.getItem("customCourses") || "[]");
                const merged = [...staticCourses, ...custom, ...(Array.isArray(data) ? data : [])];
                const deduped = [...new Map(merged.map(c => [String(c.id), c])).values()];
                const found = deduped.find(c => String(c.id) === String(id));
                if (found) {
                    if (typeof found.videos === "string") { try { found.videos = JSON.parse(found.videos); } catch { found.videos = found.videos.split(","); } }
                    setCourse(found);
                }
            } catch {
                const custom = JSON.parse(localStorage.getItem("customCourses") || "[]");
                setCourse([...staticCourses, ...custom].find(c => String(c.id) === String(id)));
            }
        }
        load();
    }, [id]);

    if (!course) {
        return (
            <div className="container mt-5 text-center">
                <h3>Course not found</h3>
                <Link to="/student" className="btn btn-primary mt-3">Back to My Learning</Link> 
            </div>
        );
    }

    const videos = course.videos || ["Introduction", "Core Concepts", "Practical Session", "Final Project"];
    const percent = Math.round((completed.length / videos.length) * 100);

    const toggleComplete = (idx) => {
        const n = completed.includes(idx) ? completed.filter(i => i !== idx) : [...completed, idx];
        setCompleted(n);
        localStorage.setItem(`progress_${id}`, JSON.stringify(n));

        if (!completed.includes(idx) && idx < videos.length - 1) {
            setCurrentVideo(idx + 1);
        }
    };

    const lessons = {
        0: "MERN = MongoDB, Express, React, Node. In this intro you will understand how frontend talks to backend via API.",
        1: "MongoDB stores JSON-like data. Express creates APIs like GET /api/courses.",
        2: "React shows UI. Use useState, useEffect, and fetch data from your Express API.",
        3: "Auth = Login with JWT token stored in localStorage. Protected routes check token.",
        4: "Deployment = Push to GitHub, deploy frontend on Vercel, backend on Render."
    };

    return (
        <div style={{background: "var(--bg)", color: "var(--text)", minHeight: "100vh"}} className="container-fluid pt-2">
            <Link to="/student" className="btn btn-sm btn-outline-secondary mb-2 ms-2">← My Learning</Link>

            <div className="row g-0">
                {/* Left - Video Player - Now uses theme */}
                <div className="col-md-8 p-0" style={{background: "#000"}}>
                    {/* Image + Lesson - Works Offline */}
                    <div style={{position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden"}}>
                        <img src={course.image} alt={course.title} style={{width: "100%", height: "100%", objectFit: "cover"}} />
                        <div style={{position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent 60%)", display: "flex", alignItems: "flex-end", padding: "20px"}}>
                            <div style={{color: "#fff"}}>
                                <span className="badge bg-primary mb-2">Lesson {currentVideo + 1} of {videos.length}</span>
                                <h2>{videos[currentVideo]}</h2>
                                <p>{lessons[currentVideo] || lessons[0]}</p>
                                <button className="btn btn-light btn-sm" onClick={() =>  setShowVideo(true)}>▶️ Try Play YouTube Video</button>
                                <small className="d-block mt-1 text-white-50">If YouTube is blocked, lesson content above still works offline.</small>
                            </div>
                        </div>
                    </div>
                    {showVideo && (
                        <div style={{aspectRatio: "16/9"}}>
                            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/fBNz5xF-Kx4?autoplay=1`} title="video" frameBorder="0" allowFullScreen></iframe>
                        </div>
                    )}

                    <div className="p-3" style={{background: "#111", color: "#fff"}}>
                        <h4>{videos[currentVideo]}</h4>
                        <p className="text-white-50 small">{course.title} • Video {currentVideo + 1} of {videos.length}</p>
                        <div className="d-flex gap-2">
                            <button onClick={() => toggleComplete(currentVideo)} className={`btn btn-sm ${completed.includes(currentVideo) ? 'btn-success' : 'btn-outline-light'}`}>{completed.includes(currentVideo) ? '✅ Complete' : 'Mark as Complete'}</button>
                            {currentVideo < videos.length - 1 && <button onClick={() => {setShowVideo(false); setCurrentVideo(currentVideo + 1);}} className="btn btn-sm btn-primary">Next →</button>}
                        </div>
                    </div>
                </div>

                {/* Right - Playlist - Now uses theme */}
                <div className="col-md-4 border-start" style={{background: "var(--card-bg)", color: "var(--text)"}}>
                    <div className="p-3 border-bottom">
                        <h6>{course.title}</h6>
                        <div className="progress" style={{height: "8px"}}>
                            <div className="progress-bar" style={{width: `${percent}%`}}></div>
                        </div>
                        <small>{percent}% completed - {completed.length}/{videos.length}</small>
                    </div>
                    {videos.map((item, idx) => (
                        <div key={idx} onClick={() => {setShowVideo(false); setCurrentVideo(idx);}} className="p-3 border-bottom d-flex justify-content-between" style={{cursor: "pointer"}}>
                            <div className="d-flex gap-2">
                                <input type="checkbox" checked={completed.includes(idx)} onChange={() =>toggleComplete(idx)} onClick={e => e.stopPropagation()} />
                                <div>
                                    <div className="small fw-bold">{idx + 1}. {item}</div>
                                    <small>10:30</small>
                                </div>
                            </div>
                            {currentVideo === idx && <span className="small text-primary">▶️ Playing</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
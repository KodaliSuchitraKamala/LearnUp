import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { courses as staticCourses } from "../data/courses";

export default function CoursePlayer() {
    const { id } = useParams();
    const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem(`progress_${id}`) || "[]"));
    const [currentVideo, setCurrentVideo] = useState(0);
    const [course, setCourse] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const fetched = await fetch("/api/courses"); const data = await fetched.json();
                const custom = JSON.parse(localStorage.getItem("customCourses") || "[]");
                const merged = [...staticCourses, ...custom, ...(Array.isArray(data) ? data : [])];
                const deduped = [...new Map(merged.map(c => [String(c.id), c])).values()];
                const found = deduped.find(c => String(c.id) === String(id));
                if (found) setCourse(normalize(found));
            } catch { const custom = JSON.parse(localStorage.getItem("customCourses") || "[]"); const f = [...staticCourses, ...custom].find(c => String(c.id) === String(id)); if (f) setCourse(normalize(f)); }
        }
        load();
    }, [id]);

    function normalize(c) {
        let v = c.videos; if (typeof v === "string") { try { v = JSON.parse(v); } catch { v = v.split(","); } }
        if (!Array.isArray(v) || v.length === 0) v = ["Introduction", "Core Concepts", "Practical Session", "Final Project"];
        c.videos = v.map((x, i) => typeof x === "string" ? { title: x, url: "" } : { title: x.title || `Lesson ${i+1}`, url: x.url || x.videoUrl || "" });
        return c;
    }

    if (!course) return <div className="container mt-5 text-center"><h3>Course not found</h3><Link to="/student" className="btn btn-primary mt-3">Back to My Learning</Link></div>;

    const videos = course.videos;
    const current = videos[currentVideo];
    const percent = Math.round((completed.length / videos.length) * 100);
    const toggleComplete = (idx) => { const n = completed.includes(idx) ? completed.filter(i => i !== idx) : [...completed, idx]; setCompleted(n); localStorage.setItem(`progress_${id}`, JSON.stringify(n)); if (!completed.includes(idx) && idx < videos.length - 1) setCurrentVideo(idx + 1); };

    const getEmbed = (url) => {
        if (!url) return null;
        if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
        if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
        if (url.includes("drive.google.com")) { const m = url.match(/\/d\/([^/]+)/); if (m) return `https://drive.google.com/file/d/${m[1]}/preview`; }
        return url;
    };
    const embed = getEmbed(current.url);
    const isDirectVideo = embed && (embed.endsWith(".mp4") || embed.includes("drive.google"));

    return (
        <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }} className="container-fluid pt-2">
            <Link to="/student" className="btn btn-sm btn-outline-secondary mb-2 ms-2">← My Learning</Link>
            {course.meetLink && <div className="alert alert-danger d-flex justify-content-between align-items-center mx-2"><span>🔴 <b>Live Class:</b> {course.liveClassTitle || "Live Session"} {course.liveClassAt ? `• ${course.liveClassAt}` : ""} - Join Meet to interact with {course.instructor}</span><a href={course.meetLink} target="_blank" rel="noreferrer" className="btn btn-danger btn-sm fw-bold">📹 Join Meet Now</a></div>}
            <div className="row g-0">
                <div className="col-md-8 p-0" style={{ background: "#000" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#000" }}>
                        {embed ? (isDirectVideo ? <video src={embed} controls style={{ width: "100%", height: "100%" }} poster={course.image} /> : <iframe width="100%" height="100%" src={embed} title={current.title} frameBorder="0" allowFullScreen></iframe>)
                        : (<><img src={course.image} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /><div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)", display: "flex", alignItems: "flex-end", padding: "20px" }}><div style={{ color: "#fff" }}><span className="badge bg-primary mb-2">Lesson {currentVideo + 1} of {videos.length}</span><h2>{current.title}</h2><p className="small">Instructor has not uploaded video for this lesson yet. Watch Live Meet or ask in Live Class.</p></div></div></>)}
                    </div>
                    <div className="p-3" style={{ background: "#111", color: "#fff" }}>
                        <h4>{current.title}</h4><p className="text-white-50 small">{course.title} • Video {currentVideo + 1} of {videos.length} • By {course.instructor}</p>
                        <div className="d-flex gap-2 flex-wrap"><button onClick={() => toggleComplete(currentVideo)} className={`btn btn-sm ${completed.includes(currentVideo) ? 'btn-success' : 'btn-outline-light'}`}>{completed.includes(currentVideo) ? '✅ Complete' : 'Mark as Complete'}</button>{currentVideo < videos.length - 1 && <button onClick={() => setCurrentVideo(currentVideo + 1)} className="btn btn-sm btn-primary">Next →</button>}{course.meetLink && <a href={course.meetLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-danger">📹 Join Live Meet</a>}</div>
                    </div>
                </div>
                <div className="col-md-4 border-start" style={{ background: "var(--card-bg)", color: "var(--text)" }}>
                    <div className="p-3 border-bottom"><h6>{course.title}</h6><div className="progress" style={{ height: "8px" }}><div className="progress-bar" style={{ width: `${percent}%` }}></div></div><small>{percent}% completed - {completed.length}/{videos.length}</small></div>
                    {videos.map((item, idx) => (<div key={idx} onClick={() => setCurrentVideo(idx)} className="p-3 border-bottom d-flex justify-content-between" style={{ cursor: "pointer" }}><div className="d-flex gap-2"><input type="checkbox" checked={completed.includes(idx)} onChange={() => toggleComplete(idx)} onClick={e => e.stopPropagation()} /><div><div className="small fw-bold">{idx + 1}. {item.title} {item.url && <span className="badge bg-success ms-1">🎥</span>}</div><small>{item.url ? "Instructor Uploaded Video" : "Theory Lesson"}</small></div></div>{currentVideo === idx && <span className="small text-primary">▶️ Playing</span>}</div>))}
                </div>
            </div>
        </div>
    );
}
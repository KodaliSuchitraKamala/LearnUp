import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ theme, toggleTheme }) {
    const [showMenu, setShowMenu] = useState(false);
    const dark = theme === "dark";
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        localStorage.removeItem("isLoggedIn");
        setShowMenu(false);
        navigate("/login");
    };
    const closeMenu = () => setShowMenu(false);
    const links = [
        { to: "/courses", label: "📚 Courses" },
        { to: "/student", label: "🎓 My Learning" },
        { to: "/instructor", label: "🧑🏻‍🏫 Instructor Dashboard" },
        { to: "/courses", label: "🔍 Browse Courses" },
    ];

    return (
        <>
            <nav className="navbar navbar-dark sticky-top" style={{ background: "var(--navbar)", padding: "10px 0" }}>
                <div className="container d-flex align-items-center justify-content-between" style={{ flexWrap: "nowrap" }}>
                    <div className="d-flex align-items-center gap-2">
                        {/* ☰ FIRST on Left - Mobile Only */}
                        <button className="btn btn-dark d-md-none" onClick={() => setShowMenu(true)} style={{ fontSize: "22px", lineHeight: "1", padding: "4px 10px", border: "1px solid #444" }}>☰</button>
                        <Link to="/" className="navbar-brand fw-bold fs-4 mb-0" onClick={closeMenu} style={{ color: "#fff" }}>🚀 LearnUp</Link>
                    </div>
                    <div className="d-none d-md-flex align-items-center gap-3">
                        <Link to="/courses" className="text-white text-decoration-none">Courses</Link>
                        <Link to="/student" className="text-white text-decoration-none">My Learning</Link>
                        <Link to="/instructor" className="text-white text-decoration-none">Instructor Dashboard</Link>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <button onClick={toggleTheme} className="btn btn-light btn-sm rounded-circle" style={{ width: "36px", height: "36px" }}>{dark ? "☀️" : "🌙"}</button>
                        <span className="text-white d-none d-md-block small">{user.name ? `${user.name} (${user.role || localStorage.getItem("userRole") || "student"})` : "Guest"}</span>
                        <button onClick={handleLogout} className="btn btn-danger btn-sm d-none d-md-block">Logout</button>
                    </div>
                </div>
            </nav>

            {showMenu && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999 }} onClick={closeMenu}>
                    <div className="h-100 p-3 d-flex flex-column" style={{ width: "280px", background: "var(--card-bg)", color: "var(--text)", position: "absolute", left: 0, top: 0, animation: "slideIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">🚀 LearnUp</h5>
                            <button className="btn btn-sm btn-outline-secondary" onClick={closeMenu}>✕</button>
                        </div>
                        <div className="card p-3 mb-3 text-center" style={{ background: "var(--bg)" }}>
                            <div style={{ fontSize: "40px" }}>👤</div>
                            <h6 className="fw-bold mb-0 mt-1">{user.name || "Guest User"}</h6>
                            <small style={{ color: "var(--muted)" }}>{user.email || "Not logged in"}</small>
                            <span className="badge bg-primary mt-2" style={{ width: "fit-content", margin: "8px auto 0" }}>{user.role || localStorage.getItem("userRole") || "Student"}</span>
                        </div>
                        <div className="d-flex flex-column gap-1">
                            {links.map(l => (
                                <Link key={l.label} to={l.to} onClick={closeMenu} className="btn text-start fw-bold py-2" style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}>{l.label}</Link>
                            ))}
                        </div>
                        <div className="mt-auto">
                            <hr />
                            <button onClick={handleLogout} className="btn btn-danger w-100 fw-bold py-2">🚪 Logout</button>
                            <p className="text-center small mt-2" style={{ color: "var(--muted)" }}>LearnUp © 2026</p>
                        </div>
                    </div>
                </div>
            )}
            <style>{`@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
        </>
    );
}
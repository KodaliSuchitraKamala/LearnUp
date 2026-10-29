import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ theme, toggleTheme }) {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const navigate = useNavigate();
    const logout = () => { localStorage.removeItem("user"); navigate("/login"); };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark px-4 py-3 sticky-top" style={{background: "var(--navbar)", boxShadow: "var(--shadow)"}}>
            <Link className="navbar-brand fw-bold fs-4" to="/">🚀 LearnUp</Link>
            <div className="ms-auto d-flex gap-3 align-items-center">
                <Link className="nav-link text-white" to="/courses">Courses</Link>
                <Link className="nav-link text-white" to="/student">My Learning</Link>
                <Link className="nav-link text-warning fw-bold" to="/instructor">Instructor</Link>
                <button onClick={toggleTheme} className="btn btn-sm btn-outline-light rounded-circle" style={{width: 38, height: 38}}>
                    {theme === "light" ? "🌙" : "☀️"}
                </button>
                {user ? <button className="btn btn-sm btn-light" onClick={logout}>Logout</button> : <>
                    <Link className="btn btn-sm btn-outline-light" to="/login">Login</Link>
                    <Link className="btn btn-sm btn-primary" to="/register">Join</Link>
                </>}
            </div>
        </nav>
    );
}
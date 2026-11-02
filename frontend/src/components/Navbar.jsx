import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ theme, toggleTheme }) {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userRole = localStorage.getItem("userRole") || "student"; // student or instructot
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        navigate("/login");
    };

    return (
        <nav style={{background: "#000", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Link to="/" style={{color: "white", fontWeight: "bold", textDecoration: "none", fontSize: "40px"}}>🚀 LearnUp</Link>

            <div style={{display: "flex", gap: "15px", alignItems: "center"}}>
                <Link to="/courses" style={{color: "white", textDecoration: "none"}}>Courses</Link>

                {/* Only For Students */}
                {isLoggedIn && userRole === "student" && (
                    <Link to="/student" style={{color: "white", textDecoration: "none"}}>My Learning</Link>
                )}

                {/* Only For Instructor */}
                {isLoggedIn && userRole === "instructor" && (
                    <Link to="/instructor" style={{color: "#ffc107", fontWeight: "bold", textDecoration: "none", border: "1px solid #ffc107", padding: "5px 10px", borderRadius: "10px"}}>🧑🏻‍🏫 Instructor Dashboard</Link>
                )}

                {/* Follow Feature - Showw instructor profile */}
                <button onClick={toggleTheme} style={{background: "white", color: "black", border: "none", padding: "6px 12px", borderRadius: "20px", cursor: "pointer"}}>
                    {theme === "light" ? "🌙" : "☀️"}
                </button>

                {!isLoggedIn ? (
                    <>
                        <Link to="/login" style={{color: "white", textDecoration: "none"}}>Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                    </>
                ) : (
                    <>
                        <span style={{color: "#aaa", fontSize: "12px"}}>{user.name} ({userRole})</span>
                        <button onClick={logout} style={{background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "10px"}}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}
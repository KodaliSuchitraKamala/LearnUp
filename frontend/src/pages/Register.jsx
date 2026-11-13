import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        let foundUser = null;

        // 1. TRY MYSQL FIRST - real users table
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password })
            });
            if (res.ok) {
                const dbUser = await res.json();
                // Backend returns role as STUDENT / INSTRUCTOR (uppercase) - convert to frontend lowercase
                foundUser = {
                    id: dbUser.id, // Real MySQL ID
                    name: dbUser.name,
                    email: dbUser.email,
                    password: dbUser.password,
                    role: dbUser.role.toLowerCase() // student / instructor
                };
                console.log("✅ Login from MySQL, ID:", dbUser.id);
            }
        } catch (err) {
            console.log("MySQL login failed, trying local:", err);
        }

        // 2. FALLBACK - localStorage (for old users before MySQL)
        if (!foundUser) {
            const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
            foundUser = allUsers.find(u => u.email === form.email && u.password === form.password);
            if (foundUser) console.log("Login from localStorage, ID:", foundUser.id);
        }

        setLoading(false);

        if (foundUser) {
            // Sync local list - if user came from MySQL but not in local, add it
            const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
            if (!allUsers.find(u => u.email === foundUser.email)) {
                allUsers.push(foundUser);
                localStorage.setItem("allUsers", JSON.stringify(allUsers));
            }
            localStorage.setItem("user", JSON.stringify(foundUser));
            localStorage.setItem("userRole", foundUser.role);
            localStorage.setItem("isLoggedIn", "true");
            alert(`Welcome back ${foundUser.name} (${foundUser.role}) | ID: ${foundUser.id}`);
            if (foundUser.role === "instructor") navigate("/instructor");
            else navigate("/courses");
        } else {
            alert("User not found! Please register first.");
            navigate("/register");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <div className="card p-4" style={{ background: "var(--card-bg)" }}>
                <h3 className="text-center" style={{ color: "var(--text)" }}>Login</h3>
                <form onSubmit={handleLogin} className="mt-3">
                    <input className="form-control mb-3" placeholder="Email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input className="form-control mb-3" placeholder="Password" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button className="btn btn-primary w-100" disabled={loading}>{loading ? "Checking..." : "Login"}</button>
                </form>
                <p className="text-center mt-3">New user? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
}
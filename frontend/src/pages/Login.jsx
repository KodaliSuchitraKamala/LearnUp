import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        let foundUser = null;

        // 1. TRY MYSQL FIRST
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email.trim(), password: form.password })
            });
            if (res.ok) {
                const dbUser = await res.json();
                foundUser = {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    password: dbUser.password,
                    role: (dbUser.role || "student").toLowerCase()
                };
                console.log("✅ Login from MySQL, ID:", dbUser.id);
            } else {
                // Backend returned 401 / 404 / 500 - don't crash, try local fallback
                const msg = await res.text().catch(() => "");
                console.log("MySQL login failed:", res.status, msg);
            }
        } catch (err) {
            console.log("Backend down, trying local:", err);
        }

        // 2. FALLBACK - localStorage
        if (!foundUser) {
            const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
            foundUser = allUsers.find(u => u.email === form.email.trim() && u.password === form.password);
            if (foundUser) console.log("Login from localStorage, ID:", foundUser.id);
        }

        setLoading(false);

        if (foundUser) {
            const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
            if (!allUsers.find(u => u.email === foundUser.email)) {
                allUsers.push(foundUser);
                localStorage.setItem("allUsers", JSON.stringify(allUsers));
            }
            localStorage.setItem("user", JSON.stringify(foundUser));
            localStorage.setItem("userRole", foundUser.role);
            localStorage.setItem("isLoggedIn", "true");
            alert(`Welcome back ${foundUser.name} (${foundUser.role})`);
            if (foundUser.role === "instructor") navigate("/instructor");
            else navigate("/courses");
        } else {
            setError("Invalid email or password. If you are new, please Register first.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <div className="card p-4" style={{ background: "var(--card-bg)" }}>
                <h3 className="text-center" style={{ color: "var(--text)" }}>Login</h3>
                {error && <div className="alert alert-danger py-2 mt-3">{error}</div>}
                <form onSubmit={handleLogin} className="mt-3">
                    <input className="form-control mb-3" placeholder="Email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input className="form-control mb-3" placeholder="Password" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button className="btn btn-primary w-100" disabled={loading}>{loading ? "Checking..." : "Login"}</button>
                </form>
                <p className="text-center mt-3">New user? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
}
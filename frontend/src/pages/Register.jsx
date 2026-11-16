import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const newUser = {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role.toUpperCase() // Backend expects STUDENT / INSTRUCTOR
        };

        // 1. TRY MYSQL FIRST
        let savedUser = null;
        try {
            const res = await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                const dbUser = await res.json();
                savedUser = {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    password: dbUser.password,
                    role: (dbUser.role || form.role).toLowerCase()
                };
                console.log("✅ Registered in MySQL, ID:", dbUser.id);
            } else {
                const msg = await res.text().catch(() => "");
                console.log("MySQL register failed:", res.status, msg);
                if (res.status === 409 || msg.toLowerCase().includes("already")) {
                    setError("Email already registered. Please Login.");
                    setLoading(false);
                    return;
                }
            }
        } catch (err) {
            console.log("Backend down, saving locally:", err);
        }

        // 2. FALLBACK - localStorage
        if (!savedUser) {
            const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
            if (allUsers.find(u => u.email === newUser.email)) {
                setError("Email already registered locally. Please Login.");
                setLoading(false);
                return;
            }
            savedUser = { ...newUser, role: newUser.role.toLowerCase(), id: Date.now() };
        }

        // Save locally for offline + Navbar
        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
        if (!allUsers.find(u => u.email === savedUser.email)) {
            allUsers.push(savedUser);
            localStorage.setItem("allUsers", JSON.stringify(allUsers));
        }
        localStorage.setItem("user", JSON.stringify(savedUser));
        localStorage.setItem("userRole", savedUser.role);
        localStorage.setItem("isLoggedIn", "true");

        setLoading(false);
        alert(`Welcome ${savedUser.name} (${savedUser.role})! Registered successfully.`);
        if (savedUser.role === "instructor") navigate("/instructor");
        else navigate("/courses");
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <div className="card p-4" style={{ background: "var(--card-bg)" }}>
                <h3 className="text-center" style={{ color: "var(--text)" }}>Register</h3>
                {error && <div className="alert alert-danger py-2 mt-3">{error}</div>}
                <form onSubmit={handleRegister} className="mt-3">
                    <input className="form-control mb-3" placeholder="Full Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input className="form-control mb-3" placeholder="Email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input className="form-control mb-3" placeholder="Password" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <label className="small fw-bold">I am a:</label>
                    <select className="form-select mb-3" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                        <option value="student">🎓 Student</option>
                        <option value="instructor">🧑🏻‍🏫 Instructor</option>
                    </select>
                    <button className="btn btn-primary w-100" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
                </form>
                <p className="text-center mt-3">Already have account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}
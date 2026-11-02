import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
        const foundUser = allUsers.find(u => u.email === form.email && u.password === form.password);

        if (foundUser) {
            // Save full user object - so Navbar shows name + role
            localStorage.setItem("user", JSON.stringify(foundUser));
            localStorage.setItem("userRole", foundUser.role);
            localStorage.setItem("isLoggedIn", "true");
            alert(`Welcome back ${foundUser.name} (${foundUser.role})`);
            if (foundUser.role === "instructor") navigate("/instructor");
            else navigate("/courses");
        } else {
            alert("User not found! Please register first.");
            navigate("/register");
        }
    };

    return (
        <div className="container mt-5" style={{maxWidth: "400px"}}>
            <div className="card p-4" style={{background: "var(--card-bg)"}}>
                <h3 className="text-center" style={{color: "var(--text)"}}>Login</h3>
                <form onSubmit={handleLogin} className="mt-3">
                    <input className="form-control mb-3" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    <input className="form-control mb-3" placeholder="Password" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                    <button className="btn btn-primary w-100">Login</button>
                </form>
                <p className="text-center mt-3">New user? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
}
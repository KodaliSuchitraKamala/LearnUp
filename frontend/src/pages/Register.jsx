import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        // Save ALL users list for login check
        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
        const userExists = allUsers.find(u => u.email === form.email);
        if(userExists) {
            alert("Email already exists, please login");
            navigate("/login");
            return;
        }
        const newUser = { ...form, id: Date.now() };
        allUsers.push(newUser);
        localStorage.setItem("allUsers", JSON.stringify(allUsers));

        // Set current logged in user
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("userRole", newUser.role);
        localStorage.setItem("isLoggedIn", "true");

        alert(`Registered as ${form.name} (${form.role})`);
        if (form.role === "instructor") navigate("/instructor");
        else navigate("/courses");
    };

    return (
        <div className="container mt-5" style={{maxWidth: "450px"}}>
            <div className="card p-4" style={{background: "var(--card-bg)"}}>
                <h3 className="text-center" style={{color: "var(--text)"}}>Create Account</h3>
                <form onSubmit={handleRegister} className="mt-3">
                    <input className="form-control mb-3" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input className="form-control mb-3" placeholder="Email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    <input className="form-control mb-3" placeholder="Password" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                    <label className="fw-bold" style={{color: "var(--text)"}}>Register as:</label>
                    <select className="form-select mb-4" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                        <option value="student">🧑🏻‍🎓 Student</option>
                        <option value="instructor">🧑🏻‍🏫 Instructor</option>
                    </select>
                    <button className="btn btn-primary w-100 fw-bold">Register</button>
                </form>
                <p className="text-center mt-3" style={{color: "var(--muted)"}}>Already have account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}
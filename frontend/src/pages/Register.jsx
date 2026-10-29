import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save user as per project logic
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        users.push(form)
        localStorage.setItem("users", JSON.stringify(users))
        alert("Registered Successfully! Please Login")
        navigate("/login")
    }

    return (
        <div className="container mt-5" style={{maxWidth: "400px"}}>
            <h3 className="text-center mb-4">Create Account</h3>
            <form onSubmit={handleSubmit} className="card p-44 shadow">
                <input className="form-control mb-3" placeholder="Full Name" required onChange={e => setForm({...form, name: e.target.value})} />
                <input className="form-control mb-3" placeholder="Email" type="email" required onChange={e => setForm({...form, email: e.target.value})} />
                <input className="form-control mb-3" placeholder="Password" type="password" required onChange={e => setForm({...form, password: e.target.value})} />
                <button className="btn btn-primary w-100">Register</button>
                <p className="mt-3 text-center small">Already have account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    )
}

export default Register
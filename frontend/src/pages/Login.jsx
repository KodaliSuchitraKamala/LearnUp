import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [role, setRole] = useState("STUDENT")
    const navigate = useNavigate()

    const handleLogin = () => {
        localStorage.setItem("role", role)
        if(role === "STUDENT") navigate("/student")
        else navigate("/instructor")
    }

    const inputStyle = {
        width: "100%",
        boxSizing: "border-box",
        background: "#f1f5f9",
        color: "black",
        border: "1.5px solid #cdb5e1",
        padding: "12px 14px",
        marginBottom: "14px",
        borderRadius: "10px",
        fontSize: "14px",
        outline: "none"
    }

    return (
        <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc"}}>
            <div style={{width: "380px", padding: "32px", background: "white", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", borderRadius: "16px", boxSizing: "border-box"}}>
                <h1 style={{fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px 0", textAlign: "center"}}>LearnUp LMS</h1>
                <p style={{textAlign: "center", color: "#64748b", marginBottom: "20px", fontSize: "14px"}}>Login to continue</p>

                <div style={{display: "flex", gap: "8px", marginBottom: "20px", background: "#f1f5f9", padding: "4px", borderRadius: "8px"}}>
                    <button onClick={() => setRole("STUDENT")} style={{flex: 1, background: role === "STUDENT" ? "#2563eb" : "transparent", color: role === "STUDENT" ? "#fff" : "#000", padding: "8px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer"}}>Student</button>
                    <button onClick={() => setRole("INSTRUCTOR")} style={{flex: 1, background: role === "INSTRUCTOR" ? "#2563eb" : "transparent", color: role === "INSTRUCTOR" ? "#fff" : "#000", padding: "8px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer"}}>Instructor</button>
                </div>

                <input placeholder="Email" style={inputStyle} />
                <input placeholder="Password" type="password" style={inputStyle} />

                <button onClick={handleLogin} style={{width: "100%", boxSizing: "border-box", background: "#0f172a", color: "white", padding: "13px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "14px"}}>Login as {role}</button>
            </div>
        </div>
    )
}

export default Login
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
    const navigate = useNavigate()

    const cardStyle = {
        background: "white",
        border: "1.5px solid #e2e8f0",
        padding: "22px",
        borderRadius: "14px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)"
    }

    return (
        <div style={{minHeight: "100vh", background: "#f8fafc", padding: "24px"}}>
            <div style={{maxWidth: "1000px", margin: "0 auto"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "16px 20px", borderRadius: "12px", border: "1px solid #e2e8f0"}}>
                    <div>
                        <h1 style={{fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: 0}}>Student Dashboard</h1>
                        <p style={{color: "#64748b", margin: "4px 0 0 0", fontSize: "14px"}}>Welcome! Continue Your Learning Journey.</p>
                    </div>
                    <button onClick={() => navigate("/")} style={{padding: "8px 16px", background: "white", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontWeight: "600"}}>Logout</button>
                </div>

                <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px"}}></div>
            </div>
        </div>
    )
}

export default StudentDashboard
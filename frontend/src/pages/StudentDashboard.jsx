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
                        <h1 style={{fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0}}>Student Dashboard</h1>
                        <p style={{color: "#64748b", margin: "4px 0 0 0", fontSize: "14px"}}>Welcome! Continue Your Learning Journey.</p>
                    </div>
                    <button onClick={() => navigate("/")} style={{padding: "8px 18px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px"}}>Logout</button>
                </div>

                <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "24px"}}>
                    <div style={cardStyle}>
                        <h3 style={{fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0"}}>Java Full Stack</h3>
                        <p style={{margin: "0 0 10px 0", color: "#475569", fontSize: "14px"}}>Progress: 60%</p>
                        <div style={{background: "#e2e8f0", height: "8px", borderRadius: "10px"}}>
                            <div style={{background: "#2563eb", width: "60%", height: "8px", borderRadius: "10px"}}></div>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3 style={{fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0"}}>React Basics</h3>
                        <p style={{margin: "0 0 10px 0", color: "#475569", fontSize: "14px"}}>Progress: 80%</p>
                        <div style={{background: "#e2e8f0", height: "8px", borderRadius: "10px"}}>
                            <div style={{background: "#16a34a", width: "80%", height: "8px", borderRadius: "10px"}}></div>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3 style={{fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0"}}>Spring Boot</h3>
                        <p style={{margin: "0 0 10px 0", color: "#475569", fontSize: "14px"}}>Progress: 30%</p>
                        <div style={{background: "#e2e8f0", height: "8px", borderRadius: "10px"}}>
                            <div style={{background: "#f59e0b", width: "30%", height: "8px", borderRadius: "10px"}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard
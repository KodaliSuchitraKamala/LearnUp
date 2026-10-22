import { useNavigate } from "react-router-dom";

function InstructorDashboard() {
    const navigate = useNavigate()

    return (
        <div style={{minHeight: "100vh", background: "#f8fafc", padding: "24px"}}>
            <div style={{maxWidth: "1000px", margin: "0 auto"}}>
                {/* HEADER */}
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "16px 20px", borderRadius: "12px", border: "1px solid #e2e8f0"}}>
                    <h1 style={{fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0}}>Instructor Dashboard</h1>
                    <button onClick={() => navigate("/")} style={{padding: "8px 18px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px"}}>Logout</button>
                </div>

                {/* CREATE BUTTON */}
                <div style={{textAlign: "center", margin: "24px 0"}}>
                    <button style={{background: "#2563eb", color: "white", padding: "12px 20px", borderRadius: "10px", border: "none", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"}}>+ Create New Course</button>
                </div>

                {/* TABLE - LIGHT THEME */}
                <div style={{background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)"}}>
                    <div style={{display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: "#f8fafc", padding: "14px 20px", fontWeight: "700", color: "#475569", borderBottom: "1px solid #e2e8f0", fontSize: "14px"}}>
                        <div>Course Name</div>
                        <div style={{textAlign: "center"}}>Students</div>
                        <div style={{textAlign: "center"}}>Status</div>
                    </div>

                    <div style={{display: "grid", gridTemplateColums: "2fr 1fr 1fr", padding: "16px 20px", borderBottom: "1px solid #f1f5f9", color: "#0f172a"}}>
                        <div style={{fontWeight: "600"}}>Java Full Stack</div>
                        <div style={{textAlign: "center"}}>45</div>
                        <div style={{textAlign: "center"}}>
                            <span style={{background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "20px", fontSize: "700"}}>Published</span>
                        </div>
                    </div>

                    <div style={{display: "grid", gridTemplateColums: "2fr 1fr 1fr", padding: "16px 20px", color: "#0f172a"}}>
                        <div style={{fontWeight: "600"}}>React Mastery</div>
                        <div style={{textAlign: "center"}}>30</div>
                        <div style={{textAlign: "center"}}>
                            <span style={{background: "#fef9c3", color: "#854d0e", padding: "4px 10px", borderRadius: "20px", fontSize: "700"}}>Draft</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructorDashboard
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
                <div style={{background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden"}}>
                    <table style={{width: "100%", borderCollapse: "collapse"}}>
                        <thead>
                            <tr style={{background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0"}}>
                                <th style={{padding: "14px 20px", color: "#475569", fontSize: "14px", width: "60%"}}>Course Name</th>
                                <th style={{padding: "14px 20px", color: "#475569", fontSize: "14px", textAlign: "center", width: "20%"}}>Students</th>
                                <th style={{padding: "14px 20px", color: "#475569", fontSize: "14px", textAlign: "center", width: "20%"}}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{borderBottom: "1px solid #f1f5f9"}}>
                                <td style={{padding: "16px 20px", fontWeight: "600", color: "#0f172a", textAlign: "left"}}>Java Full Stack</td>
                                <td style={{padding: "16px 20px", textAlign: "center", color: "#0f172a"}}>45</td>
                                <td style={{padding: "16px 20px", textAlign: "center"}}>
                                    <span style={{background: "#dcfce7", color: "#166534", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700"}}>Published</span>
                                </td>
                            </tr>
                            <tr style={{borderBottom: "1px solid #f1f5f9"}}>
                                <td style={{padding: "16px 20px", fontWeight: "600", color: "#0f172a", textAlign: "left"}}>React Mastery</td>
                                <td style={{padding: "16px 20px", textAlign: "center", color: "#0f172a"}}>30</td>
                                <td style={{padding: "16px 20px", textAlign: "center"}}>
                                    <span style={{background: "#fef9c3", color: "#854d0e", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700"}}>Draft</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default InstructorDashboard
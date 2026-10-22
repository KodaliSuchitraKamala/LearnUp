import { useNavigate } from "react-router-dom";

function InstructorDashboard() {
    const navigate = useNavigate()

    return (
        <div style={{padding: "24px", maxWidth: "1000px", margin: "0 auto"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h1 style={{fontSize: "24px", fontWeight: "bold"}}>Instructor Dashboard</h1>
                <button onClick={() => navigate("/")} style={{padding: "6px 12px", border: "1px solid #ddd", borderRadius: "6px"}}>Logout</button>
            </div>

            <button style={{background: "#2563eb", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", margin: "20px 0", fontWeight: "600", cursor: "pointer"}}>+ Create New Course</button>

            <table style={{width: "100%", borderCollapse: "collapse", border: "1px solid #e2e8f0"}}>
                <thead style={{background: "#f8fafc"}}>
                    <tr>
                        <th style={{padding: "12px", textAlign: "left", border: "1px solid #e2e8f0"}}>Course Name</th>
                        <th style={{padding: "12px", textAlign: "left", border: "1px solid #e2e8f0"}}>Students</th>
                        <th style={{padding: "12px", textAlign: "left", border: "1px solid #e2e8f0"}}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{padding: "12px", border: "1px solid #e2e8f0"}}>Java Full Stack</td>
                        <td style={{padding: "12px", border: "1px solid #e2e8f0"}}>45</td>
                        <td style={{padding: "12px", border: "1px solid #e2e8f0"}}>Published</td>
                    </tr>
                    <tr>
                        <td style={{padding: "12px", border: "1px solid #e2e8f0"}}>React Mastery</td>
                        <td style={{padding: "12px", border: "1px solid #e2e8f0"}}>30</td>
                        <td style={{padding: "12px", border: "1px solid #e2e8f0"}}>Draft</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default InstructorDashboard
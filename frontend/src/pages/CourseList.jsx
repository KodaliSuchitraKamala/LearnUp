import { useState } from "react";
import { courses } from "../data/courses";
import { useNavigate } from "react-router-dom";

function CourseList() {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const navigate = useNavigate()

    const categories = ["All", "Java", "Frontend", "Python", "Full Stack"]

    const filtered = courses.filter((c) => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === "All" || c.category === category
        return matchSearch && matchCat
    })

    return (
        <div style={{minHeight: "100vh", background: "#f8fafc", padding: "20px"}}>
            <div style={{maxWidth: "1100px", margin: "0 auto"}}> 

                {/* Header */}
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "16px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "20px"}}>
                    <h1 style={{fontSize: "20px", fontWeight: "800", margin: 0, color: "#0f172a"}}>Explore Courses</h1>
                    <button onClick={() => navigate("/student")} style={{padding: "8px 14px", background: "#0f172a", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px"}}>Back to Dashboard</button>
                </div>
                
                {/* Search + Filter */}
                <div style={{display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap"}}>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Java, React, Python..." style={{flex: 1, minWidth: "250px", color: "#e2e8f0", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none"}} />
                    <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setCategory(cat)} style={{padding: "10px 16px", borderRadius: "20px", border: "1px solid #e2e8f0", cursor: "pointer", background: category === cat ? "#0f172a" : "white", color: category === cat ? "white" : "#0f172a", fontWeight: "600", fontSize: "13px"}}>{cat}</button>
                        ))}
                    </div>
                </div>

                {/* Cards Grid */}
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px"}}>
                    {filtered.map((course) => (
                        <div key={course.id} style={{background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden"}}>
                            <img src={course.image} alt={course.title} style={{width: "100%", height: "160px", objectFit: "cover"}} />
                            <div style={{padding: "14px"}}>
                                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
                                    <span style={{fontSize: "11px", background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontWeight: "600"}}>{course.category}</span>
                                    <span style={{fontSize: "11px", color: "#64748b"}}>{course.level}</span>
                                </div>
                                <h3 style={{fontSize: "15px", fontWeight: "700", margin: "0 0 6px 0", lineHeight: "1.3", height: "40px"}}>{course.title}</h3>
                                <p style={{fontSize: "12px", color: "#64748b", margin: "0 0 8px 0"}}>{course.instructor}</p>
                                <div style={{display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px"}}>
                                    <span style={{fontSize: "13px", fontWeight: "700"}}>⭐ {course.rating}</span>
                                    <span style={{fontSize: "11px", color: "#64748b"}}>({courses.students} students)</span>
                                </div>
                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <span style={{fontWeight: "800", fontSize: "16px"}}>{course.price}</span>
                                    <button style={{background: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px"}}>Enroll Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && <p style={{textAlign: "center", marginTop: "40px", color: "#64748b"}}>No Courses Found</p>}
                
            </div>
        </div>
    )
}

export default CourseList
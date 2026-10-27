import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courses, courses as defaultCourses } from "../data/courses";

function CourseList() {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [allCourses, setAllCourses] = useState(defaultCourses)

    useEffect(() => {
        const custom = JSON.parse(localStorage.getItem("customCourses") || "[]")
        setAllCourses([...defaultCourses, ...custom])
    }, [])

    const categories = ["All", "Java", "Frontend", "Python", "Full Stack"]

    const filtered = allCourses.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === "All" ||c.category === category
        return matchSearch && matchCat
    })

    return (
        <div style={{minHeight: "100vh", background: "#f8fafc", padding: "20px"}}>
            <div style={{maxWidth: "1100px", margin: "0 auto"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px"}}>
                    <h1 style={{fontSize: "24px", fontWeight: "800", margin: 0, color: "#0f172a"}}>Explore Courses</h1>
                    <Link to="/student" style={{background: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "13px"}}>My Learning →</Link>
                </div>

                {/* Filters */}
                <div style={{display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap"}}>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." style={{padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", flex: "1", minWidth: "200px"}} />
                    <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setCategory(cat)} style={{padding: "8px 16px", borderRadius: "20px", border: category === cat ? "1px solid #2563eb" : "1px solid #e2e8f0", background: category === cat ? "#2563eb" : "white", color: category === cat ? "white" : "#334155", cursor: "pointer", fontWeight: "600", fontSize: "13px"}}>{cat}</button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "18px"}}>
                    {filtered.map(course => (
                        <Link key={course.id} to={`/courses/${course.id}`} state={{textDecoration: "none", color: "inherit"}}>
                            <div style={{background: "white", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", transition: "0.2s", height: "100%"}}>
                                <img src={course.image} alt={course.title} style={{width: "100%", height: "160px", objectFit: "cover"}} />
                                <div style={{padding: "14px"}}>
                                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px"}}>
                                        <span style={{background: "#eff6ff", color: "#2563eb", padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700"}}>{course.category}</span>
                                        <span style={{fontSize: "12px", color: "#64748b"}}>{course.level}</span>
                                    </div>
                                    <h3 style={{color: "#0f172a", fontSize: "15px", fontWeight: "700", margin: "0 0 6px 0", lineHeight: "1.3"}}>{course.title}</h3>
                                    <p style={{fontSize: "12px", color: "#64748b", margin: "0 0 10px 0"}}>By {course.instructor}</p>
                                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                        <span style={{fontWeight: "800", fontSize: "16px", color: "#0f172a"}}>{course.price}</span>
                                        <span style={{fontSize: "12px", color: "#f59e0b", fontWeight: "700"}}>⭐ {course.rating}</span>
                                    </div>
                                    {course.id > 1000000000000 && <span style={{fontSize: "10px", background: "#dcfce7", color: "#16a34a", padding: "2px 6px", borderRadius: "10px", marginTop: "6px", display: "inline-block"}}>NEW - Added by You</span>}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p style={{textAlign: "center", color: "#64748b", marginTop: "40px"}}>No courses found for "{search}"</p>
                )}
            </div>
        </div>
    )
}

export default CourseList
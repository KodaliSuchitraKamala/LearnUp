import { useState } from "react";

function InstructorDashboard() {
    const [newCourse, setNewCourse] = useState({title: "", category: "Select", price: "₹0"})

    const handleAddCourse = () => {
        if (!newCourse.title.trim()) return alert("Enter title")

        // SAFE - handles null, "null" string, everything
        let custom = []
        try {
            const stored = localStorage.getItem("customCourses")
            custom = stored ? JSON.parse(stored) : []
            if (!Array.isArray(custom)) custom = []
        } catch(e) {
            custom = []
        }

        custom.push({
            id: Date.now(),
            title: newCourse.title,
            category: newCourse.category,
            price: newCourse.price,
            instructor: "You (Instructor)",
            rating: 5.0,
            students: 0,
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
            level: "Beginner",
            description: "New course added by instructor",
            whatYouLearn: ["Basics", "Advanced", "Project"],
            duration: "20 Hours"
        })

        localStorage.setItem("customCourses", JSON.stringify(custom))
        alert("✅ Courses Added! Go to /courses to see it")
        setNewCourse({title: "", category: "Select", price: "₹0"})
    }

    return (
        <div style={{minHeight: "100vh", background: "#f8fafc", padding: "20px"}}>
            <div style={{maxWidth: "1000px", margin: "0 auto"}}>
                <h1 style={{fontSize: "34px", fontWeight: "800", color: "#0f172a"}}>Instructor Dashboard</h1>
                <div style={{background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginTop: "20px"}}>
                    <h3 style={{color: "#0f172a"}}>Add New Course</h3>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "12px"}}>
                        <input value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} placeholder="Course Title" style={{padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0"}} />
                        <select value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})} style={{padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0"}}>
                            <option>Select</option>
                            <option>Java</option>
                            <option>Frontend</option>
                            <option>Python</option>
                            <option>Full Stack</option>
                        </select>
                        <input value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} placeholder="Price ₹0" style={{padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0"}} />
                    </div>
                    <button onClick={handleAddCourse} style={{marginTop: "12px", background: "#2563eb", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: "700", cursor: "pointer"}}>Add Course</button>
                </div>
            </div>
        </div>
    )
}

export default InstructorDashboard
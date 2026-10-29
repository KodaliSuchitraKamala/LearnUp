import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="container mt-5">
            <div className="card p-5 text-center border-0">
                <h1 className="display-4 fw-bold">Learn Without Limits 🚀</h1>
                <p className="lead mt-3" style={{color: "var(--muted)"}}>Permium LMS with Light / Dark theme.</p>
                <div className="mt-4">
                    <Link to="/courses" className="btn btn-primary btn-lg me-3">Explore Courses ✨</Link>
                    <Link to="/login" className="btn btn-dark btn-lg">Get Started</Link>
                </div>
                <div className="row mt-5 text-center">
                    <div className="col-4">
                        <h2>500+</h2>
                        <small style={{color: "var(--muted)"}}>Students</small>
                    </div>
                    <div className="col-4">
                        <h2>30+</h2>
                        <small style={{color: "var(--muted)"}}>Courses</small>
                    </div>
                    <div className="col-4">
                        <h2>4.9⭐</h2>
                        <small style={{color: "var(--muted)"}}>Rating</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CompanyBugHistory.scss";

export default function CompanyBugHistory() {
  const [bugs, setBugs] = useState([]);
  const [activeFilter, setActiveFilter] = useState("approved");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/bugs/company/bugs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setBugs(data.bugs || []))
      .catch(err => console.error(err));
  }, [token]);

  const approved = bugs.filter(b => b.status === "approved");
  const rejected = bugs.filter(b => b.status === "rejected");
  const duplicate = bugs.filter(b => b.status === "duplicate");

  const getFilteredBugs = () => {
    if (activeFilter === "approved") return approved;
    if (activeFilter === "rejected") return rejected;
    if (activeFilter === "duplicate") return duplicate;
    return [];
  };

  return (
    <div className="company-page">

      <div className="top-bar">
        <button
          className="back-btn"
          onClick={() => navigate("/company")}
        >
          ⬅ Back
        </button>

        <h1>Bug History</h1>
      </div>

      {/* FILTER WIDGETS */}
      <div className="widgets">

        <div
          className={`widget approved ${activeFilter === "approved" ? "active" : ""}`}
          onClick={() => setActiveFilter("approved")}
        >
          <h2>{approved.length}</h2>
          <p>Approved</p>
        </div>

        <div
          className={`widget rejected ${activeFilter === "rejected" ? "active" : ""}`}
          onClick={() => setActiveFilter("rejected")}
        >
          <h2>{rejected.length}</h2>
          <p>Rejected</p>
        </div>

        <div
          className={`widget duplicate ${activeFilter === "duplicate" ? "active" : ""}`}
          onClick={() => setActiveFilter("duplicate")}
        >
          <h2>{duplicate.length}</h2>
          <p>Duplicate</p>
        </div>

      </div>

      {/* BUG LIST */}
      <div className="bug-section">
        <h2 className="section-title">
          {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bugs
        </h2>

        {getFilteredBugs().length === 0 ? (
          <p className="muted">No records found.</p>
        ) : (
          getFilteredBugs().map(bug => (
            <div className="bug-card" key={bug._id}>
              <h3>{bug.title}</h3>

              <span className={`status ${bug.status}`}>
                {bug.status.charAt(0).toUpperCase() + bug.status.slice(1)}
              </span>

              {bug.duplicateOf && (
                <p className="duplicate-ref">
                  Duplicate of: {bug.duplicateOf}
                </p>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
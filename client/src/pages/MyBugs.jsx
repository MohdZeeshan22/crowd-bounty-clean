import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./MyBugs.scss";

export default function MyBugs() {
  const [bugs, setBugs] = useState([]);
  const location = useLocation();

  const status = new URLSearchParams(location.search).get("status");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/bugs/hacker/bugs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = data.bugs || data || [];
        if (status) {
          setBugs(list.filter((b) => b.status === status));
        } else {
          setBugs(list);
        }
      });
  }, [status]);

  return (
    <div className="mybugs-page">
      <h1 className="page-title">
        {status ? `${status.toUpperCase()} BUGS` : "MY BUGS"}
      </h1>

      {bugs.length === 0 ? (
        <p className="empty">No bugs found.</p>
      ) : (
        <div className="bugs-grid">
          {bugs.map((bug) => (
            <div key={bug._id} className="bug-card">
              <div className="bug-header">
                <h3>{bug.title}</h3>
                <span className={`status ${bug.status}`}>
                  {bug.status}
                </span>
              </div>

              {/* BUG ID */}
              <div className="bug-id">ID: {bug._id}</div>

              <p className="description">{bug.description}</p>

              <div className="meta">
                <span className={`severity ${bug.severity}`}>
                  Severity: {bug.severity}
                </span>

                {bug.reward > 0 && (
                  <span className="reward">₹{bug.reward}</span>
                )}
              </div>

              {/* DUPLICATE INFO */}
              {bug.status === "duplicate" && bug.duplicateOf && (
                <div className="duplicate-info">
                  Duplicate of: {bug.duplicateOf}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CompanyPendingBugs.scss";

export default function CompanyPendingBugs() {
  const [bugs, setBugs] = useState([]);
  const [runningBugId, setRunningBugId] = useState(null);
  const [sandboxResult, setSandboxResult] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* =========================
     APPLY COMPANY THEME
  ========================= */
  useEffect(() => {
    document.body.classList.add("company-theme");
    document.body.classList.remove("hacker-theme");

    return () => {
      document.body.classList.remove("company-theme");
    };
  }, []);

  /* =========================
     FETCH PENDING BUGS
  ========================= */
  const fetchPendingBugs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bugs/company/bugs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const pending = (res.data.bugs || []).filter(
        (bug) => bug.status === "submitted"
      );

      setBugs(pending);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchPendingBugs();
  }, [token]);

  /* =========================
     RUN SANDBOX (FIXED PROPERLY)
  ========================= */
  const handleSandbox = async (id) => {
    try {
      setRunningBugId(id);

      const res = await axios.post(
        `http://localhost:5000/api/company/sandbox/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSandboxResult(res.data);
    } catch (err) {
      console.error("Sandbox error:", err.response || err);
      alert("Sandbox execution failed");
    } finally {
      setRunningBugId(null);
    }
  };

  /* =========================
     UPDATE STATUS
  ========================= */
  const updateStatus = async (id, status) => {
    try {
      let body = { status };

      if (status === "duplicate") {
        const originalId = prompt("Enter Original Bug ID:");
        if (!originalId) return;
        body.duplicateOf = originalId.trim();
      }

      if (status === "approved") {
        let severity = prompt(
          "Enter severity (low / medium / high / critical):"
        );
        if (!severity) return;

        severity = severity.toLowerCase().trim();

        const reward = Number(prompt("Enter reward amount:"));
        if (!reward || reward <= 0) return;

        body.severity = severity;
        body.reward = reward;
      }

      await axios.patch(
        `http://localhost:5000/api/bugs/validate/${id}`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchPendingBugs();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="company-page">
      <div className="top-bar">
        <button
          className="back-btn"
          onClick={() => navigate("/company")}
        >
          Back
        </button>

        <h1>Pending Bugs</h1>
      </div>

      {bugs.length === 0 ? (
        <p className="muted">No new bugs 🎉</p>
      ) : (
        <div className="bug-grid">
          {bugs.map((bug) => (
            <div className="bug-card" key={bug._id}>
              <h3>{bug.title}</h3>
              <div className="bug-id">ID: {bug._id}</div>
              <p className="description">{bug.description}</p>

              <div className="actions">
                <button
                  className="approve"
                  onClick={() => updateStatus(bug._id, "approved")}
                >
                  Approve
                </button>

                <button
                  className="reject"
                  onClick={() => updateStatus(bug._id, "rejected")}
                >
                  Reject
                </button>

                <button
                  className="duplicate"
                  onClick={() => updateStatus(bug._id, "duplicate")}
                >
                  Duplicate
                </button>

                <button
                  className="sandbox"
                  onClick={() => handleSandbox(bug._id)}
                  disabled={runningBugId === bug._id}
                >
                  {runningBugId === bug._id
                    ? "Running..."
                    : "Run Sandbox"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sandboxResult && (
        <div className="sandbox-modal">
          <div className="sandbox-content">
            <h2>Sandbox Analysis</h2>

            <p>
              <strong>Baseline Status:</strong>{" "}
              {sandboxResult?.baseline?.status}
            </p>

            <p>
              <strong>Injected Status:</strong>{" "}
              {sandboxResult?.injected?.status}
            </p>

            <p>
              <strong>Detected:</strong>{" "}
              {sandboxResult?.analysis?.detected}
            </p>

            <p>
              <strong>Severity:</strong>{" "}
              {sandboxResult?.analysis?.severity}
            </p>

            <p>
              <strong>Risk Score:</strong>{" "}
              {sandboxResult?.analysis?.riskScore}%
            </p>

            <p>
              <strong>Recommendation:</strong>{" "}
              {sandboxResult?.analysis?.recommendation}
            </p>

            <button
              className="close-btn"
              onClick={() => setSandboxResult(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
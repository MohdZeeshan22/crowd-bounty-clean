import { useEffect, useState, useCallback } from "react";
import "./HackerDashboard.scss";

export default function HackerDashboard() {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState("");
  const [bugs, setBugs] = useState([]);

  const token = localStorage.getItem("token");

  /* =========================
     🎨 APPLY HACKER THEME
  ========================= */
  useEffect(() => {
    document.body.classList.add("hacker-theme");
    document.body.classList.remove("company-theme");

    return () => {
      document.body.classList.remove("hacker-theme");
    };
  }, []);

  /* =========================
     🔥 FETCH BUGS
  ========================= */
  const fetchBugs = useCallback(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/bugs/hacker/bugs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBugs(data);
        else if (Array.isArray(data.bugs)) setBugs(data.bugs);
        else setBugs([]);
      })
      .catch((err) => {
        console.error("BUG FETCH ERROR:", err);
        setBugs([]);
      });
  }, [token]);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("username");

    if (!token) {
      window.location.href = "/";
      return;
    }

    setRole(storedRole);
    if (storedUser) setUsername(storedUser);

    if (storedRole === "hacker") {
      fetchBugs();
    }
  }, [fetchBugs, token]);

  /* =========================
     ⏳ WAIT FOR ROLE
  ========================= */
  if (!role) return null;

  /* =========================
     🔒 HARD GUARD
  ========================= */
  if (role !== "hacker") {
    window.location.href = "/company";
    return null;
  }

  /* =========================
     📊 STATS
  ========================= */
  const submittedCount = bugs.filter((b) => b.status === "submitted").length;
  const approvedCount = bugs.filter((b) => b.status === "approved").length;
  const rejectedCount = bugs.filter((b) => b.status === "rejected").length;

  const totalRewards = bugs
    .filter((b) => b.status === "approved")
    .reduce((sum, b) => sum + (Number(b.reward) || 0), 0);

  return (
    <div className="hacker-dashboard">

      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>
            <span className="neon">🧑‍💻 Hacker Dashboard</span>
          </h1>
          <p className="muted">
            Logged in as <span className="highlight">@{username}</span>
          </p>
        </div>
        <div className="status">
          <span className="dot"></span> ONLINE
        </div>
      </header>

      {/* STATS */}
      <section className="stats-grid">
        <div
          className="stat-card clickable"
          onClick={() =>
            (window.location.href = "/my-bugs?status=submitted")
          }
        >
          <h3>🐞 Bugs Submitted</h3>
          <p>{submittedCount}</p>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            (window.location.href = "/my-bugs?status=approved")
          }
        >
          <h3>✅ Approved</h3>
          <p>{approvedCount}</p>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            (window.location.href = "/my-bugs?status=rejected")
          }
        >
          <h3>❌ Rejected</h3>
          <p>{rejectedCount}</p>
        </div>

        <div className="stat-card reward-card">
          <h3>💰 Total Rewards</h3>
          <p>₹{totalRewards}</p>
        </div>
      </section>

      {/* ACTIONS */}
      <section className="actions-grid">
        <div
          className="action-card clickable"
          onClick={() => (window.location.href = "/submit-bug")}
        >
          <h2>🐞 Submit Bug</h2>
          <p>Report a new vulnerability</p>
        </div>

        <div
          className="action-card clickable"
          onClick={() => (window.location.href = "/my-bugs")}
        >
          <h2>📄 My Bugs</h2>
          <p>Track submissions & status</p>
        </div>

        <div
          className="action-card clickable"
          onClick={() => (window.location.href = "/wallet")}
        >
          <h2>💰 Wallet</h2>
          <p>Rewards & payouts</p>
        </div>
      </section>

      {/* TERMINAL */}
      <section className="terminal">
        <p>[✓] Connected to bounty network</p>
        <p>[✓] Bugs loaded: {bugs.length}</p>
        <span className="cursor">█</span>
      </section>

      {/* LOGOUT */}
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
      >
        🔒 Logout
      </button>

    </div>
  );
}
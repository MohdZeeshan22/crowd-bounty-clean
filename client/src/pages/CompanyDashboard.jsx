import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CompanyDashboard.scss";

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const companyName =
    localStorage.getItem("username") || "Company";

  /* =========================
     FORCE COMPANY THEME
  ========================= */
  useEffect(() => {
    document.body.classList.add("company-theme");
    document.body.classList.remove("hacker-theme");

    return () => {
      document.body.classList.remove("company-theme");
    };
  }, []);

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="company-dashboard">
      <header className="company-header">
        <h1>{companyName}</h1>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* =========================
         DASHBOARD CARDS
      ========================= */}

      <div className="dashboard-cards">

        <div
          className="dashboard-card"
          onClick={() => navigate("/company/pending")}
        >
          <h2>New Bugs</h2>
          <p>Review & take action</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/company/history")}
        >
          <h2>Bug History</h2>
          <p>Approved, rejected & duplicate</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/company/wallet")}
        >
          <h2>Wallet</h2>
          <p>View balance & transactions</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/company/analytics")}
        >
          <h2>Analytics</h2>
          <p>View bug & payment statistics</p>
        </div>

      </div>
    </div>
  );
}
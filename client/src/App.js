import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import HackerDashboard from "./pages/HackerDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyPendingBugs from "./pages/CompanyPendingBugs";
import CompanyBugHistory from "./pages/CompanyBugHistory";
import SubmitBug from "./pages/SubmitBug";
import MyBugs from "./pages/MyBugs";
import Wallet from "./pages/Wallet";
import Register from "./pages/Register";
import CompanyAnalytics from "./pages/CompanyAnalytics";
import CompanyWallet from "./pages/CompanyWallet";

export default function App() {
  const location = useLocation();

  /* =========================
     GLOBAL ROLE-BASED THEME
  ========================= */
  useEffect(() => {
    const role = localStorage.getItem("role");

    // Remove both first (clean reset)
    document.body.classList.remove("hacker-theme");
    document.body.classList.remove("company-theme");

    if (role === "company" || role === "admin") {
      document.body.classList.add("company-theme");
    } else if (role === "hacker") {
      document.body.classList.add("hacker-theme");
    }
  }, [location]); // runs on route change

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Hacker */}
      <Route path="/hacker" element={<HackerDashboard />} />
      <Route path="/submit-bug" element={<SubmitBug />} />
      <Route path="/my-bugs" element={<MyBugs />} />
      <Route path="/wallet" element={<Wallet />} />

      {/* Company */}
      <Route path="/company" element={<CompanyDashboard />} />
      <Route path="/company/pending" element={<CompanyPendingBugs />} />
      <Route path="/company/history" element={<CompanyBugHistory />} />
      <Route path="/company/analytics" element={<CompanyAnalytics />} />
      <Route path="/company/wallet" element={<CompanyWallet />} />

      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
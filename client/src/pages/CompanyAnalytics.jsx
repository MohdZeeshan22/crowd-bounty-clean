import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanyAnalytics } from "../api/bug";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";
import "./CompanyAnalytics.scss";

export default function CompanyAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("company-theme");
    document.body.classList.remove("hacker-theme");

    const fetchAnalytics = async () => {
      try {
        const res = await getCompanyAnalytics(); // ✅ USE AXIOS
        setAnalytics(res.data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      }
    };

    fetchAnalytics();

    return () => {
      document.body.classList.remove("company-theme");
    };
  }, []);

  if (!analytics)
    return <div className="company-page">Loading...</div>;

  const monthlyTrend = analytics.monthlyTrend || [];

  const formattedMonthlyTrend = monthlyTrend.map(item => {
    const [year, month] = item.month.split("-");
    const date = new Date(year, month - 1);

    return {
      ...item,
      monthLabel: date.toLocaleString("default", {
        month: "short",
        year: "numeric"
      })
    };
  });

  const statusData = [
    { name: "Approved", value: analytics.approvedBugs || 0 },
    { name: "Pending", value: analytics.pendingBugs || 0 },
    { name: "Rejected", value: analytics.rejectedBugs || 0 },
  ];

  const COLORS = ["#2ecc71", "#f1c40f", "#e74c3c"];

  const paymentData = [
    { name: "Paid", value: analytics.totalPaid || 0 },
    { name: "Wallet", value: analytics.walletBalance || 0 },
  ];

  return (
    <div className="company-page">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/company")}>
          ⬅ Back
        </button>
        <h1>Advanced Analytics</h1>
      </div>

      <div className="analytics-grid">
        <div className="stat-box">
          <h3>Total Bugs</h3>
          <p>{analytics.totalBugs || 0}</p>
        </div>

        <div className="stat-box">
          <h3>Total Paid</h3>
          <p>₹{analytics.totalPaid || 0}</p>
        </div>

        <div className="stat-box wallet">
          <h3>Wallet Balance</h3>
          <p>₹{analytics.walletBalance || 0}</p>
        </div>
      </div>

      <div className="chart-container">
        <h2>Bug Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statusData} dataKey="value" outerRadius={100} label>
              {statusData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Monthly Bug Submissions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedMonthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthLabel" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="bugs" stroke="#3498db" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Monthly Reward Payout</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedMonthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthLabel" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="paid" fill="#2ecc71" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h2>Financial Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#6dd5ed" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}